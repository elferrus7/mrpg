function myJsonMethod(feed){
	console.log(feed);
    document.write(feed);
}

function loadjs()
{
    console.log('requesting');
    $.ajax({
        type:'GET',
        url:"http://127.0.0.1:8000/",
        jsonpCallback: "myJsonMethod",
        success:function(feed) {
        },
        dataType:'jsonp'
    });
}