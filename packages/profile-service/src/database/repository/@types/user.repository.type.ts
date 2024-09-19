
export interface createuser {
    authid:string,
    profile?: string;
    fullname: string;
    email:string,
    contactphone?: string;
    gender?: string;
    location?: string;
    DOB?: string;
    nationality?: string;
    address?: string;
    educationbackground?: string;
}

export interface updateuser{
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