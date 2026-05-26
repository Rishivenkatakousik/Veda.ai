import fs from "fs";
import path from "path";
import { env } from "../config/env";
const MAX_TOTAL_CHARS = 500_000;
const MAX_SINGLE_TEXT_CHARS = 200_000;
const MAX_INLINE_FILE_BYTES = 7 * 1024 * 1024;
const MAX_INLINE_TOTAL_BYTES = 18 * 1024 * 1024;
const MATERIAL_HEADER = "========================================\nREFERENCE MATERIALS (SOURCE FOR QUESTIONS)\n========================================";
const IMAGE_EXT_TO_MIME: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp"
};
export type InlineFilePart = {
    inlineData: { mimeType: string; data: string };
};
export type MaterialContext = {
    text: string;
    fileParts: InlineFilePart[];
};
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
export const buildMaterialContext = async (filenames: string[]): Promise<MaterialContext> => {
    if (!filenames.length) {
        return { text: "", fileParts: [] };
    }
    const chunks: string[] = [
        MATERIAL_HEADER,
        `Attached files: ${filenames.map((f) => path.basename(f)).join(", ")}`
    ];
    const fileParts: InlineFilePart[] = [];
    let inlineBytes = 0;
    for (const name of filenames) {
        const fullPath = resolveSafeFilePath(name);
        if (!fullPath || !fs.existsSync(fullPath)) {
            chunks.push(`\n--- ${path.basename(name)} ---\n(missing on server)`);
            continue;
        }
        const safeLabel = path.basename(fullPath);
        const ext = path.extname(fullPath).toLowerCase();
        const fileHeader = `\n--- ${safeLabel} ---`;
        try {
            if (ext === ".txt" || ext === ".md") {
                const text = fs.readFileSync(fullPath, "utf8").slice(0, MAX_SINGLE_TEXT_CHARS);
                chunks.push(`${fileHeader} (text)\n${text}`);
            }
            else if (ext === ".pdf") {
                const { PDFParse } = await import("pdf-parse");
                const buf = fs.readFileSync(fullPath);
                const parser = new PDFParse({ data: new Uint8Array(buf) });
                const result = await parser.getText();
                const text = (result.text || "").trim().slice(0, MAX_SINGLE_TEXT_CHARS);
                chunks.push(`${fileHeader} (text extracted from PDF)\n${text || "(no extractable text)"}`);
            }
            else if (ext === ".docx") {
                const mammoth = await import("mammoth");
                const result = await mammoth.extractRawText({ path: fullPath });
                const text = (result.value || "").trim().slice(0, MAX_SINGLE_TEXT_CHARS);
                chunks.push(`${fileHeader} (text extracted from DOCX)\n${text || "(no extractable text)"}`);
            }
            else if (ext in IMAGE_EXT_TO_MIME) {
                const stat = fs.statSync(fullPath);
                if (stat.size > MAX_INLINE_FILE_BYTES || inlineBytes + stat.size > MAX_INLINE_TOTAL_BYTES) {
                    chunks.push(`${fileHeader} (image)\n(too large to attach inline — skipped)`);
                    continue;
                }
                const buf = fs.readFileSync(fullPath);
                inlineBytes += stat.size;
                fileParts.push({
                    inlineData: {
                        mimeType: IMAGE_EXT_TO_MIME[ext]!,
                        data: buf.toString("base64")
                    }
                });
                chunks.push(`${fileHeader} (image attached inline — READ the image visually and generate questions strictly from its content: text, diagrams, captions, problems, passages, illustrations.)`);
            }
            else {
                chunks.push(`${fileHeader}\n(Binary or unsupported format for auto-extraction; rely on filename and teacher instructions.)`);
            }
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "unknown error";
            chunks.push(`${fileHeader}\n(could not read: ${msg})`);
        }
    }
    let out = chunks.join("\n");
    if (out.length > MAX_TOTAL_CHARS) {
        out = `${out.slice(0, MAX_TOTAL_CHARS)}\n...[material context truncated]`;
    }
    return { text: out, fileParts };
};
