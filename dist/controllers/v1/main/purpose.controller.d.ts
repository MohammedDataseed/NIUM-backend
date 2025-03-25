import { PurposeService } from "../../../services/v1/purpose/purpose.service";
import { CreatePurposeDto, UpdatePurposeDto } from "src/dto/purpose.dto";
export declare class PurposeController {
    private readonly purposeService;
    constructor(purposeService: PurposeService);
    findAll(params: Record<string, any>): Promise<{
        purpose_type_id: string;
        purpose_name: string;
    }[]>;
    createPurposeType(createPurposeDto: CreatePurposeDto): Promise<{
        purpose_type_id: string;
        purpose_name: string;
    }>;
    update(purpose_type_id: string, updatePurposeDto: UpdatePurposeDto): Promise<{
        message: string;
    }>;
    delete(purpose_type_id: string): Promise<{
        message: string;
    }>;
}
