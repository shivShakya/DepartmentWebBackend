import express from 'express';
import UserProfile from '../User/UserProfile.js';
const router = express.Router();

router.use((req, res, next) => {
    next();
});

router.get('/Alumni', async (req, res) => {
    try {
        const alumni = await UserProfile.find({ Role: 'Alumni' });
        res.status(200).json(alumni);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/Student', async (req, res) => {
    try {
        const student = await UserProfile.find({ Role: 'Student' });
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/Teacher', async (req, res) => {
    try {
        const teacher = await UserProfile.find({ Role: 'Teacher' });
        res.status(200).json(teacher);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




export default router;
