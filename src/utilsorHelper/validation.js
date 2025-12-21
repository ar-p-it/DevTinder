const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name not valid ");
  } else if (firstName.length < 4 || lastName.length > 20) {
    throw new Error("Name not in range of 4 to 20 chars ");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Not an email  ");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Weak passwrod");
  }
};

module.exports = {
  validateSignUpData,
};
