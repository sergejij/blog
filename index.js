import express from 'express';
import mongoose from "mongoose";

import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import {getMe, login, register} from "./controllers/UserController.js";

mongoose
    .connect('mongodb+srv://sergejij:s123w123@cluster0.dk5ru.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Successful connection to mongo'))
    .catch((err) => console.error('ERROR connection to mongo:', err));

const app =  express();
app.use(express.json());

app.post('/auth/register', registerValidation, register);
app.post('/auth/login',  login);
app.get('/auth/me', checkAuth, getMe);

app.listen('3333', (e) => {
    if (e) {
        console.error(e);
        return;
    }
    console.log('Server started...');
});

