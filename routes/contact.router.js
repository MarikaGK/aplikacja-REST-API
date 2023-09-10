import { Router } from "express";
import {
  create,
  get,
  getById,
  remove,
  update,
  updateStatusContact,
} from "../controller/contact.controller.js";

const contactRouter = Router();

contactRouter.get("/", get);

contactRouter.get("/:contactId", getById);

contactRouter.post("/", create);

contactRouter.delete("/:contactId", remove);

contactRouter.put("/:contactId", update);

contactRouter.patch("/:contactId/favorite", updateStatusContact);

export default contactRouter;
