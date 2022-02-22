import Joi from 'joi';

export const schema = Joi
  .object({
    dataCenter: Joi.string().valid('EU', 'US', 'CN', 'RU').required(),
    countryCode: Joi.string().max(10).required(),
    language: Joi.string().required(),
    system: Joi.string().max(10).required(),
    purpose: Joi.string(),
    userKey: Joi.string(),
    secret: Joi.string(),
    userKeyRU: Joi.string(),
    secretRU: Joi.string(),
    multicountry: Joi.boolean().default(false),
    countryFullname: Joi.string().required()
  })
  .options({ abortEarly: false })

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      const errors = error.details.reduce((acc, detail) => {
        detail.message = detail.message.replace(/\"/g, '')
        if(detail.message.includes('is not allowed')){
          acc.incorrectParameters.push(detail.path[0])
        } else {
          acc.invalidValues.push(detail.message)
        }
        return acc
      }, {
        invalidValues: [],
        incorrectParameters: []
      })
      return res.status(400).json(errors);
    }
  };
};
