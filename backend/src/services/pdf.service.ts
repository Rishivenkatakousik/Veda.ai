import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import type { GeneratedPaper } from "../validators/generated-paper.validator";

const PDF_DIR = path.resolve("generated-pdfs");

if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true });
}

const FONT_SIZES = {
  schoolName: 16,
  subjectClass: 12,
  sectionTitle: 13,
  body: 11,
  small: 9
} as const;

const COLORS = {
  black: "#000000",
  gray: "#555555",
  lightGray: "#999999"
} as const;

const stripLeadingQuestionEnumeration = (text: string): string =>
  text.replace(/^\d+\.\s*/, "").trim();

/** Plain label for PDF (black text only — no color styling). */
const formatDifficultyLabel = (difficulty: string): string => {
  const d = difficulty.trim();
  if (!d) return difficulty;
  return d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
};

export const generatePdf = async (
  assignmentId: string,
  paper: GeneratedPaper
): Promise<string> => {
  const filePath = path.join(PDF_DIR, `${assignmentId}.pdf`);

  return new Promise<string>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 55, right: 55 }
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const { header, studentSection, sections, answerKey } = paper;
    const left = doc.page.margins.left;
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc
      .fontSize(FONT_SIZES.schoolName)
      .font("Helvetica-Bold")
      .text(header.schoolName, { align: "center" });

    doc.moveDown(0.3);
    doc
      .fontSize(FONT_SIZES.subjectClass)
      .font("Helvetica")
      .text(`Subject: ${header.subject}`, { align: "center" });

    doc.text(`Class: ${header.className}`, { align: "center" });

    doc.moveDown(0.5);

    const timeMarksY = doc.y;
    doc
      .fontSize(FONT_SIZES.body)
      .text(`Time Allowed: ${header.timeAllowed}`, left, timeMarksY, {
        width: pageWidth / 2,
        align: "left"
      });
    doc.text(`Maximum Marks: ${header.maxMarks}`, left + pageWidth / 2, timeMarksY, {
      width: pageWidth / 2,
      align: "right"
    });

    // Explicit x,y on text() leaves doc.x at the start of the last box — reset so
    // following lines use the full content width from the left margin.
    doc.x = left;
    doc.moveDown(1);
    doc
      .fontSize(FONT_SIZES.body)
      .text("All questions are compulsory unless stated otherwise.", {
        align: "left"
      });

    doc.moveDown(0.8);
    const underline = "______________________________";
    doc
      .fontSize(FONT_SIZES.body)
      .text(`${studentSection.nameLabel}: ${underline}`)
      .text(`${studentSection.rollNumberLabel}: ${underline}`)
      .text(`${studentSection.classSectionLabel}: ${underline}`);

    doc.moveDown(1);
    doc
      .moveTo(left, doc.y)
      .lineTo(left + pageWidth, doc.y)
      .strokeColor(COLORS.lightGray)
      .stroke();
    doc.moveDown(0.5);

    for (const section of sections) {
      doc
        .fontSize(FONT_SIZES.sectionTitle)
        .font("Helvetica-Bold")
        .fillColor(COLORS.black)
        .text(section.title);

      if (section.instructions) {
        doc
          .fontSize(FONT_SIZES.small)
          .font("Helvetica-Oblique")
          .fillColor(COLORS.gray)
          .text(section.instructions);
      }

      doc.moveDown(0.4);

      section.questions.forEach((q, qi) => {
        const prefix = `${qi + 1}. `;
        const marksSuffix = ` [${q.marks} Mark${q.marks > 1 ? "s" : ""}]`;
        const stem = stripLeadingQuestionEnumeration(q.text);

        doc
          .fontSize(FONT_SIZES.body)
          .font("Helvetica-Bold")
          .fillColor(COLORS.black)
          .text(prefix, { continued: true });

        doc
          .font("Helvetica")
          .fillColor(COLORS.black)
          .text(`[${formatDifficultyLabel(q.difficulty)}] `, { continued: true });

        doc.text(`${stem}${marksSuffix}`);

        const opts = q.options;
        if (opts && opts.length > 0) {
          doc.moveDown(0.15);
          doc.fontSize(FONT_SIZES.small).fillColor(COLORS.gray);
          for (const line of opts) {
            doc.font("Helvetica").text(line, { indent: 18 });
          }
          doc.fillColor(COLORS.black);
        }

        doc.moveDown(0.25);
      });

      doc.moveDown(0.6);
    }

    if (answerKey) {
      doc.addPage();
      doc
        .fontSize(FONT_SIZES.sectionTitle)
        .font("Helvetica-Bold")
        .fillColor(COLORS.black)
        .text("Answer Key", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(FONT_SIZES.body)
        .font("Helvetica")
        .text(answerKey);
    }

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

export const getPdfPath = (assignmentId: string): string | null => {
  const filePath = path.join(PDF_DIR, `${assignmentId}.pdf`);
  return fs.existsSync(filePath) ? filePath : null;
};
