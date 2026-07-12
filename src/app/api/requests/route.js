import connectToDatabase from '@/lib/mongodb';
import QuotationRequest from '@/models/QuotationRequest';
import Notification from '@/models/Notification';
import User from '@/models/User';

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

// GET /api/requests?businessId=xxx&customerId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');
    const query = {};
    if (businessId) query.businessId = businessId;
    if (customerId) query.customerId = customerId;
    
    // Fetch requests
    const requests = await QuotationRequest.find(query).sort({ createdAt: -1 });
    
    // Enrich with user information (customer info)
    const enrichedRequests = await Promise.all(requests.map(async (req) => {
      const reqObj = serialize(req);
      if (req.customerId) {
        const user = await User.findById(req.customerId).select('name email phone company');
        if (user) {
          reqObj.customerInfo = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            company: user.company
          };
        }
      }
      return reqObj;
    }));
    
    return Response.json(enrichedRequests);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/requests
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Check if customer user exists and upsert into Business Customer collection
    let resolvedCustomerId = null;
    if (data.customerId) {
      const user = await User.findById(data.customerId);
      if (user) {
        const Customer = (await import('@/models/Customer')).default;
        
        // Try to find existing CRM customer for this business and email
        let crmCustomer = await Customer.findOne({ 
          businessId: data.businessId, 
          email: user.email 
        });
        
        if (!crmCustomer) {
          // Create new CRM customer
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
    
    const req = await QuotationRequest.create({
      ...data,
      resolvedCustomerId
    });

    // Notify the business owner
    const businessUser = await User.findOne({ businessId: data.businessId });
    if (businessUser) {
      await Notification.create({
        userId: businessUser._id,
        title: 'New Quotation Request',
        message: `A new quotation request has been submitted.`,
        link: `/business/requests/${req._id}`,
      });
    }

    return Response.json(serialize(req), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
