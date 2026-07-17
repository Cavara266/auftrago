import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type TrackProviderActivityInput = {
  providerId: string;
  event: string;
  description?: string;
  page?: string;
  leadId?: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
};

export async function trackProviderActivity({
  providerId,
  event,
  description,
  page,
  leadId,
  metadata,
  ipAddress,
  userAgent,
}: TrackProviderActivityInput): Promise<void> {
  try {
    await prisma.providerActivity.create({
      data: {
        providerId,
        event,
        description,
        page,
        leadId,
        metadata,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("PROVIDER ACTIVITY ERROR:", error);
  }
}