import "./polyfills";

function isPdf(buffer, contentType) {
  if (contentType === "application/pdf") return true;
  if (!buffer || buffer.length < 5) return false;
  return buffer.slice(0, 5).toString("utf8").startsWith("%PDF-");
}

function isDocx(contentType) {
  return (
    contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    contentType === "application/msword"
  );
}

export async function extractResumeText({ buffer, contentType }) {
  if (!buffer || buffer.length === 0) {
    return "";
  }

  // 1. PDF
  if (isPdf(buffer, contentType)) {
    try {
      const { extractText } = await import("unpdf");
      const { text } = await extractText(new Uint8Array(buffer));
      const fullText = Array.isArray(text) ? text.join("\n") : String(text || "");
      if (fullText.trim()) {
        return fullText.trim();
      }
    } catch (unpdfErr) {
      console.warn(
        "[extractResumeText] unpdf failed, trying stream extraction:",
        unpdfErr.message,
      );
    }

    // Fallback: extract plain text strings from PDF streams
    try {
      const raw = buffer.toString("binary");
      const textMatches = [...raw.matchAll(/\(([^)]+)\)\s*Tj/g)];
      if (textMatches.length > 5) {
        const text = textMatches.map((m) => m[1]).join(" ");
        if (text.trim().length > 30) return text.trim();
      }
    } catch {}
  }

  // 2. Word document (.docx)
  if (isDocx(contentType)) {
    try {
      const mammoth = await import("mammoth");
      const extracted = await mammoth.extractRawText({ buffer });
      if (extracted?.value?.trim()) {
        return extracted.value.trim();
      }
    } catch (docxErr) {
      console.warn("[extractResumeText] mammoth docx failed:", docxErr.message);
    }
  }

  // 3. Plain text or UTF-8 fallback
  try {
    const text = buffer.toString("utf8");
    if (text.trim()) {
      return text.trim();
    }
  } catch {}

  return "";
}
