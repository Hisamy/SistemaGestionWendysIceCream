import "dotenv/config";
import path from "path";

// Use import.meta.url to get the current file's URL
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export const publicPath = path.join(__dirname, "../../public");
export const DATABASE = process.env.DATABASE_URL;
