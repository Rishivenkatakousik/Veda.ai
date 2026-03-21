import fs from "fs";
import path from "path";
import { env } from "../config/env";

const MAX_TOTAL_CHARS = 12_000;
const MAX_SINGLE_TEXT_CHARS = 8_000;

const resolveSafeFilePath = (storedName: string): string | null => {
  const uploadRoot = path.resolve(env.UPLOAD_DIR);
  const base = path.basename(storedName);
  const fullPath = path.resolve(uploadRoot, base);
  const relative = path.relative(uploadRoot, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return fullPath;
};

/**
 * Builds a text block for the AI prompt from uploaded material filenames.
 * Extracts plain text from .txt/.md, PDF text via pdf-parse, DOCX via mammoth;
 * other types are listed with a note that content was not extracted.
 */
export const buildMaterialContext = async (filenames: string[]): Promise<string> => {
  if (!filenames.length) {
    return "";
  }

  const chunks: string[] = [
    "--- Reference materials uploaded by the teacher ---",
    `Attached files: ${filenames.map((f) => path.basename(f)).join(", ")}`
  ];

  for (const name of filenames) {
    const fullPath = resolveSafeFilePath(name);
    if (!fullPath || !fs.existsSync(fullPath)) {
      chunks.push(`\n### ${path.basename(name)}\n(missing on server)`);
      continue;
    }

    const safeLabel = path.basename(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    try {
      if (ext === ".txt" || ext === ".md") {
        const text = fs.readFileSync(fullPath, "utf8").slice(0, MAX_SINGLE_TEXT_CHARS);
        chunks.push(`\n### ${safeLabel} (text)\n${text}`);
      } else if (ext === ".pdf") {
        // pdf-parse CJS export is not typed as callable under our moduleResolution
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse") as (
          data: Buffer
        ) => Promise<{ text?: string }>;
        const buf = fs.readFileSync(fullPath);
        const data = await pdfParse(buf);
        const text = (data.text || "").trim().slice(0, MAX_SINGLE_TEXT_CHARS);
        chunks.push(
          `\n### ${safeLabel} (text extracted from PDF)\n${text || "(no extractable text)"}`
        );
      } else if (ext === ".docx") {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ path: fullPath });
        const text = (result.value || "").trim().slice(0, MAX_SINGLE_TEXT_CHARS);
        chunks.push(
          `\n### ${safeLabel} (text extracted from DOCX)\n${text || "(no extractable text)"}`
        );
      } else {
        chunks.push(
          `\n### ${safeLabel}\n(Binary or unsupported format for auto-extraction; rely on filename and teacher instructions.)`
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      chunks.push(`\n### ${safeLabel}\n(could not read: ${msg})`);
    }
  }

  let out = chunks.join("\n");
  if (out.length > MAX_TOTAL_CHARS) {
    out = `${out.slice(0, MAX_TOTAL_CHARS)}\n...[material context truncated]`;
  }
  return out;
};
