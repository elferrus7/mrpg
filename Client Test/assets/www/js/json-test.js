function myJsonMethod(feed){
	console.log(feed);
}

function loadjs()
{
    console.log('requesting');
    $.ajax({
        type:'GET',
        url:"http://10.25.73.236:8000/",
        jsonpCallback: "myJsonMethod",
        success:function(feed) {
        },
        dataType:'jsonp'
    });
}