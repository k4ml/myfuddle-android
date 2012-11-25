function searchProduct(tx, keyword) {
    var kw = '%' + keyword + '%';
    console.log("XXX: " + kw);
    tx.executeSql("SELECT * FROM data WHERE id = ?", [kw], function(tx, results) {
        querySuccess(tx, results, kw);    
    }, errorCB);
}

function querySuccess(tx, results, kw) {
    var len = results.rows.length;
    console.log("DEMO table: " + len + " rows found.");
    var list = $("<ul/>").attr("class", "search-result");
    for (var i=0; i<len; i++){
        $(list).append($("<li/>", {text:results.rows.item(i).nama + " Harga: " + results.rows.item(i).harga + " Premis: " + results.rows.item(i).premis}));
    }

    if (len === 0) {
        var url = 'http://harga.smach.net/';
        console.log(url);
        params = {
            'q': kw,
            'format': 'json'
        }
        $.getJSON(url, params, function(data) {
            $.each(data['items'], function(index, item) {
                console.log(item.nama);
                $(list).append($("<li/>", {text:item.nama + " Harga: " + item.harga + " Premis: " + item.premis + " Tarikh: " + item.tarikh}));
            });
        });
        $(list).append($("<li/>", {text: "Tiada keputusan ditemui"}));
    }

    $("#search-result").empty();
    list.appendTo("#search-result");
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function populateDB(tx) {
     tx.executeSql('CREATE TABLE IF NOT EXISTS data (id unique, data text)');
}

function getDB() {
    var db = null;
    try {
        db = window.sqlitePlugin.openDatabase("Databases", "1.0", "Harga", 1000000);
    }
    catch (exception) {
        console.log('DEBUG: ' + exception); 
    }

    if (!db) {
        db = {};
        db.transaction = function(queryCB, errorCB, successCB) {
            console.log('DEBUG TX: ', this);
            console.log('DEBUG: ' + queryCB, errorCB, successCB);
            var that = this;
            that.executeSql = function(query, kw, querySuccess, errorCB) {
                console.log('DEBUG EXEC: '+ query);
                var results = {
                    rows: []
                }
                if (typeof querySuccess !== 'undefined') {
                    querySuccess(that, results);
                }
            }
            queryCB(that);
        }
    }
    return db;
}

function onDeviceReady() {
    var db = getDB();
    db.transaction(populateDB, errorCB);

    $('#btn_cari').click(function() {
        var keyword = $("input[name=keyword]")[0].value;
        db.transaction(function(tx) {
            searchProduct(tx, keyword);
        }, errorCB);
    });
}

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    document.addEventListener("deviceready", onDeviceReady, false);
}
else {
    onDeviceReady();
}

function alertDismissed() {
    // do something
}
