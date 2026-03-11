import jwt from "jsonwebtoken";

//create access token
export const createAccessToken = (payload, screte, expiresIn) => {
    return jwt.sign(payload, screte, { expiresIn });

}

//create refresh token
export const createRefreshToken = (payload, screte, expiresIn) => {
    return jwt.sign(payload, screte, { expiresIn });

}

//verify token
export const verifyTokens = (token, screte) => {
    return jwt.verify(token, screte);
};