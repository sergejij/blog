import { body } from "express-validator";

export const loginValidation = [
    body('email','Invalid email format').isEmail(),
    body('password', 'The password must be at least 5 characters long').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email','Invalid email format').isEmail(),
    body('password', 'The password must be at least 5 characters long').isLength({ min: 5 }),
    body('fullName', 'Enter a name').isLength({ min: 3 }),
    body('avatarUrl', 'Invalid link to the avatar').optional().isURL(),
];


export const postCreateValidation = [
    body('title','Enter title of article').isLength({ min: 3 }).isString(),
    body('text', 'Enter text of article').isLength({ min: 3 }).isString(),
    body('tags', 'Wrong tags format (use array)').optional().isString(),
    body('imageUrl', 'Invalid link to the image').optional().isString(),
];
