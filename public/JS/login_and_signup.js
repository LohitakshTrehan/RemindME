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

    // $('#second form').on('submit',function (e) {
    //     e.preventDefault();

    // });
    
    // $('#signinform').on('submit',function (e) {
    //     e.preventDefault();
    // });

    $('#github').click(function () {
        window.location.href="https://github.com/NodeNITKkr/PingME";
    })

});