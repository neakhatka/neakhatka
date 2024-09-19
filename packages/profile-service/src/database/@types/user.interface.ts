export interface IUserDocument {
  _id?: string;
  authid?: string;
  profile?: Buffer;
  fullname: string;
  email: string;
  contactphone?: string;
  gender?: string;
  location?: string;
  DOB: string;
  nationality?: string;
  address?: string;
  educationbackground?: string;
  favorite?: string[];
  removeFavorite(jobid: string): Promise<string>;
  createdAt?: Date;
}
