import express from 'express';
import bcrypt from 'bcrypt';
import UserProfile from './UserProfile.js';
import upload from './Picture.js';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dediy0rga',
  api_key: '185182492569826',
  api_secret: 'QSQwx-nuTdxE7iyWOu69wbSiVAs'
});

router.use((req, res, next) => {
    next();
});


const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const linkedinRegex = /^https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/;


router.post('/postUser', upload.single('image'), async (req, res) => {
    try {
        const {
            FirstName, MiddleName, LastName,
            Address, Semester, Email, Phone,
            Year, Position, Course,
            Company, Linkedin, Sector, Password, image,
            ConfirmPassword, Role, Message
        } = req.body;
        console.log(req.body);


        if (!passwordRegex.test(Password)) {
            return res.status(400).json({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and minimum 8 characters long" });
        }

        if (!emailRegex.test(Email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

    
      

        if (Password !== ConfirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (req.file && req.file.size > 200 * 1024) {
            return res.status(400).json({ message: "Image size should not exceed the limit of 200 KB" });
        }
        

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newUserProfile = new UserProfile({
            FirstName, MiddleName, LastName,
            Address, Semester, Email, Phone,
            Year, Position, Course,
            Company, Linkedin, Sector, Password: hashedPassword,
            Role,
            Message
        });

        const result = await newUserProfile.save();
        console.log({result});
        if (!result) {
            return res.status(500).json({ message: "Error occurred while saving user profile" });
        }

        console.log('hi');

        if (req.file) {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, { folder: 'user-images' });
            newUserProfile.Image = cloudinaryResponse.secure_url;
            newUserProfile.DateTime = new Date();
            await newUserProfile.save();    
        }
        console.log({newUserProfile});
       
        

        return res.status(200).json({ message: "Successfully inserted User in database" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});




router.post('/login', async (req, res) => {
    try {
        
        let queryLogin = { Email: req.body.Email, Role: req.body.role };
        console.log({queryLogin});

        const user = await UserProfile.findOne(queryLogin);
        console.log({user});
        if (!user) {
            return res.status(401).json({ message: "Authentication failed. Invalid email or password or role" });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed. Invalid email or password" });
        }

       let token = jwt.sign({ id: user._id, email: user.Email, role: user.Role, Name: `${user.FirstName} ${user.MiddleName} ${user.LastName}`, Address: user.Address , Phone: user.Phone, Image: user.Image , Message: user.Message}, process.env.TOKEN);
   
        console.log({ token });
        res.status(200).json({ token, message: "Successfully Logged in.", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});


router.put('/updateUserByEmail/:email', async (req, res) => {
    const { email } = req.params;
    const updatedFields = req.body;

    try {
        const user = await UserProfile.findOneAndUpdate({ Email: email }, updatedFields, { new: true });

        if (!user) {
            return res.status(404).json({ message: `User with email ${email} not found` });
        }

        res.status(200).json({ data: user, message: `Successfully updated user with email: ${email}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/userCounts', async (req, res) => {
    try {
        const alumniCount = await UserProfile.countDocuments({ Role: 'Alumni' });
        const studentCount = await UserProfile.countDocuments({ Role: 'Student' });
        const teacherCount = await UserProfile.countDocuments({ Role: 'Teacher' });
        res.status(200).json({ alumniCount, studentCount, teacherCount });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


export default router;
