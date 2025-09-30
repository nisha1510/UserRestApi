import mongoose from "mongoose";

const userSessionSchema =  mongoose.Schema({
userId : String,
refreshToken : String

    // userId:{
    //     type: String,
    //     ref: 'User',
    //     required: true
    // },
    // refreshToken:{
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // createdAt:{
    //     type: Date,
    //     default: Date.now,
    //     expires: '7d'
    // }
});

const userSession = mongoose.model('userSession', userSessionSchema);
export default userSession;