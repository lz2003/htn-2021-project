var table = document.createElement('table');

loadCollection();
function loadCollection() {

    document.getElementsByTagName('body')[0].appendChild(table);
    var row = document.createElement('tr');

    var title = document.createElement('th');
        title.innerHTML ="Fish Image";

    row.appendChild(title);
    table.appendChild(row);


    chrome.storage.local.get(function(result){
        var fishCollection = result.storage;
        console.log(fishCollection);

        row = document.createElement('tr');
        var title = document.createElement('th');
            title.innerHTML = "Fish Name";
        row.appendChild(title);

        for (var key in fishCollection) {
            var text = document.createElement('td');
            text.innerHTML = key;
            row.appendChild(text);
        }
        table.appendChild(row);

        row = document.createElement('tr');
        var title = document.createElement('th');
            title.innerHTML ="Capture Status";
        row.appendChild(title);

        for (var key in fishCollection) {
            var text = document.createElement('td');
            if (fishCollection[key]) text.innerHTML = "Caught!";
            else text.innerHTML = "Uncaught!";
            row.appendChild(text);
        }
        table.appendChild(row);
    })

}