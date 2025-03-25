export declare class CreateDocumentTypeDto {
    document_name: string;
    created_by: string;
    updated_by: string;
}
export declare class UpdateDocumentTypeDto {
    document_name?: string;
    is_active?: boolean;
    updated_by: string;
}
export declare class DocumentTypeDto {
    id: string;
    document_name: string;
    createdAt: Date;
    updatedAt: Date;
    created_by: string;
    updated_by: string;
}
