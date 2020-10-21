import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.post("/api/justify", authenticateToken, (req, res) => {
  res.send(justifyText(req.body.text));
});

app.post("/api/token", (req, res) => {
  const { email } = req.body;
  const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET_KEY);
  res.send({ token });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, email) => {
    if (err) return res.sendStatus(403);
    req.email = email;
    next();
  });
}

function justifyText(text) {
  return text;
}
