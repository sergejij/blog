import {validationResult} from "express-validator";

const handleValidationErrors = (res, resp, next) => {
    const errors =  validationResult(res);
    if(!errors.isEmpty()) {
        resp.status(400).json(errors.array());
        return;
    }

    next();
}

export default handleValidationErrors;
