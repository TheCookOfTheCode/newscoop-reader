
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Install the layouts
    require('layouts/layouts');
    require('newscoop');

    // Write your app here.
    var api = new NewscoopRestApi('http://miedzyrzecsiedzieje.pl/api');

    // List view

    var list = $('.list').get(0);
    api.getResource('/articles', {'type': 'news'})
        .setItemsPerPage(15)
        .setOrder({'number': 'desc'})
        .makeRequest(function(res){
            for(var i=0; i<res.items.length; i++) {
                var article = { 
                   title: res.items[i].title,
                   desc: res.items[i].fields.deck,
                   date: res.items[i].published,
                };

                if (typeof res.items[i].renditions != 'undefined') {
                    article['image'] = res.items[i].renditions[0].link;
                }

                list.add(article);
            }
        });

    

    // Detail view

    var detail = $('.detail').get(0);
    detail.render = function(item) {
        $('.title', this).html(item.get('title'));
        $('.desc', this).html(item.get('desc'));
        $('.date', this).text(item.get('date'));
        console.log(decodeURIComponent(item.get('image')));
        $('.image', this).attr('src', 'http://'+decodeURIComponent(item.get('image')).replace('%7C', "|"));
    };

});