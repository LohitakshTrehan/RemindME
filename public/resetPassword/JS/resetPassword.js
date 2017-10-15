$(function() {
    $('#resetPassword').on('submit',function (e) {
        e.preventDefault();
        var resetPassword=$('#resetPassword').serializeArray();
        if(resetPassword[0].value === resetPassword[1].value){
            $.post(window.location.pathname,{password:resetPassword[0].value},function(res) {
                if(res.redirect){
                    window.location = res.redirect;
                }
                else if(res.message){
                    window.alert(res.message);
                }
            });
        }
        else{
            alert('password did not match with confirm password');
        }    
    });
    
})