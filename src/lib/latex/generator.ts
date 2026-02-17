import type { ResumeData, ResumeSection, ResumeEntry, ContactInfo, EducationData, SkillsData, ExperienceData, ProjectData, AchievementData, BulletPoint } from '@/types/resume';
import { escapeLatex, passthrough } from './escaper';

/**
 * Generates a complete .tex string from resume data.
 * Matches the user's existing Overleaf template format exactly.
 */
export function generateLatex(
  resume: ResumeData,
  overrides?: Record<string, boolean>
): string {
  const isEnabled = (id: string, defaultEnabled: boolean): boolean => {
    if (overrides && id in overrides) return overrides[id];
    return defaultEnabled;
  };

  const lines: string[] = [];

  lines.push(generatePreamble());
  lines.push(generateContactHeader(resume.contactInfo));

  const sortedSections = [...resume.sections]
    .filter(s => isEnabled(s.id, s.enabled))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  for (const section of sortedSections) {
    const sectionLatex = generateSection(section, isEnabled);
    if (sectionLatex) {
      lines.push('');
      lines.push(sectionLatex);
    }
  }

  lines.push('');
  lines.push('\\end{document}');

  return lines.join('\n');
}

function generatePreamble(): string {
  return `\\documentclass[10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{ragged2e}
\\usepackage{xcolor}
\\usepackage{setspace}

\\textheight=10in
\\pagestyle{empty}
\\raggedright

\\setlist[itemize]{nosep,left=0pt,labelwidth=0.5em,labelsep=0.3em,itemsep=0pt,parsep=0pt,topsep=0pt}

% DEFINITIONS FOR RESUME
\\newcommand{\\lineunder} {
    \\vspace*{-8pt} \\\\
    \\hspace*{-18pt} \\hrulefill \\\\
}

\\newcommand{\\header}[1] {
    {\\hspace*{-18pt}\\vspace*{6pt} \\textsc{#1}}
    \\vspace*{-6pt} \\lineunder
}

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

% START DOCUMENT
\\begin{document}

\\vspace*{-40pt}`;
}

function generateContactHeader(contact: ContactInfo): string {
  const lines: string[] = [];
  lines.push('');
  lines.push('%==== Profile ====%');
  lines.push('\\begin{center}');
  lines.push(`    {\\Huge \\scshape \\textbf{${escapeLatex(contact.name)}}} \\\\`);
  lines.push('    \\vspace{3pt}');
  lines.push('\\medium');
  lines.push('');

  const parts: string[] = [];
  if (contact.phone) parts.push(escapeLatex(contact.phone));
  if (contact.email) parts.push(`\\href{mailto:${contact.email}}{\\underline{${escapeLatex(contact.email)}}}`);
  if (contact.linkedin) parts.push(`\\href{${contact.linkedin}}{\\underline{LinkedIn}}`);
  if (contact.github) parts.push(`\\href{${contact.github}}{\\underline{GitHub}}`);
  if (contact.location) parts.push(escapeLatex(contact.location));

  lines.push(parts.join(' $|$ '));
  lines.push('');
  lines.push('');
  lines.push('\\end{center}');
  return lines.join('\n');
}

function generateSection(
  section: ResumeSection,
  isEnabled: (id: string, def: boolean) => boolean
): string {
  const enabledEntries = section.entries
    .filter(e => isEnabled(e.id, e.enabled))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (enabledEntries.length === 0) return '';

  switch (section.type) {
    case 'education':
      return generateEducation(section.title, enabledEntries, isEnabled);
    case 'skills':
      return generateSkills(section.title, enabledEntries);
    case 'experience':
      return generateExperience(section.title, enabledEntries, isEnabled);
    case 'projects':
      return generateProjects(section.title, enabledEntries, isEnabled);
    case 'achievements':
      return generateAchievements(section.title, enabledEntries, isEnabled);
    default:
      return '';
  }
}

function getEnabledBullets(
  entry: ResumeEntry,
  isEnabled: (id: string, def: boolean) => boolean
): BulletPoint[] {
  return entry.bulletPoints
    .filter(b => isEnabled(b.id, b.enabled))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function generateEducation(
  title: string,
  entries: ResumeEntry[],
  isEnabled: (id: string, def: boolean) => boolean
): string {
  const lines: string[] = [];
  lines.push(`%==== ${title.toUpperCase()} ====%`);
  lines.push(`\\header{\\textbf{${title.toUpperCase()}}}`);
  lines.push('\\vspace{3pt}');

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const d = entry.data as EducationData;
    lines.push(`\\textbf{${escapeLatex(d.institution)}}${d.location ? `, ${escapeLatex(d.location)}` : ''} \\hfill ${escapeLatex(d.startDate)} -- ${escapeLatex(d.endDate)} \\\\`);
    lines.push(`${escapeLatex(d.degree)} in ${escapeLatex(d.field)}${d.gpa ? ` \\hfill GPA : ${escapeLatex(d.gpa)}` : ''} \\\\`);

    const bullets = getEnabledBullets(entry, isEnabled);
    for (const b of bullets) {
      lines.push(`${passthrough(b.text)} \\\\`);
    }

    if (i < entries.length - 1) {
      lines.push('\\vspace{6pt}');
    }
  }

  lines.push('\\vspace{5pt}');
  return lines.join('\n');
}

function generateSkills(
  title: string,
  entries: ResumeEntry[]
): string {
  const lines: string[] = [];
  lines.push(`%==== ${title.toUpperCase()} ====%`);
  lines.push(`\\header{\\textbf{${title.toUpperCase()}}}`);
  lines.push('\\vspace{3pt}');

  for (const entry of entries) {
    const d = entry.data as SkillsData;
    lines.push(`\\textbf{${escapeLatex(d.category)}:} ${passthrough(d.items)}\\\\`);
  }

  lines.push('\\vspace{6pt}');
  return lines.join('\n');
}

function generateExperience(
  title: string,
  entries: ResumeEntry[],
  isEnabled: (id: string, def: boolean) => boolean
): string {
  const lines: string[] = [];
  lines.push(`%==== ${title.toUpperCase()} ====%`);
  lines.push(`\\header{\\textbf{${title.toUpperCase()}}}`);
  lines.push('\\vspace{3pt}');
  lines.push('');

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const d = entry.data as ExperienceData;
    lines.push(`\\textbf{${escapeLatex(d.company)}: ${escapeLatex(d.title)}} \\hfill ${escapeLatex(d.startDate)} -- ${escapeLatex(d.endDate)} \\\\`);

    const bullets = getEnabledBullets(entry, isEnabled);
    if (bullets.length > 0) {
      lines.push('\\begin{itemize}');
      for (const b of bullets) {
        lines.push(`    \\item ${passthrough(b.text)}`);
      }
      lines.push('\\end{itemize}');
    }

    if (i < entries.length - 1) {
      lines.push('\\vspace{2pt}');
    }
  }

  lines.push('');
  lines.push('\\vspace{5pt}');
  return lines.join('\n');
}

function generateProjects(
  title: string,
  entries: ResumeEntry[],
  isEnabled: (id: string, def: boolean) => boolean
): string {
  const lines: string[] = [];
  lines.push(`%==== ${title.toUpperCase()} ====%`);
  lines.push(`\\header{\\textbf{${title.toUpperCase()}}}`);
  lines.push('\\vspace{3pt}');

  for (const entry of entries) {
    const d = entry.data as ProjectData;
    let dateStr: string;
    if (d.startDate && d.endDate) {
      dateStr = d.startDate === d.endDate
        ? escapeLatex(d.startDate)
        : `${escapeLatex(d.startDate)} -- ${escapeLatex(d.endDate)}`;
    } else if (d.startDate) {
      dateStr = escapeLatex(d.startDate);
    } else if (d.endDate) {
      dateStr = escapeLatex(d.endDate);
    } else {
      dateStr = '';
    }
    const nameLatex = d.url
      ? `\\href{${d.url}}{\\textbf{${escapeLatex(d.name)}}}`
      : `\\textbf{${escapeLatex(d.name)}}`;
    lines.push(`${nameLatex} \\hfill ${dateStr} \\\\`);

    const bullets = getEnabledBullets(entry, isEnabled);
    if (bullets.length > 0) {
      lines.push('\\begin{itemize}');
      for (const b of bullets) {
        lines.push(`    \\item ${passthrough(b.text)}`);
      }
      lines.push('\\end{itemize}');
    }
  }

  lines.push('\\vspace{6pt}');
  return lines.join('\n');
}

function generateAchievements(
  title: string,
  entries: ResumeEntry[],
  isEnabled: (id: string, def: boolean) => boolean
): string {
  const lines: string[] = [];
  lines.push(`%==== ${title.toUpperCase()} ====%`);
  lines.push(`\\header{\\textbf{${title.toUpperCase()}}}`);
  lines.push('\\vspace{4pt}');
  lines.push('\\begin{itemize}');

  for (const entry of entries) {
    const bullets = getEnabledBullets(entry, isEnabled);
    if (bullets.length > 0) {
      for (const b of bullets) {
        lines.push(`    \\item ${passthrough(b.text)}`);
      }
    } else {
      const d = entry.data as AchievementData;
      if (d.description) {
        lines.push(`    \\item ${passthrough(d.description)}`);
      }
    }
  }

  lines.push('\\end{itemize}');
  return lines.join('\n');
}
