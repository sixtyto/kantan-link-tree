import { drizzle } from "drizzle-orm/neon-http";
import "dotenv/config";
import * as schema from "../database/schema";

export const tables = schema;

export const useDb = () => drizzle(process.env.DATABASE_URL!);
