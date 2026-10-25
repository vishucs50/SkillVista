export async function extractResumeText({ buffer, contentType }) {
  if (contentType === "text/plain") {
    return buffer.toString("utf8");
  }

  if (contentType === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      return (await parser.getText()).text;
    } finally {
      await parser.destroy();
    }
  }

  const mammoth = await import("mammoth");
  return (await mammoth.extractRawText({ buffer })).value;
}
