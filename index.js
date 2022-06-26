import express from 'express';
import multer from 'multer';
import mongoose from "mongoose";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import {getMe, login, register} from "./controllers/UserController.js";
import { getAllPosts, getOnePost, createPost, removePost, updatePost } from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
    .connect('mongodb+srv://sergejij:s123w123@cluster0.dk5ru.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Successful connection to mongo'))
    .catch((err) => console.error('ERROR connection to mongo:', err));

const app =  express();

const storage = multer.diskStorage({
    destination: (_, __, cb) =>  {
       cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
       cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/register', registerValidation, handleValidationErrors, register);
app.post('/auth/login', loginValidation, handleValidationErrors, login);
app.get('/auth/me', checkAuth, getMe);

app.get('/posts', getAllPosts);
app.get('/posts/:id', getOnePost);
app.post('/posts', checkAuth, handleValidationErrors, postCreateValidation, createPost);
app.delete('/posts/:id', checkAuth, removePost);
app.patch('/posts/:id', checkAuth, postCreateValidation, updatePost);

app.post('/upload', checkAuth, upload.single('image'), (req, resp) => {
    resp.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.listen('3333', (e) => {
    if (e) {
        console.error(e);
        return;
    }
    console.log('Server started...');
});

