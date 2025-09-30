import mongoose from "mongoose";

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize : 3,
        });
        console.log("DB Connected");
    }catch(err){
        console.error("DB Connection error: ",err.message);
        process.exit(1);
    }
};
export default connectDB;