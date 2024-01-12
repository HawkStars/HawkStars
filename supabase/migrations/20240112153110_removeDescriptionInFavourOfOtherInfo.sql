ALTER TABLE "contributions"
    DROP COLUMN "description",
    ADD COLUMN "extra_info" TEXT NOT NULL DEFAULT(''),
    ADD COLUMN "is_anonymous" BOOLEAN NOT NULL DEFAULT FALSE;