// Hide the character selection until the user have chosen player mode
$("#bot-character-confirm-button").hide();
$("#bot-character-selected-header").hide();
$("#loader").hide();
$("#character-selection").hide();
$("#game-invite-block").hide();
$("#player-mode").hide();
$("#tip").hide();

// $("#userName-block").hide();
// $("#character-selection").show();
// createSlide();


$(document).ready(function () {
  // Create the slider preferences
  var db = firebase.database();
  var mySwiper = new Swiper(".swiper-container", {
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    nextButton: ".next-button",
    previousButton: ".previous-button",    
    slidesPerView: 2.7,
    centeredSlides: true,
    updateOnWindowResize: true,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    breakpoints: {
      1440: {
        slidesPerView: 2.6
      },
      1439: {
        slidesPerView: 1.45
      },
      1024: {
        slidesPerView: 1.45
      },
      1023: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 2
      },
      568: {
        slidesPerView: 1.5,
        spaceBetween: 10
      },
      414: {
        slidesPerView: 1.09,
        spaceBetween: 3
      },
      320: {
        slidesPerView: 1.09,
        spaceBetween: 3
      }
    }
});
  document.getElementById('next-button').onclick = function() {
    mySwiper.slideNext();
    showTip();
  };
  document.getElementById('previous-button').onclick = function() {
    mySwiper.slidePrev();
  };
  document.onkeydown = getKeyboardKey;
  function getKeyboardKey(e) {
      if (e.keyCode == '37') {
        $("#tip").hide();
      }
      else if (e.keyCode == '39') {
        $("#tip").hide();
      }
  }
  function showTip() {
    $("#tip").show();
    setTimeout(() => {
      $("#tip").hide();
    }, 7000);
  }
});



// Global variables
var gameModeBotClicked = document.getElementById('player-mode-bot');
var gameModePVPClicked = document.getElementById('player-mode-pvp');
var userName_block_Clicked = document.getElementById('userName-block');
var confirmBotCharacterButton = document.getElementById('bot-character-confirm-button');

// I started using cookies, but sometimes when using the values from the cookies it would return nothing
var characterID_value = '';
var gameMode_value = '';
var gameID_value = '';
var isHost_value = '';
var userName_value = '';
var botUserName_value = '';

var userName_block_button = document.getElementById('userName-block-button');
userName_block_button.onclick = function() {
  if (document.getElementById('username').value == '') {
    alert('Please select a username!')
  } else {
    userName_value = document.getElementById('username').value;
    $("#userName-block").hide();
    document.getElementById('userName-block').classList.add('animated', 'fadeOutTop')
      setTimeout(function () {
        $("#player-mode").show();
      }, 100);
    }
};

gameModeBotClicked.onclick = function() {
  gameMode_value = "bot";
  document.getElementById('player-mode').classList.add('animated', 'fadeOutLeft')
  document.getElementById('character-selection').classList.add('animated', 'fadeInRight')
  setTimeout(function () {
    $("#player-mode").hide();
    $("#character-selection").show();
    createSlide();
  }, 100);
};

gameModePVPClicked.onclick = function() {
gameMode_value = "pvp";
  document.getElementById('player-mode').classList.add('animated', 'fadeOutLeft')
  document.getElementById('character-selection').classList.add('animated', 'fadeInRight')
  setTimeout(function () {
    $("#player-mode").hide();
    $("#character-selection").show();    
    createSlide();
  }, 100);
};

function createSlide() {
  // Hide character info before loading the slides
  $("#character-info").hide();
  // Get character names from firebase, then update images and information with the values
    var imageCount = 0;
    var query = firebase.database().ref("characters").orderByKey();
      query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          imageCount++; // Increase the value of each snapshot data

          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          var swiper_slide = document.createElement('div');
          var slide_cover = document.createElement('div');
          var slide_card_wrapper = document.createElement('div');
          var character_img = document.createElement('div');
          var slide_content_wrapper = document.createElement('div');
          var slide_content_container = document.createElement('div');
          var button_group = document.createElement('div');
          var character_img = document.createElement('div');
          var button_inner = document.createElement('div');
          var character_header = document.createElement('h2');
          var character_span = document.createElement('span');
          var select_button = document.createElement('button');
          var info_button = document.createElement('button');
          var swiper_wrapper = document.getElementById('swiper-wrapper');

          swiper_slide.className = 'swiper-slide';
          slide_cover.className = 'slide-cover';
          slide_card_wrapper.className = 'slide-card-wrapper';
          character_img.className = 'character' + imageCount + '-img slide-background-image';
          slide_content_wrapper.className = 'slide-content-wrapper slide-content-wrapper-inactive';
          slide_content_container.className = 'slide-content-container slide-card-hide';
          button_group.className = 'button-group';
          button_inner.className = 'button-inner';
          select_button.className = 'btn blue-button';
          swiper_slide.className = 'swiper-slide';
          swiper_slide.className = 'swiper-slide';

          swiper_slide.appendChild(slide_cover);
          swiper_slide.appendChild(slide_card_wrapper);
          slide_card_wrapper.appendChild(character_img);
          slide_card_wrapper.appendChild(slide_content_wrapper);
          slide_content_wrapper.appendChild(slide_content_container);
          slide_content_container.appendChild(character_header);
          character_header.appendChild(character_span);
          slide_content_container.appendChild(button_group);
          button_group.appendChild(button_inner)
          button_inner.appendChild(select_button)
          swiper_wrapper.appendChild(swiper_slide);

          slide_card_wrapper.setAttribute('id', key + '-slide');
          slide_cover.setAttribute('id', key + '-cover');
          character_span.setAttribute('id', key + '-name');
          select_button.setAttribute('id', key + '-button');
          info_button.setAttribute('id', key + '-infobutton');
          character_img.setAttribute('id', key + '-img');
          select_button.append('SELECT');
          character_span.append(childData.name);
          // If for some reason the images can't be found, show a different image
          if (childData.imgURL == "") {
            character_img.style.backgroundImage = "url('https://firebasestorage.googleapis.com/v0/b/gameofthrones-boardgame.appspot.com/o/images%2FUntitled.png?alt=media&token=52ad4ba6-d2ab-454b-bbe8-a6fa7e39f246')";
          } else {
            character_img.style.backgroundImage = "url(" + childData.imgURL + ")";
          }
      });
          document.getElementById('character0-button').onclick = selectedCharacter_button;
          document.getElementById('character1-button').onclick = selectedCharacter_button;
          document.getElementById('character2-button').onclick = selectedCharacter_button;
          document.getElementById('character3-button').onclick = selectedCharacter_button;
          document.getElementById('character4-button').onclick = selectedCharacter_button;
          document.getElementById('character5-button').onclick = selectedCharacter_button;
          document.getElementById('character6-button').onclick = selectedCharacter_button;
          document.getElementById('character7-button').onclick = selectedCharacter_button;
          document.getElementById('character8-button').onclick = selectedCharacter_button;
          document.getElementById('character9-button').onclick = selectedCharacter_button;
    });
}

// Highlight current selected slide when clicking the buttons
  var character_selected_header = document.getElementById('character-selected-header');
  var character_info = document.getElementById('character-info');
  var character_title = document.getElementById('character-title');
  var character_born = document.getElementById('character-born');
  var character_culture = document.getElementById('character-culture');
  var character_alias = document.getElementById('character-alias');
  var character_playedby = document.getElementById('character-playedby');

  function selectedCharacter_button(clicked) {
    id = this.id;
    var characterID = id.slice(0, 10)
    if (document.getElementById(id).innerHTML == "CANCEL") {
      document.getElementById(id.slice(0, 11) + 'slide').classList.remove('selected-slide');
      document.getElementById(id).innerHTML = "SELECT";
      document.getElementById(id).classList.remove('red-button');
      document.getElementById(id).classList.add('white-button');
      character_title.innerHTML = "";
      character_born.innerHTML = "";
      character_culture.innerHTML = "";
      character_alias.innerHTML = "";
      character_playedby.innerHTML = "";
      $("#character-info").hide();
    } else {
      document.getElementById(id.slice(0, 11) + 'slide').classList.add('selected-slide');
      document.getElementById(id).innerHTML = "CANCEL";
      document.getElementById(id).classList.remove('white-button');
      document.getElementById(id).classList.add('red-button');
      characterID_value = characterID;
      firebase.database().ref("characters/" + characterID).once('value').then(function(snapshot) {
        var childData = snapshot.val();
        character_title.innerHTML = childData.title;
        character_born.innerHTML = childData.born;
        character_culture.innerHTML = childData.culture;
        character_alias.innerHTML = childData.alias1;
        character_playedby.innerHTML = childData.playedBy;
        character_selected_header.innerHTML ="Your character"
        if (childData.title == "") {
          character_title.innerHTML = "Uknown title"
        }
        if (childData.culture == "") {
          character_culture.innerHTML = "Uknown"
        }
        $("#character-info").show();
      });
    }
  }

  // Copy to clipboard function
  var copyToClipboard = document.getElementById('copy-to-clipboard');
  copyToClipboard.onclick = function() {
    var copyText = document.querySelector("#game-id-key");
    copyText.select();
    document.execCommand("copy");
    copyToClipboard.innerHTML = "DONE!";
  };

  confirmBotCharacterButton.onclick = function() {
    firebase.database().ref("games/bot/" + gameID_value + "/bot/").set({
    character: characterID_value,
    currentTile: 1,
    userName: 'bot'
  });

  // Hide the content of the page, show a loading screen, then move to the actual board game page
  document.getElementById('character-selection').classList.add('animated', 'fadeOutRight');
  document.getElementById('swiper-wrapper').classList.add('animated', 'fadeOutRight');
  $("#loader").show();
    setTimeout(function () {
      $("#loader").hide();
      isHost_value = "true";
      window.location = 'game/bot/?id=' + gameID_value.slice(2,9);
    }, 2000);
  };

  // return a random predefined trap set
  function createTrapTiles() {
    var trapSet1 = [2, 7, 12, 19, 26];
    var trapSet2 = [3, 8, 15, 19, 27];
    var trapSet3 = [4, 9, 12, 23, 28];
    var trapSet4 = [3, 10, 12, 20, 29];
    var trapSet5 = [4, 12, 19, 24, 27];
    var trapSet6 = [3, 7, 13, 21, 28];
    var trapSet7 = [2, 6, 14, 19, 29];
    var trapSet8 = [5, 8, 15, 24, 29];
    var trapSet9 = [6, 9, 12, 21, 25];
    var trapSet10 = [7, 11, 17, 26, 29];
    var trapSetArray = [trapSet1, trapSet2, trapSet3, trapSet4, trapSet5, trapSet6, trapSet7, trapSet8, trapSet9, trapSet10];
    var random = Math.floor(Math.random() * 10) + 1;
    var currentTrapSet = trapSetArray[random]
    return currentTrapSet;
  };

  // Create game
  var confirmCharacterButton = document.getElementById('character-confirm-button');
  confirmCharacterButton.onclick = function() {
    document.getElementById(characterID_value + '-slide').classList.remove('selected-slide');
    document.getElementById(characterID_value + '-button').innerHTML = "SELECT";
    document.getElementById(characterID_value + '-button').classList.remove('red-button');
    document.getElementById(characterID_value + '-button').classList.add('white-button');
    // If player vs BOT
    if (gameMode_value == "bot") {
      var createGameREF = firebase.database().ref('games/bot/');
      createGameREF.push({
        nextTurn: "player",
        trapTiles: createTrapTiles()
      })
       .then((snapshot) => {
         createGameREF.child(snapshot.key).update({
           gameID: snapshot.key.slice(2,9)
         }),
         firebase.database().ref("games/bot/" + snapshot.key + "/player/").set({
           character: characterID_value,
           userName: userName_value,
           currentTile: 1
         });
         gameID_value = snapshot.key;
       });

        $("#character-info").hide();
        $("#character-confirm-button").hide();
        $("#character-selected-header").hide();
        $("#bot-character-selected-header").show();
        $("#bot-character-confirm-button").show();
        document.getElementById('bot-character-selected-header').innerHTML = "BOT CHARACTER"
        document.getElementById('character-title').innerHTML = "";
        document.getElementById('character-born').innerHTML = "";
        document.getElementById('character-culture').innerHTML = "";
        document.getElementById('character-alias').innerHTML = "";
        document.getElementById('character-playedby').innerHTML = "";
        document.getElementById('select-character-h3').innerHTML = "Select BOT character";

    } else if (gameMode_value == "pvp") { // If player vs player
      var createGameREF = firebase.database().ref('games/pvp/');
      createGameREF.push({
        gameMode: "pvp",
        host: "player1",
        nextTurn: "player1",
        trapTiles: createTrapTiles()
      })
       .then((snapshot) => {
         createGameREF.child(snapshot.key).update({
           gameID: snapshot.key.slice(2,9)
         }),
         firebase.database().ref("games/pvp/" + snapshot.key + "/player1/").set({
           character: characterID_value,
           userName: userName_value,
           currentTile: 1
         });
         gameID_value = snapshot.key;
       });
       // Hide the content of the page, show a loading screen, then move to the actual board game page
       document.getElementById('character-selection').classList.add('animated', 'fadeOutLeft');
       document.getElementById('swiper-wrapper').classList.add('animated', 'fadeOutLeft');
      $("#loader").show();
      setTimeout(function () {
        $("#character-selection").hide();
        $("#loader").hide();
        $("#game-invite-block").show();
        document.getElementById('game-id-key').value = "https://gotboardgame.xyz/game/join/?id=" + gameID_value.slice(2,9) + "&player=2";
      }, 2000);
    } else {
      alert('Something bugged out, please clear browser cache and refresh the page!')
    }
  };

  var startGame = document.getElementById('start-game');
  startGame.onclick = function() {
    setTimeout(function () {
      window.location = 'game/pvp/?id=' + gameID_value.slice(2,9) + "&player=1";
    }, 300);
  };

  $('#username').keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      if (document.getElementById('username').value == '') {
        alert('Please select a username!')
      } else {
        userName_value = document.getElementById('username').value;
        $("#userName-block").hide();
        document.getElementById('userName-block').classList.add('animated', 'fadeOutTop')
          setTimeout(function () {
            $("#player-mode").show();
          }, 100);
        }
    }
  });
