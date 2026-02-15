export interface ResumeData {
  meta: ResumeMeta;
  contactInfo: ContactInfo;
  sections: ResumeSection[];
}

export interface ResumeMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  website?: string;
  location?: string;
}

export type SectionType =
  | "education"
  | "skills"
  | "experience"
  | "projects"
  | "achievements";

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  displayOrder: number;
  entries: ResumeEntry[];
}

export interface ResumeEntry {
  id: string;
  enabled: boolean;
  displayOrder: number;
  data: EntryData;
  bulletPoints: BulletPoint[];
}

export type EntryData =
  | EducationData
  | SkillsData
  | ExperienceData
  | ProjectData
  | AchievementData;

export interface EducationData {
  type: "education";
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  location?: string;
  availableCoursework?: string;
}

export interface SkillsData {
  type: "skills";
  category: string;
  items: string;
  availableItems?: string;
}

export interface ExperienceData {
  type: "experience";
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export interface ProjectData {
  type: "projects";
  name: string;
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface AchievementData {
  type: "achievements";
  description: string;
}

export interface BulletPoint {
  id: string;
  text: string;
  enabled: boolean;
  displayOrder: number;
}

export interface TailoredResumeConfig {
  id: string;
  name: string;
  createdAt: string;
  jobDescription?: string;
  enabledOverrides: Record<string, boolean>;
  textOverrides: Record<string, string>;
  sectionOrder: string[];
  entryOrder: Record<string, string[]>;
  additionalEntries: Record<string, ResumeEntry[]>;
  entryDataOverrides: Record<string, EntryData>;
  deletedEntryIds: string[];
  additionalBullets: Record<string, BulletPoint[]>;
  deletedBulletIds: string[];
}

export interface AppSettings {
  openaiApiKey: string;
  openaiModel: string;
  theme: "light" | "dark";
}

export interface AppState {
  masterResume: ResumeData;
  tailoredConfigs: TailoredResumeConfig[];
  activeTailoredConfigId: string | null;
  settings: AppSettings;
}
