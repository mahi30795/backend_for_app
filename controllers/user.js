const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const env = require('../config/env');
async function login(req,res){
    User.findOne({'local.email':req.body.email},function(err,data){
        if(err) console.log(err);
        if(data){
            if(validPassword(req.body.password,data.local.password)){
                res.json({
                    status:true,
                    user:data
                });
            }
            else{
                res.json({
                    status:false,
                    msg:'Incorrect password'
                });
            }
        }
        else{
            res.json({
                status:false,
                msg:'Invalid email'
            });
        }
        
    });
}



async function register(req,res){
    const hash = genHash(req.body.password);
    const user = new User({
        'local.email':req.body.email,
        'local.password':hash
    });
    user.save(function(err,data){
        if(err) console.log(err);
        console.log('Saved');
        res.json({
            status:true,
            msg:'Saved'
        });
    });

}

function validPassword(password,hash){
    return bcrypt.compareSync(password, hash);
}

function genHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }
module.exports = {login,register};