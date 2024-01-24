const {promisify} = require('util');
// eslint-disable-next-line import/no-extraneous-dependencies

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require("../models/userModel");
const sendEmail = require('../utils/email');



// eslint-disable-next-line arrow-body-style
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        status: 'success',
        token,
        data:{
            user: user
        }
    })
}


// exports.signup = async(req, res, next) => {
//     const newUser = await User.create({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         passwordConfirm: req.body.passwordConfirm
//     });

    

//     const token = signToken(newUser._id);
    
//     try{
//         res.status(201).json({
//             status: 'success',
//             token,
//             data:{
//                 user: newUser
//             }
//         })

//     }catch(err){
//         res.status(404).json({
//         status: 'fail',
//         message: err
//         })
    
//     }
// }

exports.signup = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!passwordConfirm) {
      return res.status(400).json({
          status: 'fail',
          message: 'Please provide a password confirmation',
      });
  }

  try {
      const newUser = await User.create({
          name: name,
          email: email,
          password: password,
          passwordConfirm: passwordConfirm,
      });

      const token = signToken(newUser._id);

      res.status(201).json({
          status: 'success',
          token,
          data: {
              user: newUser,
          },
      });
  } catch (err) {
      res.status(404).json({
          status: 'fail',
          message: err,
      });
  }
  
};


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password');
        if (user && await user.correctPassword(password, user.password)) {
            user.active = true;
            user.loginTime = new Date();
            await user.save();
      
            // Set res.locals.user for subsequent middleware/routes
            res.locals.user = user;
      
            // Continue with creating and sending token
            createSendToken(user, 200, res);
          } else {
            // Handle incorrect credentials
            res.status(401).json({
              status: 'fail',
              message: 'Authentication failed',
            });
          }
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
   
};


exports.finishWork = async (req, res, next) => {
    console.log('Request Body:', req.body);
    const { email, workHours } = req.body;
    try {
      
      console.log('Received email:', email);
      
  
      // Find the user by email
      const user = await User.findOne({ email });
      if(user){
        console.log(email)
      }
      if (!user) {
        console.log("user.email not recieved");
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
          
        });
        
      }
      if(user)console.log(user.email);
      // Update the user document with finish time and work duration
      
      user.workHours = workHours;
      user.finishTime=new Date();
      await user.save();
  
      res.status(200).json({
        status: 'success',
        message: 'Work time saved successfully',
      });
    } catch (error) {
        console.error('Error saving work time:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
 
  };
  


exports.logout = async (req, res) => {
    try {
      const user = req.user;
  
      // Record logout time
      user.logoutTime = new Date();
      user.active=false;
      await user.save();
  
      res.clearCookie('jwt');
  
      res.status(200).json({
        status: 'success',
        message: 'User logged out successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
  
