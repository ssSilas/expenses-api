import { createHash } from "crypto";
import { configEnv } from "../../config/env.config";

export function hashingPassword(password: string): string {
  const salt = configEnv.salt;
  const passSalt = password + salt;
  const encrypted = createHash("sha1").update(passSalt).digest("hex");
  return encrypted;
}
