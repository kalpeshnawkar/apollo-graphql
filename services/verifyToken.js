const jwt =require('jsonwebtoken');


exports.verifyToken = async (token) => {
    const payload = jwt.verify(token,process.env.SECRET);
    return payload;
}