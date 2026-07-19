import connectToDatabase from '@/lib/mongodb';
import QuotationRequest from '@/models/QuotationRequest';
import Notification from '@/models/Notification';
import Business from '@/models/Business';
import { serialize, toId, serializeItems } from '@/app/api/utils/serializer';

function toRequest(doc) {
  const obj = serialize(doc, { customerId: toId, businessId: toId, quotationId: toId, resolvedCustomerId: toId });
  if (obj.items) {
    obj.items = serializeItems(doc.items, { productId: toId });
  }
  return obj;
}

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const req = await QuotationRequest.findById(id).lean({ virtuals: false });
    if (!req) return Response.json({ error: 'Request not found' }, { status: 404 });
    return Response.json(toRequest(req));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const req = await QuotationRequest.findByIdAndUpdate(id, data, { new: true }).lean({ virtuals: false });
    if (!req) return Response.json({ error: 'Request not found' }, { status: 404 });

    if (data.status === 'Rejected' && req.customerId) {
      const business = await Business.findById(req.businessId).select('profile.businessName').lean({ virtuals: false });
      await Notification.create({
        userId: req.customerId,
        title: 'Quotation Request Rejected',
        message: `Your request to ${business?.profile?.businessName || 'the business'} was rejected. Reason: ${req.rejectionReason || 'Not provided'}`,
        link: `/customer/requests`,
      });
    }

    return Response.json(toRequest(req));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await QuotationRequest.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
