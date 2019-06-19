const jwt =require('jsonwebtoken');


exports.generateToken = async (payload) => {
    const token = await jwt.sign(payload,process.env.SECRET);
    return token;
}