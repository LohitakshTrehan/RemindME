const express = require('express');
const path = require('path');
const session = require('express-session');
const cp = require('cookie-parser');
const bp = require('body-parser');
const passport = require('./passport.js');
const register = require('./routes/register.js');
const flash = require('connect-flash')
const db = require('./userdb').users;
const dbData = require('./userdb').userData;
const app = express();
const nodeMailer = require('nodemailer');
app.use(cp('somerandomcharactersthatnooneknowslikechimichonga'));
app.use(session({
    secret: 'somerandomcharactersthatnooneknowslikechimichonga',
    resave: false,
    saveUnitialized: true
}));
app.use(flash());
var timerIdListTask = [];  //ASSIGNMENT OF NEW ARRAY FOR STORING TIMER ID's
app.use(bp.urlencoded({extended: true}));
app.use(bp.json());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    console.log(req.user);
    next();
});

app.use('/register',register);

function checkLoggedIn(req,res,next){
    console.log('check logged in');
    if(req.user){
        next();
    }
    else{
        res.status(404).send('unauthorised');
    }
}

app.use('/',express.static(path.join(__dirname,"public")))

app.use('/private',checkLoggedIn,express.static(path.join(__dirname,'private')))


app.post('/login',passport.authenticate('local',{
    failureRedirect: '/',
    successRedirect: '/private',
    failureFlash: "couldn't log in"
}))
app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/')
})


app.listen(3000,function(){
    console.log("magic happens on port 3000");
})

// CODE FOR MANIPULATING VARIOUS DATA AND DATA BASE IN CLIENTJS.

app.get('/datainfo',function(req,res){

    db.findAll({
        where : {
            id : req.user.id
        }
    }).then(function(database){
        console.log(database);
        res.send(database);
    }).catch(function(err){
        console.log(err);
    })
})

app.post('/storeDatabase',function(req,res) {
    console.log(req.body);
    console.log(req.user.id)
    dbData.findOne({
        where : {
            userdbId : req.user.id
        }
    }).then(function(database){
        console.log(database);
        if(database == null){
            console.log("let see")
            dbData.create({
                userdbId: req.user.id,
                userListName: req.body.name,
                userListCounter: req.body.counterList,
                userListData: req.body.Tasks,
                userStats: "let's put some Value Later",
                userListTaskCounter: req.body.counter
            }).then(function () {
                res.send({success: true});
            })
        }
        else
            res.send({success: false});
    })
})

app.post('/updateDatabase',function(req,res) {
    console.log(req.body);
    console.log(req.user.id)
    dbData.findOne({
        where:{
            userdbId : req.user.id
        }
    }).then(function (data) {
        data.update({
            userListName: req.body.name,
            userListCounter: req.body.counterList,
            userListData: req.body.Tasks,
            userStats: "let's put some Value Later",
            userListTaskCounter: req.body.counter
        }).then(function () {
            res.send({success: true});
        })
    })
})

app.post('/updateTasks',function(req,res) {
    console.log(req.body);
    console.log(req.user.id)
    dbData.findOne({
        where:{
            userdbId : req.user.id
        }
    }).then(function (data) {
        data.update({
            userListTaskCounter: req.body.counterList,
            userListData: req.body.Tasks,
        }).then(function () {
            res.send({success: true});
        })
    })
})
app.get('/retrieveData',function(req,res){
    dbData.findOne({
        where: {
            userdbId : req.user.id
        }
    }).then(function(data){
        if(data != null) {
            console.log(data);
            res.send(data);
        }
    }).catch(function(err){
        console.log(err);
    })
})

//Sourabh For mailing data to User.
var smtpTransport = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: "remindmecommunity@gmail.com",
        pass: "nodesofiiit"
    }
});


app.post('/send',function(req,res) {
    var emailUser;
    db.findAll({
        where: {
            id: req.user.id
        }
    }).then(function (database) {
        console.log(database)
        emailUser = database[0].email;
        //console.log(req.body.residualTime + "  " + req.body.taskName)
        arr = req.body.id.split('T');
        listId = parseInt(arr[0]);
        taskId = parseInt(arr[1]);
        if(timerIdListTask[req.user.id] == null)
            timerIdListTask[req.user.id] = [];
        if(timerIdListTask[req.user.id][listId] == null)
            timerIdListTask[req.user.id][listId] = [];

        timerIdListTask[req.user.id][listId][taskId] = setTimeout(function () {
            var mailOptions = {
                from: 'remindmecommunity@gmail.com',
                to: emailUser,
                subject: "REMINDER",
                text:  req.body.taskName
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    console.log("Message sent: " + response.message);
                }
            });
            dbData.findOne({
                where: {
                    userdbId : req.user.id
                }
            }).then(function(data){
                counterList = JSON.parse(data.userListCounter);
                listTasks = JSON.parse(data.userListData);
                listName = JSON.parse(data.userListName);
                taskCounter = JSON.parse(data.userListTaskCounter);

                flag = false;
                for (let i = 0; i < counterList; i++) {
                    if (listName[i].id == listId) {
                        //  console.log("In the loop" + i)
                        listSequenceId = i;
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    flag = false;
                    let taskSequenceId = 0;
                    for (let i = 0; i < taskCounter[listSequenceId]; i++) {
                        if (listTasks[listSequenceId][i].id == req.body.id) {
                            taskSequenceId = i;
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        listTasks[listSequenceId].splice(taskSequenceId, 1);
                        taskCounter[listSequenceId]--;
                        listTasks = JSON.stringify(listTasks);
                        taskCounter = JSON.stringify(taskCounter);

                        data.update({
                            userListData : listTasks,
                            userListTaskCounter : taskCounter
                        }).then(function(){
                            /////////////////////////////////////////////////////////////////////////////////////////////
                                var x_pending,y_done;
                                db.findOne({
                                    where: userdbId = req.user.id
                                }).then(function(data){
                                    if(data != null) {
                                        console.log(data);
                                        x_pending = data.TaskNotDoneCounter;
                                        y_done = data.TaskDoneCounter;
                                        y_done++;
                                        x_pending--;
                                    }
                                }).then(function (value) {
                                    db.findOne({
                                        where: userdbId = req.user.id
                                    }).then(function(data){
                                        data.update({
                                            TaskDoneCounter: y_done,
                                            TaskNotDoneCounter: x_pending
                                        })
                                    })
                                }).catch(function(err){
                                    console.log(err);
                                })
                            /////////////////////////////////////////////////////////////////////////////////////////////
                            res.send({success:true})
                        })
                    }
                    else
                        res.send({success:false});
                }
                else
                    res.send({success:false});
            }).catch(function(err){
                console.log("error");
            })
        },req.body.residualTime);
    })
});


app.post('/deleteTimeOut',function(req,res){
    arr = req.body.id.split('T');
    arr[0] = parseInt(arr[0]);
    arr[1] = parseInt(arr[1]);
    // console.log("timer : " +  timerIdListTask[arr[0]][arr[1]]);
    if(timerIdListTask[req.user.id][arr[0]][arr[1]] != null)
    {
        clearTimeout(timerIdListTask[req.user.id][arr[0]][arr[1]]);
        clearInterval(timerIdListTask[req.user.id][arr[0]][arr[1]]);
        res.send({success : true});
    }else{
        res.send({success : false});
    }
})



app.post('/send2',function(req,res) {
    arr = req.body.id.split('T');
    listId = parseInt(arr[0]);
    taskId = parseInt(arr[1]);
    var emailUser;
    db.findAll({
        where: {
            id: req.user.id
        }
    }).then(function (database) {
        console.log(database)
        emailUser = database[0].email;
        var R_Time = parseInt(req.body.residualTime);
        if (timerIdListTask[req.user.id] == null)
            timerIdListTask[req.user.id] = [];
        if (timerIdListTask[req.user.id][listId] == null)
            timerIdListTask[req.user.id][listId] = [];

        timerIdListTask[req.user.id][listId][taskId] = setInterval(function () {
            if (R_Time - 864000000 < 2147482647) {
                R_Time = R_Time - 864000000
                sendEmailForLong(req.body.taskName, R_Time, listId, taskId, req.user.id, req.body.id,emailUser)
            }
            R_Time = R_Time - 864000000;
        }, 864000000)
    })
})

function sendEmailForLong(taskName,R_Time,listId,taskId,id,fullTaskId,emailUser){
    clearInterval(timerIdListTask[id][listId][taskId]);

    timerIdListTask[id][listId][taskId] = setTimeout(function () {
        var mailOptions = {
            from: 'remindmecommunity@gmail.com',
            to: emailUser,
            subject: "REMINDER",
            text:  taskName
        }
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.end("error");
            } else {
                console.log("Message sent: " + response.message);
                res.send({success: true});
            }
        });
        dbData.findOne({
            where: {
                userdbId : id
            }
        }).then(function(data){
            counterList = JSON.parse(data.userListCounter);
            listTasks = JSON.parse(data.userListData);
            listName = JSON.parse(data.userListName);
            taskCounter = JSON.parse(data.userListTaskCounter);
            //console.log(arr[0] + " " + arr[1]);
            flag = false;
            for (let i = 0; i < counterList; i++) {
                if (listName[i].id == listId) {
                    //  console.log("In the loop" + i)
                    listSequenceId = i;
                    flag = true;
                    break;
                }
            }
            if (flag) {
                flag = false;
                let taskSequenceId = 0;
                for (let i = 0; i < taskCounter[listSequenceId]; i++) {
                    if (listTasks[listSequenceId][i].id == fullTaskId) {
                        taskSequenceId = i;
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    listTasks[listSequenceId].splice(taskSequenceId, 1);
                    taskCounter[listSequenceId]--;
                    listTasks = JSON.stringify(listTasks);
                    taskCounter = JSON.stringify(taskCounter);
                    //////use .then()  use id instead req.id here/////////////////////////////////////////////////////
                    data.update({
                        userListData : listTasks,
                        userListTaskCounter : taskCounter
                    }).then(function () {
                            var x_pending,y_done;
                            db.findOne({
                                where: userdbId = id
                            }).then(function(data){
                                if(data != null) {
                                    console.log(data);
                                    x_pending = data.TaskNotDoneCounter;
                                    y_done = data.TaskDoneCounter;
                                    y_done++;
                                    x_pending--;
                                }
                            }).then(function (value) {
                                db.findOne({
                                    where: userdbId = id
                                }).then(function(data){
                                    data.update({
                                        TaskDoneCounter: y_done,
                                        TaskNotDoneCounter: x_pending
                                    })
                                })
                            }).catch(function(err){
                                console.log(err);
                            })
                    })//////use .then()  use id instead req.id here/////////////////////////////////////////////////////
                }
            }
        }).catch(function(err){
            console.log("error");
        })
    },R_Time);
}
app.get('/retrievePieChart',function (req,res) {
    db.findOne({
        where: userdbId = req.user.id
    }).then(function(data){
        if(data != null) {
            console.log(data);
            res.send(data);
        }
    }).catch(function(err){
        console.log(err);
    })
})
app.post('/updatePieChart',function (req,res) {
    db.findOne({
        where: userdbId = req.user.id
    }).then(function(data){
        data.update({
            TaskDoneCounter: req.body.done_tasks,
            TaskNotDoneCounter: req.body.pending_tasks
        }).then(function(){
            res.send({success: true});
        })
    })
})
app.get('/numOfUsers',function (req, res) {
    db.count().then( function (data){
        if(data>=0)
            res.status(200).send(data.toString());
    }).catch(function (err) {
        console.log(err);
    })
})