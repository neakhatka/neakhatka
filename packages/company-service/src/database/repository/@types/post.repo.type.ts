export interface postcreateschema {
  logo: string;
  companyName?: string;
  workplace?: string;
  position?: string;
  location?: string;
  jobDescription?: string[];
  jobResponsibilities?: string[];
  startDate?: string;
  endDate?: string;
  salary?: string;
  totalEmployees?: string;
  time?: "full-time" | "part-time";
  duration?: string;
  availablePositions?: string;
  gender?: string;
}

export interface postupdateschema {
  logo?: string;
  companyName?: string;
  workplace?: string;
  position?: string;
  location?: string;
  jobDescription?: string[];
  jobResponsibilities?: string[];
  startDate?: string;
  endDate?: string;
  salary?: string;
  totalEmployees?: string;
  time?: "full-time" | "part-time";
  duration?: string;
  availablePositions?: string;
  gender?: string;
}
