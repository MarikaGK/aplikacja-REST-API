import fs from "fs/promises";

const isAccesible = (dir) =>
  fs
    .access(dir)
    .then(() => true)
    .catch(() => false);

const createDirIfNotExist = async (dir) => {
  if (!(await isAccesible(dir))) {
    await fs.mkdir(dir);
  }
};

const relocateFile = async (currentPath, targetPath) => {
  try {
    await fs.rename(currentPath, targetPath)
  } catch (err) {
    await fs.unlink(currentPath)
    return next(err)
  }
};

const removeFile = async filePath => {
  await fs.unlink(filePath, err => {
    if (err) throw err;
  });
};

export { createDirIfNotExist, relocateFile, removeFile };
