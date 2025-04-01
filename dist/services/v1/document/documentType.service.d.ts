import { DocumentType } from "../../../database/models/documentType.model";
import * as opentracing from "opentracing";
import { CreateDocumentTypeDto, UpdateDocumentTypeDto } from "../../../dto/documentType.dto";
import { WhereOptions } from "sequelize";
export declare class DocumentTypeService {
    private readonly documentTypeRepository;
    constructor(documentTypeRepository: typeof DocumentType);
    findAll(span: opentracing.Span, params: WhereOptions<DocumentType>): Promise<DocumentType[]>;
    createDocumentType(span: opentracing.Span, createDocumentTypeDto: CreateDocumentTypeDto): Promise<DocumentType>;
    updateDocumentType(span: opentracing.Span, hashed_key: string, updateDocumentTypeDto: UpdateDocumentTypeDto): Promise<DocumentType>;
    findAllConfig(): Promise<{
        id: string;
        text: string;
    }[]>;
    deleteDocumentType(span: opentracing.Span, hashed_key: string): Promise<void>;
}
