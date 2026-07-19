import connectToDatabase from '@/lib/mongodb';
import Quotation from '@/models/Quotation';
import QuotationRevision from '@/models/QuotationRevision';
import Activity from '@/models/Activity';
import Notification from '@/models/Notification';
import Business from '@/models/Business';
import Customer from '@/models/Customer';
import User from '@/models/User';
import { QUOTATION_STATUS } from '@/constants/statuses';

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

export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { userId, action, rejectionReason, remarks, quotationData } = await request.json();

    if (!userId || !action) {
      return Response.json({ error: 'userId and action are required' }, { status: 400 });
    }

    const user = await User.findById(userId).select('name role businessId').lean({ virtuals: false });
    if (!user || user.role !== 'business') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const quotation = await Quotation.findById(id).lean({ virtuals: false });
    if (!quotation) {
      return Response.json({ error: 'Quotation not found' }, { status: 404 });
    }

    if (quotation.businessId.toString() !== user.businessId.toString()) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const validActions = ['approve', 'reject', 'request_changes', 'edit_and_send'];
    if (!validActions.includes(action)) {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (action === 'reject' && !rejectionReason) {
      return Response.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    const newRevisionNum = (quotation.revision || 0) + 1;
    let newStatus;
    let activityAction;
    let notificationTitle;
    let notificationMessage;

    switch (action) {
      case 'approve':
        newStatus = QUOTATION_STATUS.APPROVED;
        activityAction = 'Revision Approved';
        notificationTitle = 'Revision Approved';
        notificationMessage = `Your revision for ${quotation.quotationNumber} has been approved.`;
        break;
      case 'reject':
        newStatus = QUOTATION_STATUS.REJECTED;
        activityAction = 'Revision Rejected';
        notificationTitle = 'Revision Rejected';
        notificationMessage = `Your revision for ${quotation.quotationNumber} has been rejected.`;
        break;
      case 'request_changes':
        newStatus = QUOTATION_STATUS.REVISION_REQUESTED;
        activityAction = 'Changes Requested';
        notificationTitle = 'Changes Requested';
        notificationMessage = `The business has requested changes on ${quotation.quotationNumber}.`;
        break;
      case 'edit_and_send':
        newStatus = QUOTATION_STATUS.SENT;
        activityAction = 'Edited and Sent';
        notificationTitle = 'Quotation Updated';
        notificationMessage = `${quotation.quotationNumber} has been updated and sent back to you.`;
        break;
    }

    await QuotationRevision.create({
      quotationId: id,
      revisionNumber: newRevisionNum,
      quotationSnapshot: snapshotQuotation(quotation),
      changedBy: userId,
      changedByRole: 'business',
      changedByName: user.name || '',
      changedFields: [],
      status: newStatus,
      remarks: remarks || rejectionReason || '',
    });

    const updates = { status: newStatus, revision: newRevisionNum };
    if (action === 'reject' && rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }
    if (action === 'edit_and_send' && quotationData) {
      Object.assign(updates, quotationData);
    }

    const updated = await Quotation.findByIdAndUpdate(id, updates, { new: true }).lean({ virtuals: false });

    const customer = await Customer.findById(quotation.customerId).select('email name companyName').lean({ virtuals: false });
    if (customer) {
      const customerUser = await User.findOne({ email: customer.email }).select('_id').lean({ virtuals: false });
      if (customerUser) {
        await Notification.create({
          userId: customerUser._id,
          title: notificationTitle,
          message: notificationMessage,
          link: `/customer/quotations/${id}`,
        });
      }

      await Activity.create({
        businessId: quotation.businessId,
        action: activityAction,
        userId: userId,
        userName: user.name || 'Business',
        role: 'business',
        details: `${quotation.quotationNumber} revision ${newRevisionNum}: ${activityAction} by ${user.name || 'Business'}.`,
      });
    }

    return Response.json({ success: true, revision: newRevisionNum, quotation: updated });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
