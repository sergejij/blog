import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

export const register = async (req, resp) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            resp.status(400).json(errors.array());
            return;
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash =  await bcrypt.hash(password.toString(), salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });

        const user = await doc.save();
        const { passwordHash, ...userData} = user._doc;

        const token = jwt.sign({
            _id: user._id,
        }, 'secretKey',{ expiresIn: '30d' });

        resp.json({
            ...userData,
            token
        })
    } catch (e) {
        console.error("Error:", e)
        resp.status(500).json({
            message: 'Error by register'
        });
    }

};

export const login = async (req, resp) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            resp.status(404).json({
                message: 'User not found',
            });
            return;
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            resp.status(400).json({
                message: 'Wrong login or password',
            })
            return;
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secretKey',{ expiresIn: '30d' });

        const { passwordHash, ...userData} = user._doc;

        resp.json({
            ...userData,
            token
        })
    } catch (e) {
        console.error("Error:", e)
        resp.status(500).json({
            message: 'Error by login'
        });
    }
};

export const getMe = async (req, resp) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            resp.status(404).json({
                message: 'User not found',
            })
            return;
        }

        const { passwordHash, ...userData} = user._doc;

        resp.json(userData);
    } catch (e) {
        console.error("Error:", e)
        resp.status(500).json({
            message: 'Error by search user'
        });
    }
}
