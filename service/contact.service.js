import Contact from "./schemas/contact.schema";

const getAllContacts = async () => {
  await Contact.find();
};

const getContactById = async (id) => {
  await Contact.findOne({ _id: id });
};

const createContact = async ({ name, email, phone }) => {
  await Contact.create({ name, email, phone });
};

const updateContact = async ({ id, fields }) => {
  await Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = async (id) => {
  await Contact.findByIdAndRemove({ _id: id });
};

export {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
