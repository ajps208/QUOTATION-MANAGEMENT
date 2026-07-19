import connectToDatabase from '@/lib/mongodb';
import Quotation from '@/models/Quotation';
import Activity from '@/models/Activity';
import Business from '@/models/Business';
import Customer from '@/models/Customer';
import User from '@/models/User';
import Notification from '@/models/Notification';
import QuotationRequest from '@/models/QuotationRequest';
import { QUOTATION_STATUS, REQUEST_STATUS } from '@/constants/statuses';
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

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const query = {};
    if (businessId) query.businessId = businessId;
    if (status) query.status = status;

    if (customerId) {
      query.customerId = customerId;
    } else if (userId) {
      const user = await User.findById(userId).select('email').lean({ virtuals: false });
      if (user?.email) {
        const customerRecords = await Customer.find({ email: user.email }).select('_id').lean({ virtuals: false });
        const customerIds = customerRecords.map(c => c._id);
        if (customerIds.length > 0) {
          query.customerId = { $in: customerIds };
        } else {
          return Response.json([]);
        }
      } else {
        return Response.json([]);
      }
    }

    const quotations = await Quotation.find(query)
      .select('quotationNumber businessId customerId requestId quotationDate expiryDate currency items overallDiscount specialDiscounts additionalCharges paymentTerms terms businessNotes customerNotes status rejectionReason revision settings createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean({ virtuals: false });

    return Response.json(quotations.map(toQuotation));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const business = await Business.findById(data.businessId).select('quotationSettings').lean({ virtuals: false });
    const prefix = data.prefix || business?.quotationSettings?.quotationPrefix || 'QT';
    const count = await Quotation.countDocuments({ businessId: data.businessId });
    const year = new Date().getFullYear();
    const quotationNumber = `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;

    const quotation = await Quotation.create({ ...data, quotationNumber });

    if (data.requestId) {
      await QuotationRequest.findByIdAndUpdate(data.requestId, {
        status: REQUEST_STATUS.CONVERTED_TO_QUOTATION,
        quotationId: quotation._id
      });
    }

    if (data.userId) {
      await Activity.create({
        businessId: data.businessId,
        action: data.status === QUOTATION_STATUS.SENT ? 'Quotation Sent' : 'Quotation Created',
        userId: data.userId,
        userName: data.userName || 'Unknown',
        details: `${quotationNumber} created.`,
      });
    }

    if (data.status === QUOTATION_STATUS.SENT) {
      const customer = await Customer.findById(quotation.customerId).select('email name companyName').lean({ virtuals: false });
      if (customer) {
        const customerUser = await User.findOne({ email: customer.email }).select('_id').lean({ virtuals: false });
        if (customerUser) {
          await Notification.create({
            userId: customerUser._id,
            title: 'New Quotation Received',
            message: `You have received a new quotation (${quotationNumber}) from ${business?.profile?.businessName || 'a vendor'}.`,
            link: `/customer/quotations/${quotation._id}`,
          });
        }
      }
    }

    return Response.json(toQuotation(quotation), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
