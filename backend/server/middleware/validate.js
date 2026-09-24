const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    const message = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join(', ');
    return next(new Error(message));
  }
  req.body = result.data;
  next();
};

export default validate;