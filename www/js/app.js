
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    require('zepto');
    require('newscoop');

    // Write your app here.
    var api = new NewscoopRestApi('http://miedzyrzecsiedzieje.pl/api');

    // List view
    var list = $('#list-view').get(0);

    var articles = [];

    list.add = function(article, appendTo){
        element = '<li><a href="#" data-article-id="'+article.id+'" data-article-language="'+article.language+'"><p>'+article.title+'</p></a></li>';
        appendTo.append(element);
    }

    // Detail view
    var detail = $('#details-view').get(0);
    detail.render = function(item) {
        $('.title', this).html(item.title);
        $('.desc', this).html(item.desc);
        $('.date', this).text(item.date);
        $('.image', this).attr('src', 'http://'+decodeURIComponent(item.image).replace('%7C', "|"));
    };

    $('#list-view ul li a').live('click', function(){
        detail.render(articles[$(this).data('articleId')+'_'+$(this).data('articleLanguage')]);
        $('header', list).attr('class', 'currentToLeftSlow');
        $('section', list).attr('class', 'currentToLeftFast');
        $(detail).show();
        $('header', detail).attr('class', 'nextToLeft');
        $('div.content', detail).attr('class', 'nextToLeft');
        
        $(list).hide();
        return false;
    });

    $('.go-to-list').live('click', function(){
        $(list).show();
        $('header', list).attr('class', 'headerLeftToCurrent');
        $('section', list).attr('class', 'leftToCurrent');

        $('header', detail).attr('class', 'fadeOut');
        $('div.content', detail).attr('class', 'currentToRight');

        $(detail).hide();
        return false;
    });

    $('.menu-link.show-news').live('click', function(){
        api.getResource('/articles', {'type': 'news'})
            .setItemsPerPage(15)
            .setOrder({'number': 'desc'})
            .makeRequest(function(res){
                $('.loading').hide();
                for(var i=0; i<res.items.length; i++) {
                    var article = { 
                       title: res.items[i].title,
                       desc: res.items[i].fields.deck,
                       date: res.items[i].published,
                       id: res.items[i].number,
                       language: res.items[i].language
                    };

                    if (typeof res.items[i].renditions != 'undefined') {
                        article['image'] = res.items[i].renditions[0].link;
                    }

                    articles[article.id+'_'+article.language] = article;

                    list.add(article, $('ul.elements', list));
                }

                $('#menu').hide();
                $(list).show();
                $('header', list).attr('class', 'headerLeftToCurrent');
                $('section', list).attr('class', 'leftToCurrent');
            });
    })

});