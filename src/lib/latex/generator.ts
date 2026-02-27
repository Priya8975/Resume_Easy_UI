import type { ResumeData, ResumeSection, ResumeEntry, ContactInfo, EducationData, SkillsData, ExperienceData, ProjectData, AchievementData, BulletPoint } from '@/types/resume';
import { escapeLatex, passthrough } from './escaper';

/**
 * Generates a complete .tex string from resume data.
 * Uses the FAANGPath resume.cls template format.
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

  // Preamble
  lines.push('\\documentclass{resume}');
  lines.push('');
  lines.push('\\usepackage[left=0.5 in,top=0.4in,right=0.5 in,bottom=0.4in]{geometry}');
  lines.push('\\usepackage{tabularx}');
  lines.push('\\usepackage{xcolor}');
  lines.push('\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}}');
  lines.push('\\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}');

  // Contact info in preamble (before \begin{document})
  lines.push(generateContactPreamble(resume.contactInfo));
  lines.push('');
  lines.push('\\begin{document}');

  // Sections
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

function generateContactPreamble(contact: ContactInfo): string {
  const lines: string[] = [];
  lines.push(`\\name{${escapeLatex(contact.name).toUpperCase()}}`);

  const parts: string[] = [];
  if (contact.phone) parts.push(escapeLatex(contact.phone));
  if (contact.location) parts.push(escapeLatex(contact.location));
  if (contact.email) {
    parts.push(`{\\color{blue}\\href{mailto:${contact.email}}{${escapeLatex(contact.email)}}}`);
  }
  if (contact.linkedin) {
    const linkedinDisplay = contact.linkedin
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/\/$/, '');
    parts.push(`{\\color{blue}\\href{${contact.linkedin}}{${escapeLatex(linkedinDisplay)}}}`);
  }

  if (parts.length > 0) {
    lines.push(`  \\address{${parts.join(' $\\mid$ ')}}`);
  }

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
  lines.push('\\vspace{-0.2em}');
  lines.push('');
  lines.push(`\\begin{rSection}{${title}}`);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const d = entry.data as EducationData;

    const institutionPart = d.location
      ? `${escapeLatex(d.institution)}, ${escapeLatex(d.location)}`
      : escapeLatex(d.institution);
    lines.push(`\\textbf {${institutionPart}}  \\hfill {\\bf ${escapeLatex(d.startDate)} - ${escapeLatex(d.endDate)}}\\\\`);
    lines.push(` {\\bf ${escapeLatex(d.degree)} in ${escapeLatex(d.field)}}  \\hfill \\\\`);

    const bullets = getEnabledBullets(entry, isEnabled);
    for (const b of bullets) {
      lines.push(`${passthrough(b.text)}`);
    }

    if (i < entries.length - 1) {
      lines.push('');
      lines.push('\\vspace{-0.2em}');
    }
  }

  lines.push('');
  lines.push('\\end{rSection}');
  return lines.join('\n');
}

function generateSkills(
  title: string,
  entries: ResumeEntry[]
): string {
  const lines: string[] = [];
  lines.push(`\\begin{rSection}{${title}}`);
  lines.push('');

  for (const entry of entries) {
    const d = entry.data as SkillsData;
    lines.push(`\\textbf{${escapeLatex(d.category)}:} ${passthrough(d.items)} \\\\`);
  }

  lines.push('');
  lines.push('\\end{rSection}');
  return lines.join('\n');
}

function generateExperience(
  title: string,
  entries: ResumeEntry[],
  isEnabled: (id: string, def: boolean) => boolean
): string {
  const lines: string[] = [];
  lines.push('\\vspace{-0.2em}');
  lines.push('\\vspace{-0.2em}');
  lines.push('');
  lines.push(`\\begin{rSection}{${title}}`);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const d = entry.data as ExperienceData;

    lines.push('');
    lines.push(`\\textbf{${escapeLatex(d.company)}} \\hfill ${escapeLatex(d.startDate)} - ${escapeLatex(d.endDate)}\\\\`);
    const locationPart = d.location ? `\\textit{${escapeLatex(d.location)}}` : '';
    lines.push(`${escapeLatex(d.title)} \\hfill ${locationPart}`);

    const bullets = getEnabledBullets(entry, isEnabled);
    if (bullets.length > 0) {
      lines.push('');
      lines.push('\\vspace{-0.1em}');
      lines.push(' \\begin{itemize}');
      lines.push('   \\itemsep -4pt {} ');
      for (const b of bullets) {
        lines.push(`     \\item ${passthrough(b.text)}`);
      }
      lines.push(' \\end{itemize}');
    }

    if (i < entries.length - 1) {
      lines.push(' ');
      lines.push('\\vspace{-0.1em}');
    }
  }

  lines.push('');
  lines.push('\\end{rSection}');
  return lines.join('\n');
}

function generateProjects(
  title: string,
  entries: ResumeEntry[],
  isEnabled: (id: string, def: boolean) => boolean
): string {
  const lines: string[] = [];
  lines.push('\\vspace{-0.2em}');
  lines.push('');
  lines.push(`\\begin{rSection}{${title}}`);
  lines.push('');

  for (const entry of entries) {
    const d = entry.data as ProjectData;

    const displayName = d.shortName || d.name;
    const nameLatex = d.url
      ? `\\href{${d.url}}{\\textbf{${escapeLatex(displayName)}}}`
      : `\\textbf{${escapeLatex(displayName)}}`;

    const techPart = d.techStack ? ` $\\mid$ ${passthrough(d.techStack)}` : '';
    lines.push(`${nameLatex}${techPart}`);

    const bullets = getEnabledBullets(entry, isEnabled);
    if (bullets.length > 0) {
      lines.push('\\vspace{-0.4em}');
      lines.push('\\begin{itemize}\\itemsep -4pt');
      for (const b of bullets) {
        lines.push(`    \\item ${passthrough(b.text)}`);
      }
      lines.push('\\end{itemize}');
    }
    lines.push('');
  }

  lines.push('\\end{rSection}');
  return lines.join('\n');
}

function generateAchievements(
  title: string,
  entries: ResumeEntry[],
  isEnabled: (id: string, def: boolean) => boolean
): string {
  const lines: string[] = [];
  lines.push(`\\begin{rSection}{${title}}`);
  lines.push('');
  lines.push('\\begin{itemize} \\itemsep -4pt');

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
  lines.push('');
  lines.push('\\end{rSection}');
  return lines.join('\n');
}
