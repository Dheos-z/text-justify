import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
import redis from "redis";

const NUMBER_OF_WORDS_PER_PERIOD = 30;
const PERIOD_IN_SECONDS = 10;

dotenv.config();
const PORT = process.env.PORT || 3000;
const redisClient = redis.createClient();
const app = express();

app.use(express.json());

app.post("/api/justify", (req, res) => {
  res.send("Hi");
});

app.post("/api/token", (req, res) => {
  const { userEmail } = req.body;
  const token = jwt.sign(userEmail, process.env.ACCESS_TOKEN_SECRET_KEY);
  res.send({ token });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, userEmail) => {
    if (err) return res.sendStatus(403);
    req.userEmail = userEmail;
    next();
  });
}

function authorizeRequest(req, res, next) {
  try {
    if (!redisClient) {
      throw new Error("Redis client does not exist");
    }

    const { userEmail } = req;
    const nbWordsInRequest = req.body.text.split(" ").length;
    const currentTimestamp = moment().unix();

    if (nbWordsInRequest > NUMBER_OF_WORDS_PER_PERIOD)
      return res.sendStatus(402);

    redisClient.get(userEmail, (err, userRecord) => {
      if (err) throw err;
      if (userRecord === null) {
        console.log(`No record found`);
        redisClient.set(
          userEmail,
          JSON.stringify({
            periodStartTimestamp: currentTimestamp,
            nbWordsProcessed: nbWordsInRequest,
          })
        );
        next();
      } else {
        console.log(`Found record: ${userRecord}`);
        const { periodStartTimestamp, nbWordsProcessed } = JSON.parse(
          userRecord
        );
        const newRecord = { periodStartTimestamp, nbWordsProcessed };
        if (periodStartTimestamp + PERIOD_IN_SECONDS < currentTimestamp) {
          newRecord.periodStartTimestamp = currentTimestamp;
          newRecord.nbWordsProcessed = 0;
        }
        if (
          newRecord.nbWordsProcessed + nbWordsInRequest >
          NUMBER_OF_WORDS_PER_PERIOD
        )
          return res.sendStatus(402);
        newRecord.nbWordsProcessed += nbWordsInRequest;
        redisClient.set(userEmail, JSON.stringify(newRecord));
        next();
      }
    });
  } catch (error) {
    next(error);
  }
}
