var player1, player2, questions, answer, result, gameOverContainer, gameOverMassage, timer, playerName, playerList, profiles, winsCountMassage, losesCountMassage;
var running = false;

function movePlayer(player, offset) {
	player.style.left = (player.offsetLeft - player.parentNode.offsetLeft + offset) + "px";
	//console.log(player1.offsetLeft);
	if (player.offsetLeft >= player.parentNode.offsetWidth - player.offsetWidth + player.parentNode.offsetLeft) {
		gameOver(player);
	}
}

function gameOver (player) {
	var profile = profiles[playerList.options.selectedIndex];
	if (player == player1) {
		profile.loses++;
		gameOverMassage.innerHTML = "You loose!";
	} else {
		gameOverMassage.innerHTML = "You win!";
		profile.wins++;
	} 
	winsCountMassage.innerHTML = profile.wins;
	losesCountMassage.innerHTML = profile.loses;
	gameOverContainer.style.display = "block";
	clearInterval(timer);
}

function getNumber() {
	var number = Math.random();
	return Math.round(number * 98 + 1);
}

function generateQuestion() {
	var operation = Math.random();
	var number1 = getNumber();
	var number2 = getNumber();	
	var sign;
	
	if (operation > 0.5) {
		sign = " + ";
		answer = number1 + number2;
	} else {
		sign = " - "; 
		if (number1 < number2) {
			var tmp = number1;
			number1 = number2;
			number2 = tmp;
		}
		answer = number1 - number2;
	}
	questions.innerHTML = number1 + sign + number2;
}

function enterAnswer() {
	if (parseInt(result.value) == answer) {
		movePlayer(player2, 50);
	}
	result.value = "";
	generateQuestion();
	result.focus();
}

function pressEnter(e) {
	if (e.keyCode == 13) {
		enterAnswer();
	} 
}

function startGame () {
	if (!running && profiles.length > 0) {
		timer = setInterval(function() {
			movePlayer(player1, 1);
		}, 100);
		generateQuestion();
		running = true;
	}
}

function findPlayer (name) {
	for (var i = 0; i < playerList.options.length; i++) {
		if (playerList.options.item(i).text == name) {
			return i;
		}
	}
	return -1;	
}

function addNewPlayer () {
	var name = playerName.value;
	if (name != "" && findPlayer(name) < 0) {
		var option = document.createElement("option");
		option.text = name;
		playerList.options.add(option);
		playerList.options.selectedIndex = playerList.options.length - 1;
		var profile = {
			name: name, 
			wins: 0,
			loses: 0
		};
		profiles.push(profile);
	}
}

function newPlayerEnter(e) {
	if (e.keyCode == 13) {
		addNewPlayer();
	} 
}

function newGame () {
	player1.style.left = 0;
	player2.style.left = 0;
	running = false;
	gameOverContainer.style.display = "none";
}

window.addEventListener("DOMContentLoaded", function () {
	player1 = document.getElementById("player-1");
	player2 = document.getElementById("player-2");
	questions = document.getElementById("questions");	
	gameOverContainer = document.getElementById("gameOverContainer");
	gameOverMassage = document.getElementById("result-txt");
	winsCountMassage = document.getElementById("wins-count");
	losesCountMassage = document.getElementById("loses-count");
	result = document.getElementById("result");
	result.focus();
	playerName = document.getElementById("player-name");
	playerList = document.getElementById("player-list");
	profiles = localStorage.getItem("playersProfiles");
	if (profiles != null) {
		profiles = JSON.parse(profiles);
	} else {
		profiles = [];
	}
	for (var profile of profiles) {
		var option = document.createElement("option");
		option.text = profile.name;
		playerList.options.add(option);
	}
});

window.addEventListener("beforeunload", function () {
	localStorage.setItem("playersProfiles", JSON.stringify(profiles));
});

