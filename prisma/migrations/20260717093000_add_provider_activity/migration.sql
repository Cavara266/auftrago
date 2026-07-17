CREATE TABLE "ProviderActivity" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "description" TEXT,
  "page" TEXT,
  "leadId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProviderActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProviderActivity_providerId_createdAt_idx"
ON "ProviderActivity"("providerId", "createdAt");

CREATE INDEX "ProviderActivity_event_createdAt_idx"
ON "ProviderActivity"("event", "createdAt");

CREATE INDEX "ProviderActivity_createdAt_idx"
ON "ProviderActivity"("createdAt");

ALTER TABLE "ProviderActivity"
ADD CONSTRAINT "ProviderActivity_providerId_fkey"
FOREIGN KEY ("providerId")
REFERENCES "Provider"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;