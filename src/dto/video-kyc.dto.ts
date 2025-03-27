// video-kyc.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject, IsArray } from 'class-validator';


export class AddressDto {
  @ApiProperty({ description: 'Type of address (e.g., current)', example: 'current' })
  type: string;

  @ApiProperty({ description: 'House number', example: '' })
  house_number: string;

  @ApiProperty({ 
    description: 'Full street address', 
    example: '26/1, P & T drivers colony,near ammar school, DJ halli, Bengaluru-560045' 
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
    required: true 
  })
  reference_id: string;
}

export class VkycImagesDto {
  @ApiProperty({ description: 'URL to the selfie image', example: 'https://storage.googleapis.com/...' })
  @IsOptional()
  @IsString()
  selfie?: string;

  @ApiProperty({ description: 'URL to the PAN image', example: 'https://storage.googleapis.com/...' })
  @IsOptional()
  @IsString()
  pan?: string;

  @ApiProperty({
    description: 'Array of URLs to other images',
    example: ['https://storage.googleapis.com/...'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  others?: string[];
}

export class VkycVideosDto {
  @ApiProperty({ description: 'URL to the agent video', example: 'https://storage.googleapis.com/...' })
  @IsOptional()
  @IsString()
  agent?: string;

  @ApiProperty({ description: 'URL to the customer video', example: 'https://storage.googleapis.com/...' })
  @IsOptional()
  @IsString()
  customer?: string;
}

export class VkycTextDto {
  @ApiProperty({
    description: 'Location details',
    example: { accuracy: 13988.53, latitude: 13.06754, longitude: 77.57483 },
  })
  @IsOptional()
  @IsObject()
  location?: object;

  @ApiProperty({ description: 'Name of the individual', example: 'Mohammed Tayibulla' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Date of birth', example: null })
  @IsOptional()
  @IsString()
  dob?: string | null;
}

export class VkycResourcesDto {
  @ApiProperty({ description: 'Unique partner order ID', example: 'NIUMTEST1' })
  partner_order_id: string;

  @ApiProperty({ description: 'Document resources', type: [String], required: false })
  documents?: string[];

  @ApiProperty({ description: 'Image resources', type: Object, required: false })
  images?: { selfie?: string; pan?: string; others?: string[] };

  @ApiProperty({ description: 'Video resources', type: Object, required: false })
  videos?: { agent?: string; customer?: string };
}

// export class VkycResourcesDto {
//   @ApiProperty({ description: 'Unique partner order ID', example: 'NIUMTEST1' })
//   partner_order_id: string;

//   @ApiProperty({ description: 'URL to the profile report document', example: 'https://storage.googleapis.com/...' })
//   @IsOptional()
//   @IsString()
//   documents?: string;

//   @ApiProperty({ description: 'Image resources', type: VkycImagesDto })
//   @IsOptional()
//   @IsObject()
//   images?: VkycImagesDto;

//   @ApiProperty({ description: 'Video resources', type: VkycVideosDto })
//   @IsOptional()
//   @IsObject()
//   videos?: VkycVideosDto;

//   @ApiProperty({ description: 'Text metadata', type: VkycTextDto })
//   @IsOptional()
//   @IsObject()
//   text?: VkycTextDto;
// }