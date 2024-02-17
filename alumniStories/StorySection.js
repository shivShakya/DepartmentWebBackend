import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    Topic: String,
    Content: {type : String , require : true},
    Image: String,
    createdBy : String,
    DateTime : { type: Date, default: Date.now }
});

const storySection = mongoose.model('AlumniStories', storySchema);

export default storySection;
