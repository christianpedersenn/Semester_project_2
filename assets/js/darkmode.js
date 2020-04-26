
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
    }        
});

var darkModeButton = document.getElementById('dark_mode');
darkModeButton.addEventListener("click", function(){ 
    document.cookie = "darkModeEnabled=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "darkModeEnabled=true; expires=Wed, 31 Dec 2099 23:59:59 UTC;";
    $('#dark_mode').hide();
    $('#light_mode').show();
    setDarkMode()
});

var lightModeButton = document.getElementById('light_mode');
lightModeButton.addEventListener("click", function(){
    document.cookie = "darkModeEnabled=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "darkModeEnabled=false; expires=Wed, 31 Dec 2099 23:59:59 UTC;";
    setLightMode()
    location.reload()
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

    // Game pages
    $('.modal-dialog .modal-content').css('background-color', '#444')
    $('#game-id-key').css('color', '#333')
    $('.tile').addClass('darkmode-border');
}

function setLightMode() {
    console.log('LIGHT MODE ACTIVATED');
}