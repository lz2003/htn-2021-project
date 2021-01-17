chrome.runtime.onInstalled.addListener((details)=> {

    var fishdict = {
        "mola": false,
        "lionfish": false,
        "tang": false,
        "clownfish": false
    }

    console.log(details.reason)
    if (details.reason == "install" || details.reason == "update" ) {
        console.log("Added");
        chrome.storage.local.set({storage: fishdict}, function(){})

        chrome.storage.local.set({history: "none"}, function(){})
    }
});
