var buttonPlayer1 = document.querySelector("#p1");
var buttonPlayer2 = document.getElementById("p2");
var reset = document.getElementById("reset");
var winningScoreDisplay = document.querySelector("p span");

var p1Display = document.querySelector("#p1Display");
var p2Display = document.querySelector("#p2Display");

var p1Score = 0;
var p2Score = 0;

var gameOver = false;
var winningScore = 5;
var numInput = document.querySelector("input[type=number]");

buttonPlayer1.addEventListener("click",function(){
	if (!gameOver){
		p1Score++;
		p1Display.textContent = p1Score;
		if (p1Score === winningScore){
			p1Display.classList.add("winner");
			gameOver = true;
		}
	}
});

buttonPlayer2.addEventListener("click",function(){
	if (!gameOver){
		p2Score++;
		p2Display.textContent = p2Score;
		if (p2Score === winningScore){
			p2Display.classList.add("winner");
			gameOver = true;
		}
	}
});

reset.addEventListener("click",resetGame);

numInput.addEventListener("change",function(){

	winningScoreDisplay.textContent = this.value;
	//winningScore = parseInt(numInput.value);
	winningScore = Number(this.value);
	resetGame();

});	

function resetGame(){
	p1Score = 0;
	p2Score = 0;
	gameOver = false;
	p1Display.textContent = 0;
	p2Display.textContent = 0;
	p1Display.classList.remove("winner");
	p2Display.classList.remove("winner");
}
