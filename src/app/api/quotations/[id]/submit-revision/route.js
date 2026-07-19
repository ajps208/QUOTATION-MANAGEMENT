import connectToDatabase from '@/lib/mongodb';
import Quotation from '@/models/Quotation';
import QuotationRevision from '@/models/QuotationRevision';
import Activity from '@/models/Activity';
import Notification from '@/models/Notification';
import Business from '@/models/Business';
import Customer from '@/models/Customer';
import User from '@/models/User';
import { QUOTATION_STATUS } from '@/constants/statuses';

const CUSTOMER_EDITABLE_FIELDS = ['items', 'customerNotes', 'expiryDate'];

function snapshotQuotation(q) {
  return {
    quotationNumber: q.quotationNumber,
    businessId: q.businessId,
    customerId: q.customerId,
    quotationDate: q.quotationDate,
    expiryDate: q.expiryDate,
    currency: q.currency,
    items: q.items,
    overallDiscount: q.overallDiscount,
    specialDiscounts: q.specialDiscounts,
    additionalCharges: q.additionalCharges,
    paymentTerms: q.paymentTerms,
    terms: q.terms,
    businessNotes: q.businessNotes,
    customerNotes: q.customerNotes,
    status: q.status,
    rejectionReason: q.rejectionReason,
    revision: q.revision,
    allowedCustomerEdit: q.allowedCustomerEdit,
  };
}

function detectChangedFields(original, updates, allowedCustomerEdit) {
  const changed = [];
  for (const field of CUSTOMER_EDITABLE_FIELDS) {
    if (updates[field] === undefined) continue;
    if (field === 'items' && !allowedCustomerEdit) {
      const origItems = original.items || [];
      const newItems = updates.items || [];
      if (origItems.length !== newItems.length) {
        changed.push('items');
        continue;
      }
      for (let i = 0; i < origItems.length; i++) {
        const oi = origItems[i];
        const ni = newItems[i];
        if (ni.quantity !== oi.quantity) {
          changed.push(`items[${i}].quantity`);
        }
        if (allowedCustomerEdit && ni.name !== oi.name) {
          changed.push(`items[${i}].name`);
        }
      }
      continue;
    }
    const oldVal = JSON.stringify(original[field]);
    const newVal = JSON.stringify(updates[field]);
    if (oldVal !== newVal) {
      changed.push(field);
    }
  }
  return changed;
}

export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { userId, items, customerNotes, expiryDate, remarks } = await request.json();

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await User.findById(userId).select('email role name').lean({ virtuals: false });
    if (!user || user.role !== 'customer') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const quotation = await Quotation.findById(id).lean({ virtuals: false });
    if (!quotation) {
      return Response.json({ error: 'Quotation not found' }, { status: 404 });
    }

    const customerRecords = await Customer.find({ email: user.email }).select('_id').lean({ virtuals: false });
    const customerIds = customerRecords.map(c => c._id.toString());
    if (!customerIds.includes(quotation.customerId.toString())) {
      return Response.json({ error: 'Quotation not found' }, { status: 404 });
    }

    const editableStatuses = [
      QUOTATION_STATUS.SENT,
      QUOTATION_STATUS.REVISION_REQUESTED,
      QUOTATION_STATUS.CUSTOMER_EDITING,
    ];
    if (!editableStatuses.includes(quotation.status)) {
      return Response.json({ error: `Cannot edit quotation in "${quotation.status}" status` }, { status: 400 });
    }

    const newRevisionNum = (quotation.revision || 0) + 1;

    await QuotationRevision.create({
      quotationId: id,
      revisionNumber: newRevisionNum,
      quotationSnapshot: snapshotQuotation(quotation),
      changedBy: userId,
      changedByRole: 'customer',
      changedByName: user.name || '',
      changedFields: detectChangedFields(quotation, { items, customerNotes, expiryDate }, quotation.allowedCustomerEdit),
      status: QUOTATION_STATUS.PENDING_BUSINESS_APPROVAL,
      remarks: remarks || '',
    });

    const updates = {
      status: QUOTATION_STATUS.PENDING_BUSINESS_APPROVAL,
      revision: newRevisionNum,
    };
    if (items !== undefined) updates.items = items;
    if (customerNotes !== undefined) updates.customerNotes = customerNotes;
    if (expiryDate !== undefined) updates.expiryDate = expiryDate;

    const updated = await Quotation.findByIdAndUpdate(id, updates, { new: true }).lean({ virtuals: false });

    const businessUser = await User.findOne({ businessId: quotation.businessId }).select('_id').lean({ virtuals: false });
    if (businessUser) {
      await Notification.create({
        userId: businessUser._id,
        title: 'Revision Submitted',
        message: `Customer has submitted a revision for ${quotation.quotationNumber}.`,
        link: `/business/quotations/${id}`,
      });
    }

    const customer = await Customer.findById(quotation.customerId).select('email name companyName').lean({ virtuals: false });
    if (customer) {
      await Activity.create({
        businessId: quotation.businessId,
        action: 'Revision Submitted',
        userId: userId,
        userName: user.name || 'Customer',
        role: 'customer',
        details: `${quotation.quotationNumber} revision ${newRevisionNum} submitted by ${customer.companyName || customer.name}.`,
      });
    }

    return Response.json({ success: true, revision: newRevisionNum, quotation: updated });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
