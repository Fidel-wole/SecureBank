import { config } from "dotenv";
config();

export const {
  PORT,
  NODE_ENV,
  JWT_ACCESS_SECRET,
  MONGO_DB_URL_DEV,
  MONGO_DB_URL_PROD,
  MONGO_DB_URL_STAGING,
} = process.env;
