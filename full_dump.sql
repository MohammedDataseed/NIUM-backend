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
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250311104241-update_purpose_table.js
20250312040646-hashed_key-esign.js
20250312085004-update-roles-table.js
20250312090206-user-table-create.js
20250312092912-create_users_table.js
20250313100022-create-order-table.js
20250313100158-create_esigns_table.js
20250313102615-rename-order-id.js
20250313104324-add-partner-order-id-to-esigns.js
20250313115735-add-e-sign-fields-to-orders.js
20250316101413-create-vkyc-table.js
20250316102147-relate-order-vkyc-table.js
20250316120925-update-vkyc-table.js
20250316122938-add-new-vkyc-fields-to-order.js
20250317063531-add_incident_fields_to_orders.js
20250317102804-change-partner-id-type.js
20250317103407-change-partner-id-type-uuid.js
20250318102531-create-esigns-table.js
20250318102715-create-vkycs-table.js
20250318104104-add-missing-fields-to-esigns-type.js
20250318104758-add-missing-fields-to-esigns-is-signed.js
20250318175007-esign-partner-order-id-table.js
20250318181016-update-partner-order-id-to-string.js
20250318183753-create-orders-table.js
20250318183921-create-esigns-table.js
20250318194842-create-esigns-table.js
20250318195109-create-vkycs-table.js
20250318195448-create-orders-table.js
\.


--
-- Data for Name: bank_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_accounts (id, hashed_key, account_holder_name, account_number, bank_name, bank_branch, ifsc_code, is_beneficiary, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
6d3bbdeb-6330-4e09-b661-847065296c9b	cd85100529774626ee379fde8553d82em85nxkc5	Admin	123456789012	State Bank of India	MG Road Branch	SBIN0001234	f	00000000-0000-0000-0000-000000000000	00000000-0000-0000-0000-000000000000	2025-03-12 08:33:16.85+00	2025-03-12 08:33:16.85+00
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, hashed_key, name, location, city, state, business_type, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
aae5704d-f397-4cfb-8994-bb0823f50cd2	06d412d3d29102c77db2d52b8723393fm85npem7	Main Branch	Bengaluru	Bengaluru	Karnataka	large_enterprise	\N	\N	2025-03-12 08:26:56.19+00	2025-03-12 08:26:56.19+00
\.


--
-- Data for Name: document_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_master (id, hashed_key, document_type, purpose_id, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: document_requirements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_requirements (id, hashed_key, document_type, is_required, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: document_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_type (id, hashed_key, name, is_active, created_at, updated_at, created_by, updated_by) FROM stdin;
d959ad8d-1546-42e8-afc4-cdba62cbb622	1e299b0b997038439b9891bd84a72a5fm8easika	PAN	t	2025-03-18 09:35:21.85+00	2025-03-18 09:35:21.85+00	\N	\N
5f6bc76e-acbc-44d4-84ab-d9812e102cc0	73366e1a2707ee1a87b95163b47c4065m8easqes	AADHAAR	t	2025-03-18 09:35:32.017+00	2025-03-18 09:35:32.019+00	\N	\N
43c09b84-803e-4463-a12e-3958863f0462	359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0	PASSPORT	t	2025-03-18 09:35:38.615+00	2025-03-18 09:35:38.616+00	\N	\N
6cee303f-90e9-4943-8ef7-cdb1049f89e1	d6133d48e423a412c6109f7db042f983m8eat3om	A2 FORM	t	2025-03-18 09:35:49.221+00	2025-03-18 09:35:49.222+00	\N	\N
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, hashed_key, entity_id, entity_type, purpose_id, document_type_id, document_name, document_url, status, document_expiry, is_doc_front_image, is_doc_back_image, is_uploaded, is_customer, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
12d7635b-ab98-422c-9ca1-6fb15e489db6	36fc51c6a820ff3030b71229b6e977e9m8eccn32	0a262f8b-1bb4-4d92-bd01-5479a35f82b4	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	BMF1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMF1/BMF1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T101900Z&X-Amz-Expires=3600&X-Amz-Signature=9c05b337871d35cdbcbda4925defce5e3bd1d6676d0da6631652e0a5b527c1af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":946450,"uploadedAt":"2025-03-18T10:19:00.444Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 10:19:00.446+00	2025-03-18 10:19:00.446+00
620d5e63-1284-44ca-b866-eb77f39bb2c2	b30403f5b051bb2c65b91651d6e8494fm8eccnti	0a262f8b-1bb4-4d92-bd01-5479a35f82b4	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	merged_BMF1.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMF1/merge_document_BMF1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T101901Z&X-Amz-Expires=3600&X-Amz-Signature=2c7ff7239de5edd656e403492add9a1693621cc991118e0ff78469ce8197773f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":946565,"uploadedAt":"2025-03-18T10:19:01.397Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 10:19:01.398+00	2025-03-18 10:19:01.398+00
55d19a4f-3bd0-4a97-8609-975e9a1be08c	990c58257f7a2891da5f4c3568ac4599m8efq7ai	33189de6-e2e4-4d3f-8ad8-e69254285083	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	BMFORDER1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMFORDER1/BMFORDER1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T115332Z&X-Amz-Expires=3600&X-Amz-Signature=6747e8274b0b03ff34d4bf0f12087509b2caa23c7279437b7a966c1bddcfb423&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":521747,"uploadedAt":"2025-03-18T11:53:32.009Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 11:53:32.01+00	2025-03-18 11:53:32.01+00
d9a7f457-6742-4e6f-b5b9-aa94251b6582	bf7d70684084a74393ce18e02f248a68m8efuehp	33189de6-e2e4-4d3f-8ad8-e69254285083	customer	\N	5f6bc76e-acbc-44d4-84ab-d9812e102cc0	BMFORDER1_73366e1a2707ee1a87b95163b47c4065m8easqes.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMFORDER1/BMFORDER1_73366e1a2707ee1a87b95163b47c4065m8easqes.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T115647Z&X-Amz-Expires=3600&X-Amz-Signature=133a2dc6c1460b5181cb66ce6dd96111a57107ffe1c14e471939399e6a0e50a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":671515,"uploadedAt":"2025-03-18T11:56:47.965Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 11:56:47.965+00	2025-03-18 11:56:47.965+00
8c9c4568-947f-450b-beb0-96e6209318fd	fb6982200f156697d3ca25bd77d0ca32m8eg16pb	33189de6-e2e4-4d3f-8ad8-e69254285083	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	BMFORDER1_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.jpeg	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMFORDER1/BMFORDER1_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T120204Z&X-Amz-Expires=3600&X-Amz-Signature=dd57db324975dd96cac2aba0bf586bd77b54faa8765a6874d582b0ea23163377&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"image/jpeg","size":72062,"uploadedAt":"2025-03-18T12:02:04.463Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 12:02:04.463+00	2025-03-18 12:02:04.463+00
8a5eea46-9bbe-4ad6-9ebb-fcd45f499aca	bb57bd70673ee48bf184f95eb2313099m8efwz2l	33189de6-e2e4-4d3f-8ad8-e69254285083	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	merged_BMFORDER1.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMFORDER1/merge_document_BMFORDER1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T120204Z&X-Amz-Expires=3600&X-Amz-Signature=65a2edb132e8a547e7b15a9a27cf40a5cebd8829fcbf4acee181b1553df2e6f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":1231709,"uploadedAt":"2025-03-18T12:02:04.978Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 11:58:47.949+00	2025-03-18 12:02:04.978+00
d335c928-222c-4edf-8410-0a281674fcfe	fac3149a176a6cbd9bfce2d4394ea6bdm8egewno	22c166b3-44f2-4d2f-80e2-8f0dd0f5fd97	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	BMFORDER2_1e299b0b997038439b9891bd84a72a5fm8easika.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMFORDER2/BMFORDER2_1e299b0b997038439b9891bd84a72a5fm8easika.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T121244Z&X-Amz-Expires=3600&X-Amz-Signature=5fd20f17ac00c720420126850a03e896a4175ce3d4cae636ef2b71e94ca26842&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":521747,"uploadedAt":"2025-03-18T12:12:44.627Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 12:12:44.628+00	2025-03-18 12:12:44.628+00
eede3424-1907-4bf2-99f8-7fedf49df64f	30da79ec574805f40dd187407ed0ca40m8egf8ek	22c166b3-44f2-4d2f-80e2-8f0dd0f5fd97	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	BMFORDER2_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.jpeg	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMFORDER2/BMFORDER2_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T121259Z&X-Amz-Expires=3600&X-Amz-Signature=dd2e3e436d7119cac59be8b4eea14e30a5ff4099b75f142ed6336c93229ed340&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"image/jpeg","size":135624,"uploadedAt":"2025-03-18T12:12:59.851Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 12:12:59.852+00	2025-03-18 12:12:59.852+00
5c949c0a-6de1-4b2b-804f-407ec29423e7	0f4d19d08ee986d4cb34652794a02618m8egei00	22c166b3-44f2-4d2f-80e2-8f0dd0f5fd97	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	merged_BMFORDER2.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMFORDER2/merge_document_BMFORDER2.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T121300Z&X-Amz-Expires=3600&X-Amz-Signature=c28bcda9494ce365e3a54b81638188a078b84edc0af6737ddeac52b61034485c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":657844,"uploadedAt":"2025-03-18T12:13:00.137Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 12:12:25.632+00	2025-03-18 12:13:00.138+00
c3da1731-03f3-4a2a-ad9e-6893795571b0	11193b95dc4660c39de03a7d5e52ec56m8er59wx	4d32e19f-e5c7-4458-bc20-059789d17634	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	TAYIB1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/TAYIB1/TAYIB1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T171311Z&X-Amz-Expires=3600&X-Amz-Signature=6c55acf68fb1e28b3034a1b82be92f1b1177fefe671f194140fc8c63b3cd70de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":946450,"uploadedAt":"2025-03-18T17:13:11.023Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 17:13:11.024+00	2025-03-18 17:13:11.024+00
8af5a22f-3353-4092-a75f-9fe18baa6573	160b38bf4d3a26b454f9948dc1af35a9m8er5bnp	4d32e19f-e5c7-4458-bc20-059789d17634	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	merged_TAYIB1.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/TAYIB1/merge_document_TAYIB1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T171313Z&X-Amz-Expires=3600&X-Amz-Signature=53f2f88a525166880c3608764e6fe4aed92ee84b8e61377f8665a232a9e7de2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":946561,"uploadedAt":"2025-03-18T17:13:13.285Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-18 17:13:13.285+00	2025-03-18 17:13:13.285+00
c09c8312-b792-433b-bbee-f5590c8d47b6	fa52d64319fed2d410ce69ec02e37f92m8fv1su6	4292748d-6fa4-4727-af59-8b7a3983839e	customer	\N	5f6bc76e-acbc-44d4-84ab-d9812e102cc0	ANIKET1_73366e1a2707ee1a87b95163b47c4065m8easqes.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/ANIKET1/ANIKET1_73366e1a2707ee1a87b95163b47c4065m8easqes.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250319%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250319T115013Z&X-Amz-Expires=3600&X-Amz-Signature=8f6a080920545ade32f7954dce3482dc217f460ab29e9474db5c9ecbea1af8ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":946450,"uploadedAt":"2025-03-19T11:50:13.563Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-19 11:50:13.565+00	2025-03-19 11:50:13.565+00
42bbfab5-1cf5-40c8-9862-d7e1cef1a3a6	caf03ab96b5dbd2099940f1bdb2935dcm8fw1r9j	4292748d-6fa4-4727-af59-8b7a3983839e	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	ANIKET1_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.jpeg	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/ANIKET1/ANIKET1_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250319%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250319T121811Z&X-Amz-Expires=3600&X-Amz-Signature=d0c4f300ad28501036fb467657174beb8076769e53bea4f248fa095480e87edb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"image/jpeg","size":135624,"uploadedAt":"2025-03-19T12:18:11.142Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-19 12:18:11.143+00	2025-03-19 12:18:11.143+00
3e5c0ca7-6b79-4248-8cc0-b62a97742411	825a15114c7d637939e43a0fcbfbf8e8m8gtv07a	556b4fc6-a09a-41f8-807f-295f00e83030	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	BMF2_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.jpeg	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMF2/BMF2_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250320T040443Z&X-Amz-Expires=3600&X-Amz-Signature=f2120a326371c220f575de03e033e3c9d5fca8ccb65d90a6ce011f22386382ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"image/jpeg","size":72062,"uploadedAt":"2025-03-20T04:04:43.078Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 04:04:43.078+00	2025-03-20 04:04:43.078+00
384e8c97-88a9-488d-85fa-3fe642cdc239	66a6cf2812296a03779222623b9ca4abm8gtxacg	556b4fc6-a09a-41f8-807f-295f00e83030	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	BMF2_1e299b0b997038439b9891bd84a72a5fm8easika.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMF2/BMF2_1e299b0b997038439b9891bd84a72a5fm8easika.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250320T040629Z&X-Amz-Expires=3600&X-Amz-Signature=d2f5e96f6ac4e9b4f59b9452886841cf6959e0b4b4327c853c6eeb60d42a7e0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":946450,"uploadedAt":"2025-03-20T04:06:29.536Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 04:06:29.536+00	2025-03-20 04:06:29.536+00
e7ce9e9c-31a9-4672-b9a8-b095755eebfe	05fe5d61f9115bfca790fc9d14d4084em8gtv0qk	556b4fc6-a09a-41f8-807f-295f00e83030	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	merged_BMF2.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMF2/merge_document_BMF2.pdf","mimeType":"application/pdf","size":269336,"uploadedAt":"2025-03-20T04:06:30.703Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 04:04:43.772+00	2025-03-20 04:06:30.703+00
b074385e-8c6b-4ae0-b550-0eb48ebec35f	52c68e52ddfae1c5171490e9912efdeam8gzs5bt	4a863510-f876-4727-9ea7-ae0dfdbd22c4	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	NIUM2_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/NIUM2/NIUM2_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250320T065027Z&X-Amz-Expires=3600&X-Amz-Signature=55c3c997084bfaf15f97ea546e8e76bc976822ffcd8fc13ce6d22240683baa59&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":364396,"uploadedAt":"2025-03-20T06:50:27.449Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 06:50:27.449+00	2025-03-20 06:50:27.449+00
d09b03f0-0c1b-4301-91cb-f345f423c494	b8521c87bc5170a49c2e6ec309fd915am8gzudf3	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	BMF1_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMF1/BMF1_359cb15eaca5b1e8cbdc43b5d94e71b8m8easvi0.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250320T065211Z&X-Amz-Expires=3600&X-Amz-Signature=41713cddf8f1c0aefc57d99fb4a1d843089e76436e13329fb21d26fee1b75053&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":364396,"uploadedAt":"2025-03-20T06:52:11.247Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 06:52:11.247+00	2025-03-20 06:52:11.247+00
6d4caf85-c3a2-4886-add9-2c9090ed3a32	3b615ec433f54caf79f0937cd8f15ed9m8grmwg3	4a863510-f876-4727-9ea7-ae0dfdbd22c4	customer	\N	5f6bc76e-acbc-44d4-84ab-d9812e102cc0	merged_NIUM2.pdf	{"url":"https://nium.thestorywallcafe.com/v1/api/documents/esign/NIUM2/merge_document_NIUM2.pdf","mimeType":"application/pdf","size":1128325,"uploadedAt":"2025-03-21T05:24:15.601Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 03:02:25.731+00	2025-03-21 05:24:15.601+00
5f1b4a33-c2b5-436d-b6f9-21c8423ac453	445087b23cf37edf5f32f0c72b78ab00m8fw1rnc	4292748d-6fa4-4727-af59-8b7a3983839e	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	merged_ANIKET1.pdf	{"url":"https://nium.thestorywallcafe.com/v1/api/documents/esign/ANIKET1/merge_document_ANIKET1.pdf","mimeType":"application/pdf","size":405697,"uploadedAt":"2025-03-20T08:40:34.849Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-19 12:18:11.64+00	2025-03-20 08:40:34.849+00
4a3c3601-51d4-4209-bed6-145bc2af895b	b41fee5ede94ecaeef12052c6dae2197m8gzueu5	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	customer	\N	43c09b84-803e-4463-a12e-3958863f0462	merged_BMF1.pdf	{"url":"https://nium.thestorywallcafe.com/v1/api/documents/esign/BMF1/merge_document_BMF1.pdf","mimeType":"application/pdf","size":120465,"uploadedAt":"2025-03-20T13:31:22.597Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 06:52:13.085+00	2025-03-20 13:31:22.597+00
ad8eec62-25ae-411e-bd8a-5dd8c7cadd5c	d4eb69c8d96b075d2fe8073a2b0cc5adm8h3pqd3	4292748d-6fa4-4727-af59-8b7a3983839e	customer	\N	6cee303f-90e9-4943-8ef7-cdb1049f89e1	ANIKET1_d6133d48e423a412c6109f7db042f983m8eat3om.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/ANIKET1/ANIKET1_d6133d48e423a412c6109f7db042f983m8eat3om.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250320T084033Z&X-Amz-Expires=3600&X-Amz-Signature=868c89dd0fad12374144cb95ede0f9f0658d41746b5e00664607054ca7c91b20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":364396,"uploadedAt":"2025-03-20T08:40:33.206Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 08:40:33.206+00	2025-03-20 08:40:33.206+00
cd5612ca-b3a3-4bb2-ae10-2cbd165f32be	c91d46d95606f04b9fd07319304dd7b8m8hdlv40	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	BMF1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMF1/BMF1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250320T131728Z&X-Amz-Expires=3600&X-Amz-Signature=80a087053d8df67d8956e343cb4b9760a342b6bbf7e37f8665a95540834ea4a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":364396,"uploadedAt":"2025-03-20T13:17:28.895Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 13:17:28.896+00	2025-03-20 13:17:28.896+00
7ea53b95-d813-459e-b56b-0172f02adae1	591ce4e3211d25b7309b75017930ceeem8he3p0j	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	customer	\N	5f6bc76e-acbc-44d4-84ab-d9812e102cc0	BMF1_73366e1a2707ee1a87b95163b47c4065m8easqes.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/BMF1/BMF1_73366e1a2707ee1a87b95163b47c4065m8easqes.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250320%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250320T133120Z&X-Amz-Expires=3600&X-Amz-Signature=aeebd784361127fb289b05285a020d19cfc99ef4ccaf815216cceb6ff455badb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":364396,"uploadedAt":"2025-03-20T13:31:20.802Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-20 13:31:20.802+00	2025-03-20 13:31:20.802+00
47994ad6-14c1-427f-8ab5-b414922e4a6b	3f1eae54b7f91f7051a03657aff8cb8cm8ic14yv	4a863510-f876-4727-9ea7-ae0dfdbd22c4	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	NIUM2_1e299b0b997038439b9891bd84a72a5fm8easika.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/NIUM2/NIUM2_1e299b0b997038439b9891bd84a72a5fm8easika.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250321%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250321T052108Z&X-Amz-Expires=3600&X-Amz-Signature=6d3ac0b34741c5f96ac1482f18b955b3ae03caa885567d7a2f6994544665e965&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":788611,"uploadedAt":"2025-03-21T05:21:08.455Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-21 05:21:08.455+00	2025-03-21 05:21:08.455+00
f5070190-909a-49ba-ba90-252d60bd784c	4ffbc2081606fd1f870be66efef8c853m8ic50ul	4a863510-f876-4727-9ea7-ae0dfdbd22c4	customer	\N	5f6bc76e-acbc-44d4-84ab-d9812e102cc0	NIUM2_73366e1a2707ee1a87b95163b47c4065m8easqes.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/NIUM2/NIUM2_73366e1a2707ee1a87b95163b47c4065m8easqes.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250321%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250321T052409Z&X-Amz-Expires=3600&X-Amz-Signature=29b3942f96f64e76a44fdd843cdacd18ca86478ff611577348118e98c8118f2d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":2294028,"uploadedAt":"2025-03-21T05:24:09.740Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-21 05:24:09.74+00	2025-03-21 05:24:09.74+00
22aeff14-592e-4faa-a3e2-c7ee2f351cae	e9336c9f6713f15101a7b6926bc5da96m8ik6mrk	6ead6776-c33f-4f78-b23d-d1d0f138e6ed	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	SADIQ1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf	{"url":"https://docnest.s3.ap-south-1.amazonaws.com/SADIQ1/SADIQ1_1e299b0b997038439b9891bd84a72a5fm8easika.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250321%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250321T090921Z&X-Amz-Expires=3600&X-Amz-Signature=3cc3a8c48e93b20f4b3e6bf82c188e9de0a391ac9047099a01ddc15b95bcea6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject","mimeType":"application/pdf","size":364396,"uploadedAt":"2025-03-21T09:09:21.728Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-21 09:09:21.728+00	2025-03-21 09:09:21.728+00
68a9ccad-1823-4c56-b4a0-769903748e41	b358e6ea07078a09b0d7562e86d28dd0m8igv93n	6ead6776-c33f-4f78-b23d-d1d0f138e6ed	customer	\N	d959ad8d-1546-42e8-afc4-cdba62cbb622	merged_SADIQ1.pdf	{"url":"https://nium.thestorywallcafe.com/v1/api/documents/esign/SADIQ1/merge_document_SADIQ1.pdf","mimeType":"application/pdf","size":315025,"uploadedAt":"2025-03-21T09:09:26.603Z"}	pending	\N	f	f	t	f	\N	\N	2025-03-21 07:36:31.955+00	2025-03-21 09:09:26.603+00
\.


--
-- Data for Name: esigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.esigns (id, hashed_key, partner_order_id, order_id, attempt_number, task_id, group_id, esign_file_details, esign_stamp_details, esign_invitees, esign_details, esign_doc_id, status, request_id, completed_at, esign_expiry, active, expired, rejected, result, esigners, file_details, request_details, esign_irn, esign_folder, esign_type, esign_url, esigner_email, esigner_phone, is_signed, type, "createdAt", "updatedAt") FROM stdin;
a500ae6f-5d2d-4967-9118-c2634243bff1	440d0c347f1a62ae3fed9b99bcf74b42m8ex661s	BMF1	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	1	BMF1	62940e36-c368-43f8-b978-4111223a1cac	{"file_name": "BMF1", "esign_file": "https://docnest.s3.ap-south-1.amazonaws.com/BMF1/merge_document_BMF1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250318%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250318T200146Z&X-Amz-Expires=3600&X-Amz-Signature=eaa0e97d3d3f6095d4ffab8c884902410d04d1e8cf236bde26f168e5d18d4b80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject", "esign_fields": {"esign_fields": {}}, "esign_allow_fill": false, "esign_profile_id": "SWRN1iH", "esign_additional_files": []}	{"esign_stamp_value": "", "esign_series_group": "", "esign_stamp_series": ""}	[{"esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tatyib@gmail.com", "esigner_phone": "8550895486", "aadhaar_esign_verification": {"aadhaar_yob": "", "aadhaar_gender": "", "aadhaar_pincode": ""}}]	{"status": "id_found", "esign_doc_id": "01JPNDJ6KWBP8JA6E7QKNRH0W1", "esign_details": [{"esign_url": "https://app1.leegality.com/sign/d5f6ce7a-1585-4f71-b6f9-6b41ff519b8a", "url_status": true, "esign_expiry": "2025-03-29T18:29:59Z", "esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tatyib@gmail.com", "esigner_phone": "8550895486"}, {"esign_url": null, "url_status": false, "esign_expiry": null, "esigner_name": null, "esigner_email": null, "esigner_phone": null}], "esigner_details": null}	\N	completed	edd80986-4601-40a8-a1c4-0caac2bc1244	2025-03-18 20:01:50.367+00	\N	t	f	f	\N	[{"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}, {"esigner_name": "Mohammed Tayibulla", "esigner_state": "Karnataka", "esigner_title": "5311", "esigner_pincode": "560045"}]	{"audit_file": "https://storage.idfy.com/edd80986-4601-40a8-a1c4-0caac2bc1244-auditfile.txt?Expires=1742447057&GoogleAccessId=api-gateway-prod%40idfy-1338.iam.gserviceaccount.com&Signature=ImEq8%2BEe%2BUh1aB4PItL3uunBkufXg%2Fn%2Bc7WPWviRnFiNvCgRIGesRFQFM5Kxl7bR%2FMOUo8D6%2FSFN6zFoSGpZ38MJ3847%2BIkPihGFDc%2Fg58t9QECtX0PkSgPn0gXbzKHNJUgpILHUTkYOw44Bo3A1eOR%2Fg8PsOliedAIfTTe%2B72zaN8o1KckQ86PCFfOqGhVgFjNijRwGb%2Fmkiy69bPyqtd9g1bMBx3viQQD22OWSBXIV3HMjyHKn7wVa9Iad3ExO%2F7IDvXGPItAfRKUhDuMM1JegPnwUREDuEoDBM5%2BHciK%2Fcmb1cqySXHmKlcJonJyg98CHwkwrXBmTrOjyVPA1Uw%3D%3D", "esign_file": ["https://storage.idfy.com/edd80986-4601-40a8-a1c4-0caac2bc1244-esign_file0.txt?Expires=1742447057&GoogleAccessId=api-gateway-prod%40idfy-1338.iam.gserviceaccount.com&Signature=hc2qZvQIW5lDQ3z4pCPnQ2O8qMSTpkfShJ9FjeMT5DtqA%2FlVEacrEmrKPFkWJMQXOcWPqHMJ58DsPRNkUJ9RztETW50H6Yb2QIJitfk%2FVaor8RDiY79V6yIusbMof8MbJQ8%2BFDvfmkaG16cUQQB%2B089ri5ZWvmkQ8ECfxI1%2Bywh43uNw0tsbslhZnU%2FNDmZtSmOL2VDoYJ30ihrr1lr5eD21ONIYzeI4jNN4oz7WQ7pY%2FgmhSbcEm5GHroX9wAtiyDsWUijiVidG1N0WLl%2BZGUIgObYddtnn6u7h9XSjpxV%2FtZXn0B1V0%2Fm7V6HGjH3sgiEcngPROc%2FeWwQs1mIW8w%3D%3D"]}	[{"esign_url": "https://app1.leegality.com/sign/d5f6ce7a-1585-4f71-b6f9-6b41ff519b8a", "is_active": true, "is_signed": true, "esign_type": "AADHAAR", "is_expired": false, "expiry_date": "29-03-2025 23:59:59", "is_rejected": false, "esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tatyib@gmail.com", "esigner_phone": "8550895486"}]	\N	\N	AADHAAR	https://app1.leegality.com/sign/d5f6ce7a-1585-4f71-b6f9-6b41ff519b8a	contact2tatyib@gmail.com	8550895486	t	\N	2025-03-18 20:01:50.368+00	2025-03-19 05:04:18.094+00
c8c979c4-9ed7-4b2e-ae49-3f3207d9ac43	999f5e81ba24b1f76b0c409aa405e39em8fgk9sy	BMF1	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	2	BMF1	62940e36-c368-43f8-b978-4111223a1cac	{"file_name": "BMF1", "esign_file": "https://docnest.s3.ap-south-1.amazonaws.com/BMF1/merge_document_BMF1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250319%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250319T050438Z&X-Amz-Expires=3600&X-Amz-Signature=2bafc9ad22fa6782750871b23af6f437c7c60fb9afad5d55f67562c0487b2010&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject", "esign_fields": {"esign_fields": {}}, "esign_allow_fill": false, "esign_profile_id": "SWRN1iH", "esign_additional_files": []}	{"esign_stamp_value": "", "esign_series_group": "", "esign_stamp_series": ""}	[{"esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tatyib@gmail.com", "esigner_phone": "8550895486", "aadhaar_esign_verification": {"aadhaar_yob": "", "aadhaar_gender": "", "aadhaar_pincode": ""}}]	{"status": "Success", "esign_doc_id": "01JPPCM6D9R1TD5NWNPQGM2N4R", "esign_details": [{"esign_url": "https://app1.leegality.com/sign/d295243a-0c13-4e40-b75b-9094b3bd12b1", "url_status": true, "esign_expiry": "2025-03-29T18:29:59Z", "esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tatyib@gmail.com", "esigner_phone": "8550895486"}, {"esign_url": null, "url_status": false, "esign_expiry": null, "esigner_name": null, "esigner_email": null, "esigner_phone": null}], "esigner_details": null}	\N	completed	d9727510-3590-4c15-96ca-8b5e2f847776	2025-03-19 05:04:41.121+00	\N	t	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	2025-03-19 05:04:41.122+00	2025-03-19 05:04:41.122+00
9a58366d-c0ad-421f-8e23-7a549d25c0ed	cb729318b1a152fe78f9de295d44b043m8fgxdof	BMF1	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	3	BMF1	62940e36-c368-43f8-b978-4111223a1cac	{"file_name": "BMF1", "esign_file": "https://docnest.s3.ap-south-1.amazonaws.com/BMF1/merge_document_BMF1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250319%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250319T051451Z&X-Amz-Expires=3600&X-Amz-Signature=c5d4c198d85ab037a9f86ad9cf4389b83f4e5ece7e983dd849ffb3f8cf5b5481&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject", "esign_fields": {"esign_fields": {}}, "esign_allow_fill": false, "esign_profile_id": "SWRN1iH", "esign_additional_files": []}	{"esign_stamp_value": "", "esign_series_group": "", "esign_stamp_series": ""}	[{"esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tatyib@gmail.com", "esigner_phone": "8550895486", "aadhaar_esign_verification": {"aadhaar_yob": "", "aadhaar_gender": "", "aadhaar_pincode": ""}}]	{"status": "id_found", "esign_doc_id": "01JPPD6VPXCXFY9XZ827HB4XJ7", "esign_details": [{"esign_url": "https://app1.leegality.com/sign/c17092ee-371b-44c8-a3b5-daaf5d1dbdfa", "url_status": true, "esign_expiry": "2025-03-29T18:29:59Z", "esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tatyib@gmail.com", "esigner_phone": "8550895486"}, {"esign_url": null, "url_status": false, "esign_expiry": null, "esigner_name": null, "esigner_email": null, "esigner_phone": null}], "esigner_details": null}	\N	completed	94875e1c-1b68-4147-8aaa-f90f6c9a2bac	2025-03-19 05:14:52.669+00	\N	t	f	f	\N	[]	{"audit_file": "https://storage.idfy.com/94875e1c-1b68-4147-8aaa-f90f6c9a2bac-auditfile.txt?Expires=1742563384&GoogleAccessId=api-gateway-prod%40idfy-1338.iam.gserviceaccount.com&Signature=APfg7KAM3yfGUyYTED3S7lMghx92pQERWbBCD%2BmNyQz6XdmLEyvGOaEWkWo3yCiLiJ0l8bouL6%2B4RTVrncy9P%2BDdlnVyPiL3BAT9752peL6h3rKFy3BEYOCAChtV%2FDJNGpObbfGH6cxSKJ9rve1LGJwpQvsAeY9B7yjnuzqpfo%2FSkdqIrL4U9oc6m6HjYnbTwltcdMw07PuNW2NLHRro75avzuchMeMnIQootcJshcEw5lTDh8LR2b2cAqzu7qbMnyqMN%2BDIIPA9j9sr%2B5qYc8WK9DczA2jBk67cy%2BXhgP7YDXj%2FJw7bk9Id9sCs5DTFC7LziS0%2B2of3AYDMggvEow%3D%3D", "esign_file": ["https://storage.idfy.com/94875e1c-1b68-4147-8aaa-f90f6c9a2bac-esign_file0.txt?Expires=1742563384&GoogleAccessId=api-gateway-prod%40idfy-1338.iam.gserviceaccount.com&Signature=nBBpb5285LaK56w6wLqqbEbvCHa0zc%2FlyfiS6be5XfAI1Vp4D%2BiKAJ9Vzr9L2VQAxHai1kmPcoZakb8r3OOtEX7xZhOxL7uTg1Neybi5vggu7O7k788WailfznEe5tzj7qiWxLfTqjQsItMgT5U6Mg1iCZZnFbvKSHhlE6oTzFseWfWWl3gQITtOh0UvyaZ0E2MoBuldDaKAxfI0fdvdrG00W1XlDNk5jjU45ISWdoSqrgVO88WrI%2FHBegV0o6iNS7pmtxKZLE9dYC6nk19G0Fwo4K%2FsTD6B2o8Lhk6aaGHo6X%2BIi6q%2F%2FMc9r4JH3Flky2GRRhjysLI6agI%2B7urAfA%3D%3D"]}	[{"esign_url": "https://app1.leegality.com/sign/c17092ee-371b-44c8-a3b5-daaf5d1dbdfa", "is_active": true, "is_signed": false, "esign_type": null, "is_expired": false, "expiry_date": "29-03-2025 23:59:59", "is_rejected": false, "esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tatyib@gmail.com", "esigner_phone": "8550895486"}]	\N	\N	\N	https://app1.leegality.com/sign/c17092ee-371b-44c8-a3b5-daaf5d1dbdfa	contact2tatyib@gmail.com	8550895486	f	\N	2025-03-19 05:14:52.67+00	2025-03-20 13:23:04.85+00
061b6a58-c6a2-49c3-978f-87b6b6216934	7fc272a5d4ef37b18050fe3f0840426dm8fhgbnh	NIUM2	4a863510-f876-4727-9ea7-ae0dfdbd22c4	1	NIUM2	62940e36-c368-43f8-b978-4111223a1cac	{"file_name": "NIUM2", "esign_file": "https://docnest.s3.ap-south-1.amazonaws.com/NIUM2/merge_document_NIUM2.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQUFLQNGLQIKPAL6H%2F20250319%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250319T052934Z&X-Amz-Expires=3600&X-Amz-Signature=86646de32a235e2b9ad966b5f73faa8207cfcab79e62aae3f1f2ce1ca2a94022&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject", "esign_fields": {"esign_fields": {}}, "esign_allow_fill": false, "esign_profile_id": "SWRN1iH", "esign_additional_files": []}	{"esign_stamp_value": "", "esign_series_group": "", "esign_stamp_series": ""}	[{"esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tayib@gmail.com", "esigner_phone": "8550895486", "aadhaar_esign_verification": {"aadhaar_yob": "", "aadhaar_gender": "", "aadhaar_pincode": ""}}]	{"status": "id_found", "esign_doc_id": "01JPPE1TSGNSJSD2AJRQHVMGV6", "esign_details": [{"esign_url": "https://app1.leegality.com/sign/c720b6b4-c45f-456c-bf30-b93266768a70", "url_status": true, "esign_expiry": "2025-03-29T18:29:59Z", "esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tayib@gmail.com", "esigner_phone": "8550895486"}, {"esign_url": null, "url_status": false, "esign_expiry": null, "esigner_name": null, "esigner_email": null, "esigner_phone": null}], "esigner_details": null}	\N	completed	51b56fb8-0abf-4a0b-a157-c1a83d10c4f2	2025-03-19 05:29:36.507+00	\N	t	f	f	\N	[]	{"audit_file": "https://storage.idfy.com/51b56fb8-0abf-4a0b-a157-c1a83d10c4f2-auditfile.txt?Expires=1742620427&GoogleAccessId=api-gateway-prod%40idfy-1338.iam.gserviceaccount.com&Signature=iqPeT1x6XdxYgezcBE7gmJG4c1hq3BgwuQJVmtdzHvIgTBATIMQTW1XVt7TwajZMMUnRVbDYiotECIVVDc%2BQjG0Z%2B6HqkAUdV%2B8C7cEzo6q4c7YHrxrfYhnsziTgxDPDTZkxMcLR63iJcl0lURZ28fcd8cOQek1n23kcIqcDr%2FfW6zVdiqzmQ712jwJDBFsKMLuwXsYPqTcsaD3pagx6r%2FwF4XsfLke%2F8BvKeKm2hfbFYJjUTkY94LLwKjSAuSF9L4mSLF9Zl0o842OsGNZez3VHzKNbsj3hZAwHzxeUwxfVQF7M7GZb7hbfQIzM0ByCH2nY%2F%2BlA2%2FcXOZV%2BcjLzpw%3D%3D", "esign_file": ["https://storage.idfy.com/51b56fb8-0abf-4a0b-a157-c1a83d10c4f2-esign_file0.txt?Expires=1742620427&GoogleAccessId=api-gateway-prod%40idfy-1338.iam.gserviceaccount.com&Signature=mKpwF2jPa7rOKt%2F2c%2FXuGlsKYYIuZ%2BWXbm%2F5A16%2BnTnEdMdLZXa4jZuNNXKkpjMr7DW5tDdRAivs659TcLawWEWZyF58IUzsAHtJkwQzl7vu8BwXI3TknvtxADUvCb6BmUFGjELuQFcBUd78eF9Nn6HPLqBSMVmE8Q%2FoCd5YqWi6oXCA6nr2MQ54Qb4cChyqkCPKaag5WYuyOD7cAiCWKL%2F3fcPWqrxzgzLTaysHU%2B9JN1BTVFNQjXWJySdi8qIvSHzXyXDFfyNrT%2Fn0BnuSd3%2B1NrSvgRUD3l4XUaA%2BaT3p6Cfwe1sHcKyBHY45FB7N2wlF46oOTLo2QGs0W1YGGw%3D%3D"]}	[{"esign_url": "https://app1.leegality.com/sign/c720b6b4-c45f-456c-bf30-b93266768a70", "is_active": true, "is_signed": false, "esign_type": null, "is_expired": false, "expiry_date": "29-03-2025 23:59:59", "is_rejected": false, "esigner_name": "Mohammed Tayibulla", "esigner_email": "contact2tayib@gmail.com", "esigner_phone": "8550895486"}]	\N	\N	\N	https://app1.leegality.com/sign/c720b6b4-c45f-456c-bf30-b93266768a70	contact2tayib@gmail.com	8550895486	f	\N	2025-03-19 05:29:36.507+00	2025-03-21 05:13:47.169+00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, hashed_key, partner_id, partner_order_id, transaction_type, purpose_type, is_esign_required, is_v_kyc_required, customer_name, customer_email, customer_phone, customer_pan, order_status, e_sign_status, e_sign_link, e_sign_link_status, e_sign_link_doc_id, e_sign_link_request_id, e_sign_link_expires, e_sign_completed_by_customer, e_sign_customer_completion_date, e_sign_doc_comments, v_kyc_reference_id, v_kyc_profile_id, v_kyc_status, v_kyc_link, v_kyc_link_status, v_kyc_link_expires, v_kyc_completed_by_customer, v_kyc_customer_completion_date, v_kyc_comments, incident_status, incident_checker_comments, nium_order_id, nium_invoice_number, date_of_departure, incident_completion_date, is_esign_regenerated, is_esign_regenerated_details, is_video_kyc_link_regenerated, is_video_kyc_link_regenerated_details, created_by, updated_by, checker_id, merged_document, "createdAt", "updatedAt") FROM stdin;
4292748d-6fa4-4727-af59-8b7a3983839e	47b4f9508dc0fab6d4327a0a49cd4280m8ftfpvg	62940e36-c368-43f8-b978-4111223a1cac	ANIKET1	603e51b68ffd0e2ad8a8dfcdad7f9dd3m8eao94v	cc232594a1320f38aa3aba24a489bae5m8eaq9c5	t	t	Mohammed Tayibulla	contact2tayib@gmail.com	8550895486	CAIPT0727K	pending	not generated	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not generated	\N	\N	\N	\N	\N	\N	t	casccs	NIUMF768160	1312VS	\N	\N	f	\N	f	\N	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	5933f919-d2ba-490c-955b-4b267c44e1a0	{"url": "https://nium.thestorywallcafe.com/v1/api/documents/esign/ANIKET1/merge_document_ANIKET1.pdf", "size": 405697, "mimeType": "application/pdf", "createdAt": "2025-03-20T08:40:34.857Z", "documentIds": ["5f1b4a33-c2b5-436d-b6f9-21c8423ac453"]}	2025-03-19 11:05:03.659+00	2025-03-21 11:02:44.332+00
556b4fc6-a09a-41f8-807f-295f00e83030	6f5f1b0347c01b08d97d3cc238581557m8eymjkg	62940e36-c368-43f8-b978-4111223a1cac	BMF2	790af50c28d94ce2306b016bdcd203ddm8eanwvs	82da017edadc6482e7617116c6ecb563m8eaq5du	t	t	Mohammed Tayibulla	contact2tatyib@gmail.com	8550895486	CAIPT0727K	pending	not generated	\N	\N	\N	\N	\N	\N	\N	\N	BMF2-1742330722617	d86a0f8e-c510-40ba-8e27-8c0c8fcb6628	pending	https://capture.kyc.idfy.com/v2/captures?t=5PWnX3Fx0B2h	active	2025-04-02 20:45:22+00	f	\N	\N	t		NIUMF410136	342342sdvsdf	\N	\N	f	\N	f	[]	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	90be33cb-9fcb-4d32-bc1c-27d4df9e5784	{"url": "https://docnest.s3.ap-south-1.amazonaws.com/BMF2/merge_document_BMF2.pdf", "size": 269336, "mimeType": "application/pdf", "createdAt": "2025-03-20T04:06:30.711Z", "documentIds": ["e7ce9e9c-31a9-4672-b9a8-b095755eebfe"]}	2025-03-18 20:42:33.989+00	2025-03-24 08:41:29.797+00
4a863510-f876-4727-9ea7-ae0dfdbd22c4	f960a94785014cf052646c490bb81847m8fhet1q	62940e36-c368-43f8-b978-4111223a1cac	NIUM2	790af50c28d94ce2306b016bdcd203ddm8eanwvs	82da017edadc6482e7617116c6ecb563m8eaq5du	t	t	Mohammed Tayibulla	contact2tayib@gmail.com	8550895486	CAIPT0727K	pending	pending	https://app1.leegality.com/sign/c720b6b4-c45f-456c-bf30-b93266768a70	active	01JPPE1TSGNSJSD2AJRQHVMGV6	c48aad58-9c3a-464f-8636-a3c43f9550e3	2025-03-24 05:29:36.518+00	\N	\N	\N	NIUM2-1742362297638	4b56caca-33ad-4e4c-bd0b-abaf7f6872d5	pending	https://capture.kyc.idfy.com/v2/captures?t=dZ2hTdQbOgpz	active	2025-04-03 05:31:37+00	f	\N	\N	f	Cscascasc	NIUMF215031		\N	\N	f	\N	f	[]	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	90be33cb-9fcb-4d32-bc1c-27d4df9e5784	{"url": "https://nium.thestorywallcafe.com/v1/api/documents/esign/NIUM2/merge_document_NIUM2.pdf", "size": 1128325, "mimeType": "application/pdf", "createdAt": "2025-03-21T05:24:15.605Z", "documentIds": ["6d4caf85-c3a2-4886-add9-2c9090ed3a32"]}	2025-03-19 05:28:25.736+00	2025-03-24 08:41:29.797+00
378d8d8c-405c-4c8a-894d-4adb7b6b7b34	1fe77137b28cdaf4e9fef8fa1b17c30fm8ex4952	62940e36-c368-43f8-b978-4111223a1cac	BMF1	790af50c28d94ce2306b016bdcd203ddm8eanwvs	82da017edadc6482e7617116c6ecb563m8eaq5du	t	t	Mohammed Tayibulla	contact2tatyib@gmail.com	8550895486	CAIPT0727K	pending	pending	https://app1.leegality.com/sign/c17092ee-371b-44c8-a3b5-daaf5d1dbdfa	active	01JPPD6VPXCXFY9XZ827HB4XJ7	f3beca79-1821-4ba1-a481-aecdb9eeca68	2025-03-24 05:14:52.686+00	\N	\N	\N	BMF1-1742361326051	c4084659-0630-4615-9319-4ffb5021b1ff	pending	https://capture.kyc.idfy.com/v2/captures?t=fUvnWTqe75_8	active	2025-04-03 05:15:26+00	f	\N	\N	t	casc casc	NIUMF492719	4124FV	\N	\N	f	\N	t	[{"profile_id": "765ebda1-e63e-4c82-ae08-d27105d1977e", "v_kyc_link": "https://capture.kyc.idfy.com/v2/captures?t=_evuVRGTvGNt", "reference_id": "BMF1-1742328963608", "attempt_number": 1, "v_kyc_link_status": "active", "v_kyc_link_expires": "2025-04-02T20:16:03.000Z"}, {"profile_id": "1f06965c-1efc-4cc1-be23-a0a5d34e521d", "v_kyc_link": "https://capture.kyc.idfy.com/v2/captures?t=mmMoiiWb4R02", "reference_id": "BMF1-1742329144067", "attempt_number": 2, "v_kyc_link_status": "pending", "v_kyc_link_expires": "2025-04-02T20:19:04.000Z"}, {"profile_id": "b1cc703c-d0f2-4686-a7cc-71a18b64591e", "v_kyc_link": "https://capture.kyc.idfy.com/v2/captures?t=i3c5jh3uc3H1", "reference_id": "BMF1-1742360641531", "attempt_number": 3, "v_kyc_link_status": "active", "v_kyc_link_expires": "2025-04-03T05:04:01.000Z"}, {"profile_id": "c4084659-0630-4615-9319-4ffb5021b1ff", "v_kyc_link": "https://capture.kyc.idfy.com/v2/captures?t=fUvnWTqe75_8", "reference_id": "BMF1-1742361326051", "attempt_number": 4, "v_kyc_link_status": "active", "v_kyc_link_expires": "2025-04-03T05:15:26.000Z"}]	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	5933f919-d2ba-490c-955b-4b267c44e1a0	{"url": "https://nium.thestorywallcafe.com/v1/api/documents/esign/BMF1/merge_document_BMF1.pdf", "size": 120465, "mimeType": "application/pdf", "createdAt": "2025-03-20T13:31:22.608Z", "documentIds": ["4a3c3601-51d4-4209-bed6-145bc2af895b"]}	2025-03-18 20:00:21.059+00	2025-03-21 11:02:44.332+00
6ead6776-c33f-4f78-b23d-d1d0f138e6ed	4d2cc5dce85a05aeea0473c6273051dcm8igg58v	62940e36-c368-43f8-b978-4111223a1cac	SADIQ1	603e51b68ffd0e2ad8a8dfcdad7f9dd3m8eao94v	cc232594a1320f38aa3aba24a489bae5m8eaq9c5	t	t	Mohammed Tayibulla	contact2tayib@gmail.com	8550895486	CAIPT0727K	pending	not generated	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	not generated	\N	\N	\N	\N	\N	\N	\N	\N	NIUMF848131	\N	\N	\N	f	\N	f	\N	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	\N	{"url": "https://nium.thestorywallcafe.com/v1/api/documents/esign/SADIQ1/merge_document_SADIQ1.pdf", "size": 315025, "mimeType": "application/pdf", "createdAt": "2025-03-21T09:09:26.610Z", "documentIds": ["68a9ccad-1823-4c56-b4a0-769903748e41"]}	2025-03-21 07:24:47.119+00	2025-03-21 09:09:26.61+00
\.


--
-- Data for Name: partner_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partner_products (partner_id, product_id, "createdAt", "updatedAt") FROM stdin;
62940e36-c368-43f8-b978-4111223a1cac	80185a93-7242-4680-8922-297d85dfbd2d	2025-03-17 08:55:43.161+00	2025-03-17 08:55:43.161+00
27644155-4cc2-4541-93ea-babd214d7df3	80185a93-7242-4680-8922-297d85dfbd2d	2025-03-18 13:29:51.174+00	2025-03-18 13:29:51.174+00
45b21f3a-d782-4059-ba8b-e8624e10ef23	80185a93-7242-4680-8922-297d85dfbd2d	2025-03-19 07:24:55.392+00	2025-03-19 07:24:55.392+00
f5d4cfd5-a4a0-41e1-a854-2e9cf3a205ae	8580130f-79a2-417d-9c16-806c1b853ac3	2025-03-19 07:58:16.536+00	2025-03-19 07:58:16.536+00
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partners (id, hashed_key, role_id, email, first_name, last_name, password, api_key, is_active, business_type, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
27644155-4cc2-4541-93ea-babd214d7df3	4f0440dc0a6d253296aff77f4566d9d8m8ctn5re	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	sana1@gmail.com	Sana	G	$2a$10$0eJs3RRH0wuQiX3u3HiSY.UGZo.O4uv0wwQjN4ijG8ZHc4K6n6T2C	eccc2215-82b7-46be-a418-fb2d997224e6	t	large_enterprise	4b9517bd-692b-459d-b39f-0c6147a67e31	723f698d-91a0-42d1-9416-d19b463f00b4	2025-03-17 08:47:32.328+00	2025-03-20 13:05:44.848+00
274a5724-5e98-49ff-90fe-0a0fd49f6dff	bbce159e39b5e7ea1096fc42ebfeff03m85s76dn	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	contact2tayib@gmail.com	Mohammed	Tayibulla	$2a$10$fTv87AaTCKxNHQYHCnMtROFlUVrlt/0BvFn4q4TDXEeG2NhdcpZa.	41dc8bcf-dff0-4152-a11a-49183559bd31	t	large_enterprise	\N	\N	2025-03-12 10:32:43.787+00	2025-03-12 10:32:43.787+00
45b21f3a-d782-4059-ba8b-e8624e10ef23	38e3e173c37876aa8d42377c02d39e0bm8flkm9y	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	salma@gmail.com	salma	M	$2a$10$gqiIaaKAYD9zDqfKltJzcOybUyL7YzluW98iqY57rbGWSu0SQqqrK	05a7c653-0c96-4853-990b-bf22bb827bf4	t	large_enterprise	4b9517bd-692b-459d-b39f-0c6147a67e31	\N	2025-03-19 07:24:55.366+00	2025-03-20 13:05:46.656+00
c396ce58-707f-4a85-b869-13f18da39483	870d73f8b3f93e8c4c8200f3e8dc3768m8fn18xk	bcbfc72e-54cc-4f67-9110-342c6570b062	sana@gmail.com	Sana	M	$2a$10$iP1wnCS0DujoqdcjKsRHu.rSANTxuoFva5mccCFwOk.wcqaqrbaO6	d18d4465-76db-4b67-8209-5ba1a8ce9208	t	large_enterprise	\N	\N	2025-03-19 08:05:50.84+00	2025-03-19 08:05:50.84+00
6329e0ee-cf1c-4a7a-be9b-107131e96134	13e5362030ce42943483d46e832102a2m8fn200q	bcbfc72e-54cc-4f67-9110-342c6570b062	sana11@gmail.com	Sana	M	$2a$10$Qo1zg9rcEd.aFUnajJes9.BSqcEv9aAlQvKZ1wguEIwV9CbYjvqfa	dc41e643-726a-417c-9a90-08d68fcf8710	t	large_enterprise	\N	\N	2025-03-19 08:06:25.945+00	2025-03-19 08:06:25.945+00
f5d4cfd5-a4a0-41e1-a854-2e9cf3a205ae	01d805d164f267afadc6ac1d48f9b5e0m8fm9lih	bcbfc72e-54cc-4f67-9110-342c6570b062	asma.checker@gmail.com	Jhon	M	$2a$10$oBFre2Hl5Csv7B6g3zrKBOTm3b32H2UN.lP5SmKT58YUl85J/gj1a	7b2ab4c0-fcb5-4b04-b066-c9eb73224481	t	large_enterprise	\N	723f698d-91a0-42d1-9416-d19b463f00b4	2025-03-19 07:44:20.776+00	2025-03-20 13:05:48.402+00
25507a99-9e99-49b6-928b-09b14125bd73	e1f6d27b558eea9a14b58b89c833e074m8mqx3zt	bcbfc72e-54cc-4f67-9110-342c6570b062	Govind	Govind	M	$2a$10$NQ5.pDUwvCoBcVOJ7feL8enA9HEoyoDXVbOZn8skNmcrKvzITJyS.	9203ede9-e916-4fa8-935d-ca17ce12d172	t	large_enterprise	\N	\N	2025-03-24 07:28:59.513+00	2025-03-24 07:28:59.513+00
ab182e5f-43bb-495a-a640-813d395f59cb	ba7b4fab27d0403c4f9062acf842b1e6m8mt8ldd	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	Hameed@gmail.com	Hameed	M	$2a$10$Z10dcgrSJ3MzWSff895KHu7mgpEKUQ3BS09qAXoDI.toVfZy.x8WW	5624f13b-4386-4162-8e47-aa8c0b13b809	t	large_enterprise	\N	\N	2025-03-24 08:33:54.48+00	2025-03-24 08:33:54.48+00
3a94676f-bd82-443c-b928-2191c93dd901	5784a592e6834ac9d369b9ebef326f58m8h13ih7	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	omraj@gmail.com	Omraj	D	$2a$10$lwVdVjViFcdTkmgqQr112eoKbbp5ZnVUV3s5i2PCE6L4zwQ3L3hoC	7a4316c6-41e0-4221-a7fc-234e40c82e87	t	large_enterprise	\N	\N	2025-03-20 07:27:17.323+00	2025-03-20 07:27:17.323+00
81cfad21-5da2-4ba2-ae5e-f175bde6d55d	fe8c087392440b3c5d0299c1fc7d41d5m8g8yg8t	bcbfc72e-54cc-4f67-9110-342c6570b062	mahi@gmail.com	Mahi	M	$2a$10$C/C7H.k5w0wahbr4RR2yPeTJuU/qGvV6rgHJPGYWqIcHaryARBXVW	403bda35-4488-48fb-bbd6-6f896e4eb105	t	large_enterprise	\N	\N	2025-03-19 18:19:31.9+00	2025-03-19 18:19:31.9+00
8b857c64-3128-4208-915d-c3dd45882c4d	95ccaccf48dd768255bef45b8cebbf6em8g9fw1p	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	salma1@gmail.com	Salma	M	$2a$10$UbSH5F0ul2eVLSAWhJzlzewBRyxjAE3u/YtRBCAPoJ908y700fPQG	c849c74b-2290-4812-9817-fbe6a08a3725	t	large_enterprise	\N	\N	2025-03-19 18:33:05.533+00	2025-03-19 18:33:05.533+00
f7c083bc-d2fd-48e7-aafc-f611bf6156c6	279323650a41479561b80946bcf98d89m8h151ny	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	priya@gmail.com	Priya	D	$2a$10$9qvv5PKNQL1AZnmmvns3zuroM4l5PPc5JRjAKTG0x7tiHqGhXiIhu	20cae7fb-a71f-40a8-8272-0a41efd886a8	t	large_enterprise	\N	\N	2025-03-20 07:28:28.846+00	2025-03-20 07:28:28.846+00
d4b0bdd8-f719-493b-883d-179a7a0f0c28	888717ced60ee802bb1a08defd50672fm8gzaf6z	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	devid@gmail.com	Devid	M	$2a$10$yVdVVc4qrtZJqIQ2NStT9.6ge5ugvqb0.J/WD9c0ku5S7h1wkBVJO	48cf84e7-3ba4-47a8-b69a-bf59993e3474	t	large_enterprise	\N	\N	2025-03-20 06:36:40.426+00	2025-03-20 06:36:40.426+00
62940e36-c368-43f8-b978-4111223a1cac	befb8eadb0fac508d695b7395ec10543m8ctxoh9	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	mohamed@gmail.com	Mohammed	Tayibulla	$2a$10$LwOm8TBBHmGn1smttSGusOrX8KiS8vJTH07PfXNt7Q0aXAMXhN4B2	7b4d9b49-1794-4a91-826a-749cf0d8a87a	t	large_enterprise	4b9517bd-692b-459d-b39f-0c6147a67e31	723f698d-91a0-42d1-9416-d19b463f00b4	2025-03-17 08:55:43.149+00	2025-03-20 13:05:43.393+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, hashed_key, name, description, is_active, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
80185a93-7242-4680-8922-297d85dfbd2d	92503a31bc222a51692d8f226928ef11m8ctvskr	Card	\N	t	4b9517bd-692b-459d-b39f-0c6147a67e31	4b9517bd-692b-459d-b39f-0c6147a67e31	2025-03-17 08:54:15.146+00	2025-03-17 08:54:15.146+00
8580130f-79a2-417d-9c16-806c1b853ac3	1d7debe7d7948ece19215bd73fa3f590m8ctw2rb	Remittance	\N	t	4b9517bd-692b-459d-b39f-0c6147a67e31	4b9517bd-692b-459d-b39f-0c6147a67e31	2025-03-17 08:54:28.342+00	2025-03-17 08:54:28.342+00
\.


--
-- Data for Name: purposes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purposes (id, hashed_key, purpose_name, is_active, created_at, updated_at, created_by, updated_by) FROM stdin;
9405afa8-e65e-4e0c-b705-309e11d50658	82da017edadc6482e7617116c6ecb563m8eaq5du	BTQ	t	2025-03-18 09:33:31.457+00	2025-03-18 09:33:31.457+00	\N	\N
c45271ae-ebc9-42ff-9c56-e451db653f3e	cc232594a1320f38aa3aba24a489bae5m8eaq9c5	TQ	t	2025-03-18 09:33:36.58+00	2025-03-18 09:33:36.581+00	\N	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, hashed_key, name, status, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
80310257-bc6f-4e99-b36b-556bdf18a091	3270de93a312c962fe5488e1c27184c6m85n9xrc	admin	t	\N	\N	2025-03-12 08:14:54.503+00	2025-03-12 08:14:54.503+00
3776948c-01a9-4de9-91dc-eabd45349aa2	734fe4e8606d29e191c056388a794d72m85q7ek4	co-admin	t	723f698d-91a0-42d1-9416-d19b463f00b4	\N	2025-03-12 09:36:55.155+00	2025-03-12 09:36:55.155+00
bcbfc72e-54cc-4f67-9110-342c6570b062	f34031c04be469504ce30f4e67b469a9m85qvfhq	checker	t	\N	\N	2025-03-12 09:55:36.11+00	2025-03-12 09:55:36.11+00
cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	dbb6d570d289b2ec4a001e2e4f978a30m85qvm32	maker	t	\N	\N	2025-03-12 09:55:44.654+00	2025-03-12 09:55:44.654+00
3c909ad0-bcd6-472b-88d1-bee3d8e6dd31	e199c133d3e341c5bf16129e6abd76f7m85qvrs1	maker-checker	t	\N	\N	2025-03-12 09:55:52.033+00	2025-03-12 09:55:52.033+00
\.


--
-- Data for Name: transaction_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_type (id, hashed_key, name, is_active, created_at, updated_at, created_by, updated_by) FROM stdin;
efd76aea-739c-43ba-955c-bf9d39eb7e0a	790af50c28d94ce2306b016bdcd203ddm8eanwvs	CARD LOAD	t	2025-03-18 09:31:47.125+00	2025-03-18 09:31:47.127+00	\N	\N
119a89c3-0804-4448-a100-25eaa0a420e2	603e51b68ffd0e2ad8a8dfcdad7f9dd3m8eao94v	CARD RELOAD	t	2025-03-18 09:32:03.006+00	2025-03-18 09:32:03.007+00	\N	\N
aad38e5f-41ce-4406-8f1e-0c7915541a60	85609a48bcf2cf4a4ba2295b03da45ecm8eaof42	CARD ENCASHMENT	t	2025-03-18 09:32:10.753+00	2025-03-18 09:32:10.754+00	\N	\N
599ac5ae-176d-4ad5-98d2-42f6cdee0697	ab95d0f45758e4bff3e0ba916d30d80am8eaomge	REMITTANCE	t	2025-03-18 09:32:20.267+00	2025-03-18 09:32:20.267+00	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, hashed_key, role_id, branch_id, bank_account_id, is_active, business_type, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
dd585706-5de5-42e4-ab88-596ff73e5a5a	bhargavim262@gmail.com	Checker1@123#	38e38067af234c7bac57cca7dd22bd8fm8ifenvq	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 06:55:38.34+00	2025-03-21 11:54:45.09+00
c722faa6-5bf8-4cdd-8100-79744ae7388b	bhargavi@dataseedtech.com	Test@123#	b15eb88ce8308b98499fb662bbfdc37am8iq86jb	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 11:58:31.703+00	2025-03-21 12:00:55.257+00
56297325-c515-4806-b287-de7b8db3ca2e	sanagroup85@gmail.com	$2a$10$rOARVWZayzD.3bv3ax9SJ.uMFZCwcJxyqkWpsxpXngPAj9WByVuau	8b4018b4e5f9c774e1f7296f27815333m8i8t4ff	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 03:50:55.659+00	2025-03-21 06:46:32.929+00
bde30790-b125-4ecb-a92e-25e46dc623e0	sanagroup75@gmail.com	$2a$10$Zw0wmREMm.InU6IhmNTMVefIbvavR4lQJnqOMsvI1LAH6llB7UCeK	d9393d5165b93e9198b9be0049a64eedm8j2k3mv	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 17:43:43.207+00	2025-03-21 17:43:43.207+00
718fd741-f823-497c-81c9-8e4533871821	user.maker@gmail.com	$2a$10$KPq2zNnKn0X1mqDJDw0kk.TinuTczUKDpuWhMnE4hVmbiQZkhRTW.	1236b0cfc456d333a3ae14a8ec760dbfm8i50sdc	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 02:04:54.816+00	2025-03-21 06:46:40.143+00
95e3c5b6-542b-43a6-b539-456e0c21ea54	asma@dataseedtech.com	$2a$10$RWl15L3rv4ph0nMIptB5GezLECX/lQH.2z1.DHHn1uJUdA6i1Teiq	8de88ec72aa58c73e2f0cb5b6692b326m8fvlloc	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-19 12:05:37.402+00	2025-03-21 07:00:30.403+00
5b58335d-1892-4680-b81a-297ec2ea0b93	hemanth@gmail.com	$2a$10$PlXuEH1DxHssXVzHIQ5R5O2pJoKdirpyABVzyY91IyQaScw4Alb3u	435dd04c44cb02c353acdf4f977b8fb9m8he4fmi	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-20 13:31:55.29+00	2025-03-20 13:31:55.29+00
5b6fd8d7-2bb0-4073-bf31-fb8ecc814017	john.doe@example.com	$2a$10$bdWzKJ3gEMt4VdAho7eOJ.B4JiDFYEwHcCGiccQF7MUsp6xwNS.P2	6965af2d74643cb4f21f63bbcc761509m8hj4zz1	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-20 15:52:19.741+00	2025-03-20 15:52:19.741+00
d13d261c-68dd-463f-9eb9-1282aaec5099	suraj@dataseedtech.com	suraj@1234#	e17b70dd993d6fb7425b3e1d9c38572fm85res8f	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-12 10:10:39.087+00	2025-03-20 16:28:08.505+00
5b7545c8-7a18-4ac3-a0e4-eec9bff85ea5	asma1234@dataseedtech.com	Suraj@123#	e6caaf42dfabc65154081a795f5bef7bm8h5dao8	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-20 09:26:52.228+00	2025-03-20 17:51:17.254+00
8811cf5d-3c4e-44a2-a3e4-601629d325ae	suraj2@dataseedtech.com	Suraj@123#	709135f82fa4aafd81491679163056b6m85rra6q	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-12 10:20:22.225+00	2025-03-20 17:51:18.416+00
cfd38acd-62c5-4385-a8ae-327f05f4a8ab	maker@dataseedtech.com	$2a$10$W23zK6vHjewGJ71wmVnpiu47pRtIwhBkNLw2LnjDcLapD7.0R/oP2	3ebe66d61c41b4a5109479880aecea0fm8fxchn3	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-19 12:54:31.503+00	2025-03-20 17:51:22.489+00
ee34e073-b5b4-4891-90c0-ef09e4df8d80	sfsdfs@gmail.com	Checker@123#	e6830394c291fc180ba8821b610b3002m8hdulqi	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-20 13:24:16.65+00	2025-03-21 10:25:19.202+00
4b9517bd-692b-459d-b39f-0c6147a67e31	aniket@dataseedtech.com	$2a$10$7z8m4vAjP/3TXQrHLbkOx.Ynu77X/UVirzIAFYVLRTUFM.v32ghIq	dbdd97ed89e97a98428e08ac1ccb46d4m85rd2cn	3776948c-01a9-4de9-91dc-eabd45349aa2	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-12 10:09:18.886+00	2025-03-21 01:51:12.533+00
6bbd9cb2-9a8d-41c6-b4a2-28895ffe4462	mahi@gmail.com	$2a$10$KVqm2UREa13hapm4bStFAeIxSM74GHlUWAp6s4tXtCR1irOY8FaQ2	cb9e562e9cd18ad0284f12d55cf9eb2am8h4jblw	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-20 09:03:33.741+00	2025-03-20 18:00:25.165+00
3987f7bf-e286-48e5-a9be-a1fb091eaf04	mahi11@gmail.com	$2a$10$02Z7pOmVQD5.ePHo00krSuEt3AoW/ZZUME6h.xQlr0aMYmZ45vE1K	fe07a10b706cd69619ec85c67d463f26m8h4mbfc	cdadd7a8-a04a-40ba-a5b3-2b1bf6d788c8	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-20 09:05:53.487+00	2025-03-21 02:11:04.802+00
723f698d-91a0-42d1-9416-d19b463f00b4	mohammed@dataseedtech.com	$2a$10$/mHeLiVlxAVwvyjMr/i/8OR8JljZtKP4pf0nABgltm8lE8RD7tv0.	9a0d9a641eea27f4713455edf0cea2eam85q23bs	80310257-bc6f-4e99-b36b-556bdf18a091	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-12 09:32:47.318+00	2025-03-21 01:51:21.022+00
56f3d7b9-e5ca-46c8-a2cf-44402378d526	mahi1@gmail.com	$2a$10$iSVfCsV4hr/WcKbE0BSnwO25fY6TufU/aEuiONTsQ04n.5dBReGSe	1689eb6775d4ae88c7d73ff4b72d5eedm8g9p9a3	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-19 18:40:22.587+00	2025-03-21 02:11:06.128+00
5933f919-d2ba-490c-955b-4b267c44e1a0	checker@dataseedtech.com	$2a$10$mqWdpuXf5HT8JHPVI83wuOredLA7SsyAoS8vGSS9ojwEqWeA5fpDW	b0a94a8cb45f4d0b4b71c4f84e4ec0c3m8fxebba	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-19 12:55:56.614+00	2025-03-21 01:51:30.047+00
0894bc1a-b0e4-4980-be56-1bd961108382	asma1235@dataseedtech.com	$2a$10$QsT9hTX3jikpm3oADbgzb.n0UczeGv/vH24BHaH/ryoW0h2qE84Ey	9674cc89b0d45feb2db4e15fb44c2e91m8hdm11h	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-20 13:17:36.581+00	2025-03-21 02:25:49.022+00
c6aea3fe-1d9e-4ceb-b6e6-6a12036027e8	asma123@dataseedtech.com	$2a$10$imCGVRqPGxwdpTRMRlrNtuW/G7LsIjMZYGcctm8vK/sUEbJbsRcm.	c1f548a9f79b9b13c3f508cd82debfdam8h58xo1	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-20 09:23:28.73+00	2025-03-21 10:25:21.168+00
7108bfa9-2f0f-4a83-8d49-e07cfe47fac6	asma4@dataseedtech.com	$2a$10$j8.Y.61AP64ccK2msjo8j.vl3lrS93h4A5IT48xbf2Y4Cmey3n0yO	961a0d65e76b5f0e09d0572bb417016fm8hdml0x	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-20 13:18:02.481+00	2025-03-21 02:46:08.133+00
527cac62-3b7f-4181-aaa0-3312e6e919a7	sanagroup8@gmail.com	$2a$10$PHkgQP8iYPblAaCauvPHRORyinGjUEUuzx.A1yKuKwf4EgQSZ01aa	c6db7822c48319208d5e5fa0cd44b4edm8ikzq62	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 09:31:59.161+00	2025-03-21 09:31:59.161+00
7b84ef4a-4571-4a28-836f-dd3c64e36102	bhargavim0304@gmail.com	Vin@123#	2d059acee8dece147736d2ca05e36242m8ipe089	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 11:35:03.849+00	2025-03-21 11:39:29.429+00
0cf8b43e-3190-4049-822b-f2d217802856	bhargavim@ekfrazo.in	Bhuvi@123#	62376a3dc4e4f6d543fe235aeb2f892am8im4k4v	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 10:03:44.238+00	2025-03-21 11:40:35.14+00
c2780ad7-e34f-46f5-a2a7-e8cdf3eff417	test@gmail.com	$2a$10$FLP2mLrG/I.npfSW1Ga1je7Uamj8Xvq8DoZTVA/wL8JJw1k9J0iPm	fee661aeed069cd1c2d63824811f1da5m8j3pe8f	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 18:15:49.838+00	2025-03-21 18:15:49.838+00
90be33cb-9fcb-4d32-bc1c-27d4df9e5784	manoj@dataseedtech.com	$2a$10$09eyr5gbsBSpKMSZXFvn2.DLXgHwejiDmqX8p3apUz39ZxG5PTJDu	08d3973439f79fa164444844293af41em8mpyfn2	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	f	large_enterprise	\N	\N	2025-03-24 07:02:01.645+00	2025-03-24 07:03:14.627+00
38a1b275-7d55-416b-a2a4-033be2e24961	sanagroup01@gmail.com	$2a$10$u6P1vHAW9oAHZwcuLsrWUuzOzgTFjvUtZG2RqA9NkyUa0uzN2Qz.m	4d8a85bc46e04421da78006cfd9fd80dm8j3z4ko	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 18:23:23.879+00	2025-03-21 18:23:23.879+00
71ea31a5-9d8c-4a1e-b2a3-b8f075486a31	manoj@ekfrazo.in	$2a$10$R.MEJLPgqZiZXnOeG3s6.O6FVj9iGDK94SFMVhZhqjGLRMyLk4iIS	4f0caa034e0cc10a2628eadea44fd4c4m8iqeub6	bcbfc72e-54cc-4f67-9110-342c6570b062	aae5704d-f397-4cfb-8994-bb0823f50cd2	6d3bbdeb-6330-4e09-b661-847065296c9b	t	large_enterprise	\N	\N	2025-03-21 12:03:42.45+00	2025-03-24 05:06:25.407+00
\.


--
-- Data for Name: vkycs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vkycs (id, hashed_key, partner_order_id, order_id, attempt_number, reference_id, profile_id, v_kyc_link, v_kyc_link_expires, v_kyc_link_status, v_kyc_comments, v_kyc_doc_completion_date, device_info, profile_data, performed_by, resources_documents, resources_images, resources_videos, resources_text, location_info, first_name, reviewer_action, tasks, status, status_description, status_detail, created_by, updated_by, "createdAt", "updatedAt") FROM stdin;
10751060-2440-4d62-9cd9-225666cc1e19	4d7b3e4df27ef9d208587390d704c0c2m8exogsu	BMF1	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	1	BMF1-1742328963608	765ebda1-e63e-4c82-ae08-d27105d1977e	https://capture.kyc.idfy.com/v2/captures?t=_evuVRGTvGNt	2025-04-02 20:16:03+00	active	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	2025-03-18 20:16:04.109+00	2025-03-18 20:16:04.109+00
c78ec137-44a2-4a0d-a972-696f4021173f	ac962419afac2ca46f7c68bf389f66fbm8exsc5k	BMF1	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	2	BMF1-1742329144067	1f06965c-1efc-4cc1-be23-a0a5d34e521d	https://capture.kyc.idfy.com/v2/captures?t=mmMoiiWb4R02	2025-04-02 20:19:04+00	pending	\N	2025-03-18 20:19:04+00	{}	{"email": [], "notes": null, "purged_at": null, "created_at": "2025-03-18T20:19:04Z", "completed_at": "2025-03-18T20:19:04Z", "performed_by": [], "mobile_number": []}	[]	[]	[]	[]	[{"attr": "name", "tags": null, "type": null, "value": {"first_name": "Mohammed Tayibulla"}, "ref_id": "nil.nil.name.0.nil", "source": 0, "location": {}, "metadata": {}}]	\N	\N	\N	[{"key": "vkyc.assisted_vkyc", "tasks": [{"tasks": [{"key": "key_location", "tasks": [{"key": "key_resolve_location", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "bd205594-524e-49f2-8c96-732af0cb6658", "resources": [], "task_type": "resolve.location"}], "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "73d5290a-29bb-4b0e-95ec-20d8d320c673", "resources": [], "task_type": "data_capture.location"}]}, {"tasks": [{"key": "sec_key1", "result": {"manual_response": {"answer": "Mohammed Tayibulla", "question": "What is your name?"}, "automated_response": null}, "status": "pending", "task_id": "d9e5df6c-e188-402c-89c6-cb373d52ac35", "resources": [], "task_type": "verify.security_question"}, {"key": "sec_key2", "result": {"manual_response": {"answer": "8550895486", "question": "What is your contact number ?"}, "automated_response": null}, "status": "pending", "task_id": "30d49bb3-509b-4d55-8127-c239861d02a7", "resources": [], "task_type": "verify.security_question"}, {"key": "sec_key3", "result": {"manual_response": {"answer": "contact2tatyib@gmail.com", "question": "What is your email id?"}, "automated_response": null}, "status": "pending", "task_id": "e61cafef-68a0-4021-8982-473d57a9b7ab", "resources": [], "task_type": "verify.security_question"}]}, {"tasks": [{"key": "key13", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "77511660-0f18-4baf-a94f-9f3cce24df69", "resources": [], "task_type": "compare.face_compare"}, {"key": "key14", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "6c75199e-80de-47de-8757-0feae8473590", "resources": [], "task_type": "extract.ind_pan"}]}, {"tasks": [{"key": "key40", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "f02049ac-7e32-4002-8b9f-af8c49a0f052", "question": "Do the faces match?", "resources": [], "task_type": "verify.qa"}]}, {"tasks": [{"key": "key31", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "95f8d4a6-aeeb-4c5c-9e0c-02f3dc8d965f", "question": "Do the Names match?", "resources": [], "task_type": "verify.qa"}, {"key": "key33", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "355846ab-7f41-48d5-99c9-c0cbcce33ce2", "question": "Do the Date of Birth Match?", "resources": [], "task_type": "verify.qa"}]}], "result": {"manual_response": null, "automated_response": null}, "status": "in_progress", "task_id": "1ce9fc3b-caf4-4cd1-801e-282848474445", "resources": [], "task_type": "vkyc.assisted_vkyc"}]	capture_pending	{}	\N	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	2025-03-18 20:19:04.711+00	2025-03-18 20:20:36.193+00
9089d5dd-3e32-4e8f-beec-1536ef3cdbcb	41c092550ed5cb64af78110755c8c682m8eyq68j	BMF2	556b4fc6-a09a-41f8-807f-295f00e83030	1	BMF2-1742330722617	d86a0f8e-c510-40ba-8e27-8c0c8fcb6628	https://capture.kyc.idfy.com/v2/captures?t=5PWnX3Fx0B2h	2025-04-02 20:45:22+00	active	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	2025-03-18 20:45:23.346+00	2025-03-18 20:45:23.346+00
9f2bdcff-eee6-43ee-8a25-52f3cacff9cb	836c3cea1540b180fbc8a168bacf6fe9m8fgjfih	BMF1	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	3	BMF1-1742360641531	b1cc703c-d0f2-4686-a7cc-71a18b64591e	https://capture.kyc.idfy.com/v2/captures?t=i3c5jh3uc3H1	2025-04-03 05:04:01+00	active	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	2025-03-19 05:04:01.865+00	2025-03-19 05:04:01.865+00
3dc91a3e-addd-4920-a56b-20ee5377e235	c21fd6b9c6d13c646834b665d545fb4bm8fgy3m6	BMF1	378d8d8c-405c-4c8a-894d-4adb7b6b7b34	4	BMF1-1742361326051	c4084659-0630-4615-9319-4ffb5021b1ff	https://capture.kyc.idfy.com/v2/captures?t=fUvnWTqe75_8	2025-04-03 05:15:26+00	pending	\N	2025-03-19 05:15:26+00	{}	{"email": [], "notes": null, "purged_at": null, "created_at": "2025-03-19T05:15:26Z", "completed_at": "2025-03-19T05:15:26Z", "performed_by": [], "mobile_number": []}	[]	[]	[]	[]	[{"attr": "name", "tags": null, "type": null, "value": {"first_name": "Mohammed Tayibulla"}, "ref_id": "nil.nil.name.0.nil", "source": 0, "location": {}, "metadata": {}}]	\N	\N	\N	[{"key": "vkyc.assisted_vkyc", "tasks": [{"tasks": [{"key": "key_location", "tasks": [{"key": "key_resolve_location", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "6d17fb5c-7262-46a7-86d3-1e88935fb84f", "resources": [], "task_type": "resolve.location"}], "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "7949b2e5-6aa1-49b5-849c-0ba3125b624a", "resources": [], "task_type": "data_capture.location"}]}, {"tasks": [{"key": "sec_key1", "result": {"manual_response": {"answer": "8550895486", "question": "What is your contact number ?"}, "automated_response": null}, "status": "pending", "task_id": "0cb7b113-5e47-4543-b4a3-85e5c4a691c0", "resources": [], "task_type": "verify.security_question"}, {"key": "sec_key2", "result": {"manual_response": {"answer": "Mohammed Tayibulla", "question": "What is your name?"}, "automated_response": null}, "status": "pending", "task_id": "8eef6b76-26be-4c76-bd89-791cf9773214", "resources": [], "task_type": "verify.security_question"}, {"key": "sec_key3", "result": {"manual_response": {"answer": "contact2tatyib@gmail.com", "question": "What is your email id?"}, "automated_response": null}, "status": "pending", "task_id": "ff92f914-cc49-49bc-a363-ecd7d91f520d", "resources": [], "task_type": "verify.security_question"}]}, {"tasks": [{"key": "key13", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "af273cda-8e6a-4969-87ae-753adc268333", "resources": [], "task_type": "compare.face_compare"}, {"key": "key14", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "7b5fd91b-d6d3-43b7-8990-08fd9820253c", "resources": [], "task_type": "extract.ind_pan"}]}, {"tasks": [{"key": "key40", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "68b3a642-f3b8-4ce2-ba9c-f22b2db80c0f", "question": "Do the faces match?", "resources": [], "task_type": "verify.qa"}]}, {"tasks": [{"key": "key31", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "bf3a9882-023d-40a9-8ced-da5f8de16c91", "question": "Do the Names match?", "resources": [], "task_type": "verify.qa"}, {"key": "key33", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "e71d8496-4741-4924-9e2d-ff68bbf4968f", "question": "Do the Date of Birth Match?", "resources": [], "task_type": "verify.qa"}]}], "result": {"manual_response": null, "automated_response": null}, "status": "in_progress", "task_id": "ae7f6364-fc4b-4cd3-97c6-61890c81c0c3", "resources": [], "task_type": "vkyc.assisted_vkyc"}]	capture_pending	{}	\N	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	2025-03-19 05:15:26.286+00	2025-03-19 05:16:45.236+00
7fb9f137-946b-404c-b4bb-ce9df9782829	b32c7753fa9040d9727c066c7bc1e6bfm8fhixb2	NIUM2	4a863510-f876-4727-9ea7-ae0dfdbd22c4	1	NIUM2-1742362297638	4b56caca-33ad-4e4c-bd0b-abaf7f6872d5	https://capture.kyc.idfy.com/v2/captures?t=dZ2hTdQbOgpz	2025-04-03 05:31:37+00	pending	\N	2025-03-19 05:31:37+00	{}	{"email": [], "notes": null, "purged_at": null, "created_at": "2025-03-19T05:31:37Z", "completed_at": "2025-03-19T05:31:37Z", "performed_by": [], "mobile_number": []}	[]	[]	[]	[]	[{"attr": "name", "tags": null, "type": null, "value": {"first_name": "Mohammed Tayibulla"}, "ref_id": "nil.nil.name.0.nil", "source": 0, "location": {}, "metadata": {}}]	\N	\N	\N	[{"key": "vkyc.assisted_vkyc", "tasks": [{"tasks": [{"key": "key_location", "tasks": [{"key": "key_resolve_location", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "e7efdfd3-2327-4da6-99fc-30d6058e8994", "resources": [], "task_type": "resolve.location"}], "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "0ea37f71-f359-4342-a33f-e79324ecee72", "resources": [], "task_type": "data_capture.location"}]}, {"tasks": [{"key": "sec_key1", "result": {"manual_response": {"answer": "Mohammed Tayibulla", "question": "What is your name?"}, "automated_response": null}, "status": "pending", "task_id": "f4e10e8f-3657-4a7a-9359-bbce64da2730", "resources": [], "task_type": "verify.security_question"}, {"key": "sec_key2", "result": {"manual_response": {"answer": "8550895486", "question": "What is your contact number ?"}, "automated_response": null}, "status": "pending", "task_id": "55612108-b562-42b3-a55e-e875fe2032ba", "resources": [], "task_type": "verify.security_question"}, {"key": "sec_key3", "result": {"manual_response": {"answer": "contact2tayib@gmail.com", "question": "What is your email id?"}, "automated_response": null}, "status": "pending", "task_id": "c8fe3650-5163-44d6-b23e-4606e09b90c3", "resources": [], "task_type": "verify.security_question"}]}, {"tasks": [{"key": "key13", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "14df4e1f-fdd2-4351-a310-729931603668", "resources": [], "task_type": "compare.face_compare"}, {"key": "key14", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "1598a1e2-3f8d-4899-bc98-0a29d1f55cb3", "resources": [], "task_type": "extract.ind_pan"}]}, {"tasks": [{"key": "key40", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "5d475450-8aac-488e-9f3d-f5b8b11865ac", "question": "Do the faces match?", "resources": [], "task_type": "verify.qa"}]}, {"tasks": [{"key": "key31", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "1c86e6e7-3e92-4385-850c-f8a354986f8d", "question": "Do the Names match?", "resources": [], "task_type": "verify.qa"}, {"key": "key33", "result": {"manual_response": null, "automated_response": null}, "status": "pending", "task_id": "81fcabd4-2c0a-4d5d-8948-3b0e0c1bf9ca", "question": "Do the Date of Birth Match?", "resources": [], "task_type": "verify.qa"}]}], "result": {"manual_response": null, "automated_response": null}, "status": "in_progress", "task_id": "ba7d5622-054c-45cc-92e4-c1ccf38f77af", "resources": [], "task_type": "vkyc.assisted_vkyc"}]	capture_pending	{}	\N	62940e36-c368-43f8-b978-4111223a1cac	62940e36-c368-43f8-b978-4111223a1cac	2025-03-19 05:31:37.886+00	2025-03-19 05:32:03.027+00
\.


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

