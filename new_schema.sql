

create or replace
function public.instarem_audit() returns trigger language plpgsql as $function$ declare begin if (TG_OP = 'UPDATE') then execute format('INSERT INTO %I.%I SELECT $1,''U'',now() AT TIME ZONE ''UTC'' , $2.*' ,
TG_TABLE_SCHEMA,
TG_TABLE_NAME || '_log')
	using nextval(TG_ARGV[0] :: regclass),
new;

elsif (TG_OP = 'INSERT') then execute format('INSERT INTO %I.%I SELECT $1,''I'',now() AT TIME ZONE ''UTC'' , $2.*' ,
TG_TABLE_SCHEMA,
TG_TABLE_NAME || '_log')
	using nextval(TG_ARGV[0] :: regclass),
new;

elseif (TG_OP = 'DELETE') then execute format('INSERT INTO %I.%I SELECT $1,''D'',now() AT TIME ZONE ''UTC'' , $2.*' ,
TG_TABLE_SCHEMA,
TG_TABLE_NAME || '_log')
	using nextval(TG_ARGV[0] :: regclass),
old;
end if;

return NULL;
-- result is ignored since this is an AFTER trigger -----
end;

$function$ ;

CREATE OR REPLACE FUNCTION public.last_updated()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now() AT TIME ZONE 'UTC';
    RETURN NEW;
END $function$
;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

----===============================DROP TABLE AND DEPENDENCY'S============================================

DROP TRIGGER IF EXISTS last_updated ON public.document_type;
DROP TRIGGER IF EINSERTXISTS instarem_audit ON public.document_type;
DROP TABLE IF EXISTS public.document_type_log;
DROP TABLE IF EXISTS public.document_type CASCADE;
DROP SEQUENCE IF EXISTS public.document_type_log_id_seq;

-----===============================TABLE DOCUMENT_TYPE==================================================

create sequence if NOT exists public.document_type_log_id_seq
start with
1 increment by 1 no minvalue no maxvalue cache 1;

ALTER SEQUENCE public.document_type_log_id_seq
OWNER TO postgres;


CREATE TABLE public.document_type_log (
    log_id          BIGINT PRIMARY KEY,
    dml_action      char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp   TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    name VARCHAR(255),
    is_active BOOLEAN,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.document_type_log OWNER TO postgres;

CREATE TABLE public.document_type (
    id UUID  PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);


ALTER TABLE public.document_type OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE
ON  public.document_type
FOR EACH ROW
EXECUTE PROCEDURE public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE
ON public.document_type
FOR EACH ROW
EXECUTE PROCEDURE public.instarem_audit('public.document_type_log_id_seq');


----===============================DROP TABLE AND DEPENDENCY'S============================================

DROP TRIGGER IF EXISTS last_updated ON public.bank_accounts;
DROP TRIGGER IF EXISTS instarem_audit ON public.bank_accounts;
DROP TABLE IF EXISTS public.bank_accounts_log;
DROP TABLE IF EXISTS public.bank_accounts CASCADE;
DROP SEQUENCE IF EXISTS public.bank_account_log_id_seq;

-----===============================TABLE BANK_ACCOUNT===================================================

create sequence if NOT exists public.bank_account_log_id_seq
start with
1 increment by 1 no minvalue no maxvalue cache 1;

ALTER SEQUENCE public.bank_account_log_id_seq OWNER TO postgres;


CREATE TABLE public.bank_accounts_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    account_holder_name VARCHAR(255),
    account_number VARCHAR(255),
    bank_name VARCHAR(255),
    bank_branch VARCHAR(255),
    ifsc_code VARCHAR(255),
    is_beneficiary BOOLEAN,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.bank_accounts_log OWNER TO postgres;

CREATE TABLE public.bank_accounts (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    account_holder_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(255) NOT NULL UNIQUE,
    bank_name VARCHAR(255) NOT NULL,
    bank_branch VARCHAR(255) NOT NULL,
    ifsc_code VARCHAR(255) NOT NULL,
    is_beneficiary BOOLEAN DEFAULT false,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.bank_accounts OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE
ON  public.bank_accounts
FOR EACH ROW
EXECUTE PROCEDURE public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE
ON public.bank_accounts
FOR EACH ROW
EXECUTE PROCEDURE public.instarem_audit('public.bank_account_log_id_seq');


----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.branches;
DROP TRIGGER IF EXISTS instarem_audit ON public.branches;
DROP TABLE IF EXISTS public.branches_log;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP SEQUENCE IF EXISTS public.branch_log_id_seq;
DROP TYPE IF EXISTS enum_branches_business_type CASCADE;
-----===============================TABLE BRANCHES========================================================

CREATE SEQUENCE public.branch_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.branch_log_id_seq OWNER TO postgres;

CREATE TYPE enum_branches_business_type AS ENUM (
	'cash&carry',
	'large_enterprise');

CREATE TABLE public.branches_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255) ,
    name VARCHAR(255),
    location VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    bussiness_type VARCHAR,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.branches_log OWNER TO postgres;

CREATE TABLE public.branches(
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    bussiness_type public.enum_branches_business_type NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.branches OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.branches
FOR EACH ROW
EXECUTE PROCEDURE public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.branches
FOR EACH ROW
EXECUTE PROCEDURE public.instarem_audit('public.branch_log_id_seq');

----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.purposes;
DROP TRIGGER IF EXISTS instarem_audit ON public.purposes;
DROP TABLE IF EXISTS public.purposes_log;
DROP TABLE IF EXISTS public.purposes CASCADE ;
DROP SEQUENCE IF EXISTS public.purposes_log_id_seq;
-----===============================TABLE PURPOSES========================================================

CREATE SEQUENCE public.purposes_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.purposes_log_id_seq OWNER TO postgres

CREATE TABLE public.purposes_log (
    log_id BIGINT PRIMARY KEY NOT NULL,
    dml_action  char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    purpose_name VARCHAR(255),
    is_active BOOLEAN,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.purposes_log OWNER TO postgres;

CREATE TABLE public.purposes (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    -- hashed_key VARCHAR(255)   NOT NULL UNIQUE,
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
   
    purpose_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.purposes OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.purposes
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.purposes
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.purposes_log_id_seq');

----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.document_master;
DROP TRIGGER IF EXISTS instarem_audit ON public.document_master;
DROP TABLE IF EXISTS public.document_master_log;
DROP TABLE IF EXISTS public.document_master;
DROP SEQUENCE IF EXISTS public.document_master_log_id_seq;
-----===============================TABLE DOCUMENT MASTER===================================================

CREATE SEQUENCE public.document_master_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.document_master_log_id_seq OWNER TO postgres

CREATE TABLE public.document_master_log (
    log_id BIGINT PRIMARY KEY NOT NULL,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    document_type VARCHAR(255),
    purpose_id UUID,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);


ALTER TABLE public.document_master_log OWNER TO postgres;

CREATE TABLE public.document_master (
    id UUID  PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    document_type VARCHAR(255) NOT NULL,
    purpose_id UUID REFERENCES purposes(id),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.document_master OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.document_master
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();


CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.document_master
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.document_master_log_id_seq');


----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.document_requirements;
DROP TRIGGER IF EXISTS instarem_audit ON public.document_requirements;
DROP TABLE IF EXISTS public.document_requirements_log;
DROP TABLE IF EXISTS public.document_requirements;
DROP SEQUENCE IF EXISTS public.document_requirements_log_id_seq;
-----===============================TABLE DOCUMENT REQUIREMENT===================================================

CREATE SEQUENCE public.document_requirements_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.document_requirements_log_id_seq OWNER TO postgres;

CREATE TABLE public.document_requirements_log (
    log_id BIGINT PRIMARY KEY NOT NULL,
    dml_action  char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamp,
    id UUID,
    hashed_key VARCHAR(255),
    document_type VARCHAR(255),
    is_required BOOLEAN,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ,
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.document_requirements_log OWNER TO postgres;

CREATE TABLE public.document_requirements (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    document_type VARCHAR(255) NOT NULL,
    is_required BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.document_requirements OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.document_requirements
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.document_requirements
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.document_requirements_log_id_seq');

----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.documents;
DROP TRIGGER IF EXISTS instarem_audit ON public.documents;
DROP TABLE IF EXISTS public.documents_log;
DROP TABLE IF EXISTS public.documents;
DROP SEQUENCE IF EXISTS public.documents_log_id_seq;
DROP TYPE IF EXISTS enum_documents_entity_type;
DROP TYPE IF EXISTS enum_documents_status;
-----===============================TABLE DOCUMENT=======================================================

CREATE SEQUENCE public.documents_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.documents_log_id_seq OWNER TO postgres;

CREATE TABLE public.documents_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'U', 'D')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    entity_id UUID,
    entity_type varchar,
    purpose_id UUID,
    document_type_id UUID,
    document_name VARCHAR(255),
    document_url json, ----*** need to check type..?
    status varchar,
    document_expiry date,
    is_doc_front_image BOOLEAN,
    is_doc_back_image BOOLEAN,
    is_uploaded BOOLEAN,
    is_customer BOOLEAN,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);


ALTER TABLE public.documents_log OWNER TO postgres;

CREATE TYPE enum_documents_entity_type AS ENUM (
	'user',
	'customer');

CREATE TYPE enum_documents_status AS ENUM (
	'pending',
	'approved',
	'rejected');

CREATE TABLE public.documents (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    entity_id UUID,
    entity_type public.enum_documents_entity_type NOT NULL,
    purpose_id UUID REFERENCES purposes(id),
    document_type_id UUID REFERENCES document_type(id),
    document_name VARCHAR(255) NOT NULL,
    document_url json NOT NULL,
    status public.enum_documents_status DEFAULT 'pending'::public.enum_documents_status,
    document_expiry date,
    is_doc_front_image BOOLEAN DEFAULT false,
    is_doc_back_image BOOLEAN DEFAULT false,
    is_uploaded BOOLEAN DEFAULT false,
    is_customer BOOLEAN DEFAULT false,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);


ALTER TABLE  public.documents OWNER TO postgres;


CREATE TRIGGER last_updated
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();


CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.documents_log_id_seq');


----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.roles;
DROP TRIGGER IF EXISTS instarem_audit ON public.roles;
DROP TABLE IF EXISTS public.roles_log;
DROP TABLE IF EXISTS public.roles CASCADE ;
DROP SEQUENCE IF EXISTS public.role_log_id_seq;
DROP TYPE IF EXISTS enum_roles_name;
-----===============================TABLE ROLES=======================================================

CREATE SEQUENCE public.role_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.role_log_id_seq OWNER TO postgres;

CREATE TYPE enum_roles_name AS ENUM (
	'admin',
	'co-admin',
	'maker',
	'checker',
	'maker-checker');

CREATE TABLE public.roles_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    name VARCHAR,
    status BOOLEAN,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.roles_log OWNER TO postgres;

CREATE TABLE public.roles(
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
   
    name public.enum_roles_name NOT NULL,
    status BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.roles OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.roles
FOR EACH ROW
EXECUTE PROCEDURE public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.roles
FOR EACH ROW
EXECUTE PROCEDURE public.instarem_audit('public.role_log_id_seq');



----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.users;
DROP TRIGGER IF EXISTS instarem_audit ON public.users;
DROP TABLE IF EXISTS public.users_log;
DROP TABLE IF EXISTS public.users CASCADE;
DROP SEQUENCE IF EXISTS public.users_log_id_seq;
-----===============================TABLE USERS=======================================================

CREATE SEQUENCE public.users_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_log_id_seq OWNER TO postgres;

CREATE TABLE public.users_log (
    log_id BIGINT PRIMARY KEY NOT NULL,
    dml_action  CHAR(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    email VARCHAR(255),
    password VARCHAR(255),
    hashed_key VARCHAR(255),
    role_id UUID,
    branch_id UUID,
    bank_account_id UUID,
    is_active BOOLEAN,
    business_type VARCHAR(255),
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.users_log OWNER TO postgres;

CREATE TABLE public.users(
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    role_id UUID REFERENCES roles(id),
    branch_id UUID REFERENCES branches(id),
    bank_account_id UUID REFERENCES bank_accounts(id),
    is_active BOOLEAN NOT NULL,
    business_type VARCHAR(255) NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);


ALTER TABLE public.users OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.users_log_id_seq');


----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.partners;
DROP TRIGGER IF EXISTS instarem_audit ON public.partners;
DROP TABLE IF EXISTS public.partners_log;
DROP TABLE IF EXISTS public.partners CASCADE ;
DROP SEQUENCE IF EXISTS public.partner_log_id_seq;
-----===============================TABLE PARTNER=======================================================

CREATE SEQUENCE public.partner_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.partner_log_id_seq OWNER TO postgres;

CREATE TABLE public.partners_log(
    log_id BIGINT PRIMARY KEY ,
    dml_action CHAR(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    role_id UUID,
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password VARCHAR(255),
    api_key VARCHAR(255),
    is_active BOOLEAN,
    business_type VARCHAR(255),
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.partners_log OWNER TO postgres;

CREATE TABLE public.partners(
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    business_type VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC') NOT NULL,
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC') NOT NULL
);

ALTER TABLE public.partners OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.partner_log_id_seq');

 INSERT INTO public.partners (
    hashed_key,
    role_id,  -- Ensure this role_id exists in the roles table
    email,
    first_name,
    last_name,
    password,
    api_key,
    is_active,
    business_type,
    created_by,
    updated_by
) VALUES
(
    '5ca00de2-aea9-4b4e-81e8-d907a45897cc',
    (SELECT id FROM public.roles WHERE name = 'maker' LIMIT 1),  -- Ensure this role ID exists in the roles table
    'aniket@dataseedtech.com',
    'Aniket',
    'Dataseed',
    '086b4f9f-e441-4f6e-8f43-2eb92f3ccd0c',  -- Use a securely hashed password, NOT plain text
    'd420779b-88af-44d8-b664-8a99dda233ab',
    true,  -- is_active
    'large_enterprise',
    '09fe4d78-b7a3-4b20-815c-0bb40a6d0cb2',  -- created_by
    '09fe4d78-b7a3-4b20-815c-0bb40a6d0cb2'   -- updated_by
);



----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.orders;
DROP TRIGGER IF EXISTS instarem_audit ON public.orders;
DROP TABLE IF EXISTS public.orders_log;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP SEQUENCE IF EXISTS public.order_log_id_seq;
DROP SEQUENCE IF EXISTS public.orders_serial_number_seq;
-----===============================TABLE ORDERS=======================================================

CREATE SEQUENCE public.order_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.order_log_id_seq OWNER TO postgres;

CREATE SEQUENCE public.orders_serial_number_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.orders_serial_number_seq OWNER TO postgres;


CREATE TABLE public.orders_log (
    log_id BIGINT PRIMARY KEY NOT NULL,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'U', 'D')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    partner_id VARCHAR(255),
    partner_order_id VARCHAR(255),
    transaction_type VARCHAR(255),
    purpose_type VARCHAR(255),
    is_esign_required BOOLEAN,
    is_v_kyc_required BOOLEAN,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(255),
    customer_pan VARCHAR(255),
    order_status VARCHAR(255),
    e_sign_status VARCHAR(255),
    e_sign_link VARCHAR(255),
    e_sign_link_status VARCHAR(255),
    e_sign_link_expires DATE,
    e_sign_completed_by_customer BOOLEAN,
    e_sign_customer_completion_date DATE,
    e_sign_doc_comments VARCHAR(255),
    v_kyc_status VARCHAR(255),
    v_kyc_link VARCHAR(255),
    v_kyc_link_status VARCHAR(255),
    v_kyc_link_expires DATE,
    v_kyc_completed_by_customer BOOLEAN,
    v_kyc_customer_completion_date DATE,
    v_kyc_comments VARCHAR(255),
    is_esign_regenerated BOOLEAN,
    is_esign_regenerated_details jsonb,
    is_video_kyc_link_regenerated BOOLEAN,
    is_video_kyc_link_regenerated_details jsonb,
    checker_id UUID,
    merged_document jsonb,
    e_sign_link_doc_id VARCHAR(255),
    e_sign_link_request_id VARCHAR(255),
    v_kyc_reference_id VARCHAR(255),
    v_kyc_profile_id VARCHAR(255),
    incident_status BOOLEAN,
    incident_checker_comments VARCHAR(255),
    nium_order_id VARCHAR(255),
    nium_invoice_number VARCHAR(255),
    date_of_departure DATE,
    incident_completion_date DATE,
    partner_hashed_api_key VARCHAR(255),
    partner_hashed_key VARCHAR(255),
    serial_number integer,
    created_by UUID ,
    created_at TIMESTAMPTZ,
    updated_by UUID ,
    updated_at TIMESTAMPTZ
);


ALTER TABLE public.orders_log OWNER TO postgres;

CREATE TABLE public.orders (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    partner_id VARCHAR(255) NOT NULL,
    partner_order_id VARCHAR(255) NOT NULL UNIQUE,
    transaction_type VARCHAR(255),
    purpose_type VARCHAR(255),
    is_esign_required BOOLEAN DEFAULT false NOT NULL,
    is_v_kyc_required BOOLEAN DEFAULT false NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(255) NOT NULL,
    customer_pan VARCHAR(255) NOT NULL,
    order_status VARCHAR(255),
    e_sign_status VARCHAR(255),
    e_sign_link VARCHAR(255),
    e_sign_link_status VARCHAR(255),
    e_sign_link_expires DATE,
    e_sign_completed_by_customer BOOLEAN,
    e_sign_customer_completion_date DATE,
    e_sign_doc_comments VARCHAR(255),
    v_kyc_status VARCHAR(255),
    v_kyc_link VARCHAR(255),
    v_kyc_link_status VARCHAR(255),
    v_kyc_link_expires DATE,
    v_kyc_completed_by_customer BOOLEAN,
    v_kyc_customer_completion_date DATE,
    v_kyc_comments VARCHAR(255),
    is_esign_regenerated BOOLEAN DEFAULT false,
    is_esign_regenerated_details jsonb,
    is_video_kyc_link_regenerated BOOLEAN DEFAULT false,
    is_video_kyc_link_regenerated_details jsonb,
	checker_id UUID  REFERENCES users(id), --checker removed not null
    merged_document jsonb,
    e_sign_link_doc_id VARCHAR(255),
    e_sign_link_request_id VARCHAR(255),
    v_kyc_reference_id VARCHAR(255),
    v_kyc_profile_id VARCHAR(255),
    incident_status BOOLEAN,
    incident_checker_comments VARCHAR(255),
    nium_order_id VARCHAR(255),
    nium_invoice_number VARCHAR(255),
    date_of_departure DATE,
    incident_completion_date DATE,
    partner_hashed_api_key VARCHAR(255),
    partner_hashed_key VARCHAR(255),
    serial_number integer DEFAULT nextval('public.orders_serial_number_seq'::regclass) NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.orders
-- ALTER COLUMN checker_id DROP NOT NULL;
ALTER TABLE public.orders OWNER TO postgres;


CREATE TRIGGER last_updated
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.order_log_id_seq');



----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.esigns;
DROP TRIGGER IF EXISTS instarem_audit ON public.esigns;
DROP TABLE IF EXISTS public.esigns_log;
DROP TABLE IF EXISTS public.esigns;
DROP SEQUENCE IF EXISTS public.esign_log_id_seq;
-----===============================TABLE ESIGN=======================================================

CREATE SEQUENCE public.esign_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.esign_log_id_seq OWNER TO postgres;

CREATE TABLE public.esigns_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID ,
    hashed_key VARCHAR(255) ,
    partner_order_id VARCHAR(255) ,
    order_id UUID ,
    attempt_number integer ,
    task_id VARCHAR(255) ,
    group_id VARCHAR(255) ,
    esign_file_details jsonb ,
    esign_stamp_details jsonb ,
    esign_invitees jsonb ,
    esign_details jsonb,
    esign_doc_id VARCHAR(255),
    status VARCHAR(255),
    request_id VARCHAR(255),
    completed_at DATE,
    esign_expiry DATE,
    active BOOLEAN,
    expired BOOLEAN,
    rejected BOOLEAN,
    result jsonb,
    esigners jsonb,
    file_details jsonb,
    request_details jsonb,
    esign_irn VARCHAR(255),
    esign_folder VARCHAR(255),
    esign_type VARCHAR(255),
    esign_url VARCHAR(255),
    esigner_email VARCHAR(255),
    esigner_phone VARCHAR(255),
    is_signed BOOLEAN,
    type VARCHAR(255),
     created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.esigns_log OWNER TO postgres;

CREATE TABLE public.esigns (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    partner_order_id VARCHAR(255) NOT NULL,
    order_id UUID NOT NULL REFERENCES orders(id),
    attempt_number integer NOT NULL,
    task_id VARCHAR(255) NOT NULL,
    group_id VARCHAR(255) NOT NULL,
    esign_file_details jsonb NOT NULL,
    esign_stamp_details jsonb NOT NULL,
    esign_invitees jsonb NOT NULL,
    esign_details jsonb,
    esign_doc_id VARCHAR(255),
    status VARCHAR(255),
    request_id VARCHAR(255),
    completed_at DATE,
    esign_expiry DATE,
    active BOOLEAN DEFAULT false NOT NULL,
    expired BOOLEAN DEFAULT false NOT NULL,
    rejected BOOLEAN DEFAULT false NOT NULL,
    result jsonb,
    esigners jsonb,
    file_details jsonb,
    request_details jsonb,
    esign_irn VARCHAR(255),
    esign_folder VARCHAR(255),
    esign_type VARCHAR(255),
    esign_url VARCHAR(255),
    esigner_email VARCHAR(255),
    esigner_phone VARCHAR(255),
    is_signed BOOLEAN DEFAULT false NOT NULL,
    type VARCHAR(255),
    created_by UUID  NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID  NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.esigns OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.esigns
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.esigns
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.esign_log_id_seq');

----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.products;
DROP TRIGGER IF EXISTS instarem_audit ON public.products;
DROP TABLE IF EXISTS public.products_log;
DROP TABLE IF EXISTS public.products CASCADE;
DROP SEQUENCE IF EXISTS public.products_log_id_seq;
-----===============================TABLE PRODUCTS=======================================================

CREATE SEQUENCE public.products_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.products_log_id_seq OWNER TO postgres;

CREATE TABLE public.products_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'U', 'D')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    name VARCHAR(255),
    description text,
    is_active BOOLEAN,
    hashed_key VARCHAR(255),
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.products_log OWNER TO postgres;

CREATE TABLE public.products (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description text,
    is_active BOOLEAN DEFAULT true,
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE  public.products OWNER TO postgres;


CREATE TRIGGER last_updated
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();


CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.products_log_id_seq');

----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.partner_products;
DROP TRIGGER IF EXISTS instarem_audit ON public.partner_products;
DROP TABLE IF EXISTS public.partner_products_log;
DROP TABLE IF EXISTS public.partner_products;
DROP SEQUENCE IF EXISTS public.partner_products_log_id_seq;
-----===============================TABLE PARTNER_PRODUCTS=======================================================

CREATE SEQUENCE public.partner_products_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.partner_products_log_id_seq OWNER TO postgres

CREATE TABLE public.partner_products_log (
    log_id BIGINT PRIMARY KEY NOT NULL ,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255) ,
    partner_id UUID,
    product_id UUID,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.partner_products_log OWNER TO postgres;

CREATE TABLE public.partner_products (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    partner_id UUID REFERENCES partners(id) ,
    product_id UUID REFERENCES products(id) ,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')  
);


CREATE TRIGGER last_updated
BEFORE UPDATE ON public.partner_products
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.partner_products
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.partner_products_log_id_seq');


----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.transaction_type;
DROP TRIGGER IF EXISTS instarem_audit ON public.transaction_type;
DROP TABLE IF EXISTS public.transaction_type_log;
DROP TABLE IF EXISTS public.transaction_type;
DROP SEQUENCE IF EXISTS public.transaction_type_log_id_seq;
-----===============================TABLE TRANSACTION_TYPE=======================================================

CREATE SEQUENCE public.transaction_type_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.transaction_type_log_id_seq OWNER TO postgres;

CREATE TABLE public.transaction_type_log (
    log_id BIGINT PRIMARY KEY,
    dml_action CHAR(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID,
    hashed_key VARCHAR(255),
    name VARCHAR(255),
    is_active BOOLEAN ,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ 
);

ALTER TABLE public.transaction_type_log OWNER TO postgres;

CREATE TABLE public.transaction_type (
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')   
);


ALTER TABLE public.transaction_type OWNER TO postgres;


CREATE TRIGGER last_updated
BEFORE UPDATE ON public.transaction_type
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.transaction_type
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.transaction_type_log_id_seq');




----===============================DROP TABLE AND DEPENDENCY'S============================================
DROP TRIGGER IF EXISTS last_updated ON public.vkycs;
DROP TRIGGER IF EXISTS instarem_audit ON public.vkycs;
DROP TABLE IF EXISTS public.vkycs_log;
DROP TABLE IF EXISTS public.vkycs;
DROP SEQUENCE IF EXISTS public.vkyc_log_id_seq;
-----===============================TABLE VKYC=======================================================

CREATE SEQUENCE public.vkyc_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vkyc_log_id_seq OWNER TO postgres;

CREATE TABLE public.vkycs_log(
    log_id BIGINT  PRIMARY KEY NOT NULL,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp TIMESTAMPTZ,
    id UUID ,
    hashed_key VARCHAR(255) ,
    partner_order_id VARCHAR(255),
    order_id UUID,
    attempt_number integer,
    reference_id VARCHAR(255),
    profile_id VARCHAR(255),
    v_kyc_link VARCHAR(255),
    v_kyc_link_expires DATE,
    v_kyc_link_status VARCHAR(255),
    v_kyc_comments TEXT,
    v_kyc_doc_completion_date DATE,
    device_info jsonb,
    profile_data jsonb,
    performed_by jsonb,
    resources_documents jsonb,
    resources_images jsonb,
    resources_videos jsonb,
    resources_text jsonb,
    location_info jsonb,
    first_name VARCHAR(255),
    reviewer_action TEXT,
    tasks jsonb,
    status VARCHAR(255),
    status_description jsonb,
    status_detail TEXT,
    resources_documents_files jsonb,
    resources_images_files jsonb,
    resources_videos_files jsonb,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
);

ALTER TABLE public.vkycs_log OWNER TO postgres;

CREATE TABLE public.vkycs(
    id UUID PRIMARY KEY NOT NULL DEFAULT public.gen_random_uuid(),
    hashed_key VARCHAR(255) NOT NULL UNIQUE DEFAULT public.gen_random_uuid(),
   
    partner_order_id VARCHAR(255) NOT NULL,
    order_id UUID NOT NULL REFERENCES orders(id),
    attempt_number integer NOT NULL,
    reference_id VARCHAR(255),
    profile_id VARCHAR(255) NOT NULL,
    v_kyc_link VARCHAR(255) NOT NULL,
    v_kyc_link_expires DATE,
    v_kyc_link_status VARCHAR(255) NOT NULL,
    v_kyc_comments TEXT,
    v_kyc_doc_completion_date DATE,
    device_info jsonb,
    profile_data jsonb,
    performed_by jsonb,
    resources_documents jsonb,
    resources_images jsonb,
    resources_videos jsonb,
    resources_text jsonb,
    location_info jsonb,
    first_name VARCHAR(255),
    reviewer_action TEXT,
    tasks jsonb,
    status VARCHAR(255),
    status_description jsonb,
    status_detail TEXT,
    resources_documents_files jsonb DEFAULT '[]'::jsonb,
    resources_images_files jsonb DEFAULT '[]'::jsonb,
    resources_videos_files jsonb DEFAULT '[]'::jsonb,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'UTC')
);

ALTER TABLE public.vkycs OWNER TO postgres;

CREATE TRIGGER last_updated
BEFORE UPDATE ON public.vkycs
FOR EACH ROW
EXECUTE FUNCTION public.last_updated();

CREATE TRIGGER instarem_audit
AFTER INSERT OR UPDATE OR DELETE ON public.vkycs
FOR EACH ROW
EXECUTE FUNCTION public.instarem_audit('public.vkyc_log_id_seq');

----===============================INSERT FOR TABLE document_type ============================================

INSERT INTO public.document_type (name, is_active, created_by, updated_by)
VALUES
    ('PAN (Applicant)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Aadhar Front (Applicant)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Aadhar Back (Applicant)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Voter ID Front (Applicant)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Voter ID Back (Applicant)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Passport Front (Applicant)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Passport Back (Applicant)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('University Admission Letter', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Card Application Letter', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Ticket- Onboard', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Ticket- Return', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Visa', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('I20', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Student University ID Card Front', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Student University ID Card Back', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Payment Instruction Letter', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Bank Account Statement', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Marriage Certificate', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('A2 Form', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('PAN (Payer)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Aadhar Front (Payer)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Aadhar Back (Payer)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Passport Front (Payer)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Passport Back (Payer)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Driving Licence (Payer)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Voter ID Front (Payer)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Voter ID Back (Payer)', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1));



----===============================INSERT FOR TABLE purposes ============================================

    INSERT INTO public.purposes (purpose_name, is_active, created_by, updated_by)
VALUES
    ('BTQ', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('EDUCATION', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('EMPLOYMENT', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT  1)),
    ('IMMIGRATION', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('N/A', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1));



    

----===============================INSERT FOR TABLE transaction_type ============================================

INSERT INTO public.transaction_type (name, is_active, created_by, updated_by)
VALUES
    ('Fresh Card Sale', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Card Reload - New Trip', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Card Reload - Existing Trip', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Remittance', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('Card - Cashout', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1));


----===============================INSERT FOR TABLE roles ============================================

INSERT INTO public.roles (name, status, created_by, updated_by)
VALUES
    ('admin', true, '03ec610e-3f2a-44ee-a600-e16636b38c61', '03ec610e-3f2a-44ee-a600-e16636b38c61'),
    ('co-admin', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('maker', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('checker', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1)),
    ('maker-checker', true, (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1), (SELECT id FROM public.users WHERE email = 'mohammed@dataseedtech.com' LIMIT 1));



----===============================INSERT FOR TABLE users ============================================

INSERT INTO public.users (
    email,
    password,
	hashed_key,
    role_id,
    branch_id,
    bank_account_id,
    is_active,
    business_type,
    created_by,
    updated_by
)
VALUES (
    'mohammed@dataseedtech.com',
    '$2a$10$jPX1T6jdXxv5qsgBQFYOmuPQ/hVbNo6PLnS1OXBUBKbOnzO48ZCvK',  -- Replace with hashed password (admin@123#)
	'23c96ffb-61fe-463f-abf8-eb1f8e284286',
    (SELECT id FROM public.roles WHERE name = 'admin' LIMIT 1),
    (SELECT id FROM public.branches WHERE name = 'Bengaluru' LIMIT 1),
    (SELECT id FROM public.bank_accounts WHERE account_number = '123456789012' LIMIT 1),
    true,
    'large_enterprise',
	'a8e9d51e-4060-4eeb-9be6-c4b2a67ed139',
	'a8e9d51e-4060-4eeb-9be6-c4b2a67ed139'
);

INSERT INTO public.users (
    email,
    password,
	hashed_key,
    role_id,
    branch_id,
    bank_account_id,
    is_active,
    business_type,
    created_by,
    updated_by
)
VALUES (
    'aniket@dataseedtech.com',
    '$2a$10$jPX1T6jdXxv5qsgBQFYOmuPQ/hVbNo6PLnS1OXBUBKbOnzO48ZCvK',  -- Replace with hashed password (admin@123#)
	'23c96ffb-61fe-463f-abf8-eb1f8e284286',
    (SELECT id FROM public.roles WHERE name = 'admin' LIMIT 1),
    (SELECT id FROM public.branches WHERE name = 'Bengaluru' LIMIT 1),
    (SELECT id FROM public.bank_accounts WHERE account_number = '123456789012' LIMIT 1),
    true,
    'large_enterprise',
	'a8e9d51e-4060-4eeb-9be6-c4b2a67ed139',
	'a8e9d51e-4060-4eeb-9be6-c4b2a67ed139'
);


---===============================INSERT FOR TABLE branches ============================================

INSERT INTO public.branches (
	hashed_key,
    name,
    location,
    city,
    state,
    bussiness_type,
    created_by,
    updated_by
) VALUES 
(
    '5f49d102-aa52-47d0-b5ef-40779cf110c3',
    'Bengaluru',
    'Bengaluru',
    'Bengaluru',
    'Karnataka',
    'large_enterprise',
    'a8e9d51e-4060-4eeb-9be6-c4b2a67ed139',
    'a8e9d51e-4060-4eeb-9be6-c4b2a67ed139'
);


---===============================INSERT FOR TABLE bank_accounts ============================================

INSERT INTO public.bank_accounts (
hashed_key,
    account_holder_name,
    account_number,
    bank_name,
    bank_branch,
    ifsc_code,
    is_beneficiary,
    created_by,
    updated_by
) VALUES 
(
	'070b7b2d-0fb5-4a32-b58f-2382d195e4ce',
    'Mohammed',
    '123456789012',
    'State Bank of India',
    'Bengaluru',
    'SBIN0001234',
    true,
    'a8e9d51e-4060-4eeb-9be6-c4b2a67ed139',
	'a8e9d51e-4060-4eeb-9be6-c4b2a67ed139'
);