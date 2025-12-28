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
const validateEditData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "emailId",
    "about",
  ];

  const updates = Object.keys(req.body);

  // 1️⃣ Empty request body check
  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  // 2️⃣ Allow only whitelisted fields
  const isValidOperation = updates.every((field) =>
    allowedFields.includes(field)
  );

  if (!isValidOperation) {
    throw new Error("Invalid fields in update request");
  }

  // 3️⃣ Field-specific validation
  if (req.body.firstName && req.body.firstName.length < 4) {
    throw new Error("First name must be at least 4 characters");
  }

  if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
    throw new Error("Invalid email format");
  }

  if (
    req.body.gender &&
    !["male", "female"].includes(req.body.gender)
  ) {
    throw new Error("Gender must be male or female");
  }

  return true;
};

module.exports = {
  validateSignUpData,
  validateEditData,
};