const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();

const db = new Sequelize({
    host:process.env.DB_HOST,
    username:process.env.DB_USER,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASS,
    dialect:process.env.DB_DIALECT
});


const users = db.define('userdb',{
    id:{
        type:Sequelize.DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fullname:{type:Sequelize.DataTypes.STRING , allowNull: false},
    email:{type:Sequelize.DataTypes.STRING , unique: true , allowNull: false}, 
    passwordhash:{type:Sequelize.DataTypes.STRING},
    dob:{type:Sequelize.DataTypes.DATEONLY},
    token:{type:Sequelize.DataTypes.STRING},
    refreshToken:{type:Sequelize.DataTypes.STRING},
    googleId:{type:Sequelize.DataTypes.STRING},
    resetPasswordToken:{type:Sequelize.DataTypes.STRING},
    resetPasswordExpires:{type:Sequelize.DataTypes.DATE},
    TaskDoneCounter:{type:Sequelize.DataTypes.INTEGER, defaultValue: 0},
    TaskNotDoneCounter:{type:Sequelize.DataTypes.INTEGER, defaultValue: 0}
},{
    timestamps: false
});

const userData = db.define('userDataDb',{
    userListName:{type:Sequelize.DataTypes.TEXT},
    userListCounter:{type:Sequelize.DataTypes.TEXT},
    userListData:{type:Sequelize.DataTypes.TEXT },
    userStats:{type:Sequelize.DataTypes.TEXT},
    userListTaskCounter:{type:Sequelize.DataTypes.TEXT}
})

userData.belongsTo(users);

db.sync().then(function () {
    console.log("database is ready");
});

module.exports = {
    users,
    userData
}
