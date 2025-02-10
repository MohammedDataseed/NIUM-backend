import { Test, TestingModule } from "@nestjs/testing";
import { RoleService } from "./role.service";
import { SharedModule } from "../../../shared/shared.module";
import { TracerService } from "../../../shared/services/tracer/tracer.service";
import { repositoryProviders } from "../../providers/model-repository.provider";
import { databaseProviders } from "../../providers/database.provider";
import { ConfigService, ConfigModule } from "@nestjs/config";

describe("RoleService", () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        RoleService,
        TracerService,
        ...repositoryProviders,
        ...databaseProviders,
        ConfigService,
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
