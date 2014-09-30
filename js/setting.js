K.__debug = 1;
var resPrePath = chrome.extension.getURL("");
K.Resource.setResPrePath(resPrePath);

K.App('cube-demo/AIndex', ['core/dialog/AsyncDialog', 'core/dialog/MsgBox', 'core/ajax/Request']).define(function(require) {
    var Request = require('core/ajax/Request'); var AsyncDialog = require('core/dialog/AsyncDialog');
    var MsgBox = require('core/dialog/MsgBox');
    var App = {

        events: {
            'click .js-btn-del': 'clickDelButton',
            'click .js-btn-add': 'clickAddButton',
        },

        clickDelButton: function(e) {
            var me = this;
            var url = $(e.target).data('url');
            var data = {
                on_ok: function() {
                    me.deleteConfig(url);
                },
                on_dismiss: function() {
                },
            };
            MsgBox.confirm('Are you sure to delete this item?', data);
        },

        main: function() {
            this.updateView();
        },

        clickAddButton: function() {

            var data_input = {};
            var keys = ['url', 'container', 'list', 'value'];
            var ok = true;
            K.forEach(keys, function(key) {
                var el = $('#input-' + key);
                var div = el.parent();
                var v = el.val();
                if (!v) {
                    ok = false;
                    div.addClass('has-error').removeClass('has-success');
                } else {
                    div.addClass('has-success').removeClass('has-error');
                    data_input[key] = v;
                }
            });

            if (!ok) {
                return;
            }

            var url = data_input['url'];
            var msg = 'An item has been added.';
            var me = this;
            chrome.storage.sync.get('config_list', function(data) {
                var config_list = data['config_list'] || {};
                if (config_list[url]) {
                    msg = 'An item has been updated.';
                }
                config_list[url] = data_input;
                chrome.storage.sync.set({'config_list': config_list});
                var msg_data = {
                    auto_close: 3000,
                    on_dismiss: function() {
                        me.updateView();
                    },
                };
                MsgBox.succ(msg, msg_data);
            });
        },

        deleteConfig: function(url) {
            var me = this;
            chrome.storage.sync.get('config_list', function(data) {
                var config_list = data['config_list'] || {};
                delete config_list[url];
                chrome.storage.sync.set({'config_list': config_list});
                me.updateView();
            });
        },

        updateView: function() {
            chrome.storage.sync.get('config_list', function(data) {
                var config_list = data['config_list'] || {};

                var list = $("#list");
                list.empty();

                var template = $("#list-template");
                K.forEach(config_list, function(config, url) {
                    config.url = url;
                    var item = $.tmpl(template, config);
                    item.appendTo(list);
                });
            });
        },
    };
    return App;
});
