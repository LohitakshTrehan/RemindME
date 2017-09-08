const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const users = require('./userdb').users;
const bcrypt = require('bcrypt');
//const saltRounds = 10;

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

const localStrategy = new LocalStrategy(
	function(username,password,done){
		console.log("brace yourself local strategy is running!!");
		users.findOne({
			where:{
				username:username
			}
		}).then(function(user){
			console.log("about to bcrypt compare")
			bcrypt.compare(password,user.passwordhash).then(function(res){
				if(res){
					console.log(res);
					done(null,user);
				}
				else{
					console.log(res);
					done(null,false,{message:'wrong password'});
				}
			})
		}).catch(function(err){
			done(null,false,{message:'user not found'});
		})
});

passport.use(localStrategy);

module.exports = passport;