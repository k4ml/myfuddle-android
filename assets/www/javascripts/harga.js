function searchProduct(keyword, cache) {
    if (cache == null) cache = true;
    var kw_md5 = md5(keyword);
    console.log("XXX: " + kw_md5);
    var cached_data = window.localStorage.getItem(kw_md5);
    console.log(cache);

    if (cached_data && cache) {
        cached_data_json = $.parseJSON(cached_data);
        var list = $("<ul/>").attr("class", "search-result");
        var update_link = $('<a href="#">Update</a>');
        $(update_link).click(function() {
            searchProduct(keyword, false);
            return false;
        });
        $(update_link).prepend($('<span>Results cached.</span> '));
        $(list).append(update_link);
        $.each(cached_data_json['items'], function(index, item) {
            $(list).append($("<li/>", {text:item.nama + " Harga: " + item.harga + " Premis: " + item.premis + " Tarikh: " + item.tarikh}));
        });
        $("#search-result").empty();
        list.appendTo("#search-result");
        return;
    }

    var url = 'http://harga.smach.net/';
    console.log(url);
    params = {
        'q': keyword,
        'format': 'json'
    }
    $.getJSON(url, params, function(data, status, jqxhr) {
        var count = 0;
        var list = $("<ul/>").attr("class", "search-result");
        $.each(data['items'], function(index, item) {
            count++;
            $(list).append($("<li/>", {text:item.nama + " Harga: " + item.harga + " Premis: " + item.premis + " Tarikh: " + item.tarikh}));
        });
        if (count == 0) {
            $(list).append($("<li/>", {text: "Tiada keputusan ditemui"}));
        }
        else {
            kw_md5 = md5(keyword);
            json_text = jqxhr.responseText;
            console.log('XXX: Result cached');
            window.localStorage.setItem(kw_md5, json_text);
        }
        $("#search-result").empty();
        list.appendTo("#search-result");
    });

}

function onDeviceReady() {
    $('#btn_cari').click(function() {
        var keyword = $("input[name=keyword]")[0].value;
        searchProduct(keyword);
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
