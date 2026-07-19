import connectToDatabase from '@/lib/mongodb';
import QuotationRequest from '@/models/QuotationRequest';
import Notification from '@/models/Notification';
import User from '@/models/User';
import Customer from '@/models/Customer';
import { serialize, toId, serializeItems } from '@/app/api/utils/serializer';

function toRequest(doc) {
  const obj = serialize(doc, { customerId: toId, businessId: toId, quotationId: toId, resolvedCustomerId: toId });
  if (obj.items) {
    obj.items = serializeItems(doc.items, { productId: toId });
  }
  return obj;
}

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');
    const query = {};
    if (businessId) query.businessId = businessId;
    if (customerId) query.customerId = customerId;

    const requests = await QuotationRequest.find(query)
      .select('customerId businessId items generalNote requestDate status rejectionReason quotationId resolvedCustomerId createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean({ virtuals: false });

    // Batch-fetch all unique customer user IDs to avoid N+1
    const customerUserIds = [...new Set(requests.map(r => r.customerId?.toString()).filter(Boolean))];
    let userMap = {};
    if (customerUserIds.length > 0) {
      const users = await User.find({ _id: { $in: customerUserIds } }).select('name email phone company').lean({ virtuals: false });
      userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]));
    }

    const enrichedRequests = requests.map(req => {
      const reqObj = toRequest(req);
      const user = req.customerId ? userMap[req.customerId.toString()] : null;
      if (user) {
        reqObj.customerInfo = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          company: user.company
        };
      }
      return reqObj;
    });

    return Response.json(enrichedRequests);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    let resolvedCustomerId = null;
    if (data.customerId) {
      const user = await User.findById(data.customerId).lean({ virtuals: false });
      if (user) {
        let crmCustomer = await Customer.findOne({
          businessId: data.businessId,
          email: user.email
        }).lean({ virtuals: false });

        if (!crmCustomer) {
          crmCustomer = await Customer.create({
            businessId: data.businessId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            companyName: user.company,
            status: 'Active'
          });
        }
        resolvedCustomerId = crmCustomer._id;
      }
    }

    const [req, businessUser] = await Promise.all([
      QuotationRequest.create({ ...data, resolvedCustomerId }),
      User.findOne({ businessId: data.businessId }).select('_id').lean({ virtuals: false }),
    ]);

    if (businessUser) {
      await Notification.create({
        userId: businessUser._id,
        title: 'New Quotation Request',
        message: `A new quotation request has been submitted.`,
        link: `/business/requests/${req._id}`,
      });
    }

    return Response.json(toRequest(req), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
