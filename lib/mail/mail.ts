import nodemailer from "nodemailer";

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function env(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} fehlt in .env.local.`);
  }

  return value;
}

function parseBoolean(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function getTransporter() {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT"));
  const secure = parseBoolean(process.env.SMTP_SECURE);
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");

  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT ist ungültig.");
  }

  console.log("====================================");
  console.log("SMTP DEBUG");
  console.log("====================================");
  console.log("HOST:", host);
  console.log("PORT:", port);
  console.log("SECURE:", secure);
  console.log("USER:", user);
  console.log("PASS LENGTH:", pass.length);
  console.log("PASS EXISTS:", !!pass);
  console.log("====================================");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    logger: true,
    debug: true,
  });
}

let transporter: nodemailer.Transporter | null = null;

function mailTransporter() {
  if (!transporter) {
    transporter = getTransporter();
  }

  return transporter;
}

export async function verifyMailConnection() {
  await mailTransporter().verify();
}

export async function sendMail({
  to,
  subject,
  html,
  text,
}: SendMailInput) {
  console.log("Versende Mail an:", to);

  const result = await mailTransporter().sendMail({
    from: env("MAIL_FROM"),
    to,
    replyTo:
      process.env.MAIL_REPLY_TO?.trim() ||
      process.env.SMTP_USER?.trim() ||
      undefined,
    subject,
    html,
    text,
  });

  console.log("Mail erfolgreich versendet:", result.messageId);

  return {
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected,
    response: result.response,
  };
}