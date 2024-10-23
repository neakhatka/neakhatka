import { Schema, model } from "mongoose";
import { IUserDocument } from "../../@types/user.interface";

const userSchema: Schema = new Schema(
  {
    profile: { type: Buffer, required: false, default: "" },
    authid: { type: String, required: false, default: "" },
    fullname: { type: String, required: true, default: "" },
    // lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contactphone: { type: String, required: false, default: "" },
    gender: { type: String, required: false, default: "" },
    location: { type: String, required: false, default: "" },
    DOB: { type: String, required: false, default: "" },
    nationality: { type: String, required: false, default: "" },
    address: { type: String, required: false, default: "" },
    educationbackground: { type: String, required: false, default: "" },
    favorite: [{ type: String, default: [] }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.methods.removeFavorite = function (jobid: string) {
  return this.updateOne({ $pull: { favorite: jobid } });
};

const seekerProfile = model<IUserDocument>("seekerProfile", userSchema);

export { seekerProfile };
