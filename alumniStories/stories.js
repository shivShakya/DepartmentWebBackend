import express from 'express';
import upload from '../User/Picture.js';
import storySection from './StorySection.js';
import cloudinary from 'cloudinary';

const router = express.Router();

router.use((req, res, next) => {
    next();
});

router.post('/postStory', upload.single('image') , async (req, res) => {
    try {
        const { Topic, Content , createdBy } = req.body;

        const currentDate = new Date();
        const newStory = new storySection({
            Topic,
            Content,
            createdBy,
            DateTime: currentDate
        });
        await newStory.save();

        if (req.file) {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, { folder: 'user-images' });
            newStory.Image = cloudinaryResponse.secure_url;
            await newStory.save();    
        }
        res.status(201).json({ message: 'Story created successfully', story: newStory });
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/getStoriesByCreator/:creator', async (req, res) => {
    try {
        const creator = req.params.creator;
        const stories = await storySection.find({ createdBy: creator });
        if (!stories || stories.length === 0) {
            return res.status(404).json({ message: 'No stories found for the given creator' });
        }
        res.status(200).json({ message: 'Stories found', stories: stories });
    } catch (error) {
        console.error('Error fetching stories by creator:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/deleteStory/:id', async (req, res) => {
    try {
        const storyId = req.params.id;
        const story = await storySection.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        await storySection.findByIdAndDelete(storyId);   
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
