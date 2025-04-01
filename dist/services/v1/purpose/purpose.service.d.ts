import { Purpose } from "../../../database/models/purpose.model";
import * as opentracing from "opentracing";
import { CreatePurposeDto, UpdatePurposeDto } from "../../../dto/purpose.dto";
import { WhereOptions } from "sequelize";
export declare class PurposeService {
    private readonly purposeRepository;
    constructor(purposeRepository: typeof Purpose);
    findAll(span: opentracing.Span, params: WhereOptions<Purpose>): Promise<Purpose[]>;
    createPurpose(span: opentracing.Span, createPurposeDto: CreatePurposeDto): Promise<Purpose>;
    updatePurpose(span: opentracing.Span, hashed_key: string, updatePurposeDto: UpdatePurposeDto): Promise<Purpose>;
    findAllConfig(): Promise<{
        id: string;
        text: string;
    }[]>;
    deletePurposeType(span: opentracing.Span, hashed_key: string): Promise<void>;
}
