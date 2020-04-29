const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = "testing123";

const validationRegister = require("../validation/register");

module.exports = {
  register: (req, res, next) => {
    let obj = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    const { errors, isValid } = validationRegister(obj);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          return res.status(400).json({ email: "Email already exists" });
        } else {
          return User.create(obj);
        }
      })
      .then((response) => res.json(response))
      .catch((err) => {
        throw err;
      });
  },

  //fix it

  authenticated: function (req, res, next) {
    User.findOne({ email: req.body.email })
      .then((response, err) => {
        console.log(response);
        if (err) next(err);
        else {
          if (
            response != null &&
            bcrypt.compareSync(req.body.password, response.password)
          ) {
            jwt.sign(
              {
                id: response._id,
              },
              privateKey,
              { expiresIn: 60 * 60 },
              (err, token) => {
                res.json(token);
              }
            );
          } else {
            res.json({ status: err });
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  },
  getAllData: (req, res, next) => {
    User.find({})
      .then((result) => {
        res.json({ status: "200", data: result });
      })
      .catch((err) => err);
  },
  getDataById: (req, res) => {
    User.findById(req.params.usersId)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
  deleteById: (req, res) => {
    User.findByIdAndRemove(req.params.userId)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
};
