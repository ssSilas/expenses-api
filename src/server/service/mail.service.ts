import * as nodemailer from "nodemailer";
import { configEnv } from "../../config/env.config";
import { ExpenseData } from "../interface/expense.interface";

export class MailService {
  sendMail(to: string, subject: string, message: string) {
    let mailOptions = {
      from: "guimaraessilas15@gmail.com",
      to: to,
      subject: subject,
      html: message,
    };

    const transporter = nodemailer.createTransport({
      host: configEnv.smtpHost,
      port: configEnv.smtpPort,
      secure: false,
      auth: {
        user: configEnv.smtpUser,
        pass: configEnv.smtpPass,
      },
      tls: { rejectUnauthorized: false },
    } as nodemailer.TransportOptions); // Specify the type here

    console.log(mailOptions);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return error;
      } else {
        return "E-mail enviado com sucesso!";
      }
    });
  }

  mailStructure(data: ExpenseData) {
    return {
      subject: "Despesa cadastrada",
      message: `
        <p>Descrição: ${data.description}</p>
        <p>Data: ${data.date}</p>
        <p>Preço:${data.price}</p>`,
    };
  }
}

export default new MailService();
