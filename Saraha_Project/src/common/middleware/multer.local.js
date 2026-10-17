import multer from "multer";
import path from "path";
import fs from "fs";
import { badRequestException } from "../exceptions/index.js";
import { fileTypeFromBuffer, fileTypeFromFile } from "file-type";

export const fileTypes = {
  images: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  pdfs: ["application/pdf"],
  vidoes: ["video/mp4"],
};

// ---------------------- FUNCTIONS --------------------------
const processSingleFile = async ({ file, fileType }) => {
  let result;

  // store on memory
  if (file.buffer) {
    result = await fileTypeFromBuffer(file.buffer);
  } else if (file.path) {
    // store on local storage
    result = await fileTypeFromFile(file.path);
  }

  const mime = result?.mime;

  if (!result || !fileType.includes(mime)) {
    // delete unsupported file
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return null;
  }

  if (file.buffer) {
    const folderPath = "./uploads";
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    const fullPath = `${folderPath}/${Date.now()}.${result.ext}`;
    fs.writeFileSync(fullPath, file.buffer);
    file.fullPath = fullPath;
  }

  return file;
};

const checkValidFiles = ({ req, file, processed, approvedFiles }) => {
  if (processed) approvedFiles.push(processed);
  else {
    req.rejectedFiles.push({
      name: file.originalname,
      reason: "Invalid file type",
    });
  }
};

const processFilesList = async ({ files, fileType, req }) => {
  const approvedFiles = [];

  for (const file of files) {
    const processed = await processSingleFile({
      file,
      fileType,
    });
    checkValidFiles({
      req,
      file,
      processed,
      approvedFiles,
    });
  }
  return approvedFiles;
};
// -----------------------------------------------------------

// store data on local storage
export const multerLocal = ({ fileName, fileType }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.resolve(fileName);
      // create folder if not exists
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.fieldname}-${file.originalname}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    req.rejectedFiles = req.rejectedFiles || [];
    if (!fileType.includes(file.mimetype)) {
      req.rejectedFiles.push({
        name: file.originalname,
        reason: `Unsupported mimetype: ${file.mimetype}`,
      });
      // skip the invalid file
      return cb(null, false);
    }
    // accepts valid file
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
  });
};

// store data on RAM
export const multerMemory = ({ fileType }) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (!fileType.includes(file.mimetype)) {
      return cb(badRequestException("This format is not supported"));
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
  });
};

export const processFiles = ({ fileType }) => {
  return async (req, res, next) => {
    try {
      req.rejectedFiles = req.rejectedFiles || [];
      // Signle
      if (req.file) {
        // return file if approved || return nothing if rejected
        const [approved] = await processFilesList({
          files: [req.file],
          file,
          req,
        });
        req.file = approved || null;
        // Array
      } else if (Array.isArray(req.files) && req.files.length > 0) {
        req.files = processFilesList({
          files: req.files,
          fileType,
          req,
        }); // keeps only valid files
        // Fields
      } else if (
        typeof req.files == "object" &&
        Object.keys(req.files).length > 0
      ) {
        for (const key of Object.keys(req.files)) {
          req.files[key] = await processFilesList({
            files: req.files[key],
            fileType,
            req,
          });
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
