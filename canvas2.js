document.getElementById("start").onclick=()=>{
    location.href="game.html";
}

var help = document.getElementById("help");

var btn = document.getElementById("helpBtn");

var helpBox = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  help.style.display = "block";
}

helpBox.onclick = function() {
  help.style.display = "none";
}

