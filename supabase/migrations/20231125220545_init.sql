CREATE TYPE "MoneyMovementType" AS ENUM ('CREDIT', 'DEBIT');
CREATE TYPE "ProfileType" AS ENUM('ADMIN', 'REGULAR');
CREATE TYPE "ContributionType" AS ENUM (
    'BANK',
    'CRYPTO',
    'WALL_NAME_SINGULAR',
    'WALL_NAME_COMPANY',
    'OFFICE_CHAIR',
    'SIMULATOR_CHAIR',
    'LOUNGE_CHAIR',
    'AUDITORIUM_CHAIR',
    'BUILDING_NAMING',
    'TRAINING_ROOM_NAMING'
);


CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "name" TEXT NOT NULL DEFAULT '',
    "type" "ProfileType" NOT NULL DEFAULT 'REGULAR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organization_movements" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "type" "MoneyMovementType" NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "paid" BOOLEAN NOT NULL DEFAULT FALSE,
    "movement_date" DATE NOT NULL,
    "registered_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_movements_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "registered_by_organization_movements_fkey" FOREIGN KEY("registered_by") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "contributions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "contribution_date" DATE NOT NULL,
    "value" INTEGER NOT NULL,
    "donor" TEXT NOT NULL,
    "registered_by" UUID NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" "ContributionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "registered_by_contributions_fkey" FOREIGN KEY("registered_by") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
