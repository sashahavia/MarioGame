"use strict";

/****************  Variables ******************/
var finished = false;
var gameCount;
var canvas = undefined;
var	ctx = undefined;
var collect = undefined;
var coinX, coinY = 300, mushroomX, mushroomY = 200;
var playButton, sound, marioX, marioY;
var currentScreen = undefined;
var muteAll = false;
var jumping = false;
var spot, spotM;

var coinCatch = false;
var firstCoin = true;
var coinLoc = JSON.parse(coinLocations);

var mushroomCatch = false;
var firstMush = true;
var mushLoc = JSON.parse(mushroomLocations);

/*****************  Images **************/
var title = new Image();
title.src = "images/startgame.jpg";

var mario = new Image();
mario.src = "images/mariostanding.png";

var mario2 = new Image();
mario2.src = "images/mariowalking.png";

var mario3 = new Image();
mario3.src = "images/mariojumping.png";

var mario4 = new Image();
mario4.src = "images/mariowalkingleft.png";

var gameBg = new Image();
gameBg.src = "images/mariobg.jpg";

var gameOverBg = new Image();
gameOverBg.src = "images/gameover.jpg";

var coin = new Image();
coin.src = "images/coin.png";

var mushroom = new Image();
mushroom.src = "images/mushroom.png";
/************** Audio ********************/

var titleMusic = new Audio("sounds/start.mp3");
var gameMusic = new Audio("sounds/game.mp3");
var gameOverMusic = new Audio("sounds/gameover.mp3");
var coinMusic = new Audio("sounds/collect_coin.wav");
var jumpMusic = new Audio("sounds/jump.mp3");
var runningOutOfTime = new Audio("sounds/runningoutoftime.wav");


function soundPlay() {
	sound = document.getElementById("button2");
    if (sound.value == "Sound on"){
    	sound.value = "Sound off";
    	muteAll = true;
    	titleMusic.pause();
    	titleMusic.currentTime = 0;
    	gameMusic.pause();
    	gameMusic.currentTime = 0;
    	gameOverMusic.pause();
    	gameOverMusic.currentTime = 0;
    	coinMusic.pause();
    	coinMusic.currentTime = 0;
    	jumpMusic.pause();
    	jumpMusic.currentTime = 0;
    	runningOutOfTime.pause();
    	runningOutOfTime.currentTime = 0;
    } else if (sound.value = "Sound off") {
    	sound.value = "Sound on";
    	muteAll = false;
    	if (currentScreen == "start") {
    		titleMusic.loop = true;
    		titleMusic.play();
    	} else if (currentScreen == "game"){
    		gameMusic.loop = true;
    		gameMusic.play();
    	} else if (currentScreen == "gameover") {
    		gameOverMusic.loop = true;
    		gameOverMusic.play();
    	}
    }
}

/**************  GAME *********************/
function start() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	title.onload = ctx.drawImage(title,0,0);
	currentScreen = "start";
	if(!muteAll) {
		titleMusic.loop = true;
    	titleMusic.play();
	}
}
window.addEventListener('load',start);

function startGame() {
	playButton= document.getElementById("button");
	playButton.value = "Playing";
    document.getElementById("button").style.background = "#146782";
    playButton.disabled = true;
    finished = false;
    currentScreen = "game";
    playGame();
}

function playGame() {
	if(!muteAll) {
		titleMusic.pause();
    	titleMusic.currentTime = 0;
		gameMusic.loop = true;
    	gameMusic.play();
	}
	gameCount = 0;
	document.getElementById("total").textContent = gameCount;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	gameBg.onload = ctx.drawImage(gameBg, 0, 0);
	// set timer
	timer();
	// set starting points for mario to start
	marioX = 10;
	marioY = 300;
	mario.onload = drawMario();
	drawItems();
}

function drawItems() {
	drawCoins();
	drawMushroom();
}

function redraw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(gameBg,0,0);
	drawItems();
	if (jumping){
		// console.log("Jumping");
		drawJumpingMario();
	} else {
		drawMario();
	}	
}

function drawMario() {
	checkBorders();
	collectItems();
	ctx.drawImage(mario,marioX,marioY);
	
}

function drawJumpingMario() {
	checkBorders();
	var jumpHeight = 100;
	marioY -= jumpHeight;
	collectItems();
	ctx.drawImage(mario, marioX,marioY);
	marioY += jumpHeight;
}

function drawCoins() {
	if (coinCatch == true || firstCoin == true){
		spot = Math.floor(Math.random()*((coinLoc.length) + 0));
		coinX = parseInt(coinLoc[spot].x);
		firstCoin = false;
		coinCatch = false;
	}
	ctx.drawImage(coin,coinX,coinY);
}

function drawMushroom() {
	if (mushroomCatch == true || firstMush == true){
		spotM = Math.floor(Math.random()*((mushLoc.length) + 0));
		mushroomX = parseInt(mushLoc[spotM].x);
		firstMush = false;
		mushroomCatch = false;
	}
	ctx.drawImage(mushroom,mushroomX,mushroomY);
}

window.addEventListener('keydown', keyDown, false);

function keyDown(e) {
	if (finished == false){
		if (e.keyCode === 39) { // right
		 	marioX += 10;
		 	mario = mario2;
		 	redraw();
		} else if (e.keyCode === 37) { // left
		 	marioX -= 10;
		 	mario = mario4;
		 	redraw();
		} else if (e.keyCode === 38) { // jump
		 	mario = mario3;
		 	if(!muteAll) {
    			jumpMusic.play();
			}
			jump();	
		}
	} else {
		console.log("The game is done! You can't move!");
	}
}

function jump() {
	if(!jumping) {
		jumping = true;
		redraw();
		setTimeout(land, 150);
	}
}

function land() {
	jumping = false;
	redraw();
}

function checkBorders(){
	if(marioX < 0) {
		marioX = 10;
	}
	if((marioX + mario.width) > canvas.width) {
		marioX = canvas.width - mario.width;
	}
}
// collision detection
function collectItems(){
	console.log("collectItems");
	// mario center x
	var mariox = ((marioX + (mario.width-10))/2);
	// mario center y
	var marioy = ((marioY + (mario.height-10))/2);
	// mario x radius
	var marioxr = (mario.width/2);
	// mario y radius
	var marioyr = (mario.height/2);
	// coin center x
	var coinx = ((coinX + coin.width)/2);
	// coin center y
	var coiny = ((coinY + coin.height)/2);
	// coin x radius
	var coinxr = (coin.width/2);
	// coin y radius
	var coinyr = (coin.height/2);

	// mushroom center x
	var mx = ((mushroomX + mushroom.width)/2);
	// mushroom center y
	var my = ((mushroomY + mushroom.height)/2);
	// mushroom x radius
	var mxr = (mushroom.width/2);
	// mushroom y radius
	var myr = (mushroom.height/2);
	if(Math.abs(mariox - coinx) < ((marioxr + coinxr)/2) && Math.abs(marioy - coiny) < ((marioyr + coinyr)/2)){
		console.log("coin touched");
		if (!muteAll){
			coinMusic.play();
		}
		collect = "coin";
		coinCatch = true;
		total();	
	} 
	if (Math.abs(mariox - mx) < ((marioxr + mxr)/2) && Math.abs(marioy - my) < ((marioyr + myr)/2)){
		console.log("Mushroom touched")
		if (!muteAll){
			coinMusic.play();
		}
		collect = "mushroom";
		mushroomCatch = true;
		total();	
	} 

}

function timer(){
	console.log("here T");
	var timeleft = 30;
    var timer = setInterval(function(){
    	timeleft--;
    	document.getElementById("timer").textContent = timeleft;
    	if (timeleft <= 5 && timeleft > 0){
    		if(!muteAll) {
    			gameMusic.pause();
    			gameMusic.currentTime = 0;
				runningOutOfTime.loop = true;
    			runningOutOfTime.play();
			}
    	}
    	if(timeleft == 0){
            clearInterval(timer);
            finished = true;
         	gameOver();
    	}
    },1000);
}

function total(){
	console.log("here total");
    if (collect == "mushroom"){
    	gameCount += 5;
    } else if (collect == "coin") {
    	gameCount++;
    }
    document.getElementById("total").textContent = gameCount;
}

function gameOver() {
	if(!muteAll) {
		runningOutOfTime.pause();
    	runningOutOfTime.currentTime = 0;
    	// gameOverMusic.loop = true;
    	gameOverMusic.play();
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	gameOverBg.onload = ctx.drawImage(gameOverBg, 0, 0);
	
	playButton.disabled = false;
	document.getElementById("button").style.background = "#008CBA";
	playButton.value = "Play";
	currentScreen = "gameover";
}

function helpInfo() {
	var help = document.getElementById("help");
    if (help.style.display === 'none') {
        help.style.display = 'block';
    } else {
        help.style.display = 'none';
    }
}





