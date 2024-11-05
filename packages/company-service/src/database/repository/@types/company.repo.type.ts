export interface companyCreateSchema {
  companyname: string;
  contactemail: string;
}
export interface companyUpdateSchema {
  companyname?: string;
  logo?: string;
  contactphone?: string;
  websiteLink?: string;
  location?: string;
  contactemail?: string;
  contactperson?: string;
  numberOfemployees?: string;
  address?: string;
  companydescription?: string;
}
