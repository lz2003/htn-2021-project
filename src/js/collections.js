var table = document.createElement('table');

loadCollection();

function loadCollection() {

    document.getElementsByTagName('body')[0].appendChild(table);
    var row = document.createElement('tr');

    var title = document.createElement('th');
        title.innerHTML = "Fish Portrait";
    row.appendChild(title);

    title = document.createElement('th');
    title.innerHTML = "Fish Name";
    row.appendChild(title);

    title = document.createElement('th');
    title.innerHTML = "Capture Status";
    row.appendChild(title);
    
    table.appendChild(row);


    
    chrome.storage.local.get(function(result){
        var fishCollection = result.storage;
        console.log(fishCollection);

        for (var key in fishCollection) {
            row = document.createElement('tr');
            var name = document.createElement('td');
            var status = document.createElement('td');
            var image = document.createElement('td');

            if (fishCollection[key]) {
                name.innerHTML = key;
                status.innerHTML = "Caught!";
            } else {
                name.innerHTML = "???";
                status.innerHTML = "Uncaught!";
            }

            image.innerHTML = "PLACEHOLDER";

            row.appendChild(image);
            row.appendChild(name);
            row.appendChild(status);
            table.appendChild(row);

        }
    });

}