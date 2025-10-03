import express from 'express'; 
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConnection.js';
import userRoutes from './routes/userRoutes.js'; 
import  todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser()); 
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// mongoose.connect(process.env.MONGO_URI, { 
//     maxPoolSize: 3,  
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
// })
//   .then(() => {
//     console.log('DB connected');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => console.log('MongoDB connection error:', err));


