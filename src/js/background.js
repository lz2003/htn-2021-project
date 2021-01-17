var counting = false;
var endTimer = false;
var remain;
var views;
var fishdict = {};

// Listens for messages
chrome.runtime.onMessage.addListener(
    (request, _, sendResponse) => {
        if (request.action == "start") {
            createTimer(0, 5);
            sendResponse( {status: "success"} );
        } else if (request.action == "check") {
            sendResponse( {status: counting});
        } else if (request.action == "stop") {
            endTimer = true;
            chrome.browserAction.setBadgeText({text: null}, function(response){});
            sendResponse( {status: "stopping timer"});
        } else if (request.action == "view") {
            openCollections();
            sendResponse( {status: "opened collections"});
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
    var frequency = 100;

    var int = setInterval(function() {
        var currTime = new Date();
        remain = (finalTime - currTime) / 1000;

        if (remain <= 0 || endTimer) {
            clearInterval(int);
            counting = false;
            if (!endTimer) notifyUser();
            endTimer = false;
            return;
        }
        
        // Ay fixed it kind of?
        views = chrome.extension.getViews({ type: "popup" });
        if (views.length > 0) chrome.runtime.sendMessage({seconds: remain, name: null}, _ => {})   

        var m = Math.floor(remain / 60);
        var s = Math.floor(remain % 60);

        if (s < 10) s = "0" + s;
        if (m < 10) m = "0" + m;

        chrome.browserAction.setBadgeBackgroundColor({color:"#153F9F"}, function(response){});
        chrome.browserAction.setBadgeText({text: (m+":"+s)}, function(response){});

    }, frequency);

}

function notifyUser() {
    chrome.notifications.create("caught-fish", 
    {
        type:'basic',
        title:"Pomodoro timer ended!",
        message:"You caught a fish! Check the compendium for all captured fish.",
        iconUrl: chrome.extension.getURL('../assets/icon.png')
    }, 
    (not) => {
        // PLAY SOUND WOWOOWOWOOWOW
        console.log("WOW")
        //sends out message to change name of start button to "start fishing"
        views = chrome.extension.getViews({ type: "popup" });
        if (views.length > 0) chrome.runtime.sendMessage({name:"start fishing"}, function(response){console.log("change button");})
        randomFish()
    });
}

function openCollections() {
    chrome.tabs.create({ 'url': '/src/html/collections.html'},(tab) => {});
}

function randomNumber(max, min) //picks random number between max (inclusive) and min (inclusive)
{
	return Math.floor(Math.random() * (max-min)) + min;
}

function randomFish() //updates the fish dictionary, returns a random name from the fishNames keys
{
	//chrome.storage.local.set({storage: fishdict}, function(){})

	chrome.storage.local.get(["storage"], function(result){
		fishdict = result.storage;

		var fishNames = Object.keys(fishdict);
		var fishTypes = fishNames.length;
		var rand = randomNumber(0, fishTypes);

        var name = fishNames[rand];
		console.log(name);
		if (fishdict[name]) 
		{
			//fish has already been caught before, no need to update storage
            console.log("caught before");
		}
		else 
		{
			//new fish! update dictionary and save locally
			console.log("not caught before");
			fishdict[name] = true;
			chrome.storage.local.set({storage: fishdict}, function(){})
        }
        chrome.storage.local.set({history: name}, function(){})
        views = chrome.extension.getViews({ type: "popup" });
        if (views.length > 0) chrome.runtime.sendMessage({seconds: -1, name: name}, _ => {})   
	});
}