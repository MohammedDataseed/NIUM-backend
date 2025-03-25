import { PartnerService } from "../../../services/v1/partner/partner.service";
import { CreatePartnerDto, UpdatePartnerDto, PartnerResponseDto } from "../../../dto/partner.dto";
import { MailerService } from "src/shared/services/mailer/mailer.service";
export declare class PartnerController {
    private readonly partnerService;
    private readonly mailService;
    constructor(partnerService: PartnerService, mailService: MailerService);
    findAll(): Promise<PartnerResponseDto[]>;
    findByHashedKey(hashed_key: string): Promise<PartnerResponseDto>;
    create(createPartnerDto: CreatePartnerDto): Promise<PartnerResponseDto>;
    update(hashed_key: string, updatePartnerDto: UpdatePartnerDto): Promise<PartnerResponseDto>;
    delete(hashed_key: string): Promise<{
        message: string;
    }>;
}
