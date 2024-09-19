import UserRepository from "../../database/repository/userRepository/userProfileRepo";
import { IUserDocument } from "../../database/@types/user.interface";
import DuplitcateError from "../../error/duplitcate-error";
import APIError from "../../error/api-error";
import {
  createuser,
  updateuser,
} from "../../database/repository/@types/user.repository.type";
import { logger } from "../../utils/logger";
export class UserService {
  private userRepo: UserRepository;
  constructor() {
    this.userRepo = new UserRepository();
  }
  async CreateUser(UserDetail: createuser) {
    try {
      const User = await this.userRepo.createuser(UserDetail);
      return User;
    } catch (error) {
      console.log(error);
      if (error instanceof DuplitcateError) {
        throw new Error("Unable to create user");
      }
    }
  }

  async GetAllProfileservice(): Promise<IUserDocument[]> {
    try {
      return await this.userRepo.GetAllUserRepo();
    } catch (error) {
      throw new APIError("Unable to get user");
    }
  }

  async GetByIdService({ id }: { id: string }) {
    try {
      return await this.userRepo.findById({ id });
    } catch (error) {
      console.log(error);
      // return null;
      throw new APIError("Unable to get user with this ID");
    }
  }
  async FindByAuthId({ userId }: { userId: string }): Promise<any> {
    try {
      return await this.userRepo.FindByAuthID({ userId });
    } catch (error) {
      console.log(error);
      // return null;
      throw new APIError("Unable to get user with this ID");
    }
  }

  // update user

  async UpdateProfileService({
    id,
    update,
  }: {
    id: string;
    update: updateuser;
  }): Promise<any> {
    try {
      return await this.userRepo.UpdateProfile({ id, update });
    } catch (error) {
      // throw error;
      throw new APIError("Unable to update User profile!");
    }
  }

  // delete user
  async DeleteProfileService({ id }: { id: string }) {
    try {
      return await this.userRepo.deleteUser({ id });
    } catch (error) {
      // throw error;
      logger.error(
        `UserProfileService DeleteProfileService() method error: ${error}`
      );
      throw new APIError("Unable to delete User profile");
    }
  }

  // =======================
  //  ABOUT FAVORITE JOB
  //======================
  async AddFavoriteJobPost(
    userId: string,
    jobId: string
  ): Promise<{ message: string; data: any }> {
    try {
      const user = await this.userRepo.findById({ id: userId });
      if (!user) {
        throw new APIError("User not found");
      }

      if (!user.favorite) {
        user.favorite = [];
      }

      if (!user.favorite.includes(jobId)) {
        user.favorite.push(jobId);
        await user.save();
      }

      return { message: "Favorite", data: user.favorite };
    } catch (error) {
      console.log(error);
      throw new APIError("Unable to add favorite job post");
    }
  }
  // DELETE FAVORITE JOB
  async RemovequetJobPost(userId: string, jobId: string) {
    try {
      return await this.userRepo.RemoveFavoriteJob(userId,jobId)
    } catch (error) {
    console.log("error on delete favorite jon in user service:",error)
    throw new APIError("Unable to remove favorite");
    }
  }
}
