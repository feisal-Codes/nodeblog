const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const User = require("./models/user");
const BlogRoutes = require("./routes/blog");
const AdminRoutes = require("./routes/admin");
// const isAuth= require("./middleware/isAuth")

const mongoose = require("mongoose");

const app = express();
const store = mongoDbStore({
  uri: config,
  collection: "sessions",
});
const csrfProtection = csrf();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// app.use(bodyParser.json());
app.use(
  session({
    secret: "this is awesome",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//using csrf as a middle ware,the package adds a csrftoken to the request body
//when you register a middleware , you can use it anywhere in the app
app.use(csrfProtection);

app.use(flash());





// transporter.sendMail(mailOptions,(err)=>{
//  if(err){
//    console.log("failed to send!",err)
//  }
//  else{
//    console.log("email sent successfully!")
//  }
// })




app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  //this fields are sent for every view that is rendered
  res.locals.isAuthenticated = req.session.loggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", AdminRoutes);

app.use(BlogRoutes);

app.use("*", (req, res, next) => {
  res.send("404! Page not found");
});

//databse connection
mongoose
  .connect(config)
  .then(result => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: "feisal",
    //       email: "feisalmib@gmail.com",
    //     });
    //     user.save();
    //   }
    // });

    app.listen(3002, () => {
      console.log("listening on port 3002");
    });
  })
  .catch(err => {
    console.log(err);
  });
