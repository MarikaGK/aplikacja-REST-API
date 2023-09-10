import {
  createContact,
  getAllContacts,
  getContactById,
  removeContact,
  updateContact,
} from "../service/contact.service.js";
import Joi from "joi";

const contactBodySchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email({ maxDomainSegments: 2 }).required(),
  phone: Joi.string().min(9).max(20).required(),
});

const favoriteBodySchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const get = async (req, res, next) => {
  const owner = req.user.id;
  try {
    const results = await getAllContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const owner = req.user.id;
  try {
    const result = await getContactById(contactId, owner);
    console.log(result);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const create = async (req, res, next) => {
  const owner = req.user.id;
  const { value, error } = contactBodySchema.validate(req.body);
  const { name, email, phone } = value;
  
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }
  
  try {
    const result = await createContact({ name, email, phone, owner });
    
    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  const owner = req.user.id;
  const { contactId } = req.params;
  const { value, error } = contactBodySchema.validate(req.body);
  const { name, email, phone } = value;
  
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }
  
  try {
    const result = await updateContact(contactId, { name, email, phone, owner, favorite });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  const owner = req.user.id;
  const { contactId } = req.params;
  const { value, error } = favoriteBodySchema.validate(req.body);
  const { favorite } = value;
  
  if (error) {
    res.status(400).json({ message: "missing field favorite" });
    return;
  }
  
  try {
    const result = await updateContact(contactId, owner, { favorite });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  const owner = req.user.id;
  const { contactId } = req.params;
  try {
    const result = await removeContact(contactId, owner);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export { get, getById, create, update, updateStatusContact, remove };
