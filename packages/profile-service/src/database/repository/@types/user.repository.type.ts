export interface createUser {
  authid: string;
  profile?: string;
  fullname: string;
  email: string;
  contactphone?: string;
  gender?: string;
  location?: string;
  DOB?: string;
  nationality?: string;
  address?: string;
  educationbackground?: string;
}

export interface updateUser {
  profile?: Buffer;
  fullname?: string;
  email?: string;
  contactphone?: string;
  gender?: string;
  location?: string;
  DOB?: string;
  nationality?: string;
  address?: string;
  educationbackground?: string;
}
