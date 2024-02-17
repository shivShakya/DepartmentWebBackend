import express from 'express';
import cors from 'cors';
import { connectToDatabase }from './Connection/Connection.js';
import user from './User/User.js';
import story from './alumniStories/stories.js';
import otp from './Emails/Varification.js';
import filter from './Filters/filters.js';
import env from 'dotenv';
env.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/images/store', express.static('/Users/jyoti-alok/Desktop/Department/Backend/store'));

connectToDatabase();
app.use('/user', user);
app.use('/varification', otp);
app.use('/story', story);
app.use('/filter', filter)



app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
})
