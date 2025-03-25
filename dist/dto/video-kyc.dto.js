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
exports.SyncProfileDto = exports.AddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
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
//# sourceMappingURL=video-kyc.dto.js.map