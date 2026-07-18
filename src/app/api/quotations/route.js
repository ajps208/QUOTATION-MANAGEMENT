import connectToDatabase from '@/lib/mongodb';
import Quotation from '@/models/Quotation';
import Activity from '@/models/Activity';
import Business from '@/models/Business';
import Customer from '@/models/Customer';
import User from '@/models/User';
import Notification from '@/models/Notification';
import QuotationRequest from '@/models/QuotationRequest';
import { QUOTATION_STATUS, REQUEST_STATUS } from '@/constants/statuses';

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

// GET /api/quotations?businessId=xxx&customerId=xxx&userId=xxx
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');
    const userId = searchParams.get('userId');
    const query = {};
    if (businessId) query.businessId = businessId;

    if (customerId) {
      query.customerId = customerId;
    } else if (userId) {
      // Resolve User ID to Customer CRM IDs via email match
      const user = await User.findById(userId).select('email');
      if (user?.email) {
        const customerRecords = await Customer.find({ email: user.email }).select('_id');
        const customerIds = customerRecords.map(c => c._id);
        if (customerIds.length > 0) {
          query.customerId = { $in: customerIds };
        } else {
          // No matching Customer CRM record found — return empty
          return Response.json([]);
        }
      } else {
        return Response.json([]);
      }
    }

    const quotations = await Quotation.find(query).sort({ createdAt: -1 });
    return Response.json(quotations.map(serialize));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/quotations
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    // Auto-generate quotation number
    const business = await Business.findById(data.businessId);
    const prefix = data.prefix || business?.quotationPrefix || 'QT';
    const count = await Quotation.countDocuments({ businessId: data.businessId });
    const year = new Date().getFullYear();
    const quotationNumber = `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;

    const quotation = await Quotation.create({ ...data, quotationNumber });

    // Update source request status if this quotation is generated from a request
    if (data.requestId) {
      await QuotationRequest.findByIdAndUpdate(data.requestId, {
        status: REQUEST_STATUS.CONVERTED_TO_QUOTATION,
        quotationId: quotation._id
      });
    }

    // Log activity
    if (data.userId) {
      await Activity.create({
        businessId: data.businessId,
        action: data.status === QUOTATION_STATUS.SENT ? 'Quotation Sent' : 'Quotation Created',
        userId: data.userId,
        userName: data.userName || 'Unknown',
        details: `${quotationNumber} created.`,
      });
    }

    // Send notification to customer when quotation is sent directly
    if (data.status === QUOTATION_STATUS.SENT) {
      const customer = await Customer.findById(quotation.customerId);
      if (customer) {
        const customerUser = await User.findOne({ email: customer.email });
        if (customerUser) {
          await Notification.create({
            userId: customerUser._id,
            title: 'New Quotation Received',
            message: `You have received a new quotation (${quotationNumber}) from ${business?.name || 'a vendor'}.`,
            link: `/customer/quotations/${quotation._id}`,
          });
        }
      }
    }

    return Response.json(serialize(quotation), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
