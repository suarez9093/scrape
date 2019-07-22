// Grab the articles as a json
$.getJSON("/articels", function(data){
    // For loop to loop through each article

    for(let i = 0; i < data.length; i++){
        // display the info on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
})

// When p tag is clicked

$(document).on("click", "p", function(){
    // empty notes from note section
    $("#notes").empty();
    // Save the id from the p tag

    let thisId = $(this).attr("data-id");

    // Make the ajax call for the article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    // add note info to the page
    .then(function(data){
        console.log(data);
        // Title of article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // Input to enter a title
        $("#notes").append("<input id='titleinput' name='title'>");
        // textarea to add to a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // button to submit note
        $("#notes").append("<button data-id='" + data._id + "'id='savenote'>Save Note</button");

        // If there's a note in the article
        if(data.note) {
            // Place title of note in title input
            $("#titleinput").val(data.note.title);
            // Place body of the note in the body textarea
            $("#bodyinput").val(data.note.body);
        }
    });
});

// When savenote button is clicked

$(document).on("click", "#savenote", function(){
    // Grab the associated id with the article from the submit button
    let thisId = $(this).attr("data-id");

    // Run a POST request to chage the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
    .then(function(data){
        console.log(data);
        $("#notes").empty();
    });

    // Remove values entered in the input and textarea
    $("#titleinput").val("");
    $("#bodyinput").val("");
});