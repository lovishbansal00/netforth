const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ error: "All fields are required" });
  
  if (!isEmail(email))
    return res.status(400).json({ error: "Invalid email address" });
  if (password.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 characters long" });

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    if (!user) return res.status(500).json({ error: "Failed to create user" });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  if (!isEmail(email))
    return res.status(400).json({ error: "Invalid email address" });
  if (password.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 characters long" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
};
