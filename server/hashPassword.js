const bcrypt = require("bcryptjs");

async function hashPassword() {
  try {
    const password = "Test123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Hashed password for "Test123":');
    console.log(hashedPassword);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

hashPassword();
