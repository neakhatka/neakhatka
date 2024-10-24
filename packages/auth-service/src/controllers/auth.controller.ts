import {
  Controller,
  Get,
  Post,
  Body,
  Middlewares,
  Query,
  Route,
  SuccessResponse,
  Header,
} from "tsoa";
import axios from "axios";
import { ROUTE_PATH } from "../routes/v1/routes-refer";
import UserService from "../service/user.service";
import { generateSignature } from "../utils/jwt";
import { UserSignInSchema, UsersignUpSchema } from "../schema/user-schema";
import AuthModel from "../database/model/user.repository"; // Ensure correct path
import { publishDirectMessage } from "../queues/auth.producer";
import { authChannel } from "../server";
import { IAuthUserMessageDetails } from "../queues/@types/auth.type";
import { StatusCode } from "../utils/consts";
import { logger } from "../utils/logger";
import APIError from "../errors/api-error";
import validateInput from "../middlewares/validate-input";
import { decodedToken } from "../utils/decodeToken";

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
  role: string;
}
interface VerifyEmailResponse {
  status: string;
  message: string;
  token: string;
  role: string;
  id: string;
}
@Route(`/v1/auth`)
export class AuthController extends Controller {
  @SuccessResponse(StatusCode.Created, "Created")
  @Post(ROUTE_PATH.AUTH.SIGN_UP)
  @Middlewares(validateInput(UsersignUpSchema))
  public async SignUpWithEmail(
    @Body() requestBody: SignUpRequestBody
  ): Promise<any> {
    try {
      const { username, email, password, role } = requestBody;

      const userService = new UserService();
      const existedEmail = await userService.FindUserByEmail({ email });
      if (existedEmail) {
        return { message: "this email already use" };
      }
      const newUser = await userService.Create({
        username,
        email,
        password,
        role,
      });
      // Step 2.
      const verificationToken = await userService.SaveVerificationToken({
        userId: newUser._id as string,
      });

      const messageDetails = {
        reciverEmail: newUser.email,
        verifyLink: `${verificationToken?.emailVerificationToken}`,
        template: "verifyEmail",
      };

      await publishDirectMessage(
        authChannel,
        "neakhatka-email-notification",
        "auth-email",
        JSON.stringify(messageDetails),
        "Verify email message has been sent to notification service"
      );

      return {
        message: "Sign up successfully. Please verify your email.",
        verify_token: verificationToken.emailVerificationToken,
        data: newUser,
      };
    } catch (error) {
      console.error("Error during verify", error);
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATH.AUTH.VERIFY)
  public async VerifyEmail(
    @Query() token: string
  ): Promise<VerifyEmailResponse> {
    try {
      const userService = new UserService();
      // Step 1: Verify email toke
      const user = await userService.VerifyEmailToken({ token });
      console.log("Verified user:", user);
      // Step 2.
      // const jwtToken = await generateSignature({userId: user._id});

      const userDetail = await userService.FindUserByEmail({
        email: user.date.email,
      });
      // console.log(user.email)
      if (!userDetail) {
        logger.error(
          `AuthController VerifyEmail() method error: user not found`
        );
        throw new APIError(
          `Something went wrong`,
          StatusCode.InternalServerError
        );
      }
      const messageDetails: IAuthUserMessageDetails = {
        username: userDetail?.username,
        email: userDetail?.email,
        type: "auth",
      };

      await publishDirectMessage(
        authChannel,
        "neakhatka-user-update",
        "user-applier",
        JSON.stringify(messageDetails),
        "User details sent to user service"
      );
      const jwttoken = await generateSignature({
        id: userDetail.id,
        role: userDetail.role,
      });
      // console.log("Jwttoken:",jwttoken)
      return {
        status: "success",
        message: "User verify email successfully",
        token: jwttoken,
        role: userDetail.role,
        id: user.id.toString(),
      };
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(ROUTE_PATH.AUTH.LOGIN)
  @Middlewares(validateInput(UserSignInSchema))
  public async loginWithEmail(
    @Body() requestBody: { email: string; password: string }
  ): Promise<{ message: string; token: string; role: string }> {
    try {
      const userService = new UserService();
      const { user, role } = await userService.Login(requestBody);

      console.log("User", user);
      const jwttoken = await generateSignature({
        id: user._id as string,
        role: role,
      });

      return { message: "Success login", token: jwttoken, role: role };
    } catch (error) {
      console.log(error);
      throw new Error(
        "Login failed. Please check your credentials and try again."
      );
    }
  }

  @Get(ROUTE_PATH.AUTH.GOOGLE)
  public async initiateGoogleLogin() {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
    return { url };
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATH.AUTH.GOOGLE_CALLBACK)
  public async GoogleAuthCallback(@Query() code: string) {
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;

    try {
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      });

      const { access_token } = data;
      const { data: profile } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      console.log("profile", profile);

      let newUser = await AuthModel.findOne({ email: profile.email });
      if (!newUser) {
        newUser = new AuthModel({
          username: profile.given_name,
          email: profile.email,
          isVerified: true,
          googleId: profile.id,
        });
        await newUser.save();
      }
      const jwtToken = await generateSignature({
        id: newUser._id as string,
        role: newUser.role,
      });

      console.log(jwtToken);

      return {
        token: jwtToken,
        message: "Good Job",
      };
    } catch (error) {
      this.setStatus(500);
      throw new Error("Error during Google authentication");
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATH.AUTH.LOGOUT)
  async logout(@Header("authorization") authorization: string): Promise<any> {
    try {
      const token = authorization?.split(" ")[1];
      const userService = new UserService();
      const decodedUser = await decodedToken(token);
      const isLogout = await userService.logout(decodedUser);

      if (!isLogout) {
        throw new APIError("Unable to logout!");
      }
      return { message: "Success logout", isLogout: isLogout };
    } catch (error: unknown) {
      throw error;
    }
  }
}
