import type { ResumeData, TailoredResumeConfig } from '@/types/resume';

export interface ExportData {
  version: number;
  exportedAt: string;
  masterResume: ResumeData;
  tailoredConfigs: TailoredResumeConfig[];
}

export function exportToJson(
  masterResume: ResumeData,
  tailoredConfigs: TailoredResumeConfig[]
): string {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    masterResume,
    tailoredConfigs,
  };
  return JSON.stringify(data, null, 2);
}

export function parseImportedJson(jsonString: string): {
  masterResume: ResumeData;
  tailoredConfigs: TailoredResumeConfig[];
} {
  const data = JSON.parse(jsonString) as ExportData;

  if (!data.masterResume || !data.masterResume.contactInfo || !data.masterResume.sections) {
    throw new Error('Invalid resume data: missing required fields');
  }

  return {
    masterResume: data.masterResume,
    tailoredConfigs: data.tailoredConfigs || [],
  };
}

export function downloadJsonExport(
  masterResume: ResumeData,
  tailoredConfigs: TailoredResumeConfig[]
) {
  const json = exportToJson(masterResume, tailoredConfigs);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
