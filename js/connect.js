$(document).ready(function(){
    var IP = "http://ganesha:8280/wikipedia/1.0.0";
    var autorization = "9205d37e9d299eb361c12165797d86a2";

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

        if (vonHead){
            $(headFrame).html(vonHead[1]);
            }
        if (vonBody){
            $(bodyFrame).html(vonBody[1]);
            }
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
        var URL = "http://ganesha:8280/wikipedia/search/1.0.0/" + searchText;
        consoleT('Connecting to ' + URL, "input", "#console");
        $.ajax({
            url: URL,
            headers: { "Authorization": "Bearer " + autorization},
            //dataType: "json",
            method: "GET",
            error: function(jqXHR, textStatus, errorThrown){
                consoleT(textStatus + ", " + jqXHR.status + ", ", "output", "#console");
            }
        }).complete(function(data) {
            if (data.status == 200){
                //consoleT(data.responseText,"ouput", "#console");
                if (!data.responseJSON) {
                    consoleI(data.responseText, "#console");
                } else {
                    var vysledok = data.responseJSON;
                    var text = "<body>";
                    text = text + "<h1> Hľadaný výraz: " + vysledok[0] + "</h1>";
                    text = text + "<h2> Počet výsledkov: " + vysledok[1].length + "</h2>";
                    for (var i = 0; i < vysledok[1].length; i++){
                        text += "<div><h3>" + vysledok[1][i] + "</h3>" +
                        "<p>" + vysledok[2][i] +"</p>"  +
                        "<a href='" + vysledok[3][i] + "'>" + vysledok[3][i] +"</a>"
                        + "</div>";
                    }
                    text = text + "</body>";
                    consoleI(text, "#console");
                }

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

    $("#regenerateButton").click(function(event){
        console.log("regenerate");
         $.ajax({
            url: "https://ganesha:8243/token",
            data: {"grant_type" : "client_credentials"},
            headers: { "Authorization": "Basic X2dQMExoZmMwb2RITzFIUHJzN18yNE1Ha0w4YTpNREU5b0VKZzRabUs0SXJxNXZYQ2JZdFVKMUlh"},
            //dataType: "json",
            method: "POST",
            error: function(jqXHR, textStatus, errorThrown){
                consoleT(textStatus + ", " + jqXHR.status + ", ", "output", "#console");
            }
        }).complete(function(data) {
            if (data.status == 200){
                console.log("secko ok");
            }
            else {
                console.log("nesecko ok");
            }
        });
    });

    $('.myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })

    $("#equalsButton").click(function() {
        var operation = $('#calcSubForm label.active input').val();
        var x = parseInt($("#x").val());
        var y = parseInt($("#y").val());
        if ((!isNaN(x)) && (!isNaN(y))){
            var URL = "http://10.100.103.31:8280/calc/1.0/";
            console.log("volaj http://10.100.103.31:8280/calc/1.0");
            switch(operation){
                case "1": URL = URL + "add";
                        break;
                case "2": URL = URL + "subtract";
                        break;
                case "3": URL = URL + "multiply";
                        break;
                case "4": URL = URL + "divide";
            };
            URL += "?x="+x+"&y="+y;
            $.ajax({
                url: URL,
                headers: { "Authorization": "Bearer " + autorization},
                //dataType: "xml",
                method: "GET",
                error: function(jqXHR, textStatus, errorThrown){
                    //consoleT(textStatus + ", " + jqXHR.status + ", ", "output", "#console");
                }
            }).complete(function(data) {
                if (data.status == 200){
                    //consoleT(data.responseText,"ouput", "#console");
                    $("#vysledok").val(data.responseJSON.answer);
                }
                else {
                    console.log("status: " + data.statusText + " " + data.status + " " + data.getAllResponseHeaders());
                }
            });
        }

        return false;
    })

    var files;

    //$("#fileEnter").on('change', prepareUpload);

    // Grab the files and set them to our variable
    function prepareUpload(event)
    {
        files = event.target.files;
    }

    //var URL = "http://10.100.103.31:8280/sandman/startSandman";
    //var URL = "http://10.100.103.31:8280/sandman/1.0.0/startSandman";
    var URL = "http://10.100.103.31:8080/sandman/startSandman";
    //var URL = "http://10.100.103.31:8280/sandmanUpload/1.0.0"

    $('#fileEnter').upload(URL,autorization);
    //$('#fileEnter').upload(URL,autorization);

    $("#getProcessedDocs").click(function(event){
        event.stopPropagation();
        event.preventDefault();

        $.ajax({
                url: "http://10.100.103.31:8280/sandman/1.0.0/sandman/successfullyProcessedDocuments",
                headers: { "Authorization": "Bearer " + autorization},
                //dataType: "json",
                method: "GET",
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(textStatus + ", " + jqXHR.status);
                    console.log(errorThrown);
                }
            }).complete(function(data) {
                if (data.status == 200){
                    //consoleT(data.responseText,"ouput", "#console");
                    $("#processedDocuments").html(data.responseText);
                }
                else {
                    console.log("status: " + data.statusText + " " + data.status + " " + data.getAllResponseHeaders());
                }
            });

    })

    $('#sendFile_').click(function(event){

        event.stopPropagation();
        event.preventDefault();

        var formData = new FormData();

        formData.append("file",files[0]);

        //dataType: "json",
        //headers: { "Authorization": "Bearer " + autorization},
        //contentType: false,

        //var fd = new FormData();
        //fd.append("CustomField", "This is some extra data");
        $.ajax({
            url: URL,
            method: "POST",
            processData: false,
            data: formData,
            headers: { "Authorization": "Bearer " + autorization},
            success: function(data, textStatus, jqXHR)
            {
                if(typeof data.error === 'undefined')
                {
                    // Success so call function to process the form
                    submitForm(event, data);
                }
                else
                {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                // Handle errors here
                console.log('ERRORS: ' + textStatus + ' ' + errorThrown);
                // STOP LOADING SPINNER
            }
        });
    });

    function submitForm(event, data)
    {
        console.log(event);
        console.log(data);
    }

    wikiList();
})
