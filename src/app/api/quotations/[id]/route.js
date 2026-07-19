import connectToDatabase from '@/lib/mongodb';
import Quotation from '@/models/Quotation';
import Activity from '@/models/Activity';
import Notification from '@/models/Notification';
import Business from '@/models/Business';
import Customer from '@/models/Customer';
import User from '@/models/User';
import { QUOTATION_STATUS } from '@/constants/statuses';
import { serialize, toId, serializeItems } from '@/app/api/utils/serializer';

function toQuotation(doc) {
  const obj = serialize(doc, { businessId: toId, customerId: toId });
  obj.requestId = toId(doc.requestId);
  if (obj.items) {
    obj.items = serializeItems(doc.items, { productId: toId });
  }
  if (obj.specialDiscounts) {
    obj.specialDiscounts = doc.specialDiscounts.map(d => ({ ...d, _id: d._id?.toString() }));
  }
  if (obj.additionalCharges) {
    obj.additionalCharges = doc.additionalCharges.map(c => ({ ...c, _id: c._id?.toString() }));
  }
  return obj;
}

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const quotation = await Quotation.findById(id)
      .select('quotationNumber businessId customerId requestId quotationDate expiryDate currency items overallDiscount specialDiscounts additionalCharges paymentTerms terms businessNotes customerNotes status rejectionReason revision allowedCustomerEdit settings createdAt updatedAt')
      .lean({ virtuals: false });

    if (!quotation) return Response.json({ error: 'Quotation not found' }, { status: 404 });

    if (userId) {
      const user = await User.findById(userId).select('email role').lean({ virtuals: false });
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

      if (user.role === 'customer') {
        const customerRecords = await Customer.find({ email: user.email }).select('_id').lean({ virtuals: false });
        const customerIds = customerRecords.map(c => c._id.toString());
        if (!customerIds.includes(quotation.customerId.toString())) {
          return Response.json({ error: 'Quotation not found' }, { status: 404 });
        }
        const customerViewableStatuses = [
          QUOTATION_STATUS.SENT,
          QUOTATION_STATUS.CUSTOMER_EDITING,
          QUOTATION_STATUS.PENDING_BUSINESS_APPROVAL,
          QUOTATION_STATUS.REVISION_REQUESTED,
          QUOTATION_STATUS.APPROVED,
        ];
        if (!customerViewableStatuses.includes(quotation.status)) {
          return Response.json({ error: 'Quotation details are not available in the current status' }, { status: 403 });
        }
      }
    }

    return Response.json(toQuotation(quotation));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const prevQuotation = await Quotation.findById(id).select('status').lean({ virtuals: false });
    const quotation = await Quotation.findByIdAndUpdate(id, data, { new: true }).lean({ virtuals: false });
    if (!quotation) return Response.json({ error: 'Quotation not found' }, { status: 404 });

    if (data.status && prevQuotation?.status !== data.status) {
      if (data.status === QUOTATION_STATUS.ACCEPTED) {
        const businessUser = await User.findOne({ businessId: quotation.businessId }).select('_id').lean({ virtuals: false });
        if (businessUser) {
          const customer = await Customer.findById(quotation.customerId).select('name companyName').lean({ virtuals: false });
          await Notification.create({
            userId: businessUser._id,
            title: 'Quotation Accepted',
            message: `${customer?.companyName || customer?.name || 'Customer'} has accepted your quotation (${quotation.quotationNumber}).`,
            link: `/business/quotations/${id}`,
          });
        }
      } else if (data.status === QUOTATION_STATUS.SENT) {
        const customer = await Customer.findById(quotation.customerId).select('email name companyName').lean({ virtuals: false });
        if (customer?.email) {
          const customerUser = await User.findOne({ email: customer.email }).select('_id').lean({ virtuals: false });
          if (customerUser) {
            const business = await Business.findById(quotation.businessId).select('profile.businessName').lean({ virtuals: false });
            await Notification.create({
              userId: customerUser._id,
              title: 'New Quotation Received',
              message: `You have received a new quotation (${quotation.quotationNumber}) from ${business?.profile?.businessName || 'a vendor'}.`,
              link: `/customer/quotations/${id}`,
            });
          }
        }
      }
    }

    return Response.json(toQuotation(quotation));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Quotation.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
