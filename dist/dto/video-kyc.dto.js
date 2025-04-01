"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VkycResourcesDto = exports.VkycTextDto = exports.VkycVideosDto = exports.VkycImagesDto = exports.SyncProfileDto = exports.AddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddressDto {
}
exports.AddressDto = AddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of address (e.g., current)', example: 'current' }),
    __metadata("design:type", String)
], AddressDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'House number', example: '' }),
    __metadata("design:type", String)
], AddressDto.prototype, "house_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full street address',
        example: '26/1, P & T drivers colony,near ammar school, DJ halli, Bengaluru-560045'
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "street_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'District name', example: 'Bengaluru' }),
    __metadata("design:type", String)
], AddressDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Postal code', example: '560045' }),
    __metadata("design:type", String)
], AddressDto.prototype, "pincode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City name', example: 'Bengaluru' }),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State name', example: 'Karnataka' }),
    __metadata("design:type", String)
], AddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country name', example: 'India' }),
    __metadata("design:type", String)
], AddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country code', example: 'ind' }),
    __metadata("design:type", String)
], AddressDto.prototype, "country_code", void 0);
class SyncProfileDto {
}
exports.SyncProfileDto = SyncProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique reference identifier',
        example: '677',
        required: true
    }),
    __metadata("design:type", String)
], SyncProfileDto.prototype, "reference_id", void 0);
class VkycImagesDto {
}
exports.VkycImagesDto = VkycImagesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to the selfie image', example: 'https://storage.googleapis.com/...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VkycImagesDto.prototype, "selfie", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to the PAN image', example: 'https://storage.googleapis.com/...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VkycImagesDto.prototype, "pan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of URLs to other images',
        example: ['https://storage.googleapis.com/...'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], VkycImagesDto.prototype, "others", void 0);
class VkycVideosDto {
}
exports.VkycVideosDto = VkycVideosDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to the agent video', example: 'https://storage.googleapis.com/...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VkycVideosDto.prototype, "agent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to the customer video', example: 'https://storage.googleapis.com/...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VkycVideosDto.prototype, "customer", void 0);
class VkycTextDto {
}
exports.VkycTextDto = VkycTextDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location details',
        example: { accuracy: 13988.53, latitude: 13.06754, longitude: 77.57483 },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], VkycTextDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the individual', example: 'Mohammed Tayibulla' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VkycTextDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of birth', example: null }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VkycTextDto.prototype, "dob", void 0);
class VkycResourcesDto {
}
exports.VkycResourcesDto = VkycResourcesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique partner order ID', example: 'NIUMTEST1' }),
    __metadata("design:type", String)
], VkycResourcesDto.prototype, "partner_order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document resources', type: [String], required: false }),
    __metadata("design:type", Array)
], VkycResourcesDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image resources', type: Object, required: false }),
    __metadata("design:type", Object)
], VkycResourcesDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Video resources', type: Object, required: false }),
    __metadata("design:type", Object)
], VkycResourcesDto.prototype, "videos", void 0);
//# sourceMappingURL=video-kyc.dto.js.map