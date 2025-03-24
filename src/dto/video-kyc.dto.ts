// video-kyc.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    description: 'Type of address (e.g., current)',
    example: 'current',
  })
  type: string;

  @ApiProperty({ description: 'House number', example: '' })
  house_number: string;

  @ApiProperty({
    description: 'Full street address',
    example:
      '26/1, P & T drivers colony,near ammar school, DJ halli, Bengaluru-560045',
  })
  street_address: string;

  @ApiProperty({ description: 'District name', example: 'Bengaluru' })
  district: string;

  @ApiProperty({ description: 'Postal code', example: '560045' })
  pincode: string;

  @ApiProperty({ description: 'City name', example: 'Bengaluru' })
  city: string;

  @ApiProperty({ description: 'State name', example: 'Karnataka' })
  state: string;

  @ApiProperty({ description: 'Country name', example: 'India' })
  country: string;

  @ApiProperty({ description: 'Country code', example: 'ind' })
  country_code: string;
}

export class SyncProfileDto {
  @ApiProperty({
    description: 'Unique reference identifier',
    example: '677',
    required: true,
  })
  reference_id: string;
}
// export class SyncProfileDto {
//   @ApiProperty({ description: 'Unique reference identifier', example: '12345' })
//   reference_id: string;

//   @ApiProperty({
//     description: 'Configuration object',
//     type: 'object',
//     properties: {
//       id: { type: 'string', description: 'Configuration ID', example: 'c480f12f-c209-4d88-ad7c-c1c70a783149' },
//       overrides: { type: 'object', description: 'Configuration overrides' },
//     },
//   })
//   config: {
//     id: string;
//     overrides: Record<string, any>;
//   };

//   @ApiProperty({
//     description: 'Profile data',
//     type: 'object',
//     properties: {
//       addresses: {
//         type: 'array',
//         items: { $ref: '#/components/schemas/AddressDto' },
//       },
//     },
//   })
//   data: {
//     addresses: AddressDto[];
//   };
// }
