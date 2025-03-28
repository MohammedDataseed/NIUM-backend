import { bank_account } from "../models/bank_account.model";
import { Branch } from "../models/branch.model";
import { Documents } from "../models/documents.model";
import { DocumentMaster } from "../models/document_master.model";
import { DocumentRequirements } from "../models/document_requirements.model";
import { Partner } from "../models/partner.model";
import { Products } from "../models/products.model";
import { Purpose } from "../models/purpose.model";
import { Role } from "../models/role.model";
import { User } from "../models/user.model";
import { Order } from "../models/order.model";
import { transaction_type } from "../models/transaction_type.model";
import { ESign } from "../models/esign.model";
import { Vkyc } from "../models/vkyc.model";
export declare const repositoryProviders: ({
    provide: string;
    useValue: typeof User;
} | {
    provide: string;
    useValue: typeof Role;
} | {
    provide: string;
    useValue: typeof bank_account;
} | {
    provide: string;
    useValue: typeof Branch;
} | {
    provide: string;
    useValue: typeof Documents;
} | {
    provide: string;
    useValue: typeof DocumentMaster;
} | {
    provide: string;
    useValue: typeof DocumentRequirements;
} | {
    provide: string;
    useValue: typeof Partner;
} | {
    provide: string;
    useValue: typeof Products;
} | {
    provide: string;
    useValue: typeof Purpose;
} | {
    provide: string;
    useValue: typeof transaction_type;
} | {
    provide: string;
    useValue: typeof Order;
} | {
    provide: string;
    useValue: typeof ESign;
} | {
    provide: string;
    useValue: typeof Vkyc;
})[];
