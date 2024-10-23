import UserRepository from "../../database/repository/userRepository/userProfileRepo";
import { IUserDocument } from "../../database/@types/user.interface";
import DuplitcateError from "../../error/duplitcate-error";
import APIError from "../../error/api-error";
import {
  createUser,
  updateUser,
} from "../../database/repository/@types/user.repository.type";
import { logger } from "../../utils/logger";
export class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  async createUser(UserDetail: createUser) {
    try {
      const User = await this.userRepository.createUser(UserDetail);
      return User;
    } catch (error) {
      console.log(error);
      if (error instanceof DuplitcateError) {
        throw new Error("Unable to create user");
      }
    }
  }
  async getAll(): Promise<IUserDocument[]> {
    try {
      return await this.userRepository.getAll();
    } catch (error) {
      throw new APIError("Unable to get user");
    }
  }
  async getById({ id }: { id: string }) {
    try {
      return await this.userRepository.findById({ id });
    } catch (error) {
      console.log(error);
      // return null;
      throw new APIError("Unable to get user with this ID");
    }
  }
  async getByAuthId({ userId }: { userId: string }): Promise<any> {
    try {
      return await this.userRepository.findByAuthID({ userId });
    } catch (error) {
      console.log(error);
      throw new APIError("Unable to get user with this ID");
    }
  }
  async updateUser({
    id,
    update,
  }: {
    id: string;
    update: updateUser;
  }): Promise<any> {
    try {
      return await this.userRepository.update({ id, update });
    } catch (error) {
      throw new APIError("Unable to update User profile!");
    }
  }
  // delete user
  async delete({ id }: { id: string }) {
    try {
      return await this.userRepository.deleteUser({ id });
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

  async addFavoriteJob(
    userId: string,
    jobId: string
  ): Promise<{ message: string; data: any }> {
    try {
      const user = await this.userRepository.findById({ id: userId });
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
  async removeJobPost(userId: string, jobId: string) {
    try {
      return await this.userRepository.removeFavoriteJob(userId, jobId);
    } catch (error) {
      console.log("error on delete favorite jon in user service:", error);
      throw new APIError("Unable to remove favorite");
    }
  }
}
