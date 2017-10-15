const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const users = require('./userdb').users;
const bcrypt = require('bcrypt');
const saltRounds = 10;

passport.serializeUser(function(user,done){
	console.log("serialize");
	done(null,user.id);
});
	
passport.deserializeUser(function(userId,done){
	console.log("deserialize");
	users.findOne({
		where:{
			id:userId
		}
	}).then(function(user){
		done(null,user);
	})
});

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile,done) {
    users.findOrCreate({ 
    	where:{ googleId: profile.id },
    	defaults:{
    		fullname:profile.displayName,
    		email:profile.emails[0].value,
    		token:accessToken,
    		refreshToken:refreshToken,
    		googleId:profile.id
    	}
    }).spread(function(user, created){
    	if(created){
    		console.log('new user created ::::: ' + user.id);
    	}
    	done(null,user);
    })


});

const localStrategy = new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passReqToCallback: true
	},
	function(req,email,password,done){
		console.log("brace yourself local strategy is running!!");
		users.findOne({
			where:{
				email:email
			}
		}).then(function(user){
			if(user){
				console.log("about to bcrypt compare")
				bcrypt.compare(password,user.passwordhash).then(function(res){
					if(res){
						console.log(res);
						done(null,user);
					}
					else{
						console.log(res);
						done(null,false,req.flash('loginMessage','wrong password'));
					}
				})
			}
			else{
				done(null,false,req.flash('loginMessage','user not found'));
				//done(null,false,{message:'user not found'});
			}
		}).catch(function(err){
			throw err;
		})
});

passport.use(googleStrategy);

passport.use(localStrategy);

module.exports = passport;