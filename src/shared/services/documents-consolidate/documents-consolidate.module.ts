//documents-consolidate.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PdfService } from './documents-consolidate.service';
import { PdfController } from './documents-consolidate.controller';

@Module({
  imports: [HttpModule],
  providers: [PdfService],
  controllers: [PdfController], // ✅ Use the actual controller
})
export class PdfModule {}
