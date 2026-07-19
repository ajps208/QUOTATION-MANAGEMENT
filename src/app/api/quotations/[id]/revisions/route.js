import connectToDatabase from '@/lib/mongodb';
import QuotationRevision from '@/models/QuotationRevision';
import { serialize, toId } from '@/app/api/utils/serializer';

function toRevision(doc) {
  const obj = serialize(doc, { quotationId: toId, changedBy: toId });
  return obj;
}

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const revisions = await QuotationRevision.find({ quotationId: id })
      .sort({ revisionNumber: -1 })
      .lean({ virtuals: false });
    return Response.json(revisions.map(toRevision));
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
