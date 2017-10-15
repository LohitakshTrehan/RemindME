$(function () {
    var database = [];
    localStorage.setItem('users',JSON.stringify(database));
    $('#for_primary').click(function () {
        $('#my_primary').css('display', 'block');
        $('#my_secondary').css('display', 'none');
    });

    $('#for_secondary').click(function () {
        $('#my_secondary').css('display', 'block');
        $('#my_primary').css('display', 'none');
    });

    $('#signup').click(function () {
        $('#second').css('display','block');
        $('#first').css('display','none');
    });

    $('#signin').click(function () {
        $('#first').css('display','block');
        $('#second').css('display','none');
    });

    $('#second form').on('submit',function (e) {
        e.preventDefault();
        var willsignup=true;
        var signup=$('#second form ').serializeArray();
        var regex = /^[a-zA-Z ]+$/;
        var errr = "";
        if(!regex.test(signup[0].value) || !regex.test(signup[1].value)){
            errr +="\u2022 It is not a format of a name, that you just entered\n";
            willsignup=false;
        }
        regex=/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!regex.test(signup[2].value))
        {
            errr +="\u2022 It is not a format of a email that you just entered\n";
            willsignup=false;
        }
        regex=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if(!regex.test(signup[3].value))
        {
            errr +="\u2022 Password must contain a number and a special character,must be 6-16 letters long\n";
            willsignup=false;
        }
        if(signup[3].value!=signup[4].value)
        {
            errr +="\u2022 Password was not able to be confirmed\n";
            willsignup=false;
        }
        database=JSON.parse(localStorage.getItem('users'));
        if(!willsignup)
            window.alert(errr);
        else
        {
            let nopush=false;
            for(let i in database)
            {
                if(signup[2].value == database[i][2].value)
                {
                    errr+="\u2022 The given Email already exists in server, use forgot password button instead\n"
                    nopush=true;
                }
            }
            if(!nopush)
            {
                for(let i in database)
                {
                    if(signup[5].value == database[i][5].value)
                    {
                        errr+="\u2022 The given Unique Username already exists in server, try any other username\n"
                        nopush=true;
                    }
                }
            }
            if(nopush)
                window.alert(errr);
            else
            {
                database.push(signup);
                localStorage.setItem('users',JSON.stringify(database));
                window.alert("**********\nCONGRATS YOU ARE SIGNED UP!!! \nGO TO YOUR EMAIL TO VERIFY BEFORE LOGGING IN\n*******");
                $('#first').css('display','block');
                $('#second').css('display','none');
                $('#signupform')[0].reset();
            }
        }
    });
    
    $('#signinform').on('submit',function (e) {
        e.preventDefault();
        var eroo='';
        database=JSON.parse(localStorage.getItem('users'));
        var willsignin=false;
        var signin=$('#signinform').serializeArray();
        for (let i in database)
        {
            if(signin[0].value==database[i][5].value) {
                willsignin = true;

            }
        }
        if(!willsignin) {
            eroo+='\u2022 The user name doesnt exist\n';
            $('#signinform')[0].reset();
            window.alert(eroo);
        }
        else
        {
            willsignin=false;
            for (let i in database)
            {
                if(signin[0].value==database[i][5].value) {
                    if(signin[1].value==database[i][3].value)
                    {
                        willsignin=true;
                    }
                }
            }
            if (!willsignin)
            {
                eroo+="\u2022 Incorrect password entered\n"
                $('#signinform')[0].reset();
                window.alert(eroo);
            }
            else
            {
                window.alert("*******\n CONGRATS YOU ARE SIGNED IN!!! \n*******");
                $('#signinform')[0].reset();
                window.location.href='content.html';
            }
        }
    });

    $('#github').click(function () {
        window.location.href="https://github.com/NodeNITKkr/PingME";
    })

});