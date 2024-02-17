import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    FirstName: String,
    MiddleName: String,
    LastName: String,
    Address: String,
    Semester: String,
    Email: { type: String, required: true, unique: true },
    Phone: { type: String, unique: true },
    Year: String,
    Position: String,
    Course: String,
    Company: String,
    Linkedin:{type: String , required: true , unique : true}, 
    Sector: String,
    Message: { type: String,required: true },
    Password: { type: String,unique: true , required: true },
    Image: String,
    Role: String,
    DateTime : { type: Date, default: Date.now }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
