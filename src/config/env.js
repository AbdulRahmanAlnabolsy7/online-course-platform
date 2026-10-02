require('dotenv').config();
const Joi = require('joi');
const { value, error } = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(5000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().pattern(/^\d+[smhd]$/).default('7d'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000')
}).unknown(true).validate(process.env);
if (error) throw new Error(`Invalid environment configuration: ${error.message}`);
module.exports = value;
