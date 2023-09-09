import {
  createUser,
  findUserByEmail,
  findUserByToken,
  updateUserById,
} from "../service/user.service.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../service/password.service.js";
import "dotenv/config";

const secret = process.env.SECRET;

const userBodySchema = Joi.object({
  email: Joi.string().email({ maxDomainSegments: 3 }).required(),
  password: Joi.string().min(8).required(),
});

const subscriptionBodySchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const create = async (req, res, next) => {
  const { value, error } = userBodySchema.validate(req.body);
  const { email, password } = value;

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const userByEmail = await findUserByEmail(normalizedEmail);

    if (userByEmail) {
      res.status(409).json({ message: "Email in use" });
      return;
    }
    const hashedPassword = await hashPassword(password);
    await createUser(normalizedEmail, hashedPassword);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: normalizedEmail,
          subscription: "starter",
        },
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const login = async (req, res, __) => {
  const { value, error } = userBodySchema.validate(req.body);
  const { email, password } = value;

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await findUserByEmail(normalizedEmail);
    const isPasswordValid = await comparePassword(password, user.password);

    if (!user || !isPasswordValid) {
      res.status(401).json({ message: "Email or password is incorrect" });
      return;
    }

    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    await updateUserById(user.id, { token });

    res.json({
      token: token,
      user: {
        email: email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const logout = async (req, res, __) => {
  try {
    const id = req.user.id;
    const token = null;
    await updateUserById(id, { token });
    return res.json({
      status: "Success",
      code: 200,
      message: "User successfully logged out",
    });
  } catch (e) {
    console.error(e);
  }
};

const getCurrent = async (req, res, __) => {
  try {
    const token = req.user.token;
    const user = await findUserByToken(token);
    const { email, subscription } = user;
    return res.json({
      status: "Success",
      code: 200,
      data: {
        currentUser: {
          email: email,
          subscription: subscription,
        },
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const updateSubscriptionStatus = async (req, res, next) => {
  const { value, error } = subscriptionBodySchema.validate(req.body);
  const { subscription } = value;
  const { id } = req.user.id;

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  try {
    await updateUserById(id, { subscription });
    return res.json({
      status: "Success",
      code: 200,
      message: `User's subscription: ${subscription}.`,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export { create, login, logout, getCurrent, updateSubscriptionStatus };
