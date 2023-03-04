import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './Routes/UserRouter.js'
import { errorHandler } from './Midllewares/errorMiddlewares.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB()
// main router
app.get('/',(req, res)=> {
    res.send('API is running...');
});
// other router 
app.use('/api/users',userRouter)
const PORT = process.env.PORT || 5000;
// error handling middleware
app.use(errorHandler)
app.listen(PORT, ()=> {
    console.log(`Server running in http://localhost:${PORT}`);
});
