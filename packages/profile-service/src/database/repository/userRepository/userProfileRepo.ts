import { seekerProfile } from "../../models/userprofile/userprofilel-model";
import { IUserDocument } from "../../@types/user.interface";
import DuplitcateError from "../../../error/duplitcate-error";
import APIError from "../../../error/api-error";
import { createUser, updateUser } from "../@types/user.repository.type";
import { StatusCode } from "../../../utils/consts/status.code";
import { logger } from "../../../utils/logger";

class UserRepository {
  async createUser(UserDetail: createUser) {
    try {
      const existingUser = await this.findByEmail({
        email: UserDetail.email,
      });

      if (existingUser) {
        throw new DuplitcateError("Email already in use");
      }
      const user = new seekerProfile(UserDetail);
      const result = await user.save();
      return result;
    } catch (error) {
      console.log(error);
      if (error instanceof DuplitcateError) {
        throw new APIError("Enable create user in database");
      }
    }
  }
  async getAll(): Promise<IUserDocument[]> {
    try {
      return await seekerProfile.find();
    } catch (error) {
      throw new APIError("Enable to find user");
    }
  }
  async findById({ id }: { id: string }) {
    try {
      const existedUser = await seekerProfile.findById(id).exec();
      return existedUser;
    } catch (error) {
      console.log(error);

      throw new APIError("Unable to find user in database ");
    }
  }
  async findByAuthID({ userId }: { userId: string }): Promise<any> {
    try {
      const existed = await seekerProfile.findOne({
        authid: userId,
      });
      return existed;
    } catch (error) {
      throw new APIError("Unable to Find User in Database ");
    }
  }
  async update({ id, update }: { id: string; update: updateUser }) {
    try {
      const existed = await this.findById({ id });
      if (!existed) {
        throw new APIError("post  does not exist", StatusCode.NotFound);
      }
      const data = await seekerProfile.findByIdAndUpdate(
        id,
        { $set: update },
        {
          new: true,
        }
      );
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof APIError) {
        throw new APIError("Unable to update that post");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  async deleteUser({ id }: { id: string }) {
    try {
      const existedID = await this.findById({ id });
      if (!existedID) {
        throw new APIError("Unable to find iin database", StatusCode.NoContent);
      }
      return await seekerProfile.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`UserRepository DeteleUser() method error: ${error}`);
      throw error;
    }
  }
  async findByEmail({ email }: { email: string }) {
    try {
      const existedUser = await seekerProfile.findOne({ email: email });
      return existedUser;
    } catch (error) {
      if (error instanceof APIError) {
        throw new APIError("Unable to Delete User in database");
      }
    }
  }
  async removeFavoriteJob(userId: string, jobid: string) {
    try {
      const user = await seekerProfile.findById(userId);
      if (user) {
        await user.removeFavorite(jobid);
      } else {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }
    } catch (error) {}
  }
}

export default UserRepository;
