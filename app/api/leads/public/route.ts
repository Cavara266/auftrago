import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail/mail";
import { sendNewLeadNotifications } from "@/lib/new-lead-notification";
import {
  getCategoryByService,
  getService,
} from "@/lib/service-categories";

type FormValue = string | boolean | string[];

type PublicLeadRequest = {
  serviceSlug?: string;
  serviceName?: string;
  categorySlug?: string;
  categoryName?: string;
  leadPrice?: number;
  answers?: Record<string, FormValue>;
};

function getStringValue(
  answers: Record<string, FormValue>,
  key: string
) {
  const value = answers[key];

  return typeof value === "string"
    ? value.trim()
    : "";
}

function formatAnswerValue(value: FormValue) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Ja" : "Nein";
  }

  return value;
}

function createDescription(
  answers: Record<string, FormValue>
) {
  const ignoredFields = new Set([
    "name",
    "email",
    "phone",
    "postalCode",
    "city",
    "street",
    "privacyAccepted",
  ]);

  const lines = Object.entries(answers)
    .filter(([key, value]) => {
      if (ignoredFields.has(key)) {
        return false;
      }

      if (value === "") {
        return false;
      }

      if (Array.isArray(value) && value.length === 0) {
        return false;
      }

      return true;
    })
    .map(([key, value]) => {
      return `${key}: ${formatAnswerValue(value)}`;
    });

  return lines.length > 0
    ? lines.join("\n")
    : "Keine weiteren Angaben vorhanden.";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character] ?? character;
  });
}

function createExpiryDate() {
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  return expiresAt;
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as PublicLeadRequest;

    const serviceSlug = body.serviceSlug?.trim();
    const answers = body.answers ?? {};

    if (!serviceSlug) {
      return NextResponse.json(
        {
          error:
            "Es wurde keine Dienstleistung ausgewählt.",
        },
        {
          status: 400,
        }
      );
    }

    const service = getService(serviceSlug);
    const category =
      getCategoryByService(serviceSlug);

    if (!service || !category) {
      return NextResponse.json(
        {
          error:
            "Die ausgewählte Dienstleistung wurde nicht gefunden.",
        },
        {
          status: 400,
        }
      );
    }

    const name = getStringValue(
      answers,
      "name"
    );

    const email = getStringValue(
      answers,
      "email"
    ).toLowerCase();

    const phone = getStringValue(
      answers,
      "phone"
    );

    const postalCode = getStringValue(
      answers,
      "postalCode"
    );

    const city = getStringValue(
      answers,
      "city"
    );

    const street = getStringValue(
      answers,
      "street"
    );

    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          error:
            "Bitte fülle alle Kontaktdaten vollständig aus.",
        },
        {
          status: 400,
        }
      );
    }

    if (!postalCode || !city) {
      return NextResponse.json(
        {
          error:
            "Bitte gib Postleitzahl und Ort an.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^\d{4}$/.test(postalCode)) {
      return NextResponse.json(
        {
          error:
            "Bitte gib eine gültige Schweizer Postleitzahl an.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Bitte gib eine gültige E-Mail-Adresse an.",
        },
        {
          status: 400,
        }
      );
    }

    if (answers.privacyAccepted !== true) {
      return NextResponse.json(
        {
          error:
            "Bitte akzeptiere den Datenschutz.",
        },
        {
          status: 400,
        }
      );
    }

    const enteredDescription =
      getStringValue(answers, "description");

    const generatedDescription =
      createDescription(answers);

    const completeDescription = [
      enteredDescription,
      generatedDescription,
      street ? `Adresse: ${street}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const lead = await prisma.lead.create({
      data: {
        title: `${service.name} in ${city}`,
        description: completeDescription,
        name,
        email,
        phone,
        region: `${postalCode} ${city}`,
        category: service.name,
        price: service.leadPrice,
        postalCode,
        city,
        maxPurchases: 4,
        expiresAt: createExpiryDate(),
      },
      select: {
        id: true,
        title: true,
        description: true,
        region: true,
        category: true,
        postalCode: true,
        city: true,
        price: true,
      },
    });

    console.log("PUBLIC LEAD CREATED:", {
      leadId: lead.id,
      title: lead.title,
      category: lead.category,
      region: lead.region,
    });

    let providerNotifications = {
      approvedProviders: 0,
      emailEnabledProviders: 0,
      matchingProviders: 0,
      sent: 0,
      failed: 0,
    };

    try {
      providerNotifications =
        await sendNewLeadNotifications({
          lead,
          estimatedValue: service.leadPrice,
        });

      console.log(
        "PUBLIC LEAD NOTIFICATIONS COMPLETED:",
        {
          leadId: lead.id,
          ...providerNotifications,
        }
      );
    } catch (notificationError) {
      console.error(
        "PUBLIC LEAD NOTIFICATION ERROR:",
        {
          leadId: lead.id,
          error: notificationError,
        }
      );
    }

    let internalMailSent = false;
    let internalMailError: string | null = null;

    try {
      const recipient =
        process.env.MAIL_TO?.trim() ||
        process.env.CONTACT_EMAIL?.trim() ||
        "info@auftrago.ch";

      const safeDescription =
        escapeHtml(completeDescription);

      await sendMail({
        to: recipient,
        subject:
          `Neue Auftrago Anfrage: ${service.name} in ${city}`,
        text: `
Neue Anfrage über Auftrago

Lead-ID: ${lead.id}
Dienstleistung: ${service.name}
Kategorie: ${category.name}
Leadpreis: ${service.leadPrice} Credits

KONTAKT
Name: ${name}
E-Mail: ${email}
Telefon: ${phone}

ADRESSE
${street}
${postalCode} ${city}

ANGABEN
${completeDescription}
        `.trim(),
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2>Neue Auftrago Anfrage</h2>

            <p>
              <strong>Lead-ID:</strong> ${escapeHtml(lead.id)}<br>
              <strong>Dienstleistung:</strong> ${escapeHtml(service.name)}<br>
              <strong>Kategorie:</strong> ${escapeHtml(category.name)}<br>
              <strong>Leadpreis:</strong> ${service.leadPrice} Credits
            </p>

            <h3>Kontakt</h3>

            <p>
              <strong>Name:</strong> ${escapeHtml(name)}<br>
              <strong>E-Mail:</strong> ${escapeHtml(email)}<br>
              <strong>Telefon:</strong> ${escapeHtml(phone)}
            </p>

            <h3>Adresse</h3>

            <p>
              ${escapeHtml(street)}<br>
              ${escapeHtml(postalCode)} ${escapeHtml(city)}
            </p>

            <h3>Alle Angaben</h3>

            <pre style="white-space:pre-wrap;font-family:Arial,sans-serif;background:#f3f4f6;padding:16px;border-radius:10px">${safeDescription}</pre>
          </div>
        `,
      });

      internalMailSent = true;

      console.log("PUBLIC INTERNAL MAIL SENT:", {
        leadId: lead.id,
        recipient,
      });
    } catch (mailError) {
      internalMailError =
        mailError instanceof Error
          ? mailError.message
          : "Interner Mailversand fehlgeschlagen.";

      console.error("PUBLIC INTERNAL MAIL ERROR:", {
        leadId: lead.id,
        error: mailError,
      });
    }

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        notifications: providerNotifications,
        internalMail: {
          sent: internalMailSent,
          error: internalMailError,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Public lead creation failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Die Anfrage konnte momentan nicht gespeichert werden. Bitte versuche es erneut.",
      },
      {
        status: 500,
      }
    );
  }
}