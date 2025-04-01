import { DocumentTypeService } from "../../../services/v1/document/documentType.service";
import { CreateDocumentTypeDto, UpdateDocumentTypeDto } from "src/dto/documentType.dto";
export declare class DocumentTypeController {
    private readonly documentTypeService;
    constructor(documentTypeService: DocumentTypeService);
    findAll(params: Record<string, any>): Promise<{
        document_type_id: string;
        document_name: string;
    }[]>;
    createDocumentType(createDocumentTypeDto: CreateDocumentTypeDto): Promise<{
        document_type_id: string;
        document_name: string;
    }>;
    update(document_type_id: string, updateDocumentTypeDto: UpdateDocumentTypeDto): Promise<{
        message: string;
    }>;
    delete(document_type_id: string): Promise<{
        message: string;
    }>;
}
