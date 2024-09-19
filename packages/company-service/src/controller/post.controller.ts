import {
  Get,
  Route,
  SuccessResponse,
  Controller,
  Path,
  Middlewares,
  Post,
  Body,
  Request,
  Put,
  Delete,
} from "tsoa";

import { StatusCode } from "../util/consts/status.code";
import PostService from "../service/post-service";
import ROUTE_PATHS from "../routes/v1/company.route";
import { AuthRequest, authorize } from "../middleware/auth_middleware";
import {
  postcreateschema,
  postupdateschema,
} from "../database/repository/@types/post.repo.type";
import CompanyService from "../service/company-servive";
import { logger } from "../util/logger";
@Route("v1/jobs")
export class PostJob extends Controller {
  @Get(ROUTE_PATHS.POSTING.GET_ALL_POST)
  @SuccessResponse(StatusCode.Found, "Data Found")
  public async GetAllPosts(): Promise<{ message: string; data: any }> {
    try {
      console.log("GetAllPosts method called");
      const postservice = new PostService();
      const post = await postservice.GetAllPost();
      console.log("Posts retrieved:", post);
      return { message: "Success get all post", data: post };
    } catch (error: any) {
      console.error("Error in GetAllPosts:", error);
      throw {
        status: StatusCode.NotFound,
        message: "Can not found ",
        detail: error.message,
      };
    }
  }

  // @Middlewares(authorize(["employer"]))
  // @Get(ROUTE_PATHS.POSTING.GET_BY_ID)
  // @SuccessResponse(StatusCode.Found, "Post Card Found")
  // public async GetPost(
  //   // @Path() companyid: string,
  //   @Path() id: string,
  //   @Request() req: Express.Request
  // ): Promise<{ message: string; data: any }> {
  //   try {
  //     const userId = (req as AuthRequest).employer.id;
  //     console.log("Auth ID:", userId);
  //     const companyservice = new CompanyService();
  //     // FIND COMPANY WITH AUTH ID
  //     const company = await companyservice.FindByAuthId({ userId });
  //     // FIND COMPANYID IN JOB ()
  //     const postservice = new PostService();
  //     const companyId = await postservice.FindByCompanyId(company._id);
  //     if (companyId) {
  //       const getcard = await postservice.FindById({ id });
  //       return { message: "Found!", data: getcard };
  //     } else {
  //       return { message: "Not Found!", data: null };
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @Middlewares(authorize(["employer"]))
  @Get(ROUTE_PATHS.POSTING.GET_BY_ID)
  @SuccessResponse(StatusCode.Found, "Post Card Found")
  public async GetPost(
    @Path() id: string
  ): Promise<{ message: string; data: any }> {
    try {
      const postservice = new PostService();
      const post = await postservice.FindById({ id });

      return { message: "Success", data: post };
    } catch (error) {
      throw error;
    }
  }

  @Middlewares(authorize(["employer"]))
  @Post(ROUTE_PATHS.POSTING.POST)
  @SuccessResponse(StatusCode.OK, "Posting Successfully")
  public async CreatePost(
    @Body() requestBody: postcreateschema,
    // @Path() companyid: string,
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      console.log("Received request body:", requestBody); // Log request body

      const userId = (req as AuthRequest).employer.id;
      console.log("Authenticated employer ID:", userId); // Log authenticated user ID
      // console.log("Auth ID:", userId);
      const companyservice = new CompanyService();
      const company = await companyservice.FindByAuthId({ userId });
      const companyId = company?.id;
      // console.log("company ID:", companyid);
      // Check if the provided companyid matches the authenticated user's companyId
      if (companyId) {
        const postData = { companyId, ...requestBody };
        const postservice = new PostService();
        const post = await postservice.Create(postData);
        console.log("post Data", post);
        this.setStatus(StatusCode.OK); // Set status code to 200
        return { message: "Success post job", data: post };
      } else {
        this.setStatus(StatusCode.Forbidden); // Set status code to 403
        return {
          // status: 403,
          message: "You are not authorized to post for this company",
          data: null,
        };
      }
    } catch (error) {
      console.log("post error:", error);
      throw error;
    }
  }
  @Middlewares(authorize(["employer"]))
  @Put(ROUTE_PATHS.POSTING.UPDATE)
  @SuccessResponse(StatusCode.OK, "Update Successfully")
  public async UpdatePost(
    @Path() id: string,
    @Body() update: postupdateschema,
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      const userId = (req as AuthRequest).employer.id;
      console.log("Auth ID:", userId);
      const companyservice = new CompanyService();
      // FIND COMPANY WITH AUTH ID
      const company = await companyservice.FindByAuthId({ userId });
      // FIND COMPANYID IN JOB ()
      const postservice = new PostService();
      const companyId = await postservice.FindByCompanyId(company._id);
      if (companyId) {
        const postservice = new PostService();
        const updatepost = await postservice.UpdatePost({ id, update });
        return { message: "Update successfully", data: updatepost };
      } else {
        this.setStatus(404); // Set HTTP status code to 404
        return { message: "Job  Not Found", data: null };
      }
    } catch (error: any) {
      console.log(error);
      this.setStatus(500); // Set HTTP status code to 500 for server errors
      return { message: error.message || "Internal Server Error", data: null };
    }
  }
  @Middlewares(authorize(["employer"]))
  @Delete(ROUTE_PATHS.POSTING.DELETE)
  @SuccessResponse(StatusCode.OK, "Delete Successfully")
  public async DeletePost(
    // @Path() companyid: string,
    @Path() id: string,
    @Request() req: Express.Request
  ): Promise<{ message: string; data: string[] }> {
    try {
      const userId = (req as AuthRequest).employer.id;
      console.log("Auth ID:", userId);
      const companyservice = new CompanyService();
      // FIND COMPANY WITH AUTH ID
      const company = await companyservice.FindByAuthId({ userId });
      // FIND COMPANYID IN JOB ()
      const postservice = new PostService();
      const companydetail = await postservice.FindByCompanyId(company._id);
      if (companydetail) {
        await postservice.DeletePost(id);
        return { message: "Delete successfully", data: [] };
      } else {
        return { message: "Delete false", data: [] };
      }
    } catch (error: any) {
      logger.error(`CompanyController DeletePost() method error: ${error}`);
      throw error;
    }
  }
  @Middlewares(authorize(["employer"]))
  @Get(ROUTE_PATHS.POSTING.GET_JOBS_BY_CID)
  @SuccessResponse(StatusCode.OK, "Successfully retrieved posts")
  public async GetPostByCID(
    // @Path() companyid: string,
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any[] }> {
    try {
      const userId = (req as AuthRequest).employer.id;
      console.log("Auth ID:", userId);
      const companyservice = new CompanyService();
      // FIND COMPANY WITH AUTH ID
      const company = await companyservice.FindByAuthId({ userId });
      // FIND COMPANYID IN JOB ()
      const postservice = new PostService();
      // const job = await postservice.FindByCompanyId(company._id);
      // const postService = new PostService();
      const posts = await postservice.getPostsByCompanyId(company._id);
      return { message: "Successfully retrieved posts", data: posts };
    } catch (error: any) {
      this.setStatus(500);
      return { message: error.message || "Internal Server Error", data: [] };
    }
  }
}
