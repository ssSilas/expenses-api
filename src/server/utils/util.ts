import { createHash } from "crypto";
import { configEnv } from "../../config/env.config";

export function hashingPassword(password: string): string {
  const salt = configEnv.salt;
  const passSalt = password + salt;
  const encrypted = createHash("sha1").update(passSalt).digest("hex");
  return encrypted;
}

export function checkAndParseId(id: any) {
  try {
    const check = typeof id === "string" ? parseInt(id) : NaN;
    if (isNaN(check)) {
      throw new Error("Invalid id");
    }
    return check;
  } catch (error) {
    throw error;
  }
}

export function isFutureDate(date: Date): boolean {
  const currentDate = new Date();
  return date > currentDate;
}
