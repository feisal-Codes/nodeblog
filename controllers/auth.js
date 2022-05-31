const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const user = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devworldprac@gmail.com",
    pass: "0708897463Aa",
  },
});

exports.getLogin = (req, res) => {
  // console.log(req.get("Cookie"))
  //   console.log(req.session);
  res.render("blog/login", {
    errorMessage: req.flash("error"),
  });
};

//set-cookie is a reserved name for setting a cookie on the response header
exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        console.log("user doesnt exist");
        req.flash("error", "invalid email address or password!");

        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then(isMatched => {
          if (isMatched) {
            req.session.loggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              return res.redirect("back");
            });
          }

          res.status(204).send();
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
    res.redirect("/");
  });
};

exports.passwordReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })

      .then(user => {
        if (!user) {
          req.flash("error, no account is associated with that email");
          return res.redirect("reset-password");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then(results => {
          let mailOptions = {
            from: "devworldprac@gmail.com",
            to: user.email,
            subject: "Test Email",
            html: `<p>click on the link below to reset your password</p>
                <p><a href="http://127.0.0.1:3002/reset-password/${token}">Click here</a></p>`,
          };

          transporter.sendMail(mailOptions, err => {
            if (err) {
              console.log("failed to send!", err);
            } else {
              console.log("email sent successfully!");
              res.send("check your email");
            }
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("blog/reset-password", {
    errorMessage: message,
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.render("blog/set-password", {
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.setNewPassword = (req, res, next) => {
  const { userId, passwordToken, password } = req.body;
  let user;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then(resetUser => {
      user = resetUser;
      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    });
};
