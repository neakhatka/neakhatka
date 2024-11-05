import { companyUpdateSchema } from "../database/repository/@types/company.repo.type";

class CompanyMapper {
  public static toUpdatePayload(
    data: Partial<companyUpdateSchema>,
    logoUrl?: string
  ): companyUpdateSchema {
    return {
      ...data,
      logo: logoUrl || data.logo,
    };
  }
}

export default CompanyMapper;
