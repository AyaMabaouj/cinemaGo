import mongoose from 'mongoose'


const UserSchema = mongoose.Schema({

    userName:{
        type: String,
        required:[true,'Please add your name ']
    }, 
    email:{
        type: String,
        required:[true,'Please add your email '],
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required:[true,'Please add your password '],
        minlength: [6, 'Password must be at least 6 characters '],
    },
    image:{
        type: String,

    },
   
    isAdmin: {
        type: Boolean,
        default: false,
    },


},
{
    timestamps: true,
});

export default mongoose.model('User',UserSchema);

































