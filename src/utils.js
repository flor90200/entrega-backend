import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const ___filename = fileURLToPath (import.meta.url);
const __dirname = path.dirname(___filename)


export default __dirname

export const createHash = password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compare(password, user.password)