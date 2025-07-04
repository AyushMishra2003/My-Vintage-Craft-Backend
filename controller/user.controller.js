import UserModel from "../models/user.model.js";
import AppError from "../utlis/error.utlis.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Environment Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use .env for security

// Sign Up Controller
const signup = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists with this email", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// Sign In Controller
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return next(new AppError("Invalid email or password", 401));
    // }

    // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
    
    });
  } catch (error) {
    console.log(error);
    
    return next(new AppError(error.message, 500));
  }
};

// Get All Users
const getUser = async (req, res, next) => {
  try {
    const allUser = await UserModel.find({});
    res.status(200).json({
      success: true,
      message: "Users fetched",
      data: allUser,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export { signup, signin, getUser };
