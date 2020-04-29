const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validationRegister(data) {
  let errors = {};
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  if (Validator.isEmpty(data.password)) {
    errors.password = "password is required";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "confirm password is required";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
