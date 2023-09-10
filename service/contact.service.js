import Contact from "./schemas/contact.schema.js";

const getAllContacts = async (owner) => {
  return Contact.find({ owner });
};

const getContactById = (id, owner) => {
  return Contact.findOne({ _id: id, owner });
};

const createContact = ({ name, email, phone, owner }) => {
  return Contact.create({ name, email, phone, owner });
};

const updateContact = (id, owner, field) => {
  const contact = Contact.findOne({ _id: id, owner });
  if (!contact) {
    return null;
  }
  return Contact.findByIdAndUpdate(
    { _id: id },
    field,
    { new: true }
  );
};

const removeContact = (id, owner) => {
  return Contact.findByIdAndRemove({ _id: id, owner });
};

export {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
