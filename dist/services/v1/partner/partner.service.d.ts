import { Partner } from '../../../database/models/partner.model';
import * as opentracing from 'opentracing';
import { CreatePartnerDto, UpdatePartnerDto, PartnerResponseDto } from '../../../dto/partner.dto';
import { JwtService } from '@nestjs/jwt';
export declare class PartnerService {
    private readonly partnerRepository;
    private readonly jwtService;
    constructor(partnerRepository: typeof Partner, jwtService: JwtService);
    findAllPartners(span: opentracing.Span): Promise<PartnerResponseDto[]>;
    findPartnerById(span: opentracing.Span, id: number): Promise<PartnerResponseDto>;
    findPartnerByHashedKey(span: opentracing.Span, hashed_key: string): Promise<PartnerResponseDto>;
    private generateUniqueApiKey;
    private generateHashedKey;
    createPartner(span: opentracing.Span, createPartnerDto: CreatePartnerDto): Promise<PartnerResponseDto>;
    updatePartnerByHashedKey(span: opentracing.Span, hashed_key: string, updatePartnerDto: UpdatePartnerDto): Promise<PartnerResponseDto>;
    deletePartnerByHashedKey(span: opentracing.Span, hashed_key: string): Promise<void>;
    deletePartnerById(span: opentracing.Span, id: number): Promise<void>;
    private toResponseDto;
}
