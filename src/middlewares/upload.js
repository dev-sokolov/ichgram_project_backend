import multer from "multer";
import HttpExeption from "../utils/HttpExeption.js";

const storage = multer.memoryStorage();

const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
};

const fileFilter = (req, file, callback) => {
  if (file.originalname.endsWith(".exe")) {
    callback(HttpExeption(400, ".exe files are not allowed"));
  } else {
    callback(null, true);
  }
};

const upload = multer({ storage, limits, fileFilter });

export default upload;


