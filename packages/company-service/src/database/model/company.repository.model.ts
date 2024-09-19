
import { Schema, model,
  //  Document,
    // Model
   } from "mongoose";
const companySchema = new Schema(
  {
    companyname: { type: String, required: true },
    logo: { type: Buffer, required: false, default: "" },
    contactphone: { type: String, required: false, default: 0 },
    contactemail: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    websitelink: { type: String, required: false, default: "" },
    location: { type: String, required: false, default: "" },
    contactPerson: { type: String, required: false, default: "" },
    numberOfemployees: { type:String, required: false, default: 0 },
    address: { type: String, required: false, default: "" },
    companydescription: { type: String, required: false, default: "" },
    userId: { type: String, required: false, default: "" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CompanyProfile = model("CompanyProfile",companySchema)

export { CompanyProfile };
