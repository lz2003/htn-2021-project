var fishdict = {
	"mola": false,
	"lionfish": false,
	"blue tang": false,
	"clownfish": false
}
var fishNames = Object.keys(fishdict);
var testText = document.getElementById("test");

function randomNumber(max, min) //picks random number between max (inclusive) and min (inclusive)
{
	return Math.floor(Math.random() * (max-min+1) + min);
}

function randomFish() //updates the fish dictionary, returns a random name from the fishNames keys
{
	var rand = randomNumber(0, fishNames.length);
	var name = fishNames[rand];
	chrome.storage.local.get(["fishDictionary"], function(result) {fishdict = result.fishDictionary;}); //not tested, but 90% sure it'll work'

	if (fishdict[name]) 
	{
		//fish has already been caught before, no need to update storage
		console.log("caught before");
		testText.innerHTML = name;
		//return name;
	}
	else 
	{
		//new fish! update dictionary and save locally
		console.log("not caught before");
		fishdict[name] = true;
		chrome.storage.local.set({"fish dictionary": fishdict}, function() {message(fishdict[name] + " saved");});
		
		testText.innerHTML = name;
		return name;
	}
	
}

// Listen for messages from background
chrome.extension.onMessage.addListener((response, _, sendResponse) => {
    console.log(response.seconds);
    sendResponse();
});

