$(function () {
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

    $('#signupform').on('submit',function (e) {
        e.preventDefault();
        var willsignup=true;
        var signup=$('#second form ').serializeArray();
        var regex = /^[a-zA-Z ]+$/;
        var errr = "";
        if(!regex.test(signup[0].value)){
            errr +="\u2022 It is not a format of a name, that you just entered\n";
            willsignup=false;
        }
        regex=/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!regex.test(signup[1].value))
        {
            errr +="\u2022 Email format is wrong\n";
            willsignup=false;
        }
        regex=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if(!regex.test(signup[2].value))
        {
            errr +="\u2022 Password must contain a number and a special character,must be 6-16 letters long\n";
            willsignup=false;
        }
        if(signup[2].value!=signup[3].value)
        {
            errr +="\u2022 Confirm password did not match\n";
            willsignup=false;
        }

        if(!willsignup)
            window.alert(errr);
        else
        {
            let form = {
                fullname:signup[0].value,
                email:signup[1].value,
                password:signup[2].value,
                dob:signup[4].value
            }

            $.post('/register',form,function(res) {
                if(res.redirect){
                    window.location = res.redirect;
                }
                if(res.message){
                    window.alert(res.message);
                }
            });
        }
    });
    
    $('#signinform').on('submit',function (e) {
        e.preventDefault();
        var eroo='';
        var willsignin=false;
        var signin=$('#signinform').serializeArray();
        let form = {
                email:signin[0].value,
                password:signin[1].value
            }
        $.post('/login',form,function(res) {
            if(res.redirect){
                window.location = res.redirect;
            }
            if(res.message){
                window.alert(res.message);
            }
        });
    });

    $('#github').click(function () {
        window.location.href="https://github.com/NodeNITKkr/PingME";
    })

});