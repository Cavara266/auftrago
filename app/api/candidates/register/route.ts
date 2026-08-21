import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createCandidateSession } from "@/lib/candidate-auth";
import { put, del } from "@vercel/blob";

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const cvEntry = formData.get("cv");
    const cvFile = cvEntry instanceof File && cvEntry.size > 0 ? cvEntry : null;

    const MAX_CV_SIZE = 8 * 1024 * 1024;

    const allowedCvTypes = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);

    if (cvFile && cvFile.size > MAX_CV_SIZE) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen?error=cv-too-large", request.url),
      );
    }

    if (cvFile && !allowedCvTypes.has(cvFile.type)) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen?error=cv-type", request.url),
      );
    }

    const firstName = clean(formData.get("firstName"));
    const lastName = clean(formData.get("lastName"));
    const email = clean(formData.get("email")).toLowerCase();
    const password = clean(formData.get("password"));
    const phone = clean(formData.get("phone"));

    const title = clean(formData.get("title"));
    const category = clean(formData.get("category"));

    const canton = clean(formData.get("canton"));
    const city = clean(formData.get("city"));
    const postalCode = clean(formData.get("postalCode"));

    const employmentPercent = clean(formData.get("employmentPercent"));

    const languages = clean(formData.get("languages"))
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const description = clean(formData.get("description"));

    const radiusRaw = Number.parseInt(
      clean(formData.get("radiusKm")) || "25",
      10,
    );

    const experienceRaw = clean(formData.get("experienceYears"));

    const contactConsent = formData.get("contactConsent") === "on";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !title ||
      !category ||
      !canton ||
      !contactConsent
    ) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen?error=missing", request.url),
      );
    }

    let uploadedCv: {
      pathname: string;
      url: string;
    } | null = null;

    if (
      cvFile &&
      process.env.NODE_ENV === "production" &&
      process.env.BLOB_READ_WRITE_TOKEN
    ) {
      const safeName = cvFile.name
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 120);

      uploadedCv = await put(
        `candidate-cvs/${crypto.randomUUID()}-${safeName}`,
        cvFile,
        {
          access: "private",
          addRandomSuffix: false,
          contentType: cvFile.type,
        },
      );
    }

    const profile = await prisma.candidateProfile.upsert({
      where: {
        email,
      },

      update: {
        firstName,
        lastName,
        phone: phone || null,

        title,
        category,

        canton,
        city: city || null,
        postalCode: postalCode || null,

        radiusKm: Number.isFinite(radiusRaw) && radiusRaw > 0 ? radiusRaw : 25,

        employmentPercent: employmentPercent || null,

        experienceYears: experienceRaw
          ? Number.parseInt(experienceRaw, 10)
          : null,

        languages,

        drivingLicense: formData.get("drivingLicense") === "on",

        ownCar: formData.get("ownCar") === "on",

        description: description || null,

        isVisible: true,
        status: "ACTIVE",
        contactConsent: true,
      },

      create: {
        firstName,
        lastName,
        email,
        phone: phone || null,

        title,
        category,

        canton,
        city: city || null,
        postalCode: postalCode || null,

        radiusKm: Number.isFinite(radiusRaw) && radiusRaw > 0 ? radiusRaw : 25,

        employmentPercent: employmentPercent || null,

        experienceYears: experienceRaw
          ? Number.parseInt(experienceRaw, 10)
          : null,

        languages,

        drivingLicense: formData.get("drivingLicense") === "on",

        ownCar: formData.get("ownCar") === "on",

        description: description || null,

        contactConsent: true,
        source: "DIRECT",
        sourceConsent: true,

        ...(uploadedCv && cvFile
          ? {
              cvPath: uploadedCv.pathname,
              cvFilename: cvFile.name,
              cvMimeType: cvFile.type,
              cvSize: cvFile.size,
              cvUploadedAt: new Date(),
            }
          : {}),
      },
    });

    if (password.length < 8) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen?error=password", request.url),
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const existingAccount = await prisma.candidateAccount.findUnique({
      where: {
        candidateProfileId: profile.id,
      },
    });

    const account = existingAccount
      ? await prisma.candidateAccount.update({
          where: {
            id: existingAccount.id,
          },
          data: {
            passwordHash,
            status: "ACTIVE",
          },
        })
      : await prisma.candidateAccount.create({
          data: {
            candidateProfileId: profile.id,
            passwordHash,
            credits: 3,
            status: "ACTIVE",
          },
        });

    await createCandidateSession(account.id);

    return NextResponse.redirect(
      new URL("/arbeit-suchen?success=1", request.url),
    );
  } catch (error) {
    console.error("===== CANDIDATE REGISTER ERROR =====");
    console.error("name:", error instanceof Error ? error.name : "unknown");
    console.error(
      "message:",
      error instanceof Error ? error.message : String(error),
    );
    console.error("cause:", error instanceof Error ? error.cause : undefined);
    console.error("full:", error);
    console.error("====================================");

    return NextResponse.redirect(
      new URL("/arbeit-suchen?error=server", request.url),
    );
  }
}
