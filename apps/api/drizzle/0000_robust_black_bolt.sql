CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" varchar(200) NOT NULL,
	"birth_date" date NOT NULL,
	"sex" "sex" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
