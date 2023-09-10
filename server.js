import "dotenv/config";
import app from "./app.js";
import connection from "./config/db.config.js";
import { createDirIfNotExist } from "./utils/handle.file.js";
import {
  PUBLIC_DIR,
  AVATAR_DIR,
  TEMP_DIR,
} from "./utils/avatar/avatar.variables.js";

const PORT = process.env.PORT || 3000;

connection()
  .then(() => {
    app.listen(PORT, async () => {
      await createDirIfNotExist(PUBLIC_DIR);
      await createDirIfNotExist(AVATAR_DIR);
      await createDirIfNotExist(TEMP_DIR);
      console.log(
        `Database connection successful. Server running. Use our API on port: ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(`Database connection failed. Error message: ${err.message}`);
    process.exit(1);
  });
