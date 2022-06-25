import jwt from 'jsonwebtoken';

const checkAuth = (req, resp, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const { _id } = jwt.verify(token, 'secretKey');
            req.userId = _id;

            next(); // return to callback
        } catch (e) {
            resp.status(403).json({
                message: 'Does not have access'
            });
        }
    } else {
        resp.status(403).json({
            message: 'Does not have access'
        });
    }
}

export default checkAuth;
