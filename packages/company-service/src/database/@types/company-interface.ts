export interface ICompanyDocument {
  companyname?: string;
  logo?: Buffer;
  contactphone?: string;
  websiteLink?: string;
  location?: string;
  contactemail?: string | undefined;
  contactperson: string;
  numberOfemployees: string;
  address: string;
  companydescription: string;
  userId?: string;
}
