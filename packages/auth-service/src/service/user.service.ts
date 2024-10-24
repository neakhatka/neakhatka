import UserRepository from "../database/repository/user.repository";
import {
  ValidatePassword,
  generatePassword,
  generateSignature,
} from "../utils/jwt";
import { UserSignUpResult, UserSignupParams } from "./@types/user.service.type";
import { AccountVerificationRepository } from "../database/repository/account-verication-repository";
import { generateEmailVerificationToken } from "../utils/account-verification";
import accountVerificationModel from "../database/model/account-verify";
import { publishDirectMessage } from "../queues/auth.producer";
import { authChannel } from "../server";
import { UsersignInSchemType } from "../schema/@types/user";
import DuplicateError from "../errors/duplicate-error";
import APIError from "../errors/api-error";
import { StatusCode } from "../utils/consts";
import { logger } from "../utils/logger";
import axios from "axios";
// import { IAuthDocument } from "../database/model/user.repository";

class UserService {
  private userRepo: UserRepository;
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  // NOTE: THIS METHOD WILL USE BY SIGNUP WITH EMAIL & OAUTH
  async Create(userDetails: UserSignupParams): Promise<UserSignUpResult> {
    try {
      // Step 1
      const hashedPassword =
        userDetails.password && (await generatePassword(userDetails.password));
      let newUserParams = { ...userDetails };
      if (hashedPassword) {
        newUserParams = { ...newUserParams, password: hashedPassword };
      }
      // Step 2
      const authUser = await this.userRepo.CreateUser(newUserParams);
      return authUser;
    } catch (error: unknown) {
      // Step 3
      if (error instanceof DuplicateError) {
        const existedUser = await this.userRepo.FindUser({
          email: userDetails.email,
        });

        if (!existedUser?.isVerified) {
          // Resend the token
          const token =
            await this.accountVerificationRepo.FindVerificationTokenById({
              id: existedUser!._id as string,
            });
          if (!token) {
            logger.error(`UserService Create() method error: token not found!`);
            throw new APIError(
              `Something went wrong!`,
              StatusCode.InternalServerError
            );
          }

          const messageDetails = {
            receiverEmail: existedUser!.email,
            verifyLink: `${token.emailVerificationToken}`,
            template: "verifyEmail",
          };
          // Publish To Notification Service
          await publishDirectMessage(
            authChannel,
            "email-notification",
            "auth-email",
            JSON.stringify(messageDetails),
            "Verify email message has been sent to notification service"
          );
          throw new APIError(
            "A user with this email already exists. Verification email resent.",
            StatusCode.Conflict
          );
        } else {
          throw new APIError(
            "A user with this email already exists. Please login.",
            StatusCode.Conflict
          );
        }
      }
      throw error;
    }
  }

  // Generate and Save Verification Token
  async SaveVerificationToken({ userId }: { userId: string }) {
    try {
      // Step 1
      const emailVerificationToken = generateEmailVerificationToken();
      // Step 2
      const accountVerification = new accountVerificationModel({
        userId,
        emailVerificationToken,
      });

      const newAccountVerification = await accountVerification.save();
      return newAccountVerification;
    } catch (error) {
      throw error;
    }
  }
  async VerifyEmailToken({ token }: { token: string }) {
    const isTokenExist =
      await this.accountVerificationRepo.FindVerificationToken({ token });

    if (!isTokenExist) {
      throw new APIError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
    }
    // Find the user associated with this token
    const user = await this.userRepo.FindUserById({
      id: isTokenExist.userId.toString(),
    });
    if (!user) {
      throw new APIError("User does not exist.", StatusCode.NotFound);
    }
    // Mark the user's email as verifie
    user.isVerified = true;
    await user.save();
    const jwttoken = await generateSignature({ id: user.id, role: user.role });
    // Remove the verification token
    await this.accountVerificationRepo.DeleteVerificationToken({ token });
    console.log("User", user);

    const { id } = await this.SentRequestBaseOnRole(user);
    return {
      message: "User verify email successfully",
      token: jwttoken,
      status: "success",
      date: user,
      id: id,
    };
    // return user;
  }
  async SentRequestBaseOnRole(user: any): Promise<{ id: string }> {
    try {
      if (user.role === "seeker") {
        const response = await axios.post(
          "http://profile-service:4003/v1/users",
          {
            authid: user._id.toString(),
            fullname: user.username,
            email: user.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response.data);
        // const   jwttoken= await generateSignature( response.data.data.id , user.role)
        return { id: response.data._id };
      } else {
        //(user.role === "employer")
        const response = await axios.post(
          "http://company-service:4004/v1/companies",
          {
            userId: user._id.toString(),
            companyname: user.username,
            contactemail: user.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        return { id: response.data._id };
      }
    } catch (error) {
      console.log(error);
      logger.error(`Error sending request based on role: ${error}`);
      throw new APIError(
        "Failed to send request to the appropriate service",
        StatusCode.InternalServerError
      );
    }
  }

  // Login method
  // async Login(UserDetails: UsersignInSchemType) {
  //   try {
  //     const user = await this.userRepo.FindUser({ email: UserDetails.email });

  //     if (!user) {
  //       throw new APIError("User does not exist", StatusCode.NotFound);
  //     }

  //     const isPwdCorrect = await ValidatePassword({
  //       enterpassword: UserDetails.password,
  //       savedPassword: user.password as string,
  //     });

  //     if (!isPwdCorrect) {
  //       throw new APIError(
  //         "Email or Password is incorrect",
  //         StatusCode.BadRequest
  //       );
  //     }
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }

  //   //  const requestUser = new UserRepository();
  //   //   const { data } = await requestUser.FindUserById(user._id.toString());

  //   // const jwtToken = await generateSignature({ _id: user._id.toString() });
  // }
  async Login(UserDetails: UsersignInSchemType) {
    try {
      const user = await this.userRepo.FindUser({ email: UserDetails.email });

      if (!user) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }

      const isPwdCorrect = await ValidatePassword({
        enterPassword: UserDetails.password,
        savedPassword: user.password as string,
      });

      if (!isPwdCorrect) {
        throw new APIError(
          "Email or Password is incorrect",
          StatusCode.BadRequest
        );
      }
      // Ensure the user object contains a role property
      const userRole = user.role;
      return { user, role: userRole };
    } catch (error) {
      throw error;
    }
  }

  // logout
  async logout(decodedUser: any) {
    try {
      console.log("welcome to user service");
      const { id, role } = decodedUser;
      if (role == "seeker") {
        const existingUser = await axios.get(
          `http://profile-service:4003/v1/users`
        );
        if (!existingUser) {
          throw new APIError("No user found!", StatusCode.NotFound);
        }
        return true;
      }
      if (role == "employer") {
        const existingUser = await axios.get(
          `http://company-service:4004/v1/companies/${id}`
        );
        if (!existingUser) {
          throw new APIError("No user found!", StatusCode.NotFound);
        }
        return true;
      }

      if (role === undefined) {
        throw new APIError("Role is undefined", StatusCode.NotFound);
      }
    } catch (error: unknown) {
      throw error;
    }
  }

  async findById({ id }: { id: string }) {
    try {
      return await this.userRepo.FindUserById({ id });
    } catch (error) {
      console.log(error);
    }
  }
  async FindUserByEmail({ email }: { email: string }) {
    try {
      const user = await this.userRepo.FindUser({ email });
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async UpdateUser({ id, update }: { id: string; update: object }) {
    try {
      const user = await this.userRepo.FindUserById({ id });
      if (!user) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }
      const updatedUser = await this.userRepo.UpdateUserById({ id, update });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
