import express from 'express';
import dotenv from 'dotenv';
dotenv.config();


const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


console.log(process.env.ULTRAVOX_API_KEY);
console.log(process.env.AGENT_ID);

// Import our routes and mount them
import { router as twilioRoutes } from './routes/twilio.js';

app.use('/twilio/', twilioRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});