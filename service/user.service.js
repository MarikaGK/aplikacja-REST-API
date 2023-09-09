import User from "./schemas/user.schema.js";

const createUser = (email, password) =>
{ return new User({ email, password }).save()};

const findUserByEmail = (email) => { return User.findOne({ email })};

const findUserById = (id) => { return User.findOne({ _id: id })};

const updateUserById = (id, field) => {
 return User.findByIdAndUpdate({ _id: id }, field, { new: true });
};

const findUserByToken = (token) => { return User.findOne({ token })};

export {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  findUserByToken,
};
