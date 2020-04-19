// character constructor
function Character(name) {
  this.name = name;
  this.health = 100;
  this.status = "Good"
  this.illness = []
}
// wagon/inventory constructor
function Wagon() {
  this.food = 0;
  this.money = 500;
  this.days = 0;
  this.characters = [];
  this.bullets = 0;
  this.distance = 0;
  this.hunted = 0;
  this.completed = 0.01;
}

Character.prototype.healthBar = function() {
  var pairs = {Good: "#28a745", Fair: "#f0ad4e", Poor: "#d9534f", Dead: "black"};
    $( "#char1-health-bar").progressbar({value: char1.health});
    $( "#char1-health-bar .ui-widget-header").css("background", pairs[char1.status]).css("border-color", pairs[char1.status]);
    $( "#char2-health-bar").progressbar({value: char2.health});
    $( "#char2-health-bar .ui-widget-header").css("background", pairs[char2.status]).css("border-color", pairs[char2.status]);
    $( "#char3-health-bar").progressbar({value: char3.health});
    $( "#char3-health-bar .ui-widget-header").css("background", pairs[char3.status]).css("border-color", pairs[char3.status]);
    $( "#char4-health-bar").progressbar({value: char4.health});
    $( "#char4-health-bar .ui-widget-header").css("background", pairs[char4.status]).css("border-color", pairs[char4.status]);
    $( "#char5-health-bar").progressbar({value: char5.health});
    $( "#char5-health-bar .ui-widget-header").css("background", pairs[char5.status]).css("border-color", pairs[char5.status]);
}

// illness generator
Character.prototype.illnessGenerator = function() {
  var num = Math.floor(Math.random() * Math.floor(80))
  if (num === 1 && this.illness.includes("Malaria") == false ) {
    this.illness.push("Malaria")
    $("#ongoing-text-box").prepend(this.name + " got malaria. <br>")
  } else if (num === 2 && this.illness.includes("Typhoid") == false) {
    this.illness.push("Typhoid")
    $("#ongoing-text-box").prepend(this.name + " got typhoid. <br>")
  } else if (num === 3 && this.illness.includes("Mild Tuberculosis") == false) {
    this.illness.push("Mild Tuberculosis")
    $("#ongoing-text-box").prepend(this.name + " got a mild case of tuberculosis. <br>")
  } else if (num === 4 && this.illness.includes("Broken Bone") == false) {
    this.illness.push("Broken Bone")
    $("#ongoing-text-box").prepend(this.name + " broke a bone. <br>")
  } 
}
//food checker
Wagon.prototype.resourceChecker = function() {
  if (this.food <= 0) {
    this.food = 0
    wagon.characters.forEach(function(char){
      char.health -= 10
    });
  }
  if (this.bullet <= 0) {
    this.bullet = 0
  }
}

//Checks for illness, status changes, and character death
Wagon.prototype.statusAdjuster = function() {
  wagon.characters.forEach(function(char){
    if (char.illness.length === 1) {
      char.health -= 2
    } else if (char.illness.length === 2) {
      char.health -= 4
    } else if (char.illness.length >= 3) {
      char.health -= 6
    }

    if (char.health >= 80) {
      char.status = "Good"
    } else if (char.health < 80 && char.health >= 20) {
      char.status = "Fair"
    } else if (char.health < 20 && char.health > 0) {
      char.status = "Poor"
    } else {
      char.status = "Dead"
    }
    char.healthBar();

    if (char.health <= 0) {
      var index = wagon.characters.indexOf(char)
      wagon.characters.splice(index, 1)
      char.status = "Dead"
    }
  })
  if (wagon.characters.length === 0) {
    buildEndModal("3", "death", "Try Again")
    $(".button-content").prepend("Game Over! All the soldiers died, never making it to Brundisium. The rest of your army lost the battle at Brundisium because you weren't there. Many of your former comrads were killed in the fighting.")
    $("#myModal").toggle();
  }
}

//calculates potential illnesses
Wagon.prototype.turn = function() {
  this.hunted = 0;
  wagon.eventGrabber();
  wagon.characters.forEach(function(char){
    char.illnessGenerator()
  });
    wagon.statusAdjuster()
    if (wagon.food > 0) {
    wagon.food -= (wagon.characters.length * 5 )
  } else if (wagon.food <= 0) {
    wagon.food = 0
  }
    this.days += 1
    this.distance += 10
    landmarkEvent();
    this.completed = (this.completed + 2);
    journey(this.completed);
    wagon.resourceChecker()
}

function journey(dist) {
    $( "#progressbar" ).progressbar({
      value: dist
    });
  }

  // function for resting -- cure illness, gain some health
Wagon.prototype.rest = function() {
  wagon.characters.forEach(function(char){
    char.illness.splice(0, 1)
    if (char.health < 99) {
    char.health += 2
    }
  });
  wagon.statusAdjuster()
  wagon.food -= (wagon.characters.length * 5 )
  this.days += 1
  wagon.resourceChecker()
}

  //event grabber
Wagon.prototype.eventGrabber = function() {
  var num = Math.floor(Math.random() * Math.floor(100))
  if (this.distance === 100 || this.distance === 200 || this.distance === 300 || this.distance === 400 || this.distance === 500) {

  } else if (num >= 80) {
    positiveEvent()
    //call positive event
  } else if (num < 80 && num >= 60) {
    neutralEvent()
    //call neutral event
  } else if (num < 60 && num >= 40) {
    negativeEvent()
    //call negative event
  } else if (num < 40 && num >= 35){
    deathEvent()
    //call death event
  }
}
  //random positiveEvent
function positiveEvent() {
  var num = Math.floor(Math.random() * Math.floor(5))
  var ranSupplyIncrease = Math.floor(Math.random() * (200 - 100) + 100)
  if (num === 1) {
    $("#ongoing-text-box").prepend('As you rest by the river, you notice something shiny in the water. You send one of your men to dive after it, and find ' + ranSupplyIncrease + ' denarii lying on the riverbed. <br>')
    wagon.money += ranSupplyIncrease
    $('.wagon-money-remaining').text(wagon.money.toFixed(2));
  } else if (num === 2) {
    $("#ongoing-text-box").prepend('You come across an abandoned chariot on the side of the road. You take a peek inside and find ' + ranSupplyIncrease + ' units of unspoiled food, so you take it and leave quickly. <br>')
    wagon.food += ranSupplyIncrease
    $('.wagon-food-remaining').text(wagon.food.toFixed(2));
  } else if (num === 3) {
    $("#ongoing-text-box").prepend('You found a wounded deer -- food increased by ' + ranSupplyIncrease + ' <br>')
    wagon.food += ranSupplyIncrease
    $('.wagon-food-remaining').text(wagon.food.toFixed(2));
  } else if (num === 4) {
    $("#ongoing-text-box").prepend('As you travel along, you trick a group of Parthians into giving you ' + ranSupplyIncrease + ' denarii. <br>')
    wagon.money += ranSupplyIncrease
    $('.wagon-money-remaining').text(wagon.money.toFixed(2));
  } else if (num === 5){
    $("#ongoing-text-box").prepend('You ambush a Greek chariot that you have been following for some time now. You stole ' + ranSupplyIncrease + ' units of food and ' + (ranSupplyIncrease/2) + ' denarii. <br>')
    wagon.money += (ranSupplyIncrease/2)
    wagon.food += ranSupplyIncrease
    $('.wagon-money-remaining').text(wagon.money.toFixed(2));
    $('.wagon-food-remaining').text(wagon.food.toFixed(2));
  }
}
  //random neutralEvent
function neutralEvent() {
  var num = Math.floor(Math.random() * Math.floor(5))
  if (num === 1) {
    $("#ongoing-text-box").prepend("One of your horses was pregnant and gave birth. Unfortunately, the baby died. The mother seems a bit glum, but continues on. <br>")
  } else if (num === 2) {
    $("#ongoing-text-box").prepend("You get a letter from back home in Philippi, telling you that your neighbor has fallen sick and that your farm's caretaker will be overseeing your neighbor's farm as well. <br>")
  } else if (num === 3) {
    $("#ongoing-text-box").prepend("Your party finds a small lake and decides to go for a swim. " + wagon.characters[Math.floor(Math.random() * Math.floor(wagon.characters.length))].name + " was being a stickler about it and forced everyone to get out and keep moving. <br>")
  } else if (num === 4) {
    $("#ongoing-text-box").prepend("You find a small bunny on the side of the road and decide to keep it (not as food, what's wrong with you.) <br>")
  } else if (num === 5){
    $("#ongoing-text-box").prepend("A member of your party decides that they need a break. You stop until noon, but make up the time by going faster through the next town. <br>")
  }
}
  //random negativeEvent
function negativeEvent() {
  var num = Math.floor(Math.random() * Math.floor(5))
  var ranMoneySupplyDecrease = Math.floor(Math.random() * wagon.money)
  var ranFoodSupplyDecrease = Math.floor(Math.random() * wagon.food)
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  if (num === 1) {
    $("#ongoing-text-box").prepend("Your party finds a small lake and decides to go for a swim. Unfortunately, the lake was full of harmful fish. " + wagon.characters[index].name + " got bitten by one of them. <br>")
    wagon.characters[index].health -= 10
  } else if (num === 2 && wagon.characters[index].illness.includes("Broken Bone") == false) {
    $("#ongoing-text-box").prepend("You find a small dog and decide to keep it. An hour later, you come to find out that the dog is a baby wolf. The wolf bites down hard on " + wagon.characters[index].name + "'s leg, breaking his bone. <br>")
    wagon.characters[index].illness.push("Broken Bone")
  } else if (num === 3) {
    $("#ongoing-text-box").prepend("Your group is ambushed, they hold you hostage and take " + ranFoodSupplyDecrease + " units of your food. <br>")
    wagon.food -= ranFoodSupplyDecrease
    wagon.days += index
    $('.wagon-food-remaining').text(wagon.food.toFixed(2));
  } else if (num === 4) {
    $("#ongoing-text-box").prepend("One of the soldiers loses his sword and so the group spends 5 days trying to find it. However, " + wagon.characters[index].name + " decides not to help, instead going to the nearest town and gambling away " + ranMoneySupplyDecrease + " denarii. <br>")
    wagon.days += 5
    wagon.food -= ((wagon.characters.length * 5 ) * 5)
	$('.wagon-food-remaining').text(wagon.food.toFixed(2));
	wagon.money -= ranMoneySupplyDecrease
	$('.wagon-money-remaining').text(wagon.money.toFixed(2));
  } else if (num === 5){
    $("#ongoing-text-box").prepend(ranFoodSupplyDecrease + " units of your food rot because " + wagon.characters[index].name + " wet themselves as they napped on it. <br>")
    wagon.food -= ranFoodSupplyDecrease
    $('.wagon-food-remaining').text(wagon.food.toFixed(2));
  }
}
//landmarkEvent for distance traveled

function storeModal() {
  $('.modal-child').html('<div id="popup-text"><h2>Here is what is in your cart currently</h2><span id="wagon-food-remaining"></span></div>' + wagon.money.toFixed(2) + '<span id="back-button" class="btn btn-danger">Back</span></div>')
}

function buildModal(value) {
  $('.modal-child').html('<img style="height:75vh" src="img/' + value + '.jpg" alt="an image">' +
    '<div id="popup-text" class="button-content">' +
    '</div>'
  )
}

function buildEndModal(value, btnID1, btn1Name) {
  $('.modal-child').html('<img style="height:60vh;" src="img/' + value + '.jpg" alt="an image">' +
    '<div id="popup-text" class="button-content">' +
    '<div class="buttons">' +
    '<span id="'+ btnID1 + 'Button" class="btn btn-success">' + btn1Name +'</span>' +
    '</div>' +
    '</div>'
  )
}

function buildLandmarkModal(value, btnID1, btnID2, btn1Name, btn2Name) {
  $('.modal-child').html('<img style="height:60vh;" src="img/' + value + '.jpg" alt="an image">' +
    '<div id="popup-text" class="button-content">' +
    '<div class="buttons">' +
    '<span id="'+ btnID1 + 'Button" class="btn btn-success">' + btn1Name +'</span> <span id="'+ btnID2 + 'Button" class="btn btn-success">' + btn2Name +'</span>' +
    '</div>' +
    '</div>'
  )
}

Wagon.prototype.buildScore = function() {
  var finalScore = 10000;
  finalScore -= ((this.days - 50) * 20) + ((5 - this.characters.length) * 2000) - (this.food * .2) - (this.money * .3) - (this.bullets* .1)
  return finalScore.toFixed();

}
//Push text to class .button-content
//Option 1 button - id #option1-button
//Option 2 button - id #option2-button
function landmarkEvent() {
  var num = wagon.distance
  if (num === 100) {
    buildLandmarkModal(num, "crossRiver", "detourRiver", "Cross River", "Detour")
    $(".button-content").prepend("You have reached a river and the bridge is under construction. You can choose to risk supplies and your party to cross the river by wading through the water or take 7 days to go around. <br>")
    $("#buttonModal").toggle();
  } else if (num === 200) {
    buildModal("merc");
    $(".button-content").prepend("Your group made it to a larger town with a big market. You send one of your men to the store. Select what you would like them to buy. <br>")
    $("#myModal").toggle();
    $("#gameMainScreen").fadeOut(500);
    $("#store").delay(500).fadeIn(500);
    $("#back-button").hide();
  } else if (num === 300) {
	  //put something here, this was the cannibal spot
  } else if (num === 400) {
    buildModal("merc");
    $(".button-content").prepend("Your party has come across a small roadside market. Select what you would like to buy. <br>")
    $("#myModal").toggle();
    $("#gameMainScreen").fadeOut(500);
    $("#store").delay(500).fadeIn(500);
    $("#back-button").hide();
  } else if (num === 500){
    buildEndModal("500", "win", "Play Again!")
    var endScore = wagon.buildScore()
    $(".button-content").prepend("<h4>WINNER!</h4>Your score is: " + endScore);
    $("#buttonModal").addClass('confetti');
    $("#buttonModal").toggle();
  }
}
//landmark 1 button events
function detourRiver() {
  for(i=0; i < 8; i++) {
    wagon.days += 1
    wagon.food -= (wagon.characters.length * 5 )
    wagon.resourceChecker()
    wagon.statusAdjuster()
  }
  $(".button-content").prepend("You spent seven days and went around the river. <br>")
  wagon.statusAdjuster()
}
function crossRiver() {
  var num = Math.floor(Math.random() * Math.floor(100))
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  if (num > 50) {
    wagon.characters[index].health -= 30
    wagon.food -= (wagon.food * 0.4)
    wagon.money -= (wagon.money * 0.2)
    buildModal("riverFail");
    $(".button-content").prepend(wagon.characters[index].name + " tripped and was swallowed by a giant fish. The soldier narrowly escaped, but was still injured badly. You lost everything he was carrying to the river's raging rapids: " + (wagon.food * 0.4).toFixed(0) + " units of food and " + (wagon.money * 0.2).toFixed(0) + " denarii. <br>")
     $("#myModal").toggle();
    for(i=0; i < 4; i++) {
      wagon.statusAdjuster()
      wagon.days += 1
      wagon.food -= (wagon.characters.length * 5 )
    }
  } else {
    buildModal("riverWin");
    $(".button-content").prepend("Your group successfully crossed the river! The soldiers dry off and get back on the road. <br>")
    $("#myModal").toggle();
    wagon.days += 1
    wagon.food -= (wagon.characters.length * 5 )
  }

  wagon.resourceChecker()
  wagon.statusAdjuster()
}
// landmark 3 button events

function deathEvent() {
  var num = Math.floor(Math.random() * Math.floor(5))
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  if (num === 1 && wagon.characters[index].health < 65) {
    buildModal("3");
    $(".button-content").prepend(wagon.characters[index].name + " tried to run away from the group and was mistaken for one of Spartacus' slave/rebels. He was hung alongside the road. <br>")
    $("#myModal").toggle();
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Dead"
  } else if (num === 2 && wagon.characters[index].health < 65) {
	buildModal("3");
    $(".button-content").prepend(wagon.characters[index].name + " tried to mail a letter back home but forgot to pay for postage, so he was stabbed by the mailman. <br>")
    $("#myModal").toggle();
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Dead"
  } else if (num === 3 && wagon.characters[index].health < 65 ) {
    buildModal("3");
    $(".button-content").prepend(wagon.characters[index].name + " secretly stole a quarter of the group's money, gambling it away at night. Another soldier kills him in a fit of rage. <br>")
    $("#myModal").toggle();
    wagon.money -= (wagon.money * 0.25)
    $('.wagon-money-remaining').text(wagon.money.toFixed(2));
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Dead"
  } else if (num === 4) {
    buildModal(num);
    $(".button-content").prepend(wagon.characters[index].name + " got so hungry, he ate half the group's food. Another soldier kills him in a fit of rage. <br>")
    $("#myModal").toggle();
    wagon.food -= (wagon.food * 0.5)
    $('.wagon-food-remaining').text(wagon.food.toFixed(2));
	wagon.characters[index].health = 0
    wagon.characters[index].status = "Dead"
  } else if (num === 5) {
    buildModal("5");
    $(".button-content").prepend(wagon.characters[index].name  + " ran off into the woods to find a natural latrine. " + wagon.characters[index-1].name + ", thinking his fellow soldier was deserting, snuck up on him and stabbed him while he was using the latrine he found. <br>")
    $("#myModal").toggle();
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Dead"
  }
}
//Hunting
Wagon.prototype.huntingTime = function() {
  var hunt = Math.floor(Math.random() * Math.floor(150))
  if (this.hunted == 1) {
    var num = 1;
    document.getElementById('shotgun-dry').play();
    buildModal(num);
    $(".button-content").prepend("You have already hunted here, so don't waste your precious arrows. Continue to a new area to hunt again.<br>");
    $("#myModal").toggle();
  } else if (this.hunted == 0 && wagon.bullets > 0){
    this.food += hunt
    this.bullets -= 1
    wagon.statusAdjuster()
    this.hunted += 1;
    $("#ongoing-text-box").prepend("One of the soldiers spent the day hunting and gathered " + hunt + " units of food.<br>")
    document.getElementById('shotgun-fire').play();
  }

  if (hunt === 0) {
    buildModal("huntFail");
    $(".button-content").prepend("The hunter came back empty handed to the group. The rest of the soldiers resent him, and make him promise that one of them will hunt next time.<br>");
    $("#myModal").toggle();
  }

  if (wagon.bullets <= 0) {
    wagon.bullets = 0
  }
  $('#wagon-bullets-remaining').text(wagon.bullets);
}
//Profession checker
Wagon.prototype.profession = function(input) {
  if (input == 1) {
    this.money += 500
  } else if (input == 2) {
    this.money += 300
  } else if (input == 3) {
    this.food += 500
  } else if (input == 4) {
    this.food += 250
    this.money += 250
  } else if (input == 5) {
    this.money += 400
    this.food += 100
  } else if (input == 6) {
    this.money += 50
  }
}

function storeSubTotal(food, bullets) {
  var total = (food * 0.2) + (bullets * 0.1);
  $('.food-total').text((food * 0.2).toFixed(2));
  $('.bullet-total').text((bullets * 0.1).toFixed(2));
  return total.toFixed(2);
}

function storeBuy(food, bullets) {
    var total = ((food * 0.2) + (bullets * 0.1)).toFixed(2);

    if (total == NaN || isNaN(total) || wagon.money < total || food < 0 || bullets < 0) {
      $("#store").effect("shake", {times:3}, 700);
    }
    else {
      wagon.money -= total;
      wagon.food += food;
      wagon.bullets += bullets;
      $("#store").fadeOut(500);
      $("#gameMainScreen").delay(500).fadeIn(500);
      $('.wagon-money-remaining').text(wagon.money.toFixed(2));
      $("#food-fields input, #bullet-fields input").val(0);
      $(".store-total, .bullet-total, .food-total").text("$0");
      return total;
  }
}

function textUpdateUI() {
  $('#player-one-name').text(char1.name);
  $('#player-two-name').text(char2.name);
  $('#player-three-name').text(char3.name);
  $('#player-four-name').text(char4.name);
  $('#player-five-name').text(char5.name);
  $('#player-one-status').text(char1.status);
  $('#player-two-status').text(char2.status);
  $('#player-three-status').text(char3.status);
  $('#player-four-status').text(char4.status);
  $('#player-five-status').text(char5.status);
  $('#player-one-illness').text(char1.illness.length);
  $('#player-two-illness').text(char2.illness.length);
  $('#player-three-illness').text(char3.illness.length);
  $('#player-four-illness').text(char4.illness.length);
  $('#player-five-illness').text(char5.illness.length);
  $('#wagon-food-remaining').text(wagon.food.toFixed(0));
  $('.wagon-money-remaining').text(wagon.money.toFixed(2));
  $('#wagon-bullets-remaining').text(wagon.bullets.toFixed(0));
  $('.current-date').text(wagon.days);
  $('.distance-traveled').text(wagon.distance);
}

function validateNames(profession, playerOne, playerTwo, playerThree, playerFour, playerFive) {
  if (profession === undefined || playerOne === "" || playerTwo === "" || playerThree === "" || playerFour === "" || playerFive === "") {
    $("#charNameInput").effect("shake", {times:3}, 700);
    $("#profession").effect("shake", {times:3}, 700)
  } else {
    $("#characterInput").fadeOut(500);
    $("#store").delay(500).fadeIn(500, function () {
	  $("#store").css("display", "block")
	});
  }
}

function enableSubmit(ele) {
  if (ele == "#continue-button") {
    $(ele).css({"pointer-events":"auto","background-color":"#28a745","border-color":"#28a745"});
  } else if (ele == "#rest-button") {
    $(ele).css({"pointer-events":"auto","background-color":"#17a2b8","border-color":"#17a2b8"});
  }
}


$(document).ready(function(){
  var x = 1;
  $('#wagon-images').addClass('sky1');

  // modal that closes with click anywhere
  var modal = document.getElementById('myModal');
  var span = document.getElementById('myModal');
  span.onclick = function() {
    modal.style.display = "none";
  }

  $("#startBTN").click(function(){
    document.getElementById('openingSong').play();
    $("#start").fadeOut(500);
    $("#characterInput").delay(500).fadeIn(500);
  });
  $("#characterBTN").click(function(){
    var playerOneName = $("#char1").val()
    var playerTwoName = $("#char2").val()
    var playerThreeName = $("#char3").val()
    var playerFourName = $("#char4").val()
    var playerFiveName = $("#char5").val()
    var professionValue = $("input:radio[name=profession]:checked").val()

    validateNames(professionValue, playerOneName, playerTwoName, playerThreeName, playerFourName, playerFiveName)
    char1 = new Character(playerOneName)
    char2 = new Character(playerTwoName)
    char3 = new Character(playerThreeName)
    char4 = new Character(playerFourName)
    char5 = new Character(playerFiveName)
    wagon = new Wagon()
    journey(0)
    char1.healthBar()
    wagon.characters.push(char1, char2, char3, char4, char5)
    wagon.profession(professionValue)
    textUpdateUI()
  });
  $("#subtotal").click(function(){
    var buyFood = parseInt($("#food-fields input").val())
    var buyBullets = parseInt($("#bullet-fields input").val())
    $(".store-total").text("$ " + storeSubTotal(buyFood, buyBullets))
  });
  $("#storeBTN").click(function(){
    var buyFood = parseInt($("#food-fields input").val())
    var buyBullets = parseInt($("#bullet-fields input").val())
    storeBuy(buyFood, buyBullets)
    $('#wagon-food-remaining').text(wagon.food);
    $('.wagon-money-remaining').text(wagon.money.toFixed(2));
    $('#wagon-bullets-remaining').text(wagon.bullets);
    document.getElementById('openingSong').pause();
  });
  $("#preCheckout").click(function(){
    storeModal();
    $('#myModal').toggle();
  });
  $("#back-button").click(function(){
    $("#store").fadeOut(500);
    $("#characterInput").delay(500).fadeIn(500);
  });
  $("#continue-button").click(function(){
    $("#continue-button").css({"pointer-events":"none","background-color":"lightgreen","border-color":"lightgreen"});
    setTimeout(function() { enableSubmit("#continue-button") }, 500);
    wagon.turn()
    wagon.statusAdjuster()
    textUpdateUI()
    if (x < 6) {
      $('#wagon-' + x).toggle();
      $('#wagon-images').removeClass('sky' + x);
      x++;
      $('#wagon-' + x).toggle();
      $('#wagon-images').addClass('sky' + x);
    } else {
      $('#wagon-' + x).toggle();
      $('#wagon-images').removeClass('sky' + x);
      x = 1;
      $('#wagon-' + x).toggle();
      $('#wagon-images').addClass('sky' + x);
    }
  });
  $("#rest-button").click(function(){
    $("#rest-button").css({"pointer-events":"none","background-color":"lightblue","border-color":"lightblue"});
    setTimeout(function() { enableSubmit("#rest-button") }, 500);
    wagon.rest()
    textUpdateUI()
  });
  $('#hunt-button').click(function(){
    wagon.huntingTime()
    wagon.resourceChecker()
    textUpdateUI()
  });
  $(document).on('click', '#deathButton', function(){
    history.go(0)
  });
  $(document).on('click', '#winButton', function(){
    history.go(0)
  });
  $(document).on('click', '#sacrifice', function(){
    history.go(0)
  });
  $(document).on('click', '#crossRiverButton', function(){
    crossRiver()
    textUpdateUI()
    $('#buttonModal').hide();
  });
  $(document).on('click', '#detourRiverButton', function(){
    detourRiver()
    textUpdateUI()
    $('#buttonModal').hide();
  });
  $(document).on('click', '#sacrificeButton', function(){
    sacrifice()
    textUpdateUI()
    $('#buttonModal').hide();
  });
  $(document).on('click', '#fleeButton', function(){
    flee()
    textUpdateUI()
    $('#buttonModal').hide();
  });
});