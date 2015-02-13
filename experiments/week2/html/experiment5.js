
var count = 0;

function doFirst() {
    var button = document.getElementById("post");
    button.addEventListener("click", saveComment, false);
}

function saveComment() {
    count++;
    var name = document.getElementById("inputName").value;
    var comment = document.getElementById("textArea").value;

    var teams = document.getElementsByName("teamFavored");
    for (var i = 0; i < teams.length; i++) {
        if (teams[i].checked)
            var teamFavored = teams[i].value;
    }

    if (document.getElementById("anonymous-check").checked)
        name = "Anonymous";

    var store = name + " favoring " + teamFavored + " says...<br />" + comment;
    sessionStorage.setItem(count, store);

    display();
}

function display() {
    var commentBox = document.getElementById("allComments");

    var comments = "";

    for (var i = 0; i < sessionStorage.length; i++) {
        var propertyName = sessionStorage.key(i);
        var fetchedComment = sessionStorage.getItem(propertyName);
        comments = comments + fetchedComment + "<br /> <br />";
    }

    commentBox.innerHTML = comments;
}



window.addEventListener("load", doFirst, false);