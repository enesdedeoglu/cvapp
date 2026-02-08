
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface PhotoConfig {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  zoom: number; // scale 1-3
}

export interface ResumeData {
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    website: string;
    photoUrl: string | null;
    photoConfig?: PhotoConfig;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export type SectionType = 'personal' | 'summary' | 'experience' | 'education' | 'skills';

export interface AIState {
  isGenerating: boolean;
  error: string | null;
}

export type TemplateId = 
  | 'modern' 
  | 'classic' 
  | 'minimal' 
  | 'professional' 
  | 'creative' 
  | 'executive' 
  | 'student' 
  | 'tech' 
  | 'compact' 
  | 'bold';

export type FontFamily = 'sans' | 'serif' | 'mono';

export interface ResumeTheme {
  templateId: TemplateId;
  primaryColor: string;
  fontFamily: FontFamily;
}

// Global declaration for the injected script library
declare global {
  var html2pdf: any;
}