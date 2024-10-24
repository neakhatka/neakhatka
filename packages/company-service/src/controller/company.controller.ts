import {
  companyCreateSchema,
  companyUpdateSchema,
} from "../database/repository/@types/company.repo.type";
import CompanyService from "../service/company-servive";
import ROUTE_PATHS from "../routes/v1/company.route";
import {
  Body,
  Controller,
  Post,
  Get,
  Route,
  Put,
  SuccessResponse,
  Delete,
  Middlewares,
  Request,
  UploadedFile,
  FormField,
} from "tsoa";
import { StatusCode } from "../util/consts/status.code";
import { authorize } from "../middleware/auth_middleware";
// import { logger } from "../util/logger";

interface AuthRequest extends Request {
  employer?: {
    id: string;
  };
}

// ===================================================
// ============= COMPANY RESOURCE ====================
// ===================================================

@Route("v1/companies")
export class CompanyController extends Controller {
  @SuccessResponse(StatusCode.Found, "Data Found")
  @Get(ROUTE_PATHS.COMPANY.GETALL)
  public async getAll(): Promise<{ message: string; data: any }> {
    try {
      const companyService = new CompanyService();
      const result = await companyService.getAll();
      return { message: "Success retrieved!", data: result };
    } catch (error: any) {
      throw {
        status: StatusCode.NotFound,
        message: "Can not found",
        detail: error.message,
      };
    }
  }
  @Middlewares(authorize(["employer"]))
  @Get(ROUTE_PATHS.COMPANY.GET_BY_ID)
  @SuccessResponse(StatusCode.OK, "Successfully retrieved profile")
  public async getById(
    // @Path() id: string,
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      const authReq = req as unknown as AuthRequest;
      const userId = authReq!.employer!.id;
      console.log("Auth ID:", userId);
      const companyService = new CompanyService();
      const company = await companyService.findByAuthId({ userId });
      const result = await companyService.findById({ id: company._id });
      if (!result) {
        return { message: "Could not find", data: null };
      }
      return { message: "Company had found ", data: result };
    } catch (error: any) {
      console.log(error);
      throw {
        status: StatusCode.NotFound,
        message: "Can not found with that id",
        detail: error.message,
      };
    }
  }
  // @Middlewares(authorize(["employer"]))
  @SuccessResponse(StatusCode.Created, "Created")
  @Post(ROUTE_PATHS.COMPANY.CREATE)
  public async createCompany(
    @Body() requestBody: companyCreateSchema
  ): Promise<any> {
    try {
      console.log("Hello");
      console.log("data:", requestBody);
      const companyService = new CompanyService();
      const result = await companyService.create(requestBody);
      console.log("hello");
      return result;
    } catch (error: any) {
      console.log(error);
      throw {
        status: StatusCode.BadRequest,
        message: "Can not create that User!",
        detail: error.message,
      };
    }
  }
  @Middlewares(authorize(["employer"]))
  @SuccessResponse(StatusCode.Found, "Successfully Update profile")
  @Put(ROUTE_PATHS.COMPANY.UPDATE)
  public async updateCompany(
    @Request() req: Express.Request,
    @FormField() companyname: string,
    @FormField() contactphone: string,
    @FormField() websiteLink: string,
    @FormField() location: string,
    @FormField() contactemail: string,
    @FormField() contactperson: string,
    @FormField() numberOfemployees: string,
    @FormField() address: string,
    @FormField() companydescription: string,
    @UploadedFile() logo?: Express.Multer.File
  ): Promise<{ message: string; data: any }> {
    console.log(
      "Data:",
      companyname,
      contactemail,
      contactperson,
      numberOfemployees,
      address,
      contactphone,
      location,
      websiteLink,
      contactemail,
      contactperson,
      companydescription,
      logo
    );
    try {
      const update: companyUpdateSchema = {
        logo: logo ? Buffer.from(logo.buffer) : undefined,
        companyname,
        contactphone,
        websiteLink,
        location,
        contactemail,
        contactperson,
        numberOfemployees,
        address,
        companydescription,
      };
      const authReq = req as unknown as AuthRequest;
      const userId = authReq!.employer!.id;
      console.log("Auth ID:", userId);
      const companyService = new CompanyService();
      const company = await companyService.findByAuthId({ userId });
      const result = await companyService.update({ id: company._id, update });
      if (!result) {
        this.setStatus(404);
        return { message: "Profile not found", data: null };
      }
      return { message: "Profile updated", data: result };
    } catch (error: any) {
      this.setStatus(500);
      return { message: error.message || "Internal Server Error", data: null };
    }
  }
  @Middlewares(authorize(["employer"]))
  @SuccessResponse(StatusCode.NoContent, "Successfully Delete  profile")
  @Delete(ROUTE_PATHS.COMPANY.DELETE)
  public async deleteCompany(
    @Request() req: Express.Request
  ): Promise<{ message: string }> {
    try {
      const authReq = req as unknown as AuthRequest;
      const userId = authReq!.employer!.id;
      console.log("Auth ID:", userId);
      const companyService = new CompanyService();
      const company = await companyService.findByAuthId({ userId });
      if (company) {
        await companyService.delete({ id: company._id });
        return { message: "profile deleted" };
      } else {
        return { message: "profile not found" };
      }
    } catch (error: any) {
      throw {
        status: StatusCode.NoContent,
        message: "Can not delete that company ",
        detail: error.message,
      };
    }
  }
}
