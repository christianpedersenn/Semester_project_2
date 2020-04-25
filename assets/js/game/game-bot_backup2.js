function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

const queryStringID = getQueryStringValue("id");
let playerID = "player" + getQueryStringValue("player"); // get the current player
let playerName;
let playerUserName;

// Game variables
let startTile = 1;
let playerCurrentTile = Number(0);
let maxTile = 30;
let gameWinner;
var player1_img_element = document.createElement("img");
var player2_img_element = document.createElement("img");
let player1Image = '../../assets/img/icons/king.png';
let player2Image = '../../assets/img/icons/rook.png';
let player1CurrentTile;
let player2CurrentTile;
let player1Character;
let player2Character;
let player1Username;
let player2Username;

let trapCustomMessage;
let trapCount;
let trapMove;
let trap0, trap1, trap2, trap3, trap4, trap5;
let trapTile_value;

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

firebase.database().ref('games/bot/').orderByChild('gameID').equalTo(queryStringID).on("child_added", function(snapshot) {
  Cookies.set('databaseKey_value', snapshot.key)
});

// Has to be in a function because it is needed to load it only when player2 has connected to the game
function createTileTraps() {
var query = firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/trapTiles/').orderByKey();
  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // If one of the traps are on tile 1, then delete the value and set it to 2 instead
      // You don't want to start the game on a trap tile
    if (childSnapshot.val() == 1) {
      let key = childSnapshot.key;
      firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/trapTiles/' + key).remove();
      firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/trapTiles/').update({
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
  firebase.database().ref('games/bot/').orderByChild('gameID').equalTo(queryStringID).on("child_added", function(snapshot) {
    playerUserName = snapshot.val().player1.userName
    player1Character = snapshot.val().player1.character
    player1Username = snapshot.val().player1.userName
    firebase.database().ref('games/bot/' + snapshot.key).on('value', function(snapshot) {
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
}

if (playerID == 'player2') {
  firebase.database().ref('games/bot/').orderByChild('gameID').equalTo(queryStringID).on("child_added", function(snapshot) {
    playerUserName = snapshot.val().player2.userName
    player2Character = snapshot.val().player2.character
    player2Username = snapshot.val().player2.userName
  });
}

function listenForTraps() {
  var trapMessage = document.getElementById('trapMessage');
  const trapID = playerCurrentTile;
  switch (trapID) {
    case trap0:
      trapMessage.innerHTML = 'Arya Stark found a shortcut for you, go ahead 3 spaces.';
      trapCustomMessage = 'Arya Stark found a shortcut for you, go ahead 3 spaces.';
      trapCount = 3;
      trapMove = ' got lucky and can move ' + trapCount + ' spaces ahead.';
      logTrapMessage()
        firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
          currentTile: Number(playerCurrentTile) + Number(3)
        });              
      break;
    case trap1:
      trapMessage.innerHTML = 'Ned Stark raised his Sword and told you to go back, go back 2 spaces.';
      trapCustomMessage = 'Ned Stark raised his Sword and told you to go back, go back 2 spaces.';
      trapCount = 2;
      trapMove = ' got trapped and must move ' + trapCount + ' spaces back.';      
      logTrapMessage()
        firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
          currentTile: Number(playerCurrentTile) - Number(2)
        });              

      break;
    case trap2:
      trapMessage.innerHTML = 'Melisandre came out from the dark and scared you off, go back 3 spaces.';
      trapCustomMessage  = 'Melisandre came out from the dark and scared you off, go back 3 spaces.';
      trapCount = 3;
      trapMove = ' got trapped and must move ' + trapCount + ' spaces back.';      
      logTrapMessage()
        firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
          currentTile: Number(playerCurrentTile) - Number(3)
        });              
      break;
    case trap3:
      trapMessage.innerHTML = 'Sandor Clegane blocked the way, but Jon Snow appeared and gave a free passage, go ahead 2 spaces.';
      trapCustomMessage  = 'Sandor Clegane blocked the way, but Jon Snow appeared and gave a free passage, go ahead 2 spaces.';
      trapCount = 2;
      trapMove = ' got lucky and can move ' + trapCount + ' spaces ahead.';     
      logTrapMessage()
        firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
          currentTile: Number(playerCurrentTile) + Number(2)
        });              
      break;
    case trap4:
      trapMessage.innerHTML = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
      trapCustomMessage  = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
      trapCount = 4;
      trapMove = ' got trapped and must move ' + trapCount + ' spaces back.';       
      logTrapMessage()
        firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
          currentTile: Number(playerCurrentTile) - Number(4)
        });              
      break;
      case trap5:
        trapMessage.innerHTML = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
        trapCustomMessage  = 'Deanerys’s dragons have blocked the road ahead, go back 4 spaces.';
        trapCount = 4;
        trapMove = ' got trapped and must move ' + trapCount + ' spaces back.';       
        logTrapMessage()
          firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
            currentTile: Number(playerCurrentTile) - Number(4)
          });              
        break;      
  }
}

  function logTrapMessage() {    
    firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/gamelog/').push({
      userName: playerUserName,
      trap: trapCustomMessage,
      trapCount: trapCount,
      trapMove: trapMove
    })   
  }


// get current player tile and update location of players tile
firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).on('value', function(snapshot) {
    player1CurrentTile = snapshot.val().player1.currentTile;
    if (snapshot.child('player2').exists() == true) {
      player2CurrentTile = snapshot.val().player2.currentTile;
      createTileTraps()
    }
    if (playerID == 'player1') {
      playerCurrentTile = player1CurrentTile
      setTimeout(function () {         
        // Unless we wrap this in a try catch function, the code would stop executing when the game ends it would create an error because dataset isn't defined.
        try {
          trapTile_value = document.querySelectorAll('#tile-' + playerCurrentTile)[0].dataset.trap; 
        } catch (error) {
            console.error(error);
        } finally {
            // console.log('');
        }

        if (trapTile_value) {
          playerName = 'player2';         
          trap0 = snapshot.val().trapTiles[0]
          trap1 = snapshot.val().trapTiles[1]
          trap2 = snapshot.val().trapTiles[2]
          trap3 = snapshot.val().trapTiles[3]
          trap4 = snapshot.val().trapTiles[4]
          trap5 = snapshot.val().trapTiles['newKey']
          setTimeout(() => {
            listenForTraps();
            $('#trapModal').modal('show')
          }, 100);
          // If player rolled a 6 on the dice and lands on a trap tile, the player shouldn't be able to roll again. 
          if (result == 6) {
            firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
              nextTurn: playerName
            });
            roll_dice_button.disabled = true;
            setTimeout(function () {
              dice_element.classList.remove('animated', 'rotateIn');
            }, 200);              
          }
          
        }
      }, 200);
    }
    if (playerID == 'player2') {
      playerCurrentTile = player2CurrentTile
      setTimeout(function () {
        let trapTile_value = document.querySelectorAll('#tile-' + playerCurrentTile)[0].dataset.trap;
        if (trapTile_value) {
          playerName = 'player1';
          trap0 = snapshot.val().trapTiles[0]
          trap1 = snapshot.val().trapTiles[1]
          trap2 = snapshot.val().trapTiles[2]
          trap3 = snapshot.val().trapTiles[3]
          trap4 = snapshot.val().trapTiles[4]
          trap5 = snapshot.val().trapTiles['newKey']
          setTimeout(() => {
            listenForTraps();
            $('#trapModal').modal('show')
          }, 100);
          // If player rolled a 6 on the dice and lands on a trap tile, the player shouldn't be able to roll again. 
          if (result == 6) {
            firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
              nextTurn: playerName
            });
            roll_dice_button.disabled = true;
            setTimeout(function () {
              dice_element.classList.remove('animated', 'rotateIn');
            }, 200);              
          }         
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
      firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
        nextTurn: "none",
        gameWinner: "player1"
      });
      setTimeout(function () {
        $('#tile-' + 30).append(player1_img_element);
        if (playerID == 'player1') {
          $('#winnerModal').modal('show')
        }
        if (playerID == 'player2') {
          // $('#loserModal').modal('show')
        }
      }, 100);
    }
    if (player2CurrentTile >= maxTile){
      player2_img_element.src = ''
      firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
        nextTurn: "none",
        gameWinner: "player2"
      });
      setTimeout(function () {
        $('#tile-' + 30).append(player2_img_element);
        if (playerID == 'player1') {
          $('#loserModal').modal('show')
        }
        if (playerID == 'player2') {
          // $('#winnerModal').modal('show')
        }
      }, 100);
    }
});


firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).on('value', function(snapshot) {
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
// firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/gamelog/').on("value", function(snapshot) {
//   snapshot.forEach(function(childSnapshot) {
//     // unless we remove the game-log element from the html, this would be looped as we are 2 players -
//     // requesting data from the database at the same time since Firebase are asking to retrieve data on values changed
//     $('#game-log').remove();
//     setTimeout(function () {
//       var gameLog = document.createElement("div")
//       gameLog.setAttribute('id', 'game-log');      
//       if (childSnapshot.val().diceResult == null || childSnapshot.val().diceResult == undefined) {
//         $('#game-log-container').append(gameLog);
//         var textElement = document.createElement("p")
//         textElement.setAttribute('id', childSnapshot.key);
//         textElement.innerHTML = '\n' + childSnapshot.val().userName + childSnapshot.val().trapMove;
//         $('#game-log').append(textElement);
//         $('#' + childSnapshot.key).addClass('animated fadeIn fast');
//       } else {
//         $('#game-log-container').append(gameLog);
//         var textElement = document.createElement("p")
//         textElement.setAttribute('id', childSnapshot.key);
//         textElement.innerHTML = '\n' + childSnapshot.val().userName + ' rolled a ' + childSnapshot.val().diceResult + ' on the dice.';
//         $('#game-log').append(textElement);
//         $('#' + childSnapshot.key).addClass('animated fadeIn fast')     
//       }         
//     }, 100);
//   });
// });

document.getElementById('roll-dice-button').onclick = function() {
  if (playerID == 'player1') {
    let result = rollDice();
    getDiceNumber(result);
  // Scroll to bottom of the game log if the game log is getting to large
  // if player roll a 6 on the dice, let the player throw the dice once more
    if (result == 6) {
      firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
        currentTile: Number(player1CurrentTile) + Number(result)
      });
      roll_dice_button.disabled = false;
      setTimeout(function () {
        dice_element.classList.remove('animated', 'rotateIn');
      }, 200);
    } else {
        // If player doesn't roll a 6, do this
        firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
          nextTurn: 'player2'
        });
        firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
          currentTile: Number(player1CurrentTile) + Number(result)
        });
        roll_dice_button.disabled = true;
        setTimeout(function () {
          dice_element.classList.remove('animated', 'rotateIn');
        }, 200);  
    }

    setTimeout(() => {
      firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).once("value", function(snapshot) {
        // console.log(snapshot.val().nextTurn);
        let player2tile = snapshot.val().player2.currentTile
        // console.log('BOT IS AT: ' + player2tile);
        
        if (snapshot.val().nextTurn == 'player2') {
          let botResult = rollDice();
          console.log('BOT ROLLED: ' + botResult);
          player2tile = snapshot.val().player2.currentTile + botResult;
          // console.log('BOT IS NOW AT: ' + player2tile);
          if (botResult == 6) {
            firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/player2').update({
              currentTile: Number(player2tile) + Number(botResult)
            });
            // roll_dice_button.disabled = false;
            // setTimeout(function () {
            //   dice_element.classList.remove('animated', 'rotateIn');
            // }, 200);
          } else {
              // console.log('player2 is now at: ' + player2tile);
              // If player doesn't roll a 6, do this
              firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
                nextTurn: 'player1'
              });
              firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/player2').update({
                currentTile: Number(player2tile) + Number(botResult)
              });
            }
            setTimeout(() => {
              // console.log('player2 is now at: ' + player2tile);   
              roll_dice_button.disabled = false;
            }, 1000);
            // }, 1000);                  
        }     
      });
    }, 1500);



    // console.log('player2 is at: ' + player2CurrentTile); 
    // setTimeout(() => {
      // firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).on("value", function(snapshot) {
      //   if (snapshot.val().nextTurn == 'player2') {
      //     let botResult = rollDice()
      //     console.log('BOT ROLLED: ' + botResult);
          
      //   if (botResult == 6) {
      //      firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/player2').update({
      //        currentTile: Number(player2CurrentTile) + Number(botResult)
      //      });
      //      console.log('player2 is now at: ' + player2CurrentTile); 
      //      roll_dice_button.disabled = false;
      //      setTimeout(function () {
      //        dice_element.classList.remove('animated', 'rotateIn');
      //      }, 200);
      //   } else {
      //       console.log('player2 is now at: ' + player2CurrentTile);
      //       // If player doesn't roll a 6, do this
      //       firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
      //         nextTurn: 'player1'
      //       });
      //       firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/player2').update({
      //         currentTile: Number(player2CurrentTile) + Number(botResult)
      //       });
      //     }  
      //     console.log('player2 is now at: ' + player2CurrentTile);        
      //   }
      //   if ((snapshot.val().nextTurn == 'player1')) {
      //     setTimeout(() => {
      //       roll_dice_button.disabled = false;
      //     }, 500);
          
      //   } 
      // });            
    // }, 1500);
  }

  // result = rollDice();
  // getDiceNumber(result);

  // firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/gamelog/').push({
  //   player: playerName,
  //   diceResult: result,
  //   userName: playerUserName
  // }).then((snapshot) => {
  //   Cookies.set('gameLog_key', snapshot.key)
  // });
// Scroll to bottom of the game log if the game log is getting to large
// if player roll a 6 on the dice, let the player throw the dice once more
// if (result == 6) {
//    firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
//      currentTile: Number(playerCurrentTile) + Number(result)
//    });
//    roll_dice_button.disabled = false;
//    setTimeout(function () {
//      dice_element.classList.remove('animated', 'rotateIn');
//    }, 200);
// } else {
//     // If player doesn't roll a 6, do this
//     firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
//       nextTurn: playerName
//     });
//     firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/' + playerID).update({
//       currentTile: Number(playerCurrentTile) + Number(result)
//     });
//     roll_dice_button.disabled = true;
//     setTimeout(function () {
//       dice_element.classList.remove('animated', 'rotateIn');
//     }, 200);  
//   }
};

// TODO: Remove before serving
document.getElementById('resetData').onclick = function() {
  firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/player1' ).update({
    currentTile: 1
  });  
  firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/player2' ).update({
    currentTile: 1
  });
  firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value')).update({
    nextTurn: 'player1'
  });
  firebase.database().ref('games/bot/' + Cookies.get('databaseKey_value') + '/gamelog' ).remove();
  setTimeout(() => {
    location.reload();
  }, 1000);     
};