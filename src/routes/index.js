require("dotenv").config();
const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");
const verifyToken = require("../controllers/verifyToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const users = require("../users");

const router = Router();

router.get("/greeting", verifyToken, (req, res, next) => {
  let user = users.find((user) => user.id === req.userId);

  user
    ? res.status(200).json({ Auth: true, greeting: `Good Moorning ${user.name}` })
    : res.status(404).send("No user found");
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  password = crypto.createHash("sha1").update(password).digest("hex");
  const exist = users.find(
    (user) => user.email === email && user.password === password
  );
  if (exist) {
    const token = jwt.sign({ id: exist.id }, SECRET, {
      expiresIn: 60 * 60,
    });
    return res.status(200).json({ Auth: true, Token: token });
  } else {
    return res.status(400).send("User or Password invalid");
  }
});

router.post("/register", (req, res, next) => {
  let { email, password, name } = req.body;
  const exist = users.find((user) => user.email === email);

  if (exist) {
    return res.send("The user is already registered");
  }
  if (email && password) {
    password = crypto.createHash("sha1").update(password).digest("hex");

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password,
    };
    users.push(newUser);
    res.status(200).send("User registered");
  }
});

module.exports = router;
