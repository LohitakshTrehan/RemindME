const express = require('express');
const router = express.Router();
const bp = require('body-parser');
const passport = require('../passport.js');
const users = require('../userdb').users;
const expressValidator = require('express-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(bp.urlencoded({extended: true}));
router.use(bp.json());
router.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares!

router.post('/',function(req,res,next) {
    console.log('inside register post request');
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('confirmpassword', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('confirmpassword', 'Passwords do not match, please try again.').equals(req.body.password);

    // Additional validation to ensure username is alphanumeric with underscores and dashes
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
            return;
        }
        else{

            if(req.body.password == req.body.confirmpassword){
                bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
                    //Store hash in password DB.
                    users.create({
                        firstname:req.body.firstname,
                        lastname:req.body.lastname,
                        username:req.body.username,
                        email:req.body.email,
                        passwordhash:hash,
                        sex:req.body.sex,
                        dob:req.body.dob
                    }).then(function(){
                        //res.send({success:true})
                        users.findOne({
                            where:{
                                username:req.body.username
                            }
                        }).then(function(user){
                            req.login(user,(err)=>{
                                // console.log(user.id);
                                res.redirect('/private');
                            })
                        }).catch(function(err){
                            throw err;
                        })
                    }).catch(function(err){
                        throw err;
                    })
                })
            }
        }
    })
});


module.exports = router;