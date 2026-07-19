import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { serializeBusiness } from '@/app/api/business/utils';

export function createSectionHandler(sectionPath) {
  return {
    async GET(request, { params }) {
      try {
        await connectToDatabase();
        const { id } = await params;
        const business = await Business.findById(id).select(sectionPath).lean({ virtuals: false });
        if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
        const section = sectionPath.split('.').reduce((obj, key) => obj?.[key], business);
        return Response.json(section || {});
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    },

    async PUT(request, { params }) {
      try {
        await connectToDatabase();
        const { id } = await params;
        const data = await request.json();
        const { id: _id, _id: __id, createdAt, updatedAt, __v, ...updateData } = data;
        const setObj = {};
        for (const [key, value] of Object.entries(updateData)) {
          setObj[`${sectionPath}.${key}`] = value;
        }
        if (Object.keys(setObj).length === 0) {
          return Response.json({ error: 'No fields to update' }, { status: 400 });
        }
        const business = await Business.findByIdAndUpdate(id, { $set: setObj }, { new: true, runValidators: true }).lean({ virtuals: false });
        if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });
        return Response.json(serializeBusiness(business));
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    },
  };
}
