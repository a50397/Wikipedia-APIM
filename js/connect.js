$(document).ready(function(){
    var IP = "http://10.100.103.31:8280/wikipedia/1.0.1";

    function console(text, trieda, okno){
        var p = $("<p></p>");
        p.text(text);
        p.addClass(trieda);
        $(okno).append(p);
    }

    function consoleI(text, okno){
        var p = $("<iframe>"+text+"</iframe>");
        //p.html(text);
        //RegExp("<body[^>]*>(.*?)<\/body>")
        $(okno).append(text.match(/<body[^>]*>(.*?)<\/body>/g));
    }

    function wiki(){
        $("#serverIP").text(IP);

        console('Connecting to ' + IP, "input", "#console");
        $.ajax({
            url: IP,
            headers: { "Authorization": "Bearer e1d6169484d1bad2396c72e04d6f9f0f"},
            dataType: "xml",
            method: "GET",
            error: function(jqXHR, textStatus, errorThrown){
                //console(textStatus + ", " + jqXHR.status + ", ", "output", "#console");
            }
        }).complete(function(data) {
            if (data.statusText != "error"){
                if (data.id){
                    console("id: " + data.id + " content: " + data.content, "output", "#console");
                } else {
                    console(data.responseText,"ouput", "#console");
                }
            }
            else {
                console("status: " + data.statusText + " " + data.status + " " + data.getAllResponseHeaders(), "output", "#console");
            }
        });
    } //end wiki
})
