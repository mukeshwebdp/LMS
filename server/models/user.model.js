import { Schema,model } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true,'Name is required'],
        minLength:[5,'Name must be at least than 50 characters'],
        maxLength:[50,'Name should be less than 50 character'],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    Password: {
        type: String,
        required: [true,'Password is required'],
        minLength: [8,'Password must be at least 8 characters'],
        select: false
    },
    role:{
        type: String,
        enum:['USER','ADMIN'],
        default: 'USER'
    },
    avatar:{
        public_id: {
            type: String
        },
        secure_url:{
            type: String
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date

    
},{timestamps:true});

const User = model('User',userSchema)

export default User;