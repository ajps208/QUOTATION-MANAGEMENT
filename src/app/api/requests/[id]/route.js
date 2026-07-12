import connectToDatabase from '@/lib/mongodb';
import QuotationRequest from '@/models/QuotationRequest';
import Notification from '@/models/Notification';
import Business from '@/models/Business';

function serialize(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  obj.customerId = obj.customerId?.toString();
  obj.businessId = obj.businessId?.toString();
  if (obj.items) {
    obj.items = obj.items.map(item => ({
      ...item,
      _id: item._id?.toString(),
      productId: item.productId?.toString(),
    }));
  }
  
  if (obj.quotationId) obj.quotationId = obj.quotationId.toString();
  if (obj.resolvedCustomerId) obj.resolvedCustomerId = obj.resolvedCustomerId.toString();

  delete obj._id;
  delete obj.__v;
  return obj;
}

// GET /api/requests/[id]
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const req = await QuotationRequest.findById(id);
    if (!req) return Response.json({ error: 'Request not found' }, { status: 404 });
    return Response.json(serialize(req));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/requests/[id]
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    const req = await QuotationRequest.findByIdAndUpdate(id, data, { new: true });
    if (!req) return Response.json({ error: 'Request not found' }, { status: 404 });
    
    // If request is rejected, send a notification to the customer
    if (data.status === 'Rejected' && req.customerId) {
      const business = await Business.findById(req.businessId);
      await Notification.create({
        userId: req.customerId,
        title: 'Quotation Request Rejected',
        message: `Your request to ${business?.name || 'the business'} was rejected. Reason: ${req.rejectionReason || 'Not provided'}`,
        link: `/customer/requests`,
      });
    }
    
    return Response.json(serialize(req));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/requests/[id]
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
