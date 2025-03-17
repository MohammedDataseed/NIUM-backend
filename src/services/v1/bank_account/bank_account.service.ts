import { 
    Injectable, 
    Inject, 
    ConflictException, 
    NotFoundException 
  } from "@nestjs/common";
  import { bank_account } from "src/database/models/bank_account.model";
  import * as opentracing from "opentracing";
  import { CreateBankAccountDto } from "../../../dto/bank_account.dto";
  import { WhereOptions } from "sequelize";
  
  @Injectable()
  export class BankAccountService {
    constructor(
      @Inject("BANK_ACCOUNT_REPOSITORY")
      private readonly bankAccountRepository: typeof bank_account
    ) {}
  
    /**
     * Get all bank accounts with optional filters.
     */
    async findAll(span: opentracing.Span, params: WhereOptions<bank_account>): Promise<bank_account[]> {
      const childSpan = span.tracer().startSpan("find-all-bank-accounts", { childOf: span });
  
      try {
        return await this.bankAccountRepository.findAll({ where: params });
      } finally {
        childSpan.finish();
      }
    }
  
    /**
     * Get a single bank account by ID.
     */
    async findOne(span: opentracing.Span, id: string): Promise<bank_account> {
      const childSpan = span.tracer().startSpan("find-bank-account", { childOf: span });
  
      try {
        const account = await this.bankAccountRepository.findByPk(id);
        if (!account) {
          throw new NotFoundException("Bank account not found");
        }
        return account;
      } finally {
        childSpan.finish();
      }
    }
  
    /**
     * Create a new bank account.
     */

    async createBankAccount(
        span: opentracing.Span,
        createBankAccountDto: CreateBankAccountDto
      ): Promise<bank_account> {
        const childSpan = span.tracer().startSpan("create-bank-account", { childOf: span });
      
        try {
          const existingAccount = await this.bankAccountRepository.findOne({
            where: { account_number: createBankAccountDto.account_number },
          });
      
          if (existingAccount) {
            throw new ConflictException("Bank account already exists");
          }
      
          const account = this.bankAccountRepository.build({
            ...createBankAccountDto,
            hashed_key: this.generateHashedKey(createBankAccountDto.account_number), // Generate a hashed key if needed
          });
      
          await account.save();
          return account;
        } finally {
          childSpan.finish();
        }
      }
      
    /**
     * Update a bank account.
     */
    async updateBankAccount(
      span: opentracing.Span,
      id: string,
      updateBankAccountDto: Partial<CreateBankAccountDto>
    ): Promise<bank_account> {
      const childSpan = span.tracer().startSpan("update-bank-account", { childOf: span });
  
      try {
        const account = await this.bankAccountRepository.findByPk(id);
        if (!account) {
          throw new NotFoundException("Bank account not found");
        }
  
        await account.update(updateBankAccountDto);
        return account;
      } finally {
        childSpan.finish();
      }
    }
  
    /**
     * Delete a bank account.
     */
    async deleteBankAccount(span: opentracing.Span, id: string): Promise<void> {
      const childSpan = span.tracer().startSpan("delete-bank-account", { childOf: span });
  
      try {
        const account = await this.bankAccountRepository.findByPk(id);
        if (!account) {
          throw new NotFoundException("Bank account not found");
        }
  
        await account.destroy();
      } finally {
        childSpan.finish();
      }
    }


    private generateHashedKey(accountNumber: string): string {
        const crypto = require("crypto");
        return crypto.createHash("sha256").update(accountNumber).digest("hex");
      }
      
  }
  
