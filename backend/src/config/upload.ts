import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { env } from "./env";

const uploadDir = path.resolve(env.UPLOAD_DIR);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueId = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (env.ALLOWED_UPLOAD_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname)
    );
  }
};

export const assignmentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_UPLOAD_SIZE_MB * 1024 * 1024,
    files: env.MAX_UPLOAD_FILES
  }
});
