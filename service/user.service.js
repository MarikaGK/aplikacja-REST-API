import { token } from "morgan";
import User from "./schemas/user.schema.js";

const createUser = (email, password, avatarURL, verificationToken) => {
  return new User({ email, password, avatarURL, verificationToken }).save();
};

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

const findUserById = (id) => {
  return User.findOne({ _id: id });
};

const updateUserById = (id, field) => {
  return User.findByIdAndUpdate({ _id: id }, field, { new: true });
};

const findUserByToken = (token) => {
  return User.findOne({ token });
};

const findUserByVerificationToken = (verificationToken) => {
  return User.findOne({ verificationToken });
};

export {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  findUserByToken,
  findUserByVerificationToken,
};
