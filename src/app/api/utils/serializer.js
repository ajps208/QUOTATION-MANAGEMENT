export function serialize(doc, fieldMap = {}) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  for (const [key, converter] of Object.entries(fieldMap)) {
    if (obj[key] && typeof converter === 'function') {
      obj[key] = converter(obj[key]);
    }
  }
  return obj;
}

export function toId(val) {
  return val?.toString?.() ?? val;
}

export function serializeItems(items, fieldMap = {}) {
  if (!items) return items;
  return items.map(item => {
    const obj = { ...item, _id: item._id?.toString() };
    for (const [key, converter] of Object.entries(fieldMap)) {
      if (obj[key] && typeof converter === 'function') {
        obj[key] = converter(obj[key]);
      }
    }
    return obj;
  });
}

export function successResponse(data, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(message, status = 500) {
  return Response.json({ error: message }, { status });
}
