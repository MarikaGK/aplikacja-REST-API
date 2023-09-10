import path from "node:path";
import multer from "multer";
import { AVATAR_DIR, AVATAR_MAX_SIZE } from "../utils/avatar/avatar.variables";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATAR_DIR);
  },
  filename: (req, file, cb) => {
    const unixSuffix = Date.now();
    cb(null, unixSuffix + "-" + file.originalname);
  },
  limits: {
    fileSize: AVATAR_MAX_SIZE,
  },
});

const upload = multer({
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg" && ext !== ".gif") {
      return cb(
        new Error(
          "Wrong extension type! You can upload avatar only with extension: .png, .jpg, .jpeg or .gif."
        ),
        false
      );
    }
    cb(null, true);
  },
  storage,
});

export default upload;
