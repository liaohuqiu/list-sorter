(function() {

    var url = window.location.href;
    storage=$.localStorage;

    chrome.storage.sync.get('config_list', function(data) {
        var config_list = data['config_list'] || {};

        var config;
        if (!config_list) {
            return;
        }

        K.forEach(config_list, function(value, key) {
            if (url.indexOf(key) != -1) {
                config = value;
            }
        });

        if (!config) {
            return;
        }

        var list = $(config.list);
        var b = list.sort(sort_li);
        b.appendTo(config.container);

        function sort_li(a, b){
            var code1 = "var v1 = $(a)." + config.value;
            var code2 = "var v2 = $(b)." + config.value;
            eval(code1);
            eval(code2);
            return (v1 < v2 ? 1 : -1);
        }
    });

})();
