const express = require("express");
const cookieParser = require("cookie-parser");
const login = require("./login.js");

const swaggerui = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const userRoutes = require("./routes/api/userRoutes.js");
const communityRoutes = require("./routes/api/communityRoutes.js");
const mbtiRoutes = require("./routes/api/mbtiRoutes.js");
const pageRoutes = require("./routes/pageRoutes.js");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WEB-KMN API DOCUMENTATION",
      version: "1.0.0",
    },
  },
  apis: ["./routes/api/*.js"],
};

const app = express();

const spacs = swaggerJsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));

const port = 4000;

app.use(express.json());
app.use(cookieParser());
login.users.set("margad@mail.com", {
  user_id: 1,
  fullname: "Margad",
  password: "123",
});
login.users.set("khanka@mail.com", {
  user_id: 2,
  fullname: "Khanka",
  password: "123",
});
login.users.set("nomio@mail.com", {
  user_id: 3,
  fullname: "Nomio",
  password: "123",
});

app.post("/login", (req, res) => {
  login.verifyLogin(req, res);
});
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  login.registerUser(username, email, password);
  res.status(201).send("User registered successfully");
});
app.use("/user", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/mbti", mbtiRoutes);
app.use("/", pageRoutes);

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`);
});
