var endTimer = document.querySelector('#stop_button');
var timer = document.querySelector('#start_button');
var viewCollection = document.querySelector('#open_button');

var minus = document.querySelector('#minus');
var plus = document.querySelector('#plus');

var isCounting = false;
chrome.runtime.sendMessage({action: "check"}, (response)=> {if (response.status){isCounting=true; timer.innerHTML=timer.innerHTML.replace("start fishing", "stop fishing");;}})

// Starts the timer if it is not running
timer.onclick = function () { 
    // Send first message to check if timer is counting
    chrome.runtime.sendMessage({action: "check"}, (response) => {    

        if (!response.status) { //if timer not counting, start timer and set isCounting to true
            chrome.runtime.sendMessage({action: "start"}, (response) => {
                isCounting = true;
                timer.innerHTML="stop fishing";
                //console.log(response.status);
            });
        } 
        else if (response.status && isCounting)
        { //if timer is already counting (iscounting=true), then the second click will reset the timer
            timer.innerHTML="start fishing"
            isCounting = false;
            chrome.runtime.sendMessage({action: "check"}, (response) => {
            // If not, send message to start timer
                if (response.status) {
                    chrome.runtime.sendMessage({action: "stop"}, (response) => {
                        //console.log(response.status);
                        document.getElementById("time").innerHTML =  "00:00";
                    });
                } 
                else 
                {
                console.log("Timer not active!")
                }
            });
        
        }
        else 
        {
            //console.log(response.status);
            //console.log(isCounting);
            console.log("Timer still counting!");
        }
    });

    /*
    chrome.tabs.query(  {active: true, currentWindow: true }, function(tabs) {
        console.log("wow i feel tired");
        chrome.tabs.sendMessage(tabs[0].id, {action: "start"}, function(response) {
        });
    });*/
}

// Ends currently running timer
endTimer.onclick = function () { 
    // Send first message to check if timer is counting
    chrome.runtime.sendMessage({action: "check"}, (response) => {
        // If not, send message to end timer
        if (response.status) {
            chrome.runtime.sendMessage({action: "stop"}, (response) => {
                //console.log(response.status);
                document.getElementById("time").innerHTML =  "00:00";
            });
        } else {
            console.log("Timer not active!")
        }
    });

}

// Sends message to background to open the compendium
viewCollection.onclick = function () { 
    chrome.runtime.sendMessage({action: "view"}, (response) => {});

}

minus.onclick = function () {
    chrome.storage.local.get(["duration"], function(result){ 
        if (result.duration > 5) {
            chrome.storage.local.set({duration: result.duration-1}, function(){})
            displayDuration(result.duration-1);
        }
    });
}

plus.onclick = function () {
    chrome.storage.local.get(["duration"], function(result){ 
        if (result.duration < 25) {
            chrome.storage.local.set({duration: result.duration+1}, function(){})
            displayDuration(result.duration+1);
        }
    });
}

// Loads the popup 
window.onload = function () {
    document.getElementById("time").innerHTML = "00:00";

    chrome.storage.local.get(["history", "duration"], function(result){ 
        var lastFish = result.history;

        if (lastFish != "none") {
            displayFish(lastFish);
        } else {
            var url = chrome.extension.getURL('/assets/placeholder.png');
            document.getElementById("imagecontainer").style.backgroundImage = 'url(' + url + ')';
            document.getElementById("fishdisplay").innerHTML = "Start the timer!";
        }

        var currMinutes = result.duration;
        displayDuration(currMinutes);
    });

}

// Displays into actual nice text haha
function displayTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);

    if (s < 10) s = "0" + s;
    if (m < 10) m = "0" + m;

    document.getElementById("time").innerHTML =  m + ":" + s;
}

// Displays the correct fish
function displayFish(fish) {
    document.getElementById("fishdisplay").innerHTML = "you caught a(n) " + fish + "!";
    var url = chrome.extension.getURL('/assets/' + fish + '.png');
    document.getElementById("imagecontainer").style.backgroundImage = 'url(' + url + ')';
}

function displayDuration(minutes) {
    document.getElementById("user_selection").innerHTML = minutes;
}

// Listen for messages from background
chrome.extension.onMessage.addListener((response, _, sendResponse) => {
    //console.log(response.name);
    if (response.seconds >= 0) {
        displayTime(response.seconds);
    } 
    if (response.name == "start fishing")
    {
        timer.innerHTML="start fishing"
    }
    if (response.name != null) {
        displayFish(response.name);
    }
    sendResponse();
});
