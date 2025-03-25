import { Branch } from "../../../database/models/branch.model";
import * as opentracing from "opentracing";
import { CreateBranchDto } from "../../../dto/branch.dto";
import { WhereOptions } from "sequelize";
export declare class BranchService {
    private readonly branchRepository;
    constructor(branchRepository: typeof Branch);
    findAll(span: opentracing.Span, params: WhereOptions<Branch>): Promise<Branch[]>;
    createBranch(span: opentracing.Span, createBranchDto: CreateBranchDto): Promise<Branch>;
}
