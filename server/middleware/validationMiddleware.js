import Joi from 'joi';

export const validateChat = (req, res, next) => {
  const schema = Joi.object({
    message: Joi.string().required().max(1000).trim(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validatePayment = (req, res, next) => {
  const schema = Joi.object({
    plan: Joi.string().required().valid('PRO', 'ELITE', 'ELITE PRIME'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
