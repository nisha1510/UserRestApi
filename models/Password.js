import mongoose from "mongoose";

const passwordSchema =  mongoose.Schema({
  userId: { 
    type: String, 
    ref: 'User', 
    required: true 
  }, 
  hashedPassword: { 
    type: String, 
    required: true 
  } 
}, 
{ 
  timestamps: true 
});

const Password = mongoose.model('Password',passwordSchema);
export default Password;
