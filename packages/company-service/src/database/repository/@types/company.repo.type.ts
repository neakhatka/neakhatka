

export interface companycreateschema {
  companyname: string;
  contactemail: string;
}
  export interface companyupdateschema {
  companyname?: string;
  logo?: Buffer;
  contactphone?: string;
  websiteLink?: string;
  location?: string;
  contactemail?: string;
  contactperson?: string;
  numberOfemployees?: string;
  address?: string;
  companydescription?: string;
}
