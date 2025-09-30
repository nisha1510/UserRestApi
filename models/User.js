import mongoose from "mongoose";

const userSchema =  mongoose.Schema({
  id: {
    type : String,
    required : true,
    unique : true
  },
  fullName: {
    type : String,
    required : true,
    trim : true
  },
  email: {
    type : String,
    required: true, 
    unique: true,
    lowercase: true, 
    trim: true
    // match :[/^\S+@\S+\.\S+$/, 'Invalid email format']
  }
},
{
  timestamps : true
});

const User = mongoose.model('User', userSchema);
export default User;
