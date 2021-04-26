// to detect when "start" button is clicked --> it redirects to Game page.
    
document.getElementById("start").onclick=()=>{
    location.href="game.html";
}

var help = document.getElementById("help");

var btn = document.getElementById("helpBtn");

var helpBox = document.getElementsByClassName("close")[0];

// pops up the help box 

btn.onclick = function() {
  help.style.display = "block";
}

// closes the help box when "close" button  is clicked

helpBox.onclick = function() {
  help.style.display = "none";
}

