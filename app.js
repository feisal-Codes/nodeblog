const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');


const User = require("./models/user");
const BlogRoutes = require("./routes/blog");
const AdminRoutes = require("./routes/admin");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
  }));
  // app.use(bodyParser.json());

app.use((req, res, next) => {
  User.findById("626c2f8a4ead4f6f87b96c43")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use("/admin", AdminRoutes);

app.use(BlogRoutes);

//databse connection
mongoose
  .connect(
    "mongodb+srv://feisal:aqNw7jkUTDBFWx6h@cluster0.ponza.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "feisal",
          email: "feisalmib@gmail.com",
        });
        user.save();
      }
    });

    app.listen(3002, () => {
      console.log("listening on port 3002");
    });
  })
  .catch(err => {
    console.log(err);
  });
