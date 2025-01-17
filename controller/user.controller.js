import {
  createUser,
  findUserByEmail,
  findUserByToken,
  findUserByVerificationToken,
  updateUserById,
} from "../service/user.service.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/password.hashing.js";
import "dotenv/config";
import generateAvatar from "../utils/avatar/avatar.generator.js";
import createFilePath from "../utils/create.filePath.js";
import { AVATAR_DIR, TEMP_DIR } from "../utils/avatar/avatar.variables.js";
import { relocateFile, removeFile } from "../utils/handle.file.js";
import optimizeAvatar from "../utils/avatar/avatar.optimizer.js";
import { nanoid } from "nanoid";
import sendVerificationEmail from "../config/sendGrid.config.js";

const secret = process.env.SECRET;

const userBodySchema = Joi.object({
  email: Joi.string().email({ maxDomainSegments: 3 }).required(),
  password: Joi.string().min(8).required(),
});

const subscriptionBodySchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const emailBodySchema = Joi.object({
  email: Joi.string().email({ maxDomainSegments: 3 }).required(),
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
    const avatarURL = generateAvatar(normalizedEmail);
    const verificationToken = nanoid();
    await createUser(
      normalizedEmail,
      hashedPassword,
      avatarURL,
      verificationToken
    );
    await sendVerificationEmail(email, verificationToken);
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
    const isUserVerified = user.verify;

    if (!user || !isPasswordValid) {
      res.status(401).json({ message: "Email or password is incorrect" });
      return;
    }

    if (!isUserVerified) {
      res.status(401).json({ message: "Email is not verified yet" });
      return;
    }

    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    await updateUserById(user.id, { token });

    res.json({
      token,
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
  const { id } = req.user;

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

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { path: originalPath, originalName } = req.file;
    const temporaryPath = createFilePath(TEMP_DIR, originalName);
    const targetPath = createFilePath(AVATAR_DIR, originalName);
    await relocateFile(originalPath, temporaryPath);
    await optimizeAvatar(temporaryPath, targetPath);
    await removeFile(temporaryPath);
    await updateUserById(userId, { avatarURL: targetPath });
    return res.json({
      status: "success",
      code: 200,
      message: "New avatar added successfully.",
      avatarURL: targetPath,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
};

const submitVerification = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await findUserByVerificationToken(verificationToken);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { _id } = user;
    await updateUserById(_id, { verificationToken: null, verify: true });
    return res.json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
};

const sendVerificationToken = async (req, res, next) => {
  const { value, error } = emailBodySchema.validate(req.body);
  const { email } = value;

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { verificationToken, verify } = user;

    if (verify) {
      res.status(400).json({ message: "Verification has already been passed" });
      return;
    }

    await sendVerificationEmail(email, verificationToken);
    return res.json({
      status: "success",
      code: 200,
      message: "Verification email sent",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
};

export {
  create,
  login,
  logout,
  getCurrent,
  updateSubscriptionStatus,
  updateAvatar,
  submitVerification,
  sendVerificationToken,
};
