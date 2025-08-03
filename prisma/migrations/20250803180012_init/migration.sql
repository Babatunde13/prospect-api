-- CreateTable
CREATE TABLE "public"."prospects" (
    "id" CHAR(26) NOT NULL,
    "linkedin_url" TEXT NOT NULL,
    "name" TEXT,
    "title" TEXT,
    "company" TEXT,
    "location" TEXT,
    "profile_data" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "prospects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tov_configs" (
    "id" CHAR(26) NOT NULL,
    "prospect_id" TEXT NOT NULL,
    "formality" DOUBLE PRECISION NOT NULL,
    "warmth" DOUBLE PRECISION NOT NULL,
    "directness" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "tov_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message_sequences" (
    "id" CHAR(26) NOT NULL,
    "prospect_id" TEXT NOT NULL,
    "tov_config_id" TEXT NOT NULL,
    "company_context" TEXT NOT NULL,
    "sequences" JSONB NOT NULL,
    "sequence_length" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "message_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_generations" (
    "id" CHAR(26) NOT NULL,
    "message_sequence_id" TEXT NOT NULL,
    "prompt" JSONB NOT NULL,
    "output" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "client_type" TEXT NOT NULL,
    "tokens_used" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prospects_linkedin_url_key" ON "public"."prospects"("linkedin_url");

-- CreateIndex
CREATE INDEX "prospects_created_at_idx" ON "public"."prospects"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tov_configs_prospect_id_key" ON "public"."tov_configs"("prospect_id");

-- CreateIndex
CREATE INDEX "tov_configs_prospect_id_idx" ON "public"."tov_configs"("prospect_id");

-- CreateIndex
CREATE INDEX "tov_configs_created_at_idx" ON "public"."tov_configs"("created_at");

-- CreateIndex
CREATE INDEX "message_sequences_prospect_id_idx" ON "public"."message_sequences"("prospect_id");

-- CreateIndex
CREATE INDEX "message_sequences_tov_config_id_idx" ON "public"."message_sequences"("tov_config_id");

-- CreateIndex
CREATE INDEX "message_sequences_created_at_idx" ON "public"."message_sequences"("created_at");

-- CreateIndex
CREATE INDEX "ai_generations_message_sequence_id_idx" ON "public"."ai_generations"("message_sequence_id");

-- CreateIndex
CREATE INDEX "ai_generations_created_at_idx" ON "public"."ai_generations"("created_at");

-- AddForeignKey
ALTER TABLE "public"."tov_configs" ADD CONSTRAINT "tov_configs_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message_sequences" ADD CONSTRAINT "message_sequences_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message_sequences" ADD CONSTRAINT "message_sequences_tov_config_id_fkey" FOREIGN KEY ("tov_config_id") REFERENCES "public"."tov_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_generations" ADD CONSTRAINT "ai_generations_message_sequence_id_fkey" FOREIGN KEY ("message_sequence_id") REFERENCES "public"."message_sequences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
