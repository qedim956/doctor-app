CREATE TYPE "public"."lab_type" AS ENUM('creatinine', 'potassium', 'phosphorus', 'albumin');--> statement-breakpoint
CREATE TABLE "lab_results" (
	"id" uuid PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"type" "lab_type" NOT NULL,
	"value" numeric(10, 4) NOT NULL,
	"unit" varchar(20) NOT NULL,
	"canonical_value" numeric(12, 4) NOT NULL,
	"taken_at" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lab_results_patient_type_taken_idx" ON "lab_results" USING btree ("patient_id","type","taken_at");