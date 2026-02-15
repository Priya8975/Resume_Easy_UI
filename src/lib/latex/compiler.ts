export interface LatexCompilationResult {
  success: boolean;
  pdfBlob?: Blob;
  errorLog?: string;
}

/**
 * Compiles LaTeX to PDF using latex-on-http API.
 * Falls back to error message with .tex download suggestion.
 */
export async function compileToPdf(
  texContent: string
): Promise<LatexCompilationResult> {
  try {
    return await compileViaLatexOnHttp(texContent);
  } catch (error) {
    return {
      success: false,
      errorLog: `Compilation service failed: ${error instanceof Error ? error.message : String(error)}\n\nYou can download the .tex file and compile it on Overleaf or locally with pdflatex.`,
    };
  }
}

async function compileViaLatexOnHttp(
  texContent: string
): Promise<LatexCompilationResult> {
  const response = await fetch('https://latex.ytotech.com/builds/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'pdflatex',
      resources: [
        {
          main: true,
          content: texContent,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, errorLog: errorText };
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/pdf')) {
    const pdfBlob = await response.blob();
    return { success: true, pdfBlob };
  }

  // If not PDF, it's likely an error log
  const errorText = await response.text();
  return { success: false, errorLog: errorText };
}

/**
 * Downloads content as a file.
 */
export function downloadFile(content: string | Blob, filename: string, mimeType?: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
