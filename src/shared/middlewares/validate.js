const validate = (schema, reqPart = "body") => {
  return (req, res, next) => {
    const validationRes = schema.validate(req[reqPart], {
      abortEarly: false,
      allowUnknown: false,
    });

    if (validationRes.error) {
      return res.status(400).send(validationRes.error);
    }

    next();
  };
};

module.exports = {
  validate,
};
