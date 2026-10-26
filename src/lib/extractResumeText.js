import "./polyfills";

export async function extractResumeText({ buffer, contentType }) {
  if (contentType === "text/plain") {
    return buffer.toString("utf8");
  }

  if (contentType === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return parsed.text;
    } finally {
      await parser.destroy();
    }
  }

  const mammoth = await import("mammoth");
  const extracted = await mammoth.extractRawText({ buffer });
  return extracted.value;
}
