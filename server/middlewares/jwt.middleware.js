import { verifyJWTToken } from "../services/jwt.service.js";

export const jwtAuthVerify = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    verifyJWTToken(token)
      .then((decodedToken) => {
        req.userId = decodedToken.userId;
        next();
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({
          status: false,
          message: "Invalid token",
        });
      });
  } else {
    res.status(401).json({
      status: false,
      message: "No token provided",
    });
  }
};
