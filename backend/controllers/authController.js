    const User = require("../models/user");
    const jwt = require("jsonwebtoken");
    const bcrypt = require("bcrypt");

    const authController ={
        registerUser:async (req, res) => {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.password, salt);

                //Create new user
                const newUser =  await new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashed,
                }); 

                //Save to DB
                const user = await newUser.save();
                res.status(200).json(user);
            } catch (error) {
                    console.error("Register error:", error);
                    res.status(500).json({ message: error.message, stack: error.stack });
            }
        },

        //Login
        loginUser: async (req, res) =>{
            try {
                const user = await User.findOne({ username: req.body.username });
                if(!user){
                    return res.status(404).json("Wrong username");     
                }
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if(!validPassword){
                     res.status(404).json("Wrong password");
                }
                if(user && validPassword){  
                    const accessToken = jwt.sign(
                        {   
                            id: user.id,
                            admin:user.admin,
                        },
                        process.env.JWT_ACCESS_KEY,
                        {expiresIn:"1h"}
                        );
                        const { password, ...others } = user._doc; // loai bo password chi lay nhung thong tin con lai
                        res.status(200).json({...others,accessToken});
                    }                
            } catch (error) {
                res.status(500).json(error);
            }
        }
    };

    module.exports = authController;