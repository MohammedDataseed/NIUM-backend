import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PdfService } from './documents-consolidate.service';

@Module({
  imports: [HttpModule],
  providers: [PdfService],
})
export class PdfModule {}
