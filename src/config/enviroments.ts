import * as dotenv from "dotenv";

class SetEnv {
  portApp: number;
  nodeEnv: string;

  userDb: string;
  passDb: string;
  nameDb: string;
  portDb: number;
  dialectDb: string;
  hostDb: string;

  salt: string;
  secret: string;
  expireToken: string;

  constructor() {
    dotenv.config();
    this.setVariable();
  }

  setVariable(): void {
    //APP
    this.portApp = parseInt(process.env.PORT_APP || "3000", 10);
    this.nodeEnv = process.env.NODE_ENV || "";

    //DB
    this.userDb = process.env.DATA_BASE_USER || "";
    this.passDb = process.env.DATA_BASE_PASSWORD || "";
    this.nameDb = process.env.DATA_BASE_NAME || "";
    this.hostDb = process.env.DATA_BASE_HOST || "";
    this.portDb = parseInt(process.env.PORT || "0", 10);
    this.dialectDb = process.env.DATA_BASE_DIALECT || "";

    //TOKEN
    this.salt = process.env.PASS_SALT || "";
    this.secret = process.env.SECRET_KEY || "";
    this.expireToken = process.env.DURATION_TOKEN || "";
  }
}

export const configEnv = new SetEnv();
