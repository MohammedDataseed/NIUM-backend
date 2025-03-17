import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { BankAccountService } from "../../../services/v1/bank_account/bank_account.service";
import { bank_account } from "../../../database/models/bank_account.model";
import * as opentracing from "opentracing";
import { WhereOptions } from "sequelize";
import { CreateBankAccountDto } from "src/dto/bank_account.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { JwtGuard } from "../../../auth/jwt.guard";

@ApiTags("Bank Accounts")
@Controller("bank-accounts")
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  /**
   * Get all bank accounts with optional filters.
   */
  ////@UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: "Get all bank accounts with optional filtering" })
  @ApiResponse({
    status: 200,
    description: "List of bank accounts",
    type: [bank_account],
  })
  async findAll(@Query() params: Record<string, any>): Promise<bank_account[]> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("find-all-bank-accounts-request");

    try {
      span.log({ event: "query-start", filters: params });

      const whereCondition: WhereOptions<bank_account> =
        params as WhereOptions<bank_account>;
      const accounts = await this.bankAccountService.findAll(
        span,
        whereCondition
      );

      span.log({ event: "query-success", count: accounts.length });

      return accounts;
    } catch (error) {
      span.setTag("error", true);
      span.log({ event: "query-failed", error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }

  /**
   * Get a single bank account by ID.
   */
  ////@UseGuards(JwtGuard)
  @Get(":id")
  @ApiOperation({ summary: "Get a bank account by ID" })
  @ApiParam({ name: "id", description: "Bank Account ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Bank Account details",
    type: bank_account,
  })
  @ApiResponse({ status: 404, description: "Bank Account not found" })
  async findOne(@Param("id") id: string): Promise<bank_account> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("find-bank-account-by-id-request");

    try {
      span.log({ event: "searching-bank-account", accountId: id });

      const account = await this.bankAccountService.findOne(span, id);

      span.log({ event: "bank-account-found", accountId: id });

      return account;
    } catch (error) {
      span.setTag("error", true);
      span.log({ event: "bank-account-not-found", error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }

  /**
   * Create a new bank account.
   */
  ////@UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: "Create a new bank account" })
  @ApiResponse({
    status: 201,
    description: "Bank account successfully created",
    type: bank_account,
  })
  @ApiResponse({ status: 400, description: "Invalid data provided" })
  async createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto
  ): Promise<bank_account> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("create-bank-account-request");

    try {
      span.log({
        event: "creating-bank-account",
        account_holder_name: createBankAccountDto.account_holder_name,
      });

      const account = await this.bankAccountService.createBankAccount(
        span,
        createBankAccountDto
      );

      span.log({ event: "bank-account-created", accountId: account.id });

      return account;
    } catch (error) {
      span.setTag("error", true);
      span.log({ event: "creation-failed", error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }

  /**
   * Update a bank account.
   */
  ////@UseGuards(JwtGuard)
  @Put(":id")
  @ApiOperation({ summary: "Update an existing bank account" })
  @ApiParam({ name: "id", description: "Bank Account ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Bank account successfully updated",
    type: bank_account,
  })
  @ApiResponse({ status: 404, description: "Bank account not found" })
  async updateBankAccount(
    @Param("id") id: string,
    @Body() updateBankAccountDto: Partial<CreateBankAccountDto>
  ): Promise<bank_account> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("update-bank-account-request");

    try {
      span.log({ event: "updating-bank-account", accountId: id });

      const account = await this.bankAccountService.updateBankAccount(
        span,
        id,
        updateBankAccountDto
      );

      span.log({ event: "bank-account-updated", accountId: account.id });

      return account;
    } catch (error) {
      span.setTag("error", true);
      span.log({ event: "update-failed", error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }

  /**
   * Delete a bank account.
   */
  ////@UseGuards(JwtGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Delete a bank account" })
  @ApiParam({ name: "id", description: "Bank Account ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Bank account successfully deleted",
  })
  @ApiResponse({ status: 404, description: "Bank account not found" })
  async deleteBankAccount(
    @Param("id") id: string
  ): Promise<{ message: string }> {
    const tracer = opentracing.globalTracer();
    const span = tracer.startSpan("delete-bank-account-request");

    try {
      span.log({ event: "deleting-bank-account", accountId: id });

      await this.bankAccountService.deleteBankAccount(span, id);

      span.log({ event: "bank-account-deleted", accountId: id });

      return { message: "Bank account successfully deleted" };
    } catch (error) {
      span.setTag("error", true);
      span.log({ event: "delete-failed", error: error.message });
      throw error;
    } finally {
      span.finish();
    }
  }
}
