// import { Controller, Get, Query } from '@nestjs/common';
// import { RoleService } from '../../../database/services/role/role.service';
// import { Role } from '../../../database/models/role.model';
// import * as opentracing from 'opentracing';
// import { TracerService } from '../../../shared/services/tracer/tracer.service';

// @Controller('roles')
// export class RoleController {
//   constructor(private readonly roleService: RoleService) {}

//   @Get()
//   async findAll(@Query() params: object): Promise<Role[]> {
//     const tracer = opentracing.globalTracer();
//     const span = tracer.startSpan('find-all-roles-request');
//     const result = await this.roleService.findAll(span, params);
//     span.finish();
//     return result;
//   }
// }


// import { Controller, Get,Post,Body, Query } from '@nestjs/common';
// import { RoleService } from '../../../database/services/role/role.service';
// import { Role } from 'src/database/models/role.model';
// @Controller('roles')
// export class RoleController {
//   constructor(private readonly roleService: RoleService) {}

//   @Get()
//   async findAll(@Query() params: object): Promise<any> {
//     try {
//       const result = await this.roleService.findAll(params);
//       return result;
//     } catch (err) {
//       console.error('Error fetching roles:', err);
//       throw new Error('Something went wrong');  // You can customize this error message
//     }
//   }

//   @Post()
//   async create(@Body() roleData: Partial<Role>) {
//     return await this.roleService.createRole(roleData);
//   }
// }

import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { RoleService } from "../../../database/services/role/role.service";
import { Role } from "src/database/models/role.model";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Roles") // This groups all the endpoints under the 'Roles' tag in Swagger UI
@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Get()
  async findAll(@Query() params: object): Promise<any> {
    try {
      const result = await this.roleService.findAll(params);
      return result;
    } catch (err) {
      console.error('Error fetching roles:', err);
      throw new Error('Something went wrong');  // You can customize this error message
    }
  }

}
