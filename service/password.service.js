import bcrypt from "bcrypt";

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const comparePassword = async (password, hash) =>
  await bCrypt.compare(password, hash);

export { hashPassword, comparePassword };
