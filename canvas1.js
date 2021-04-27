let c = document.getElementById("myCanvas");
let cntxt = c.getContext("2d");

c.width = 1418; // width of the Canvas
c.height = 530; // height of the Canvas

cntxt.font = "30px Comic Sans MS";
cntxt.fillStyle = "red";

let imgstartX = 0; //player's starting position(x-coordinate)
let imgstartY = 240; //player's starting position(y-coordinate)
let imgWidth = 260; //width of the player
let imgHeight = 300; //height of the player
let monsWidth = 150; //width of the monster
let monsHeight = 150; //height of the monster
let monsstartX = 1200; //monster's starting position(x-coordinate)
let monsstartY = 400; //monster's starting position(y-coordinate)
let score = 105; //initial score

let paused = false; //initial status of game

let images = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  monster: [1],
}; //images needed to be  loaded

// function to change the Background

let backGround = (mode) => {
  if (mode === "Day") {
    c.style.background = "url('images/background/bg2.jpg')";
  } else if (mode === "Night") {
    c.style.background = "url('images/background/bg3.jpg')";
  }
};

// function to update the Sound

let updateSound = () => {
  let audio = document.getElementById("audio");
  let sound = document.getElementById("sound");
  if (sound.value == "Sound") {
    if (typeof audio.loop == "boolean") {
      audio.loop = true;
    } else {
      audio.addEventListener(
        "ended",
        function () {
          this.currentTime = 0;
          this.play();
        },
        false
      );
    }
    sound.value = "NoSound";
    audio.play();
  } else {
    audio.pause();
    sound.value = "Sound";
  }
};

// function to update the Mode

let updateMode = () => {
  let mode = document.getElementById("mode");
  if (mode.value === "Day") {
    backGround(mode.value);
    mode.value = "Night";
  } else {
    backGround(mode.value);
    mode.value = "Day";
  }
  console.log("mode got updated");
};

// function to pause and resume the game

// let pause = () => {
//   clearInterval(interval);
//   paused = true;
//   document.getElementById("pause").value = "Resume";
//   c.style.opacity = 0.5;
//   cntxt.textAlign = "center";
//   cntxt.textBaseline = "middle";
//   console.log("Game Paused");
//   cntxt.fillText("Game Paused", 400, 250);
// };

// let resume = () => {
//   paused = false;
//   document.getElementById("pause").value = "Pause";
//   cntxt.clearRect(0, 0, c.width, c.height);
//   c.style.opacity = 1;
//   console.log("Game Paused");
//   interval = setInterval(startGame, 20);
// };

// function to load a single image

let loadImage = (pathToImage, callback) => {
  let img = new Image();
  img.src = pathToImage;
  img.onload = () => callback(img);
};

// Function to return the image path

let imagePath = (action, imgNo) => {
  return "images/" + action + "/" + imgNo + ".png";
};

// function to load multiple images

let loadImages = (callback) => {
  let imageArr = { idle: [], kick: [], punch: [], monster: [] };
  let count = 0;
  let keys = Object.keys(images);
  keys.forEach((action) => {
    count = count + images[action].length;
    images[action].forEach((imgNo) => {
      let path = imagePath(action, imgNo);
      loadImage(path, (image) => {
        imageArr[action][imgNo - 1] = image;
        count = count - 1;
        if (count === 0) {
          callback(imageArr);
        }
      });
    });
  });
};

// function to animate the multiple loaded images

let animate = (cntxt, action, imageArr, callback) => {
  imageArr[action].forEach((image, index) => {
    setTimeout(() => {
      cntxt.clearRect(0, 0, c.width, c.height);
      updateScore(score);
      cntxt.drawImage(image, imgstartX, imgstartY, imgWidth, imgHeight);
    }, index * 100);
  });
  setTimeout(callback, imageArr[action].length * 100);
  animateMonster(imageArr, 100);
  if (action === "punch" || action === "kick") {
    setTimeout(() => {
      actionCollide();
    }, 100);
  }
  walkCollide();
};

//  function to draw the monster's image on Canvas

let monster = (image) => {
  cntxt.drawImage(image, monsstartX, monsstartY, monsWidth, monsHeight);
};

// function to animate the monster's image

let animateMonster = (imageArr, speed) => {
  if (monsstartX > 10) {
    monsstartX = monsstartX - speed;
  } else {
    monsstartX = 1300;
  }
  setInterval(() => {
    monster(imageArr["monster"][0]);
  }, 50);
};

// function to detect if the  player  gets hit by the mosnter , if so game wil get ended  and if not score will be incremented by 1.
let walkCollide = () => {
  let dx = monsstartX - imgstartX;
  let dy = monsstartY - imgstartY;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (
    Math.sqrt(distance) < monsWidth / 11 ||
    (imgstartX > 1200 && score - 10 > 0)
  ) {
    score = score - 30;
  } else if (score - 10 > 0) {
    score = score - 5;
  } else {
    gameOver();
  }
};

// function to pop up a  message displaying the score if the game got over

let gameOver = () => {
  let text = "You Lost ! \nWant to Play a New Game";
  window.location.reload();
  alert(text);
};

// function to pop up a winning message displaying the score if the player reaches the end point

let win = () => {
  let text = "You Won ! \n Your Score : " + score + "\nWant to Play a New Game";
  window.location.reload();
  alert(text);
};

// function to detect if the player kicks or punches the monster and the score will get incremented by 10

let actionCollide = () => {
  let distance = monsstartX - imgstartX;
  console.log(Math.sqrt(distance));
  if (Math.sqrt(distance) < monsWidth / 8) {
    score = score + 10;
    monsstartX = 1200;
  }
};

// function to update the score

let updateScore = (score) => {
  let text = "Score : " + score;
  cntxt.fillText(text, 1000, 60);
};

loadImages((imageArr) => {
  let selectedAnime;

  let queuedAnimations = []; // to queue the actions

  // function to detect the action

  let aux = () => {
    if (queuedAnimations.length === 0) {
      selectedAnime = "idle";
    } else {
      selectedAnime = queuedAnimations.shift();
    }

    animate(cntxt, selectedAnime, imageArr, aux);
  };
  aux();

  // to detect when "punch" button is clicked

  document.getElementById("punch").onclick = () => {
    queuedAnimations.push("punch");
  };

  // to detect when "kick" button is clicked

  document.getElementById("kick").onclick = () => {
    queuedAnimations.push("kick");
  };

  // to detect when "walk" button is clicked

  let walk = (document.getElementById("walk").onclick = () => {
    if (imgstartX < c.width - imgWidth && imgstartY > 140) {
      imgstartX = imgstartX + 50;
    } else if (score > 1 && imgstartY > 140) win();
  });

  // to detect when "jumpD" button is clicked

  let jumpDown = (document.getElementById("jumpD").onclick = () => {
    if (imgstartY < 240) {
      imgstartY = imgstartY + 100;
    } else imgstartY = 240;
  });

  // to detect when "jumpU" button is clicked

  let jumpUp = (document.getElementById("jumpU").onclick = () => {
    if (imgstartY > 140) {
      imgstartY = imgstartY - 100;
      score = score - 2;
    } else imgstartY = 240;
  });

  // to detect when "refresh" button is clicked

  document.getElementById("refresh").onclick = () => {
    window.location.reload();
  };

  //event listeners to detect the keys

  document.addEventListener("keyup", (event) => {
    const key = event.key;
    switch (key) {
      case "ArrowLeft":
        queuedAnimations.push("kick");
        break;
      case "ArrowRight":
        queuedAnimations.push("punch");
        break;

      case "ArrowDown":
        jumpDown();
        break;

      case "ArrowUp":
        jumpUp();
        break;

      case "w":
        walk();
        break;
    }
  });
});

// main function

let startGame = () => {
  backGround("Day");
  document.getElementById("mode").onclick = () => {
    updateMode();
  };
  document.getElementById("sound").onclick = () => {
    updateSound();
  };

  // document.getElementById("pause").onclick = () => {
  //   if (paused) resume();
  //   else pause();
  // };

  document.getElementById("home").onclick = () => {
    location.href = "index.html";
  };
};
startGame();
