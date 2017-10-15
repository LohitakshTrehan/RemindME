$(function() {
    $('#forgotPassword').on('submit',function (e) {
        e.preventDefault();
        var forgotPassword=$('#forgotPassword').serializeArray();
        $.post('/forgot',{email:forgotPassword[0].value},function(res) {
        	if(res.redirect){
 	        	window.location = res.redirect;
        	}
        	if(res.message){
            	window.alert(res.message);
        	}
    	});
    });
    
})