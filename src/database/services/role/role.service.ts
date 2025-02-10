// import { Injectable, Inject } from '@nestjs/common';
// import { Role } from '../../models/role.model';
// import * as opentracing from 'opentracing';
// import { TracerService } from '../../../shared/services/tracer/tracer.service';

// @Injectable()
// export class RoleService {
//   constructor(
//     @Inject('USER_REPOSITORY')
//     private readonly roleRepository: typeof Role,
//     private tracerService: TracerService,
//   ) {}

//   async findAll(
//     parentSpan: opentracing.Span,
//     params: object,
//   ): Promise<Role[]> {
//     const span = this.tracerService.traceDBOperations(
//       parentSpan,
//       'findall',
//       Role.tableName,
//     );
//     try {
//       const result = await this.roleRepository.findAll(params);
//       this.tracerService.finishSpanWithResult(span, 200, null);
//       return result;
//     } catch (err) {
//       // Log the error before throwing
//       console.error('Error in RoleService.findAll:', err);
//       this.tracerService.finishSpanWithResult(span, null, true);
//       throw err;
//     }
//   }
// }

import { Injectable, Inject } from "@nestjs/common";
import { Role } from "../../models/role.model";

@Injectable()
export class RoleService {
  constructor(
    @Inject("ROLE_REPOSITORY")
    private readonly roleRepository: typeof Role
  ) {}

  async findAll(params: object): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.findAll(params);
      return roles;
    } catch (err) {
      console.error("Error in RoleService.findAll:", err); // Log detailed error
      throw new Error("Database fetch failed"); // Custom error message
    }
  }

}
