function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
const gameID = getQueryStringValue("id");
$("#game-board").hide();
$("#roll-dice-button").hide();
// Game variables
let startTile = 1;
let playerCurrentTile = Number(0);
let maxTile = 30;
let gameWinner;
let player_img_element = document.createElement("img");
let bot_img_element = document.createElement("img");
let playerImage = '../../assets/img/icons/king.png';
let botImage = '../../assets/img/icons/rook.png';

let trapCustomMessage;
let trapCount;
let trapMove;
let trap0, trap1, trap2, trap3, trap4, trap5;
let trapTile_value;

let playerUserName;
let playerCharacter;
let botUserName;
let botCharacter;

let userCurrentTile;
let botCurrentTile;

let currentPlayer; // This will be the current player (snapshot.val().nextTurn;)
let trapPlayer; // This will be the next player

let result; // to use if player rolls a 6 on the dice and then lands on a trap. user should then not be able to roll the dice again
let botResult;

firebase.database().ref('games/bot/').orderByChild('gameID').equalTo(gameID).on("child_added", function(snapshot) {
  Cookies.set('dbKey_value', snapshot.key)
  playerUserName = snapshot.val().player.userName
  playerCharacter = snapshot.val().player.character

  botUserName = snapshot.val().bot.userName
  botCharacter = snapshot.val().bot.character

  //check if bot exists in the database, if so - show the game board
  if (snapshot.child('bot').exists() == true) {
    $("#loader").hide();
    $("#roll-dice-button").show();
    $("#game-board").show();
    trap0 = snapshot.val().trapTiles[0]
    trap1 = snapshot.val().trapTiles[1]
    trap2 = snapshot.val().trapTiles[2]
    trap3 = snapshot.val().trapTiles[3]
    trap4 = snapshot.val().trapTiles[4]
    trap5 = snapshot.val().trapTiles['newKey']
  }
});
// tiles images
var tileElement = document.querySelectorAll('tile');
[].forEach.call(
  document.querySelectorAll('.tile'),
  function (element) {
      var imageURL = "../../assets/img/tiles/" + element.id + ".png";
      $("#" + element.id).css("background-image", "url(" + imageURL + ")");
  }
);

// disable the button before we get the user
var dice_element = document.getElementById('dice');
var roll_dice_button = document.getElementById('roll-dice-button');

// create traps in the document
var query = firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/trapTiles/').orderByKey();
  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // If one of the traps are on tile 1, then delete the value and set it to 2 instead
      // You don't want to start the game on a trap tile
    if (childSnapshot.val() == 1) {
      let key = childSnapshot.key;
      firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/trapTiles/' + key).remove();
      firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/trapTiles/').update({
        newKey: 2
      });
      document.getElementById('tile-' + key).classList.remove('tile-trap');
      document.getElementById('tile-' + key).setAttribute('data-trap', '');
    }
    document.getElementById('tile-' + childSnapshot.val()).classList.add('tile-trap');
    document.getElementById('tile-' + childSnapshot.val()).setAttribute('data-trap', 'true');
  });
});

function listenForTraps() {
  var trapMessage = document.getElementById('trapMessage');
  const trapID = playerCurrentTile;
  switch (trapID) {
    case trap0:
      trapMessage.innerHTML = 'Arya Stark found a shortcut for you, go ahead 3 spaces.';
      trapCustomMessage = 'Arya Stark found a shortcut for you, go ahead 3 spaces.';
      trapCount = 3;
      trapMove = ' got lucky and can move ' + trapCount + ' spaces ahead.';
        firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/' + trapPlayer).update({
          currentTile: Number(playerCurrentTile) + Number(3)
        });              
      break;
    case trap1:
      trapMessage.innerHTML = 'Ned Stark raised his Sword and told you to go back, go back 2 spaces.';
      trapCustomMessage = 'Ned Stark raised his Sword and told you to go back, go back 2 spaces.';
      trapCount = 2;
      trapMove = ' got trapped and must move ' + trapCount + ' spaces back.';      
        firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/' + trapPlayer).update({
          currentTile: Number(playerCurrentTile) - Number(2)
        });              
      break;
    case trap2:
      trapMessage.innerHTML = 'Melisandre came out from the dark and scared you off, go back 3 spaces.';
      trapCustomMessage  = 'Melisandre came out from the dark and scared you off, go back 3 spaces.';
      trapCount = 3;
      trapMove = ' got trapped and must move ' + trapCount + ' spaces back.';      
        firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/' + trapPlayer).update({
          currentTile: Number(playerCurrentTile) - Number(3)
        });              
      break;
    case trap3:
      trapMessage.innerHTML = 'Sandor Clegane blocked the way, but Jon Snow appeared and gave a free passage, go ahead 2 spaces.';
      trapCustomMessage  = 'Sandor Clegane blocked the way, but Jon Snow appeared and gave a free passage, go ahead 2 spaces.';
      trapCount = 2;
      trapMove = ' got lucky and can move ' + trapCount + ' spaces ahead.';     
        firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/' + trapPlayer).update({
          currentTile: Number(playerCurrentTile) + Number(2)
        });              
      break;
    case trap4:
      trapMessage.innerHTML = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
      trapCustomMessage  = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
      trapCount = 4;
      trapMove = ' got trapped and must move ' + trapCount + ' spaces back.';       
        firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/' + trapPlayer).update({
          currentTile: Number(playerCurrentTile) - Number(4)
        });              
      break;
    case trap5:
      trapMessage.innerHTML = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
      trapCustomMessage  = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
      trapCount = 4;
      trapMove = ' got trapped and must move ' + trapCount + ' spaces back.';       
        firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/' + trapPlayer).update({
          currentTile: Number(playerCurrentTile) - Number(4)
        });              
      break;      
  }
}

firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).on('value', function(snapshot) {
  currentPlayer = snapshot.val().nextTurn;

  if (currentPlayer == null) {
    location.reload()
  } // just to be sure that we are able to load the database before starting the game. Better than setTimeout here.
  // get the the players tiles
  userCurrentTile = snapshot.val().player.currentTile; 
  botCurrentTile = snapshot.val().bot.currentTile;

    // set the players icon according to their current tiles
    player_img_element.src = playerImage;
    bot_img_element.src = botImage;
    $('#tile-' + userCurrentTile).append(player_img_element);
    player_img_element.setAttribute('id', 'img-player');
    $('#img-player').addClass('character1-tileimg');
    $('#tile-' + botCurrentTile).append(bot_img_element);
    bot_img_element.setAttribute('id', 'img-bot');
    $('#img-bot').addClass('character2-tileimg');  
  
    if (currentPlayer == 'player') {
      roll_dice_button.disabled = false;    
    }
    if (currentPlayer == 'bot') {
      roll_dice_button.disabled = true;
    }

  if (userCurrentTile >= maxTile) {
    roll_dice_button.disabled = true; 
    player_img_element.src = ''
    firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).update({
      gameWinner: "player"
    });
    console.log('Player won');
    setTimeout(function () {
      $('#tile-' + 30).append(player_img_element);
      $('#winnerModal').modal('show')
    }, 100);    
  }
  if (botCurrentTile >= maxTile){
    roll_dice_button.disabled = true;
    bot_img_element.src = ''
    firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).update({
      gameWinner: "bot"
    });
    console.log('Bot won');
    setTimeout(function () {
      $('#tile-' + 30).append(bot_img_element);
      $('#loserModal').modal('show')
    }, 100);     
  } 
  
  // If the player or the bot lands on a trap, show a modal and the execute the function listenForTraps() which contains the trap message and a database update
  if(snapshot.val().trapTiles.indexOf(userCurrentTile) !== -1){
    trapPlayer = 'player';
    playerCurrentTile = userCurrentTile
    setTimeout(() => {
      trapTile_value = document.querySelectorAll('#tile-' + playerCurrentTile)[0].dataset.trap;  
      if (trapTile_value) { 
        setTimeout(() => {
          listenForTraps();
          $('#trapModal').modal('show')
        }, 200);
        // If player rolled a 6 on the dice and lands on a trap tile, the player shouldn't be able to roll again. 
        if (result == 6) {
          firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).update({
            nextTurn: 'bot'
          });
          roll_dice_button.disabled = false; 
          setTimeout(function () {
            dice_element.classList.remove('animated', 'rotateIn');
          }, 200);              
        }  
      }  
    }, 200);      
  }

  if(snapshot.val().trapTiles.indexOf(botCurrentTile) !== -1){
    trapPlayer = 'bot';
    playerCurrentTile = botCurrentTile
    setTimeout(() => {
      botTrapTile_value = document.querySelectorAll('#tile-' + playerCurrentTile)[0].dataset.trap; 
      console.log(botTrapTile_value);    
      if (botTrapTile_value) { 
        setTimeout(() => {
          listenForTraps();
        }, 500);
        // If player rolled a 6 on the dice and lands on a trap tile, the player shouldn't be able to roll again. 
        if (botResult == 6) {
          firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).update({
            nextTurn: 'player'
          });
          roll_dice_button.disabled = false; 
          setTimeout(function () {
            dice_element.classList.remove('animated', 'rotateIn');
          }, 200);              
        }  
      }  
    }, 200);  
  }
})

// function to roll the dice, we can then use the function later when the player clicks the button
function rollDice() {
  let dice = Math.floor(Math.random() * 6) + 1;
  return dice;
}

// update the dice img from the function above
function getDiceNumber(number) {
  dice_element.className = ''
  dice_element.classList.add('animated', 'rotateIn', 'dice', 'dice-' + number);
}

document.getElementById('roll-dice-button').onclick = function() {
  result = rollDice();
  getDiceNumber(result);
  console.log('Player rolled: ' + result);
  
  if (result == 6) {
    roll_dice_button.disabled = false;
    firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/player').update({
      currentTile: Number(userCurrentTile) + Number(result)
    });
    setTimeout(function () {
      dice_element.classList.remove('animated', 'rotateIn');
    }, 200);
  } else {
    // If player doesn't roll a 6, do this
    setTimeout(() => {
      firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).update({
        nextTurn: 'bot'
      });
    }, 1000);
    firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/player').update({
      currentTile: Number(userCurrentTile) + Number(result)
    });

    roll_dice_button.disabled = true;
    setTimeout(() => {
      rollDiceBot();
    }, 1500);
    setTimeout(function () {
      dice_element.classList.remove('animated', 'rotateIn');
    }, 200);  
  }
};

function rollDiceBot() {
  roll_dice_button.disabled = true;
  botResult = rollDice();
  console.log('BOT rolled: ' + botResult);
  if (botResult == 6) {    
    firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/bot').update({
      currentTile: Number(botCurrentTile) + Number(botResult)
    });
    setTimeout(() => {
      newBotResult = rollDice();
      console.log('BOT ROLLED: ' + botResult);
      firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/bot').update({
        currentTile: Number(botCurrentTile) + Number(newBotResult)
      });
      firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).update({
        nextTurn: 'player'
      });        
    }, 1500);
    roll_dice_button.disabled = false;
  } else {  
    // If player doesn't roll a 6, do this
      firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/bot').update({
        currentTile: Number(botCurrentTile) + Number(botResult)
      });
      firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).update({
        nextTurn: 'player'
      });   
      roll_dice_button.disabled = false;
  }  
}


// TODO: Remove before serving
document.getElementById('resetData').onclick = function() {
  firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/gameWinner').remove();   
  firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/player' ).update({
    currentTile: 1
  });  
  firebase.database().ref('games/bot/' + Cookies.get('dbKey_value') + '/bot' ).update({
    currentTile: 1
  });
  firebase.database().ref('games/bot/' + Cookies.get('dbKey_value')).update({
    nextTurn: 'player'
  });
};
