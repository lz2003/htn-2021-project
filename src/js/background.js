var counting = false;
var remain;
var views;


// Listens for messages
chrome.runtime.onMessage.addListener(
    (request, _, sendResponse) => {
        if (request.action == "start") {
            createTimer(0, 10);
            sendResponse( {status: "success"} );
        } else if (request.action == "check") {
            sendResponse( {on: counting})
        }
        else {
            sendResponse( {status: "error"});
        }
    }
)

function createTimer(timerMinutes, timerSeconds)  {
    // Get time
    counting = true;
    var currTime = new Date().getTime();

    // Calculate total time 
    var totalSeconds = (timerMinutes * 60) + (timerSeconds);
    if (totalSeconds > 1500) {
        alert("Too big");
        counting = false;
        return;
    }
    var finalTime = new Date(currTime + totalSeconds * 1000);
    var frequency = 600;
    var int = setInterval(function() {
        var currTime = new Date();
        remain = (finalTime - currTime) / 1000;

        if (remain <= 0) {
            clearInterval(int);
            counting = false;
            return;
        }
        
        // Ay fixed it
        views = chrome.extension.getViews({ type: "popup" });
        if (views.length > 0)
        {
            chrome.runtime.sendMessage({seconds: remain}, _ => {});
        }
    }, frequency);

}