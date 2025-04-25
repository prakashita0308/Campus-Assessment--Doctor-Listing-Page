export interface Doctor {
  id: number;
  name: string;
  specialty: string[];
  image: string;
  experience: number;
  fees: number;
  consultationType: ConsultationType[];
  clinic?: string;
  location?: string;
  qualifications?: string;
}

export enum ConsultationType {
  VIDEO = "Video Consult",
  IN_CLINIC = "In Clinic"
}

export interface DoctorFilterState {
  search: string;
  specialties: string[];
  consultationType: ConsultationType | '';
  sortBy: 'fees' | 'experience' | '';
}
