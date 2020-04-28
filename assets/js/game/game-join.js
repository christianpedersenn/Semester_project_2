// get URL query string
function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

// Global variables
var characterID_value = '';
var userName_value = '';
var databaseKey_value = '';
var queryStringID = getQueryStringValue("id"); // variable for the id
var playerID = "player" + getQueryStringValue("player"); // get the current player

$("#character-selection").hide();
$("#userName-block").show();
$("#loader").hide();
$("#tip").hide();
// get the parent database key from the id (getQueryStringValue("id"))
firebase.database().ref('games/pvp/').orderByChild('gameID').equalTo(queryStringID).on("child_added", function(snapshot) {
  databaseKey_value = snapshot.key;
  Cookies.set('databaseKey_value', snapshot.key)
});

$(document).ready(function () {
  var db = firebase.database();
  var mySwiper = new Swiper(".swiper-container", {
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    slidesPerView: 2.7,
    centeredSlides: true,
    updateOnWindowResize: true,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    nextButton: ".next-button",
    previousButton: ".previous-button",      
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

// Let player2 choose a username. Player 1 already did this before creating the game
document.getElementById('game-id').innerHTML = queryStringID;
var userName_block_button = document.getElementById('userName-block-button');
userName_block_button.onclick = function() {
  if (document.getElementById('username').value == '') {
    alert('Please select a username!')
  } else {
    userName_value = document.getElementById('username').value;
    console.log(userName_value);
    $("#userName-block").hide();
    document.getElementById('userName-block').classList.add('animated', 'fadeOutTop')
      setTimeout(function () {
        $("#character-selection").show();
      }, 100);
    }
};

$("#character-selection").hide();
$("#userName-block").show();
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
          console.log("Image not found");
          character_img.style.backgroundImage = "url('https://firebasestorage.googleapis.com/v0/b/gameofthrones-boardgame.appspot.com/o/images%2FUntitled.png?alt=media&token=52ad4ba6-d2ab-454b-bbe8-a6fa7e39f246')";
        } else {
          character_img.style.backgroundImage = "url(" + childData.imgURL + ")";
        }
    });
  });

// Hide character info before loading the slides
$("#character-info").hide();
$("#loader").hide();
// Highlight current selected slide when clicking the buttons
setTimeout(function () {
  var character_selected_header = document.getElementById('character-selected-header');
  var character_info = document.getElementById('character-info');
  var character_title = document.getElementById('character-title');
  var character_born = document.getElementById('character-born');
  var character_culture = document.getElementById('character-culture');
  var character_alias = document.getElementById('character-alias');
  var character_playedby = document.getElementById('character-playedby');

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
        // Set the selected character as a cookie for reference later when confirming character
        $("#character-info").show();
      });
    }
  }
}, 1500); // Using a timeout function to be sure that the data from Firebase has been retrieved, because if not it won't find the button's id.

var joinGame_button = document.getElementById('join-game')
joinGame_button.onclick = function() {
  firebase.database().ref("games/pvp/" + databaseKey_value + "/player2/").set({
    character: characterID_value,
    userName: userName_value,
    currentTile: 1
  });
  //Hide the content of the page, show a loading screen, then move to the actual board game page
  document.getElementById('character-selection').classList.add('animated', 'fadeOutRight');
  document.getElementById('swiper-wrapper').classList.add('animated', 'fadeOutRight');
  $("#loader").show();
  setTimeout(function () {
    $("#loader").hide();
    $("#character-selection").hide();
    window.location = '../pvp/?id=' + queryStringID + "&player=2";
  }, 1000);
};
}); // Document ready end
