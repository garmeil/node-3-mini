require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const mc = require(`${__dirname}/controllers/messages_controller`);
const createInitialSession = require(`${__dirname}/middlewares/session`);
const filter = require(`${__dirname}/middlewares/filter`);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookies: { maxAge: 1000 }
  })
);
app.use((req, res, next) => createInitialSession(req, res, next));

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.use((req, res, next) => {
  if (req.method === "PUT" || req.method === "POST") {
    filter(req, res, next);
  } else {
    next();
  }
});

const messagesBaseUrl = "/api/messages";
app.post(messagesBaseUrl, mc.create);
app.get(messagesBaseUrl, mc.read);
app.put(`${messagesBaseUrl}`, mc.update);
app.delete(`${messagesBaseUrl}`, mc.delete);
app.get(`${messagesBaseUrl}/history`, mc.history);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
