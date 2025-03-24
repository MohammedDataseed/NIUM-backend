-- Database: nium-dev

-- Create the required ENUM types
CREATE TYPE role_name AS ENUM ('admin', 'co-admin', 'maker', 'checker', 'maker-checker');
CREATE TYPE business_type_enum AS ENUM ('cash&carry', 'large_enterprise');
CREATE TYPE action_enum AS ENUM ('create', 'update', 'delete');
CREATE TYPE status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE beneficiary_type_enum AS ENUM ('Individual', 'Organization');
CREATE TYPE relationship_with_recipient_enum AS ENUM ('relationship1', 'relationship2');
CREATE TYPE transaction_status_enum AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE transaction_mode_enum AS ENUM ('cash', 'online');
CREATE TYPE support_status_enum AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE entity_type_enum AS ENUM ('user', 'customer');
CREATE TYPE log_type_enum AS ENUM ('roles', 'users', 'branches', 'bank_accounts', 'products', 'block_deal_requests', 'customer_details', 'purposes', 'documents', 'document_requirements', 'transactions', 'support_tickets');

-- Create the "uuid-ossp" extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the "roles" table
CREATE TABLE "roles" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" role_name NOT NULL,
  "status" boolean DEFAULT true,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp
);

-- Create the "users" table
CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "role_id" uuid,
  "username" varchar UNIQUE NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "branch_id" uuid,
  "bank_account_id" uuid,
  "agent_code" varchar,
  "agent_name" varchar,
  "status" boolean DEFAULT true,
  "product_id" uuid,
  "business_type" business_type_enum NOT NULL,
  "document_id" uuid,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "branches" table
CREATE TABLE "branches" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "location" varchar NOT NULL,
  "city" varchar NOT NULL,
  "state" varchar NOT NULL,
  "business_type" business_type_enum NOT NULL,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "bank_accounts" table
CREATE TABLE "bank_accounts" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "account_holder_name" varchar NOT NULL,
  "account_number" varchar UNIQUE NOT NULL,
  "bank_name" varchar NOT NULL,
  "bank_branch" varchar NOT NULL,
  "ifsc_code" varchar NOT NULL,
  "is_beneficiary" boolean,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "products" table
CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "block_deal_requests" table
CREATE TABLE "block_deal_requests" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "unique_deal_id" varchar UNIQUE NOT NULL,
  "agent_id" uuid,
  "checker_id" uuid,
  "product_id" uuid,
  "status" status_enum DEFAULT 'pending',
  "purpose_id" uuid,
  "type_of_currency" varchar NOT NULL,
  "fx_rate" numeric(15,2) NOT NULL,
  "fx_amount" numeric(15,2) NOT NULL,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "customer_details" table
CREATE TABLE "customer_details" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "block_deal_request_id" uuid,
  "customer_name" varchar NOT NULL,
  "customer_email" varchar UNIQUE NOT NULL,
  "customer_pan" varchar UNIQUE NOT NULL,
  "customer_mobile" varchar,
  "bank_account_id" uuid,
  "agent_id" uuid,
  "currency_type" varchar NOT NULL,
  "fx_amount" numeric(15,2) NOT NULL,
  "source_of_funds" varchar,
  "beneficiary_type" beneficiary_type_enum NOT NULL,
  "beneficiary_country" varchar NOT NULL,
  "relationship_with_recipient" relationship_with_recipient_enum NOT NULL,
  "beneficiary_full_name" varchar NOT NULL,
  "beneficiary_bank_id" uuid,
  "recipient_address" varchar NOT NULL,
  "purpose_id" uuid,
  "document_id" uuid,
  "transaction_id" uuid,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "purposes" table
CREATE TABLE "purposes" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp
);

-- Create the "documents" table
CREATE TABLE "documents" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "entity_id" uuid,
  "entity_type" entity_type_enum NOT NULL,
  "purpose_id" uuid,
  "document_type_id" json NOT NULL,
  "document_name" varchar NOT NULL,
  "document_url" json NOT NULL,
  "status" status_enum DEFAULT 'pending',
  "document_expiry" date,
  "is_doc_front_image" boolean DEFAULT false,
  "is_doc_back_image" boolean DEFAULT false,
  "is_uploaded" boolean DEFAULT false,
  "is_customer" boolean DEFAULT false,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "document_requirements" table
CREATE TABLE "document_requirements" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "purpose_id" uuid,
  "customer_id" uuid,
  "document_type" varchar NOT NULL,
  "is_required" boolean DEFAULT true,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "transactions" table
CREATE TABLE "transactions" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "block_deal_request_id" uuid,
  "customer_detail_id" uuid,
  "agent_id" uuid,
  "instarem_fx_rate" integer,
  "instarem_nostro" integer,
  "instarem_other_charges" integer,
  "instarem_markup" integer,
  "agent_nostro" integer,
  "agent_other_charges" integer,
  "gst" integer,
  "checker_verified" boolean,
  "checker_id" uuid,
  "document_ids" uuid,
  "payment_collected_via" varchar UNIQUE NOT NULL,
  "payment_link" varchar UNIQUE NOT NULL,
  "transaction_status" transaction_status_enum DEFAULT 'pending',
  "transaction_mode" transaction_mode_enum,
  "transaction_amount" numeric(15,2),
  "transaction_fee" numeric(15,2),
  "transaction_date" timestamp DEFAULT current_timestamp,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp,
  "created_by" uuid,
  "updated_by" uuid
);

-- Create the "support" table
CREATE TABLE "support" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "issue_description" text NOT NULL,
  "issue_status" support_status_enum DEFAULT 'open',
  "support_type" uuid, -- Correcting the foreign key
  "created_by" uuid,
  "assigned_to" uuid,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp
);

-- Create the "support_tickets" table
CREATE TABLE "support_tickets" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "support_tickets" varchar,
  "created_by" uuid,
  "assigned_to" uuid,
  "created_at" timestamp DEFAULT current_timestamp,
  "updated_at" timestamp DEFAULT current_timestamp
);

-- Create the "audit_logs" table
CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "log_id" uuid NOT NULL,
  "log_type" log_type_enum NOT NULL,
  "action" action_enum NOT NULL,
  "changes" jsonb NOT NULL,
  "logged_data" jsonb,
  "performed_by" uuid,
  "created_at" timestamp DEFAULT current_timestamp
);

-- Create foreign key constraints
-- (The rest of the foreign key constraints from your previous schema can be added in a similar manner.)
