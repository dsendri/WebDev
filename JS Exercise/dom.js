var buttonListener = document.querySelector("button");
buttonListener.addEventListener("click",function(){
	console.log("Button is pressed");
	document.querySelector("body").style.background = "purple";
});