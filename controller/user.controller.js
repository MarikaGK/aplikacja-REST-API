import { createUser } from "../service/user.service";
import Joi from "joi";

const userBodySchema = Joi.object({
  email: Joi.string().email({ maxDomainSegments: 2 }).required(),
  password: Joi.string().min(8).required(),
});

const create = async (res, req, next) => {
    const { value, error } = userBodySchema.validate(req.body);
    const { email, password } = value;

    if (error) {
        res.status(400).json({ message: error.message });
    return;
    }

    try {

    } catch (e) {
        console.error(e);
        next(e);
    }
}