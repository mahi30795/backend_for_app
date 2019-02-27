const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const mod = require('../middleware/module');

function login(req,res){
    console.log(req.body);
    User.findOne({'local.email':req.body.email},function(err,data) {
        if (err) {
            res.json({
                status:false,
                msg:'An error occured'
            });
        }
        if(data){
            if (!validPassword(req.body.password,data.local.password)) {
                res.json({
                    status:false,
                    msg:'Invalid password'
                })
              }
              else {
                req.session.userid=data._id;
                res.json({
                    status:true,
                    data:data
                });
              }
        }
        else{
            res.json({
                status:false,
                msg:'Invalid email'
            })
        }
    });
}

function signup(req,res){
    User.findOne({email:req.body.email},function(err,data){
        if(err){
            res.json({
                status:false,
                msg:'An error occured'
            });
        }
        if(data){
            res.json({
                status:false,
                msg:'Email already exists'
            });
        }
        else{
            const newUser = new User({
                email:req.body.email,
                local:{
                    email:req.body.email,
                    password: genHash(req.body.password)
                }
            });
            newUser.save(function(err,data){
                if(err){
                    res.json({
                        status:false,
                        msg:'An error occured'
                    });
                }
                if(data){
                    res.json({
                        status:true,
                        user:data
                    });
                }
            });
        }
    });
}

function getUser(req,res){
    User.findOne({_id:req.session.userid},function(err,data){
        if(err){
            res.json({
                status:false,
                msg:'An error occured'
            });
        }
        res.json({
            status:true,
            user:data
        })
    })
    
}

function validPassword(password,hash) {
    return bcrypt.compareSync(password, hash);
  };

function genHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = {login,getUser,signup};