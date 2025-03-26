import "dotenv/config";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
    
export const publicPath = join(__dirname, "../../public");
export const DATABASE = process.env.DATABASE_URL || join(__dirname, "../../wendysicecream.db");