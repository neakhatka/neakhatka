import { CompanyProfile } from "../model/company.model";
import {
  companyCreateSchema,
  companyUpdateSchema,
} from "./@types/company.repo.type";
import { StatusCode } from "../../util/consts/status.code";
import APIError from "../error/api-error";
import DuplicateError from "../error/duplicate-error";

class CompanyRepository {
  async create(companyDetail: companyCreateSchema) {
    try {
      const existedemail = await this.findByEmail({
        contactEmail: companyDetail.contactemail,
      });
      if (existedemail) {
        throw new DuplicateError("This email has been used!");
      }
      const company = new CompanyProfile(companyDetail);
      const result = await company.save();
      return result;
    } catch (error) {
      console.log("error", error);
      if (error instanceof DuplicateError) {
        throw error;
      }
      throw new Error("Database error");
    }
  }
  async getAll(): Promise<any> {
    try {
      const company = await CompanyProfile.find();
      if (!company) {
        return { message: "can not user" };
      }
      return company;
    } catch (error: any) {
      return {
        message: "An error occurred while fetching companies",
        error: error.message,
      };
    }
  }

  async findByEmail({ contactEmail }: { contactEmail: string }): Promise<any> {
    try {
      const existedEmail = await CompanyProfile.findOne({
        contactEmail: contactEmail,
      });
      return existedEmail;
    } catch (error) {
      throw new APIError("Unable to Find User in Database ");
    }
  }

  async findByAuthID({ userId }: { userId: string }): Promise<any> {
    try {
      const existedCompany = await CompanyProfile.findOne({
        userId: userId,
      });
      return existedCompany;
    } catch (error) {
      throw new APIError("Unable to Find User in Database ");
    }
  }
  async findById({ id }: { id: string }) {
    try {
      const existed = await CompanyProfile.findById(id);
      return existed;
    } catch (error) {
      throw new APIError("Unable To Find in Database");
    }
  }

  async Update({ id, update }: { id: string; update: companyUpdateSchema }) {
    try {
      const existed = await this.findById({ id });
      if (!existed) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }
      const updateData = (await CompanyProfile.findByIdAndUpdate(
        id,
        { $set: update },
        {
          new: true,
        }
      )) as companyUpdateSchema;
      return updateData;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError("Unble to Update User in Database");
    }
  }

  async delete({ id }: { id: string }) {
    try {
      const existed = await this.findById({ id });
      if (!existed) {
        throw new APIError("Unable to find in database", StatusCode.NoContent);
      }
      return await CompanyProfile.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
export default CompanyRepository;
