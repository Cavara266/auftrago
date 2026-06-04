import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("Empfangene Daten:", data);

  const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

await transporter.sendMail({
  from: process.env.MAIL_FROM,
  to: process.env.MAIL_TO,
  subject: data.typ || "Neue Anfrage",
  text: `...`,
});

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "info@cavara-hauswartung.ch",
      subject: data.typ || "Neue Anfrage",
      text: JSON.stringify(data, null, 2),
    });

    return Response.json({
      ok: true,
      message: "Anfrage erfolgreich gesendet",
    });
  } catch (error: any) {
    console.error("MAIL FEHLER:", error);

    return Response.json(
      {
        ok: false,
        error: error?.message || "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}