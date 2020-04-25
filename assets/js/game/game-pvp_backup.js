// Global letiables
function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

const queryStringID = getQueryStringValue("id");
let playerID = "player" + getQueryStringValue("player"); // get the current player
let playerName = '';
let playerUserName = '';

// Game variables
let startTile = 1;
let playerCurrentTile = Number(0);
let maxTile = 30;
let gameWinner = '';
var player1_img_element = document.createElement("img");
var player2_img_element = document.createElement("img");
let player1Image = '../../assets/img/icons/king.png';
let player2Image = '../../assets/img/icons/rook.png';
let player1CurrentTile = '';
let player2CurrentTile = '';

// tiles images
var tileElement = document.querySelectorAll('tile');
[].forEach.call(
    document.querySelectorAll('.tile'),
    function (element) {
        var imageURL = "../../assets/img/tiles/" + element.id + ".png";
        $("#" + element.id).css("background-image", "url(" + imageURL + ")");
    }
);

var dice_element = document.getElementById('dice');
var roll_dice_button = document.getElementById('roll-dice-button');
roll_dice_button.disabled = true;
$("#roll-dice-button").hide();
$("#game-board").hide();

firebase.database().ref('games/pvp/').orderByChild('gameID').equalTo(queryStringID).on("child_added", function(snapshot) {
  Cookies.set('databaseKey_value', snapshot.key)
});

// Has to be in a function because it is needed to load it only when player2 has connected to the game
function createTileTraps() {
  var query = firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value') + '/trapTiles/').orderByKey();
    query.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // If one of the traps are on tile 1, then delete the value and set it to 2 instead
        // You don't want to start the game on a trap tile
      if (childSnapshot.val() == 1) {
        let key = childSnapshot.key;
        firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value') + '/trapTiles/' + key).remove();
        firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value') + '/trapTiles/').update({
          newKey: 2
        });
        document.getElementById('tile-' + key).classList.remove('tile-trap');
        document.getElementById('tile-' + key).setAttribute('data-trap', '');
      }
      document.getElementById('tile-' + childSnapshot.val()).classList.add('tile-trap');
      document.getElementById('tile-' + childSnapshot.val()).setAttribute('data-trap', 'true');
    });
  });
}

if (playerID == 'player1') {
  document.getElementById('loader-text').innerHTML ="Waiting for player ..";
  firebase.database().ref('games/pvp/').orderByChild('gameID').equalTo(queryStringID).on("child_added", function(snapshot) {
    firebase.database().ref('games/pvp/' + snapshot.key).on('value', function(snapshot) {
      // If key exists, player2 has created a character and we can continue to the game
      if (snapshot.child('player2').exists() == true) {
        player2CurrentTile = snapshot.val().player2.currentTile;
        $("#loader").hide();
        $("#roll-dice-button").show();
        $("#game-board").show();
      } else {
        $("#game-board").hide();
        $("#loader").show();
        $("#roll-dice-button").hide();
      }
    });
  });
  // get player username  
  firebase.database().ref('games/pvp/').orderByChild('gameID').equalTo(queryStringID).on("child_added", function(snapshot) {
    playerUserName = snapshot.val().player1.userName
  });  
}

if (playerID == 'player2') {
  firebase.database().ref('games/pvp/').orderByChild('gameID').equalTo(queryStringID).on("child_added", function(snapshot) {
    playerUserName = snapshot.val().player2.userName
  });
}

// get current player tile and update location of players tile
firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value')).on('value', function(snapshot) {
      player1_img_element.src = ''
      player2_img_element.src = ''
      player1CurrentTile = snapshot.val().player1.currentTile;
      if (snapshot.child('player2').exists() == true) {
        player2CurrentTile = snapshot.val().player2.currentTile;
        createTileTraps()
      }
      if (playerID == 'player1') {
        playerCurrentTile = player1CurrentTile
        setTimeout(function () {
          var trapTile_value = document.querySelectorAll('#tile-' + playerCurrentTile)[0].dataset.trap;
          if (trapTile_value) {
            $('#trapModal').modal('show')
            setTimeout(function () {
              var trapTile_value = document.querySelectorAll('#tile-' + playerCurrentTile)[0].dataset.trap;
              var currentTileREF = firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value') + '/player1/')
              // console.log(Number(snapshot.val().player1.currentTile) - Number(4));
              if (trapTile_value) {
                var trapMessage = document.getElementById('trapMessage');
                var trap0 = snapshot.val().trapTiles[0]
                var trap1 = snapshot.val().trapTiles[1]
                var trap2 = snapshot.val().trapTiles[2]
                var trap3 = snapshot.val().trapTiles[3]
                var trap4 = snapshot.val().trapTiles[4]
                var trap5 = snapshot.val().trapTiles[5]
                var trap6 = snapshot.val().trapTiles[6]
                var trap7 = snapshot.val().trapTiles['newKey']
                const trapID = playerCurrentTile;
                switch (trapID) {
                  case trap0:
                    trapMessage.innerHTML = 'trap1 message';
                    console.log(snapshot.val().trapTiles[0]);
                    break;
                  case trap1:
                    trapMessage.innerHTML = 'trap2 message';
                    console.log(snapshot.val().trapTiles[1]);
                    break;
                  case trap2:
                    trapMessage.innerHTML = 'trap3 message';
                    console.log(snapshot.val().trapTiles[2]);
                    break;
                  case trap3:
                    trapMessage.innerHTML = 'trap4 message';
                    console.log(snapshot.val().trapTiles[3]);
                    break;
                  case trap4:
                    trapMessage.innerHTML = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
                    console.log(snapshot.val().trapTiles[4]);
                    break;
                  case trap5:
                    trapMessage.innerHTML = 'trap6 message';
                    console.log(snapshot.val().trapTiles[6]);
                    break;
                  case trap6:
                    trapMessage.innerHTML = 'trap7 message';
                    console.log(snapshot.val().trapTiles[7]);
                    break;
                  case trap7:
                    trapMessage.innerHTML = 'trap7 message';
                    console.log(snapshot.val().trapTiles['newkey']);
                    break;
                }
              }
            }, 200);
          }
        }, 200);
      }
      if (playerID == 'player2') {
        playerCurrentTile = player2CurrentTile
        setTimeout(function () {
          var trapTile_value = document.querySelectorAll('#tile-' + playerCurrentTile)[0].dataset.trap;
          if (trapTile_value) {
            $('#trapModal').modal('show')
          }
        }, 200);
      }
      setTimeout(function () {
        // Get the character img for each player and add some attributes and styles to it
        player1_img_element.src = player1Image;
        player2_img_element.src = player2Image;
        $('#tile-' + player1CurrentTile).append(player1_img_element);
        player1_img_element.setAttribute('id', 'img-player1');
        $('#img-player1').addClass('character1-tileimg');
        $('#tile-' + player2CurrentTile).append(player2_img_element);
        player2_img_element.setAttribute('id', 'img-player2');
        $('#img-player2').addClass('character2-tileimg');
      }, 100);

      if (player1CurrentTile >= maxTile){
        player1_img_element.src = ''
        firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value')).update({
          nextTurn: "none",
          gameWinner: "player1"
        });
        setTimeout(function () {
          $('#tile-' + 30).append(player1_img_element);
          if (playerID == 'player1') {
            $('#winnerModal').modal('show')
          }
          if (playerID == 'player2') {
            $('#loserModal').modal('show')
          }
        }, 100);
      }
      if (player2CurrentTile >= maxTile){
        player2_img_element.src = ''
        firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value')).update({
          nextTurn: "none",
          gameWinner: "player2"
        });
        setTimeout(function () {
          $('#tile-' + 30).append(player2_img_element);
          if (playerID == 'player1') {
            $('#loserModal').modal('show')
          }
          if (playerID == 'player2') {
            $('#winnerModal').modal('show')
          }
        }, 100);
      }
});


firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value')).on('value', function(snapshot) {
    let player1 = "player1";
    let player2 = "player2";
    if (snapshot.exists() == true) {
      $("#loader").hide();
      $("#game-board").show();
      $("#roll-dice-button").show();
      if (snapshot.val().nextTurn == playerID) {
        // console.log('Next turn: ' + snapshot.val().nextTurn);
        if (player1 == playerID) {
          roll_dice_button.disabled = false;
          playerName = player2;
        }
        if (player2 == playerID) {
          roll_dice_button.disabled = false;
          playerName = player1;
        }
      }
      if (snapshot.val().nextTurn == "none") {
        roll_dice_button.disabled = true;
      }
    }
    if (snapshot.exists() == false) {
      console.log("Does not exist");
      if (player1 == playerID) {
        // reload the page once to properly retrieve the nextTurn entry in the database.
        // without this function the game wouldn't load properly
        location.reload()
      }
    }
});

function rollDice() {
  let dice = Math.floor(Math.random() * 6) + 1;
  return dice;
}

function getDiceNumber(number) {
  dice_element.className = ''
  dice_element.classList.add('animated', 'rotateIn', 'dice', 'dice-' + number);
}

// update the game-log element in the html
firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value') + '/gamelog/').on("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    // unless we remove the game-log element from the html, this would be looped as we are 2 players -
    // requesting data from the database at the same time since Firebase are asking to retrieve data on values changed
    $('#game-log').remove();
    setTimeout(function () {
      var gameLog = document.createElement("div")
      gameLog.setAttribute('id', 'game-log');
      $('#game-log-container').append(gameLog);
      var textElement = document.createElement("p")
      textElement.setAttribute('id', childSnapshot.key);
      textElement.innerHTML = '\n' + childSnapshot.val().userName + ' rolled a ' + childSnapshot.val().diceResult + ' on the dice.';
      $('#game-log').append(textElement);
      $('#' + childSnapshot.key).addClass('animated fadeIn fast');
    }, 10);
  });
});

document.getElementById('roll-dice-button').onclick = function() {
  let result = rollDice();
  getDiceNumber(result);

  firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value') + '/gamelog/').push({
    player: playerName,
    diceResult: result,
    userName: playerUserName
  }).then((snapshot) => {
   console.log(snapshot.key);
   Cookies.set('gameLog_key', snapshot.key)
 });
  // Scroll to bottom of the game log if the game log is getting to large
  // if player roll a 6 on the dice, let the player throw the dice once more
  if (result == 6) {
     firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
       currentTile: Number(playerCurrentTile) + Number(result)
     });
     roll_dice_button.disabled = false;
     setTimeout(function () {
       dice_element.classList.remove('animated', 'rotateIn');
     }, 200);
  } else {
    // If player doesn't roll a 6, do this
    firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value')).update({
      nextTurn: playerName
    });
    console.log(Number(playerCurrentTile));
    firebase.database().ref('games/pvp/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
      currentTile: Number(playerCurrentTile) + Number(result)
    });
    roll_dice_button.disabled = true;
    setTimeout(function () {
      dice_element.classList.remove('animated', 'rotateIn');
    }, 200);
  }
};
