require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

function verifyToken(req, res, next ) {
    const token = req.headers["x-access-token"];
  if (token) {
    const decoded = jwt.verify(token, SECRET);
    if (decoded) {
      req.userId = decoded.id;
    } else {
      return res.status(401).json({ Error: "Token Invalid" });
    }
  } else {
    return res.status(400).json({ Auth: false, message: "No token" });
  }
  next();
}

module.exports = verifyToken;
