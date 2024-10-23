import {
  Body,
  Controller,
  Get,
  Route,
  SuccessResponse,
  Post,
  Put,
  Delete,
  Middlewares,
  Request,
  Path,
  // UploadedFiles,
  UploadedFile,
  FormField,
} from "tsoa";
import { UserService } from "../../service/userService/userProfileService";
import ROUTE_PATHS from "../../routes/v1/useProfile.Route";
import { StatusCode } from "../../utils/consts/status.code";
import {
  createUser,
  updateUser,
} from "../../database/repository/@types/user.repository.type";
import { IUserDocument } from "../../database/@types/user.interface";
import { AuthRequest, authorize } from "../../middleware/authmiddleware";

@Route("/v1/users")
export class UserController extends Controller {
  @Post(ROUTE_PATHS.PROFILE.CREATE)
  public async CreateUser(@Body() requestBody: createUser): Promise<any> {
    try {
      console.log("Recived data", requestBody);
      const userService = new UserService();
      const userProfile = await userService.createUser(requestBody);
      return userProfile;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Get(ROUTE_PATHS.PROFILE.GET_ALL)
  public async getAll(): Promise<{
    message: string;
    data: IUserDocument[];
  }> {
    try {
      const userService = new UserService();
      const result = await userService.getAll();
      return { message: "Success retrieved!", data: result };
    } catch (err: any) {
      console.log(err);
      throw {
        status: StatusCode.NotFound,
        message: "Can not found with that id",
        detail: err.message,
      };
    }
  }
  @Middlewares(authorize(["seeker"]))
  @Get(ROUTE_PATHS.PROFILE.GET_BY_ID)
  @SuccessResponse(StatusCode.OK, "Successfully retrieved profile")
  public async GetCardById(
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      const userId = (req as AuthRequest).seeker.id;
      const userService = new UserService();
      const user = await userService.getByAuthId({ userId });
      const User = await userService.getById({ id: user._id });
      if (!User) {
        return { message: "Profile Not Found", data: null };
      } else {
        return { message: "Successfully retrieved profile", data: User };
      }
    } catch (error) {
      throw error;
    }
  }
  // update user
  @Middlewares(authorize(["seeker"]))
  @Put(ROUTE_PATHS.PROFILE.UPDATE)
  @SuccessResponse(StatusCode.OK, "Successfully Update profile")
  public async UpdateProfile(
    @Request() req: Express.Request,
    @FormField() fullname: string,
    @FormField() email: string,
    @FormField() contactphone?: string,
    @FormField() gender?: string,
    @FormField() location?: string,
    @FormField() DOB?: string,
    @FormField() nationality?: string,
    @FormField() address?: string,
    @FormField() educationbackground?: string,
    @UploadedFile() profile?: Express.Multer.File
  ): Promise<{ message: string; data: any }> {
    console.log("Received data", {
      fullname,
      email,
      contactphone,
      gender,
      location,
      DOB,
      nationality,
      address,
      educationbackground,
      profile,
    });
    try {
      const update: updateUser = {
        profile: profile ? Buffer.from(profile.buffer) : undefined,
        fullname,
        email,
        contactphone,
        gender,
        location,
        DOB,
        nationality,
        address,
        educationbackground,
      };
      const userId = (req as AuthRequest).seeker.id;
      const userService = new UserService();
      const user = await userService.getByAuthId({ userId });
      const Id = user?.id;
      const newData = await userService.updateUser({
        id: Id,
        update,
      });
      return { message: "Update successfully", data: newData };
    } catch (error: any) {
      console.log(error);
      this.setStatus(500);
      return { message: error.message || "Internal Server Error", data: null };
    }
  }
  @Middlewares(authorize(["seeker"]))
  @SuccessResponse(StatusCode.NoContent, "Successfully Delete  profile")
  @Delete(ROUTE_PATHS.PROFILE.DELETE)
  public async deleteUser(
    // @Path() id: string
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      const userId = (req as AuthRequest).seeker.id;
      const userService = new UserService();
      const user = await userService.getByAuthId({ userId });
      const deleteUser = await userService.delete({
        id: user._id,
      });
      if (deleteUser) {
        return { message: "Successfully deleted profile", data: null };
      } else {
        return { message: "Profile Not Found", data: null };
      }
    } catch (error) {
      throw error;
    }
  }

  // ==========================
  // ACTION  FOR FAVORITE JOB
  // ==========================

  @Post(ROUTE_PATHS.PROFILE.ADD_FAVORITE)
  @Middlewares(authorize(["seeker"]))
  public async AddFavorites(
    @Path() jobid: string,
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      const userId = (req as AuthRequest).seeker.id;
      const userService = new UserService();
      const user = await userService.getByAuthId({ userId });
      const addFavorite = await userService.addFavoriteJob(user._id, jobid);
      if (addFavorite) {
        return { message: "Successfully added favorite", data: null };
      } else {
        return { message: "Profile Not Found", data: null };
      }
    } catch (error) {
      throw error;
    }
  }
  @Get(ROUTE_PATHS.PROFILE.GET_FAVORITE)
  @Middlewares(authorize(["seeker"]))
  public async GetFavorite(
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      const userId = (req as AuthRequest).seeker.id;
      console.log("Userid:", userId);
      const userService = new UserService();
      const user = await userService.getByAuthId({ userId });
      if (!user) {
        return { message: "Profile Not Found", data: null };
      } else {
        return { message: "Found", data: user.favorite };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Delete(ROUTE_PATHS.PROFILE.DELETE_FAVORITE)
  @Middlewares(authorize(["seeker"]))
  public async deleteFavorites(
    @Path() jobid: string,
    @Request() req: Express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      const userId = (req as AuthRequest).seeker.id;
      const userService = new UserService();
      const user = await userService.getByAuthId({ userId });
      if (user) {
        await userService.removeJobPost(user._id, jobid);
        return { message: "Favorite job deleted successfully", data: null };
      } else {
        return { message: "Favorite job can not delete", data: null };
      }
    } catch (error) {
      throw error;
    }
  }
}
