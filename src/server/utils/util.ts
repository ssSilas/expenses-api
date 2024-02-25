import { configEnv } from "config/enviroments";
import { createHash } from "crypto";

export function hashingPassword(password: string): string {
  const salt = configEnv.salt;
  const passSalt = password + salt;
  const encrypted = createHash("sha1").update(passSalt).digest("hex");
  return encrypted;
}
