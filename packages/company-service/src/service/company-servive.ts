import APIError from "../database/error/api-error";
import {
  companyCreateSchema,
  companyUpdateSchema,
} from "../database/repository/@types/company.repo.type";
import CompanyRepository from "../database/repository/company.repository";

class CompanyService {
  private companyRepository: CompanyRepository;
  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  async create(companydetail: companyCreateSchema) {
    try {
      const company = await this.companyRepository.create(companydetail);
      return company;
    } catch (error) {
      throw new Error("Unable to create user from service");
    }
  }
  async getAll(): Promise<any> {
    try {
      return await this.companyRepository.getAll();
    } catch (error) {
      throw new Error("Unable to create user");
    }
  }
  async findById({ id }: { id: string }) {
    try {
      return await this.companyRepository.findById({ id });
    } catch (error) {
      throw new APIError("Unable to get user with this ID");
    }
  }
  async findByAuthId({ userId }: { userId: string }): Promise<any> {
    try {
      return await this.companyRepository.findByAuthID({ userId });
    } catch (error) {
      console.log(error);
      // return null;
      throw new APIError("Unable to get user with this ID");
    }
  }
  async delete({ id }: { id: string }) {
    try {
      return await this.companyRepository.delete({ id });
    } catch (error: any) {
      console.log("error on service layer", error);
      throw new APIError("Unable to delete User profile");
    }
  }
  async update({
    id,
    update,
  }: {
    id: string;
    update: companyUpdateSchema;
  }): Promise<any> {
    try {
      return await this.companyRepository.Update({ id, update });
    } catch (error) {
      // console.log(error);
      throw new APIError("Unable to update User profile!");
    }
  }
}
export default CompanyService;
