/**
 * Escapes special LaTeX characters in user-provided text.
 * Characters that need escaping: # $ % & ~ _ ^ \ { }
 */
export function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([#$%&_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * For bullet point text that intentionally contains LaTeX commands
 * (e.g., \textbf{}, \&), pass through without escaping.
 */
export function passthrough(text: string): string {
  return text;
}
