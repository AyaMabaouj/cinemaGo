
import asyncHandler from "express-async-handler"
import User from "../Models/UserModels.js"
import bcrypt from 'bcryptjs'
import { generateToken } from '../Midllewares/Auth.js'

//register user
//post/api/user
const registerUser = asyncHandler(async (req,res) =>{
    const {userName, email, password,image} = req.body
    try{
      const userExists = await User.findOne({email})
      //check if user exists
      if(userExists){
        res.status(400)
        throw new Error("User alerady exists")
      }

      //hash password
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
      // create user
      const user = await User.create({
        userName,
        email,
        password: hashedPassword,
        image,
      });

     // if user created successfully send user data and token to client
     if(user){
      res.status(201).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    
     }

    else{
      res.status(400);
      throw new Error(" Invalid user data");
    }

    }catch(error){
     res.status(400).json({
      message: error.message
     });

    }
});

//login user
//post/api/user
const loginUser = asyncHandler(async (req,res) =>{
  const { email, password } = req.body;
  try{
    //find user in db
    const user = await User.findOne({email});
    //if user exist compare password with hashed password then send user data and token to client
    if(user && (await bcrypt.compare(password, user.password))){
      res.status(201).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }
    else{
      res.status(401);
      throw new Error(" Invalid email or password");
    }
  }catch(error){
    res.status(400).json({
     message: error.message
    });

   }

});

//update user profile
// put api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userName, email, image } = req.body;

  try {
    // Find user in db
    const user = await User.findById(req.user._id);

    // If user exists, update user data and save it in db
    if (user) {
      user.userName = userName || user.userName;
      user.email = email || user.email;
      user.image = image || user.image;

      const updatedUser = await user.save();

      // Send updated user data and token to client
      res.status(201).json({
        _id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        image: updatedUser.image,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
//delete user profile
// delete api/users
const deleteUserProfile = asyncHandler(async (req, res) => {

  try{
//find user in DB
const user = await User.findById(req.user._id);
//if user exists delete user from DB
if(user){
  //if user is admin throw error message
  if(user.isAdmin){
    res.status(400);
    throw new Error("can't delete admin user");
  }
  //else delete user from DB 
  await user.remove();
  res.json({ message: "User deleted successfully"});
}
//else send error message
else {
  res.status(404);
  throw new Error("User not found");
}
  }catch (error){
    res.status(400).json({message: error.message});
  }
});
//change user password
//put/api/users/password
const changeUserPassword = asyncHandler(async (req, res) => {
const {oldPassword, newPassword} = req.body;
try{
  // find user password
  const user = await User.findById(req.user._id)
//if user exists compare old password with hashed password then update user password and save it in DB
if(user && await bcrypt.compare(oldPassword, user.password)){
  //hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
  await user.save();
  res.json({message: "password changed!"});
}
//else send error message
else{
  res.status(401);
  throw new error("Invalid old password");
}
}catch (error){
  res.status(400).json({message : error.message});
}
});
//get all users
// get/api/users
const getUsers = asyncHandler(async (req, res) => {

  try{
    //find all users in  DB
    const users = await User.find({});
    res.json(users);
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

//delete user
//delete/api/user/:id
const deleteUser = asyncHandler(async(req,res)=>{
  try{
    //find user in DB
    const user = await User.findById(req.params.id);
    //if user exists delete user from DB
    if (user){
      //if user is admin throw error message
      if(user.isAdmin){
        res.status(400);
        throw new Error("Can't delete admin user");
      }
      //else delete user from DB
      await user.remove();
      res.json({message: "User dleted successfuly"});
    }
//else send error message
else{
  res.status(404);
  throw new Error("User not found");
}
  }catch(error){
    res.status(400).json({message: error.message});
  }
})

export {registerUser,
   loginUser,
   updateUserProfile,
  deleteUserProfile,
  changeUserPassword,
  getUsers,
  deleteUser,
};