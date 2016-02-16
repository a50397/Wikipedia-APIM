$(document).ready(function(){
    var IP = "http://10.100.103.31:8280/wikipedia/1.0.0";
    var autorization = "37c154c543d673d05c31a0af94c2f3a9";

    function consoleT(text, trieda, okno){
        //var p = $("<p></p>");
        //p.text(text);
        //p.addClass(trieda);
        $("#consoleInputText").text(text);
    }

    function consoleI(text, okno){
        //var p = $("<iframe id='htmlReturn' />");
        var reg = new RegExp(/<body.*?>([^]*?)<\/body>/g),
            regH = new RegExp(/<head.*?>([^]*?)<\/head>/g);
        var vonBody = reg.exec(text);
        var vonHead = regH.exec(text);
        //$(okno).append(p);
        //$(p).wrap('<div class="embed-responsive embed-responsive-16by9"/>');
        //$(p).addClass('embed-responsive-item');
        //$(p).html = "";
        var bodyFrame = $("#htmlReturn").contents().find("body");
        var headFrame = $("#htmlReturn").contents().find("head");
        if (vonHead[1])
            $(headFrame).html(vonHead[1]);
        if (vonBody[1])
            $(bodyFrame).html(vonBody[1]);
    }

    function wikiList(){
        $("#serverIP").text(IP);

        consoleT('Connecting to ' + IP, "input", "#console");
        $.ajax({
            url: IP,
            headers: { "Authorization": "Bearer " + autorization},
            //dataType: "xml",
            method: "GET",
            error: function(jqXHR, textStatus, errorThrown){
                //consoleT(textStatus + ", " + jqXHR.status + ", ", "output", "#console");
            }
        }).complete(function(data) {
            if (data.status == 200){
                //consoleT(data.responseText,"ouput", "#console");
                consoleI(data.responseText, "#console");
            }
            else {
                consoleT("status: " + data.statusText + " " + data.status + " " + data.getAllResponseHeaders(), "output", "#console");
            }
        });
    }; //end wiki

    function wiki(){
        $("#serverIP").text(IP);
        var searchText = $("#wikisearch").val();
        var URL = "http://10.100.103.31:8280/wikipedia/1.0.1/?&search=" + searchText;
        consoleT('Connecting to ' + URL, "input", "#console");
        $.ajax({
            url: URL,
            headers: { "Authorization": "Bearer " + autorization},
            dataType: "json",
            method: "GET",
            error: function(jqXHR, textStatus, errorThrown){
                //consoleT(textStatus + ", " + jqXHR.status + ", ", "output", "#console");
            }
        }).complete(function(data) {
            if (data.status == 200){
                //consoleT(data.responseText,"ouput", "#console");
                consoleI(data.responseText, "#console");
            }
            else {
                consoleT("status: " + data.statusText + " " + data.status + " " + data.getAllResponseHeaders(), "output", "#console");
            }
        });
    }; //end wiki

    $("#searchButton").click(function(event){
        if ($("#wikisearch").val())
            wiki();
        else
            wikiList();
    });

    wikiList();
})
