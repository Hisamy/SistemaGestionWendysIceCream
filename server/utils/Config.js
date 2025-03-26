import "dotenv/config";
import path from "path";

export const publicPath = path.join(__dirname, "../../public");
export const DATABASE = process.env.DATABASE_URL; 