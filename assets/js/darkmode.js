$(document).ready(function () {
    if (Cookies.get('darkModeEnabled') == 'true') {
        $('#dark_mode').hide();
        setDarkMode();   
    }
    if (Cookies.get('darkModeEnabled') == 'false') {
        $('#light_mode').hide();
        setLightMode();            
    }    
    if (Cookies.get('darkModeEnabled') == undefined) {
        setLightMode();
        $('#light_mode').hide();
        setLightMode();     
    }        
});

var darkModeButton = document.getElementById('dark_mode');
darkModeButton.addEventListener("click", function(){ 
    document.cookie = "darkModeEnabled=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "darkModeEnabled=true; expires=Wed, 31 Dec 2099 23:59:59 UTC; path=/;";
    $('#dark_mode').hide();
    $('#light_mode').show();
    setDarkMode()
});

var lightModeButton = document.getElementById('light_mode');
lightModeButton.addEventListener("click", function(){
    document.cookie = "darkModeEnabled=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "darkModeEnabled=false; expires=Wed, 31 Dec 2099 23:59:59 UTC; path=/;";
    $('#dark_mode').show();
    $('#light_mode').hide();    
    setLightMode()
});


function setDarkMode() {
    console.log('DARK MODE ACTIVATED');
    $('body').css('background-color', '#333');
    $('*').css('color', '#fff');    
    $('#username').css('color', '#333')
    $('#userName-block').css('background-color', '#444');
    $('#userName-block').css('background-color', '#444');
    $('#player-mode-bot').css('background-color', '#444');
    $('#player-mode-pvp').css('background-color', '#444');
    $('#game-invite-block').css('background-color', '#444');
    $('.modal-dialog .modal-content').css('background-color', '#444')
    $('#game-id-key').css('color', '#333')
    $('.tile').addClass('darkmode-border');
}

function setLightMode() {
    console.log('LIGHT MODE ACTIVATED');
    $('body').css('background-color', '#f6f6f6');
    $('*').css('color', '#333');
    $('#username').css('color', '#fff')
    $('.green-button').css('color', '#fff')
    $('.navbar-dark .navbar-brand').css('color', '#fff')
    $('.navbar').css('color', '#fff')
    $('.nav-item .nav-link').css('color', '#fff')
    $('.btn').css('color', '#fff')
    // $('.btn-sucess').css('color', '#fff')
    $('.heading').css('color', '#fff')
    $('#userName-block').css('background-color', '#fff');
    $('#userName-block').css('background-color', '#fff');
    $('#player-mode-bot').css('background-color', '#fff');
    $('#player-mode-pvp').css('background-color', '#fff');
    $('.modal-dialog .modal-content').css('background-color', '#fff')
    $('#game-id-key').css('color', '#333')
    $('.tile').removeClass('darkmode-border');   
}