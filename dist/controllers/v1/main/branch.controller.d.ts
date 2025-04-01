import { BranchService } from "../../../services/v1/branch/branch.service";
import { Branch } from "../../../database/models/branch.model";
import { CreateBranchDto } from "src/dto/branch.dto";
export declare class BranchController {
    private readonly branchService;
    constructor(branchService: BranchService);
    findAll(params: Record<string, any>): Promise<Branch[]>;
    createBranch(createBranchDto: CreateBranchDto): Promise<Branch>;
}
