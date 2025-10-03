import mongoose from "mongoose";

const userSessionSchema =  mongoose.Schema({
userId : String,
refreshToken : String
});

const userSession = mongoose.model('userSession', userSessionSchema);
export default userSession;