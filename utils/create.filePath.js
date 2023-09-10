import path from 'node:path';

const createFilePath = (dirPath, fileName) => path.join(dirPath, fileName);

export default createFilePath;