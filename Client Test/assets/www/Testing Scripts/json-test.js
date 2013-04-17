function myJsonMethod(feed){
	console.log(feed);
    document.write(feed);
}

function loadjs2()
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

function loadjs(){
    var data ={val1:"hello", val2:"world"};
    var dataS = JSON.stringify(data);

    $.ajax({
        url:"http://127.0.0.1:8080/",
        type:"POST",
        data:dataS,
        success:function (res)
        {
            resHandler(res);
        }
    });
}