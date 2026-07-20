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

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT ist ungültig.");
  }

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
    logger: process.env.NODE_ENV !== "production",
    debug: process.env.NODE_ENV !== "production",
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

  const accepted = result.accepted.map(String);
  const rejected = result.rejected.map(String);

  if (accepted.length === 0) {
    throw new Error(
      `E-Mail wurde von SMTP nicht akzeptiert. Empfänger: ${to}`
    );
  }

  if (rejected.length > 0) {
    throw new Error(
      `E-Mail wurde teilweise oder vollständig abgelehnt. Empfänger: ${to}, abgelehnt: ${rejected.join(
        ", "
      )}`
    );
  }

  console.log("Mail erfolgreich akzeptiert:", {
    to,
    messageId: result.messageId,
    accepted,
  });

  return {
    messageId: result.messageId,
    accepted,
    rejected,
    response: result.response,
  };
}