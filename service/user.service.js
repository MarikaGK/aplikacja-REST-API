import User from "./schemas/user.schema.js";

const createUser = async ({ email, password }) =>
  await User.create({ email, password });

const findUserByEmail = async (email) => await User.findOne({ email });

const findUserById = async (id) => await User.findOne({ _id: id });

const updateUserById = async (field, id) => {
  await User.findByIdAndUpdate({ _id: id }, field, { new: true });
};

const findUserByToken = async token => await User.findOne({ token });

export { createUser, findUserByEmail, findUserById, updateUserById, findUserByToken };
