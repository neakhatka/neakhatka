"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const userProfileService_1 = require("../../service/userService/userProfileService");
// import { IUserDocument } from "../../database/@types/user.interface";
const useProfile_Route_1 = __importDefault(require("../../routes/v1/useProfile.Route"));
const status_code_1 = require("../../utils/consts/status.code");
const authmiddleware_1 = require("../../middleware/authmiddleware");
let UserController = class UserController extends tsoa_1.Controller {
    CreateUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Recived data", requestBody);
            try {
                const userService = new userProfileService_1.UserService();
                const userProfile = yield userService.CreateUser(requestBody);
                return userProfile;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    GetAllUserController() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userService = new userProfileService_1.UserService();
                const result = yield userService.GetAllProfileservice();
                return { message: "Success retrieved!", data: result };
            }
            catch (err) {
                console.log(err);
                throw {
                    status: status_code_1.StatusCode.NotFound,
                    message: "Can not found with that id",
                    detail: err.message,
                };
            }
        });
    }
    GetCardById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.seeker.id;
                const userservice = new userProfileService_1.UserService();
                const user = yield userservice.FindByAuthId({ userId });
                const User = yield userservice.GetByIdService({ id: user._id });
                if (!User) {
                    return { message: "Profile Not Found", data: null };
                }
                else {
                    return { message: "Successfully retrieved profile", data: User };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    // update user
    UpdateProfile(req, fullname, email, contactphone, gender, location, DOB, nationality, address, educationbackground, profile) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const update = {
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
                const userId = req.seeker.id;
                const userservice = new userProfileService_1.UserService();
                const user = yield userservice.FindByAuthId({ userId });
                const Id = user === null || user === void 0 ? void 0 : user.id;
                const updatepost = yield userservice.UpdateProfileService({
                    id: Id,
                    update,
                });
                return { message: "Update successfully", data: updatepost };
            }
            catch (error) {
                console.log(error);
                this.setStatus(500); // Set HTTP status code to 500 for server errors
                return { message: error.message || "Internal Server Error", data: null };
            }
        });
    }
    // DEETE USER
    DeleteUserContrioller(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.seeker.id;
                const userservice = new userProfileService_1.UserService();
                const user = yield userservice.FindByAuthId({ userId });
                const deleteuser = yield userservice.DeleteProfileService({
                    id: user._id,
                });
                if (deleteuser) {
                    return { message: "Successfully deleted profile", data: null };
                }
                else {
                    return { message: "Profile Not Found", data: null };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    // ==========================
    // ACTION  FOR FAVORITE JOB
    // ==========================
    AddFavorites(jobid, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.seeker.id;
                const userservice = new userProfileService_1.UserService();
                const user = yield userservice.FindByAuthId({ userId });
                const addfavorite = yield userservice.AddFavoriteJobPost(user._id, jobid);
                if (addfavorite) {
                    return { message: "Successfully added favorite", data: null };
                }
                else {
                    return { message: "Profile Not Found", data: null };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetFavorite(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.seeker.id;
                console.log("Userid:", userId);
                const userservice = new userProfileService_1.UserService();
                const user = yield userservice.FindByAuthId({ userId });
                if (!user) {
                    return { message: "Profile Not Found", data: null };
                }
                else {
                    return { message: "Found", data: user.favorite };
                }
                console.log("User:", user);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    DeleteFavorites(jobid, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.seeker.id;
                const userservice = new userProfileService_1.UserService();
                const user = yield userservice.FindByAuthId({ userId });
                if (user) {
                    yield userservice.RemovequetJobPost(user._id, jobid);
                    return { message: "Favorite job deleted successfully", data: null };
                }
                else {
                    return { message: "Favorite job can not delete", data: null };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Post)(useProfile_Route_1.default.PROFILE.CREATE),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "CreateUser", null);
__decorate([
    (0, tsoa_1.Get)(useProfile_Route_1.default.PROFILE.GET_ALL)
    //   @Get("/all-profile")
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "GetAllUserController", null);
__decorate([
    (0, tsoa_1.Middlewares)((0, authmiddleware_1.authorize)(["seeker"])),
    (0, tsoa_1.Get)(useProfile_Route_1.default.PROFILE.GET_BY_ID),
    (0, tsoa_1.SuccessResponse)(status_code_1.StatusCode.OK, "Successfully retrieved profile"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "GetCardById", null);
__decorate([
    (0, tsoa_1.Middlewares)((0, authmiddleware_1.authorize)(["seeker"])),
    (0, tsoa_1.Put)(useProfile_Route_1.default.PROFILE.UPDATE),
    (0, tsoa_1.SuccessResponse)(status_code_1.StatusCode.OK, "Successfully Update profile"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.FormField)()),
    __param(2, (0, tsoa_1.FormField)()),
    __param(3, (0, tsoa_1.FormField)()),
    __param(4, (0, tsoa_1.FormField)()),
    __param(5, (0, tsoa_1.FormField)()),
    __param(6, (0, tsoa_1.FormField)()),
    __param(7, (0, tsoa_1.FormField)()),
    __param(8, (0, tsoa_1.FormField)()),
    __param(9, (0, tsoa_1.FormField)()),
    __param(10, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "UpdateProfile", null);
__decorate([
    (0, tsoa_1.Middlewares)((0, authmiddleware_1.authorize)(["seeker"])),
    (0, tsoa_1.SuccessResponse)(status_code_1.StatusCode.NoContent, "Successfully Delete  profile"),
    (0, tsoa_1.Delete)(useProfile_Route_1.default.PROFILE.DELETE),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "DeleteUserContrioller", null);
__decorate([
    (0, tsoa_1.Post)(useProfile_Route_1.default.PROFILE.ADD_FAVORITE),
    (0, tsoa_1.Middlewares)((0, authmiddleware_1.authorize)(["seeker"])),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "AddFavorites", null);
__decorate([
    (0, tsoa_1.Get)(useProfile_Route_1.default.PROFILE.GET_FAVORITE),
    (0, tsoa_1.Middlewares)((0, authmiddleware_1.authorize)(["seeker"])),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "GetFavorite", null);
__decorate([
    (0, tsoa_1.Delete)(useProfile_Route_1.default.PROFILE.DELETE_FAVORITE),
    (0, tsoa_1.Middlewares)((0, authmiddleware_1.authorize)(["seeker"])),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "DeleteFavorites", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Route)("/v1/users")
], UserController);
//# sourceMappingURL=userProfile-Controller.js.map