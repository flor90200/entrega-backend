import path from "path";
import { fileURLToPath } from "url";


const ___filename = fileURLToPath (import.meta.url);
const __dirname = path.dirname(___filename)

import bcrypt from "bcrypt";
export default __dirname

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)