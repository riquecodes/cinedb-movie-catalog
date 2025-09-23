const express = require("express");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");

const movieApiRoutes = require("./routes/movies");
const commentApiRoutes = require("./routes/comments");
const authApiRoutes = require("./routes/auth");
const viewRoutes = require("./routes/views");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); 
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "sessaotestedevweb",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use("/api/movies", movieApiRoutes);
app.use("/api/comments", commentApiRoutes);
app.use("/api/auth", authApiRoutes);


app.use("/", viewRoutes);


module.exports = app;