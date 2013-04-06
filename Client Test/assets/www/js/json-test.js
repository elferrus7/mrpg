function loadjs()
{
    $('#feed').html('<span><p>asdasdasd</p></span>');
    console.log('requesting');
    $.ajax({
        type:'GET',
        url:"http://127.0.0.1:8000/",
        success:function(feed) {
            // Do something with the response
            //console.log(JSON.stringify(feed));
            var jason = JSON.parse(feed);
            console.log(jason);
        },
        dataType:'jsonp'
    });
}