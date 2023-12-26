ALTER TABLE "contributions"
    DROP COLUMN "registered_by",
    ADD COLUMN "confirmed_by" UUID NULL REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;