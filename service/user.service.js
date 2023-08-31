import User from "./schemas/user.schema";

const createUser = async ({ email, password }) =>
  await User.create({ email, password });

const findUserByEmail = async (email) => await User.findOne({ email });

const findUserById = async (id) => await User.findOne({ _id: id });

export { createUser, findUserByEmail, findUserById };
