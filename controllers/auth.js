const { redirect } = require("express/lib/response");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res) => {
  // console.log(req.get("Cookie"))
  //   console.log(req.session);
  res.render("blog/login");
};

//set-cookie is a reserved name for setting a cookie on the response header
exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        console.log("user doesnt exist")

        return res.redirect("/signup");
      }
      bcrypt
        .compare(password, user.password)
        .then(isMatched => {
          if (isMatched) {
            req.session.loggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              return res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });

};
exports.getSignup = (req, res) => {
  res.render("blog/signup");
};

//set-cookie is a reserved name for setting a cookie on the response header
exports.postSignup = (req, res) => {
  //get the fields from the request

  //check if the email exists
  //create a new user if they dont exist else redirect to login if the exist

  console.log("*****************************");
  // console.log(req.body)
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        console.log("user  exist");
        return res.redirect("/login");
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          // console.log(result)
          const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
          });
          return newUser.save();
        })
        .then(result => {
          console.log("user saved successfuly");
          res.send(result);
        });
    })

    .catch(err => {
      console.log(err);
    });

  //  req.session.isLoggedin=true;
  //  res.setHeader("Set-Cookie", "loggedIn=true")
};
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
  };