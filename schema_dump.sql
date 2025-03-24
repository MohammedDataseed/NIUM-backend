--
-- PostgreSQL database dump
--

-- Dumped from database version 13.19 (Debian 13.19-1.pgdg120+1)
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: enum_branches_business_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_branches_business_type AS ENUM (
    'cash&carry',
    'large_enterprise'
);


ALTER TYPE public.enum_branches_business_type OWNER TO postgres;

--
-- Name: enum_documents_entity_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_documents_entity_type AS ENUM (
    'user',
    'customer'
);


ALTER TYPE public.enum_documents_entity_type OWNER TO postgres;

--
-- Name: enum_documents_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_documents_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.enum_documents_status OWNER TO postgres;

--
-- Name: enum_partners_business_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_partners_business_type AS ENUM (
    'cash&carry',
    'large_enterprise'
);


ALTER TYPE public.enum_partners_business_type OWNER TO postgres;

--
-- Name: enum_roles_name; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_roles_name AS ENUM (
    'admin',
    'co-admin',
    'maker',
    'checker',
    'maker-checker'
);


ALTER TYPE public.enum_roles_name OWNER TO postgres;

--
-- Name: enum_users_business_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_business_type AS ENUM (
    'cash&carry',
    'large_enterprise'
);


ALTER TYPE public.enum_users_business_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: bank_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_accounts (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    account_holder_name character varying(255) NOT NULL,
    account_number character varying(255) NOT NULL,
    bank_name character varying(255) NOT NULL,
    bank_branch character varying(255) NOT NULL,
    ifsc_code character varying(255) NOT NULL,
    is_beneficiary boolean DEFAULT false,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.bank_accounts OWNER TO postgres;

--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    location character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    state character varying(255) NOT NULL,
    business_type public.enum_branches_business_type NOT NULL,
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: document_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_master (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    document_type character varying(255) NOT NULL,
    purpose_id uuid,
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.document_master OWNER TO postgres;

--
-- Name: document_requirements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_requirements (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    document_type character varying(255) NOT NULL,
    is_required boolean DEFAULT true,
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.document_requirements OWNER TO postgres;

--
-- Name: document_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_type (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.document_type OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id uuid,
    hashed_key character varying(255) NOT NULL,
    entity_id uuid,
    entity_type public.enum_documents_entity_type NOT NULL,
    purpose_id uuid,
    document_type_id uuid,
    document_name character varying(255) NOT NULL,
    document_url json NOT NULL,
    status public.enum_documents_status DEFAULT 'pending'::public.enum_documents_status,
    document_expiry timestamp with time zone,
    is_doc_front_image boolean DEFAULT false,
    is_doc_back_image boolean DEFAULT false,
    is_uploaded boolean DEFAULT false,
    is_customer boolean DEFAULT false,
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: esigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.esigns (
    id uuid NOT NULL,
    hashed_key character varying(255),
    partner_order_id character varying(255) NOT NULL,
    order_id uuid NOT NULL,
    attempt_number integer NOT NULL,
    task_id character varying(255) NOT NULL,
    group_id character varying(255) NOT NULL,
    esign_file_details jsonb NOT NULL,
    esign_stamp_details jsonb NOT NULL,
    esign_invitees jsonb NOT NULL,
    esign_details jsonb,
    esign_doc_id character varying(255),
    status character varying(255),
    request_id character varying(255),
    completed_at timestamp with time zone,
    esign_expiry timestamp with time zone,
    active boolean DEFAULT false NOT NULL,
    expired boolean DEFAULT false NOT NULL,
    rejected boolean DEFAULT false NOT NULL,
    result jsonb,
    esigners jsonb,
    file_details jsonb,
    request_details jsonb,
    esign_irn character varying(255),
    esign_folder character varying(255),
    esign_type character varying(255),
    esign_url character varying(255),
    esigner_email character varying(255),
    esigner_phone character varying(255),
    is_signed boolean DEFAULT false NOT NULL,
    type character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.esigns OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    partner_id character varying(255) NOT NULL,
    partner_order_id character varying(255) NOT NULL,
    transaction_type character varying(255),
    purpose_type character varying(255),
    is_esign_required boolean DEFAULT false NOT NULL,
    is_v_kyc_required boolean DEFAULT false NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_email character varying(255) NOT NULL,
    customer_phone character varying(255) NOT NULL,
    customer_pan character varying(255) NOT NULL,
    order_status character varying(255),
    e_sign_status character varying(255),
    e_sign_link character varying(255),
    e_sign_link_status character varying(255),
    e_sign_link_doc_id character varying(255),
    e_sign_link_request_id character varying(255),
    e_sign_link_expires timestamp with time zone,
    e_sign_completed_by_customer boolean,
    e_sign_customer_completion_date timestamp with time zone,
    e_sign_doc_comments character varying(255),
    v_kyc_reference_id character varying(255),
    v_kyc_profile_id character varying(255),
    v_kyc_status character varying(255),
    v_kyc_link character varying(255),
    v_kyc_link_status character varying(255),
    v_kyc_link_expires timestamp with time zone,
    v_kyc_completed_by_customer boolean,
    v_kyc_customer_completion_date timestamp with time zone,
    v_kyc_comments character varying(255),
    incident_status boolean,
    incident_checker_comments character varying(255),
    nium_order_id character varying(255),
    nium_invoice_number character varying(255),
    date_of_departure timestamp with time zone,
    incident_completion_date timestamp with time zone,
    is_esign_regenerated boolean DEFAULT false,
    is_esign_regenerated_details jsonb,
    is_video_kyc_link_regenerated boolean DEFAULT false,
    is_video_kyc_link_regenerated_details jsonb,
    created_by uuid,
    updated_by uuid,
    checker_id uuid,
    merged_document jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: partner_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_products (
    partner_id uuid NOT NULL,
    product_id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.partner_products OWNER TO postgres;

--
-- Name: partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partners (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    role_id uuid NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    api_key character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    business_type character varying(255) NOT NULL,
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.partners OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: purposes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purposes (
    id uuid NOT NULL,
    hashed_key character varying(255),
    purpose_name character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.purposes OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    name public.enum_roles_name NOT NULL,
    status boolean DEFAULT true,
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: transaction_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_type (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.transaction_type OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    hashed_key character varying(255) NOT NULL,
    role_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    bank_account_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    business_type public.enum_users_business_type NOT NULL,
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vkycs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vkycs (
    id uuid NOT NULL,
    hashed_key character varying(255),
    partner_order_id character varying(255) NOT NULL,
    order_id uuid NOT NULL,
    attempt_number integer NOT NULL,
    reference_id character varying(255),
    profile_id character varying(255) NOT NULL,
    v_kyc_link character varying(255) NOT NULL,
    v_kyc_link_expires timestamp with time zone NOT NULL,
    v_kyc_link_status character varying(255) NOT NULL,
    v_kyc_comments character varying(255),
    v_kyc_doc_completion_date timestamp with time zone,
    device_info jsonb,
    profile_data jsonb,
    performed_by jsonb,
    resources_documents jsonb,
    resources_images jsonb,
    resources_videos jsonb,
    resources_text jsonb,
    location_info jsonb,
    first_name character varying(255),
    reviewer_action character varying(255),
    tasks jsonb,
    status character varying(255),
    status_description jsonb,
    status_detail character varying(255),
    created_by uuid,
    updated_by uuid,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.vkycs OWNER TO postgres;

--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: bank_accounts bank_accounts_account_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_account_number_key UNIQUE (account_number);


--
-- Name: bank_accounts bank_accounts_account_number_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_account_number_key1 UNIQUE (account_number);


--
-- Name: bank_accounts bank_accounts_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_hashed_key_key UNIQUE (hashed_key);


--
-- Name: bank_accounts bank_accounts_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: bank_accounts bank_accounts_hashed_key_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_hashed_key_key2 UNIQUE (hashed_key);


--
-- Name: bank_accounts bank_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_pkey PRIMARY KEY (id);


--
-- Name: branches branches_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_hashed_key_key UNIQUE (hashed_key);


--
-- Name: branches branches_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: branches branches_hashed_key_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_hashed_key_key2 UNIQUE (hashed_key);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: document_master document_master_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_master
    ADD CONSTRAINT document_master_hashed_key_key UNIQUE (hashed_key);


--
-- Name: document_master document_master_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_master
    ADD CONSTRAINT document_master_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: document_master document_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_master
    ADD CONSTRAINT document_master_pkey PRIMARY KEY (id);


--
-- Name: document_requirements document_requirements_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_requirements
    ADD CONSTRAINT document_requirements_hashed_key_key UNIQUE (hashed_key);


--
-- Name: document_requirements document_requirements_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_requirements
    ADD CONSTRAINT document_requirements_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: document_requirements document_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_requirements
    ADD CONSTRAINT document_requirements_pkey PRIMARY KEY (id);


--
-- Name: document_type document_type_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT document_type_hashed_key_key UNIQUE (hashed_key);


--
-- Name: document_type document_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT document_type_name_key UNIQUE (name);


--
-- Name: document_type document_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT document_type_pkey PRIMARY KEY (id);


--
-- Name: documents documents_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_hashed_key_key UNIQUE (hashed_key);


--
-- Name: documents documents_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: esigns esigns_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esigns
    ADD CONSTRAINT esigns_hashed_key_key UNIQUE (hashed_key);


--
-- Name: esigns esigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esigns
    ADD CONSTRAINT esigns_pkey PRIMARY KEY (id);


--
-- Name: orders orders_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_hashed_key_key UNIQUE (hashed_key);


--
-- Name: orders orders_partner_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_partner_order_id_key UNIQUE (partner_order_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: partner_products partner_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_products
    ADD CONSTRAINT partner_products_pkey PRIMARY KEY (partner_id, product_id);


--
-- Name: partners partners_api_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_api_key_key UNIQUE (api_key);


--
-- Name: partners partners_api_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_api_key_key1 UNIQUE (api_key);


--
-- Name: partners partners_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_email_key UNIQUE (email);


--
-- Name: partners partners_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_email_key1 UNIQUE (email);


--
-- Name: partners partners_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_hashed_key_key UNIQUE (hashed_key);


--
-- Name: partners partners_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: products products_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_hashed_key_key UNIQUE (hashed_key);


--
-- Name: products products_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: purposes purposes_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purposes
    ADD CONSTRAINT purposes_hashed_key_key UNIQUE (hashed_key);


--
-- Name: purposes purposes_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purposes
    ADD CONSTRAINT purposes_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: purposes purposes_hashed_key_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purposes
    ADD CONSTRAINT purposes_hashed_key_key2 UNIQUE (hashed_key);


--
-- Name: purposes purposes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purposes
    ADD CONSTRAINT purposes_pkey PRIMARY KEY (id);


--
-- Name: roles roles_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_hashed_key_key UNIQUE (hashed_key);


--
-- Name: roles roles_hashed_key_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_hashed_key_key1 UNIQUE (hashed_key);


--
-- Name: roles roles_hashed_key_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_hashed_key_key2 UNIQUE (hashed_key);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: transaction_type transaction_type_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT transaction_type_hashed_key_key UNIQUE (hashed_key);


--
-- Name: transaction_type transaction_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT transaction_type_name_key UNIQUE (name);


--
-- Name: transaction_type transaction_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT transaction_type_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_hashed_key_key UNIQUE (hashed_key);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vkycs vkycs_hashed_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vkycs
    ADD CONSTRAINT vkycs_hashed_key_key UNIQUE (hashed_key);


--
-- Name: vkycs vkycs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vkycs
    ADD CONSTRAINT vkycs_pkey PRIMARY KEY (id);


--
-- Name: unique_esign_hashed_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_esign_hashed_key ON public.esigns USING btree (hashed_key);


--
-- Name: unique_order_hashed_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_order_hashed_key ON public.orders USING btree (hashed_key);


--
-- Name: unique_vkyc_hashed_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_vkyc_hashed_key ON public.vkycs USING btree (hashed_key);


--
-- Name: esigns fk_esigns_orders; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esigns
    ADD CONSTRAINT fk_esigns_orders FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vkycs fk_vkycs_orders; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vkycs
    ADD CONSTRAINT fk_vkycs_orders FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_checker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_checker_id_fkey FOREIGN KEY (checker_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.partners(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders orders_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.partners(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: partners partners_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE;


--
-- Name: users users_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

