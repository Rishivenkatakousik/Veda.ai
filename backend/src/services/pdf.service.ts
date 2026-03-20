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
  lightGray: "#999999",
  easy: "#22c55e",
  moderate: "#f59e0b",
  challenging: "#ef4444"
} as const;

const difficultyColor = (d: string): string => {
  if (d === "easy") return COLORS.easy;
  if (d === "challenging") return COLORS.challenging;
  return COLORS.moderate;
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
    const pageWidth =
      (doc.page?.width ?? 595.28) -
      (doc.page?.margins?.left ?? 55) -
      (doc.page?.margins?.right ?? 55);

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
      .text(`Time Allowed: ${header.timeAllowed}`, 55, timeMarksY, {
        width: pageWidth / 2,
        align: "left"
      });
    doc.text(`Maximum Marks: ${header.maxMarks}`, 55 + pageWidth / 2, timeMarksY, {
      width: pageWidth / 2,
      align: "right"
    });

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
      .moveTo(55, doc.y)
      .lineTo(55 + pageWidth, doc.y)
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
        const diffBadge = `[${q.difficulty}]`;
        const marksSuffix = ` [${q.marks} Mark${q.marks > 1 ? "s" : ""}]`;

        doc
          .fontSize(FONT_SIZES.body)
          .font("Helvetica-Bold")
          .fillColor(COLORS.black)
          .text(prefix, { continued: true });

        doc
          .font("Helvetica")
          .fillColor(difficultyColor(q.difficulty))
          .text(diffBadge, { continued: true });

        doc
          .fillColor(COLORS.black)
          .font("Helvetica")
          .text(` ${q.text}${marksSuffix}`);

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
