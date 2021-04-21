let c=document.getElementById("myCanvas");
let cntxt=c.getContext("2d");

c.width=1418;
c.height=575;

cntxt.font="30px Comic Sans MS";
cntxt.fillStyle = "red";
// cntxt.textAlign = "right";


let imgstartX=0;
let imgstartY=300;
let imgWidth=260;
let imgHeight=300;
let monsWidth=150;
let monsHeight=150;
let monsstartX=1300;
let monsstartY=440;
let score=0;

let paused=false;

let images={idle:[1,2,3,4,5,6,7,8],kick:[1,2,3,4,5,6,7],punch:[1,2,3,4,5,6,7],monster:[1]};

let backGround=(mode)=>{
    if(mode==="Day"){
    c.style.background = "url('images/background/bg8.jpg')";}
    else if(mode==="Night"){
        c.style.background = "url('images/background/bg7.jpg')";}
    
}


let music=()=>{
    let audio=document.createElement("audio");
    audio.src="music/doomsgate.mp3";
    audio.play();
}

let updateMode=()=>{
let mode=document.getElementById("mode");
    if(mode.value==="Day"){
        backGround(mode.value);
        mode.value="Night";
    }
    else{
        backGround(mode.value); 
        mode.value="Day";
    }
}

let togglePause=()=>{
    paused=!paused;
}

let loadImage=(pathToImage,callback)=>{

    let img=new Image();
    img.src=pathToImage;
    img.onload=()=>
        callback(img);
    
}

let imagePath=(action,imgNo)=>{
    return ("images/"+action+"/"+imgNo+".png");
}


let loadImages=(callback)=>{
    let imageArr={idle:[],kick:[],punch:[],monster:[]};
    let count=0;
    let keys=Object.keys(images);
    keys.forEach((action)=>{
        count=count+images[action].length;
        images[action].forEach((imgNo) =>{
            let path=imagePath(action,imgNo);
            loadImage(path,(image)=>{
                imageArr[action][imgNo-1]=image;
                count=count-1;
                if(count === 0) {
                    callback(imageArr); 
                }
    
            });
        });    
    });

}

let drawImg=(image,imgstartX,imgstartY,imgWidth,imgHeight)=>{
    cntxt.drawImage(image,imgstartX,imgstartY,imgWidth,imgHeight);
}

let animate=(cntxt,action,imageArr,callback)=>{
        imageArr[action].forEach((image,index)=>{
            setTimeout(()=>{
                cntxt.clearRect(0,0,c.width,c.height);
                updateScore(score)
                drawImg(image,imgstartX,imgstartY,imgWidth,imgHeight);
                // monster(imageArr["monster"][0]);
            },index*100);

        });
        setTimeout(callback,imageArr[action].length*100);
        animateMonster(imageArr,150); 
        walkcollide();  
}
    
let monster=(image)=>{
    drawImg(image,monsstartX,monsstartY,monsWidth,monsHeight);
}

let animateMonster=(imageArr,speed)=>{
    if(monsstartX>10){monsstartX=monsstartX-speed}
    else{monsstartX=1300;}
    setInterval(()=>{
        monster(imageArr["monster"][0]);
    },50);   
    
}

let walkcollide=()=>{
    let dx = monsstartX-imgstartX;
    let dy = monsstartY-imgstartY;
    let distance=Math.sqrt(dx*dx+dy*dy);
    console.log(distance);
    if(distance > monsWidth+10){
        score=score+1;
        console.log(score);
    }
    else{
        var text="Your Score : "+score+"\nWant to Play a New Game";
        var r = confirm(text);
        if (r == true) {
            window.location.reload();
        } else {
            location.href("canvas2.html");
        }
    }
        
}


let collide=()=>{
    let distance = monsstartX-imgstartX;
    console.log(distance);
    if(Math.sqrt(distance) < monsWidth/3){
        score=score+10;
        monsstartX=1300;
    }
   
}


let updateScore=(score)=>{
    let text="Score : "+score;
    cntxt.fillText(text,800,60);

}

loadImages((imageArr)=>{
    let selectedAnime;
    let queuedAnimations=[];
    let aux=()=>{
        if(queuedAnimations.length===0){
            selectedAnime="idle";
        }
        else{
            selectedAnime=queuedAnimations.shift();
        }
    
        animate(cntxt,selectedAnime,imageArr,aux); 
    }
    if(!paused){aux();}
    else{cntxt.drawImage(cntxt.drawImage(image,startX,startY,imgWidth,imgHeight));}
    
    document.getElementById("punch").onclick=()=>{
        queuedAnimations.push("punch");
        collide();
    };
    
    document.getElementById("kick").onclick=()=>{
        queuedAnimations.push("kick");
        collide();
    };

    let walk=document.getElementById("walk").onclick=()=>{
        if(imgstartX<(c.width-imgWidth)){imgstartX=imgstartX+100;
            }
            else imgstartX=0;
        
    };

    let jump=document.getElementById("jump").onclick=()=>{
        if(imgstartY>200){imgstartY=imgstartY-100;
            score=score+2;
            }
            else imgstartY=300;
    }
    
    document.getElementById("refresh").onclick=()=>{
        window.location.reload();
    };

    document.getElementById("sound").onclick=()=>{
        music();
    }

    document.addEventListener("keyup",(event)=>{
        const key=event.key;
        if(key==="ArrowLeft"){
            queuedAnimations.push("kick");
        }
        else if(key==="ArrowRight"){
            queuedAnimations.push("punch");
        }
        else if(key==="ArrowDown"){
            walk();
        }
        else if(key==="ArrowUp"){
            jump();
        }

    });
});


let startGame=()=>{
backGround("Day");
document.getElementById("mode").onclick=()=>{updateMode();}
document.getElementById("home").onclick=()=>{location.href="canvas2.html";}
document.addEventListener("click",togglePause);
}
startGame();
