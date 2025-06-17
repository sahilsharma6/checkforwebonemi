import { config as conf } from "dotenv";
conf({ path: "./config/config.env" });

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  COOKIE_EXPIRE: process.env.COOKIE_EXPIRE,
  NODE_ENV: process.env.NODE_ENV,
  //
  SMTP_MAIL: process.env.SMTP_MAIL,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  //
  // SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
  // SMTP_HOST: process.env.SMTP_HOST,
  // SMTP_PORT: process.env.SMTP_PORT,
};
export default config;
