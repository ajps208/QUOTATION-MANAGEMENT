import connectToDatabase from '@/lib/mongodb';
import Quotation from '@/models/Quotation';
import Activity from '@/models/Activity';
import Notification from '@/models/Notification';
import Customer from '@/models/Customer';
import User from '@/models/User';
import { QUOTATION_STATUS } from '@/constants/statuses';

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  obj.businessId = obj.businessId?.toString();
  obj.customerId = obj.customerId?.toString();
  obj.requestId = obj.requestId?.toString() || null;
  if (obj.items) {
    obj.items = obj.items.map(item => ({
      ...item,
      _id: item._id?.toString(),
      productId: item.productId?.toString(),
    }));
  }
  if (obj.specialDiscounts) {
    obj.specialDiscounts = obj.specialDiscounts.map(d => ({ ...d, _id: d._id?.toString() }));
  }
  if (obj.additionalCharges) {
    obj.additionalCharges = obj.additionalCharges.map(c => ({ ...c, _id: c._id?.toString() }));
  }
  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/quotations/[id]
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const quotation = await Quotation.findById(id);
    if (!quotation) return Response.json({ error: 'Quotation not found' }, { status: 404 });
    return Response.json(serialize(quotation));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/quotations/[id]
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const prevQuotation = await Quotation.findById(id);
    const quotation = await Quotation.findByIdAndUpdate(id, data, { new: true });
    if (!quotation) return Response.json({ error: 'Quotation not found' }, { status: 404 });

    // Trigger notifications on status changes
    if (data.status && prevQuotation?.status !== data.status) {
      const customer = await Customer.findById(quotation.customerId);
      if (customer) {
        if (data.status === QUOTATION_STATUS.ACCEPTED) {
          // Notify business owner
          const businessUser = await User.findOne({ businessId: quotation.businessId });
          if (businessUser) {
            await Notification.create({
              userId: businessUser._id,
              title: 'Quotation Accepted',
              message: `${customer.companyName || customer.name} has accepted your quotation (${quotation.quotationNumber}).`,
              link: `/business/quotations/${id}`,
            });
          }
        } else if (data.status === QUOTATION_STATUS.SENT) {
          // Notify customer user (if they have an account on Quotely)
          const customerUser = await User.findOne({ email: customer.email });
          if (customerUser) {
            const business = await Business.findById(quotation.businessId);
            await Notification.create({
              userId: customerUser._id,
              title: 'New Quotation Received',
              message: `You have received a new quotation (${quotation.quotationNumber}) from ${business?.name || 'a vendor'}.`,
              link: `/customer/quotations/${id}`,
            });
          }
        }
      }
    }

    return Response.json(serialize(quotation));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/quotations/[id]
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
