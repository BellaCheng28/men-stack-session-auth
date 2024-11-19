import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 10,
    // Not a validation! https://mongoosejs.com/docs/validation.html#the-code%3Eunique%3C/code%3E-option-is-not-a-validator
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  }
})

const User = mongoose.model("User", userSchema)

export default User
