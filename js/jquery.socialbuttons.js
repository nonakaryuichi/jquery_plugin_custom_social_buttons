/* ************************************
 *
 * jQuery Custom Social Buttons Plugin
 * 
 * Aauthor   : Ryuichi Nonaka
 * Version   : 1.1.1
 * Copyright : 2012 Ryuichi Nonaka
 * Date      : 2012/09/25
 *
 * Released under the MIT license
 *
 *********************************** */
(function($) {
var name_space   = 'customSocialButtons';
$.fn[name_space] = function( options ) {

        //setting
        var settings   = $.extend({
                'item_class'     : '.button',
                'data_property'  : {
                        'url'    : 'data-url',
                        'title'  : 'data-title',
                        'service': 'data-service'
                },
                'request_url'    : {
                        'twitter'      : 'http://urls.api.twitter.com/1/urls/count.json',
                        'facebook'     : 'http://graph.facebook.com/',
                        'hatena'       : 'http://api.b.st-hatena.com/entry.count'
                },
                'share_url'      : {
                        'twitter'      : 'http://twitter.com/share',
                        'facebook'     : 'http://www.facebook.com/sharer.php',
                        'hatena'       : 'http://b.hatena.ne.jp/add'
                },
                'count_url'      : {
                        'twitter'      : 'http://twitter.com/i/#!/search',
                        'facebook'     : 'http://www.facebook.com/sharer.php',
                        'hatena'       : 'http://b.hatena.ne.jp/entry/'
                },
                'labels'         : {
                        'twitter'      : 'ツイート',
                        'facebook'     : 'いいね！',
                        'hatena'       : ''
                }
        }, options );

        //target dom elements
        var $elements   = this;

        //initialize buttons
        var init_button = function ( $button ){
                //vars
                var targetURL     = $button.attr(settings.data_property.url);
                var encodeURL     = encodeURI(targetURL);
                
                var service       = $button.attr(settings.data_property.service);
                
                //service type action
                switch( service ){
                        case "twitter":
                                $.ajax({
                                        url       : settings.request_url.twitter,
                                        data      : {
                                                url      : encodeURL,
                                                noncache : new Date()
                                        },
                                        dataType  : "jsonp",
                                        success   : function( result ){
                                                allot_button( $button, result.count, service );
                                        }
                                });
                                break;

                        case "facebook":
                                $.ajax({
                                        url       : settings.request_url.facebook + encodeURL,
                                        dataType  : "jsonp",
                                        success   : function( result ){
                                                allot_button( $button, result.shares, service );
                                        }
                                });
                                break;

                        case "hatena":
                                $.ajax({
                                        url       : settings.request_url.hatena,
                                        data      : {
                                                url : encodeURL
                                        },
                                        dataType  : "jsonp",
                                        success   : function( result ){
                                                allot_button( $button, result, service );
                                        }
                                });
                                break;
                
                }
        };


        var get_popupURL = function( service, title, url ){
                
                var encodeURL     = encodeURIComponent( url );
                var encodeTitle   = encodeURI( title );
                
                switch( service ){
                        case "twitter":
                                popupURL   = "?text=" + encodeTitle
                                             + "&amp;url=" + encodeURL;
                                break;

                        case "facebook":
                                popupURL   = "?u=" + encodeURL
                                             + "&amp;t=" + encodeTitle;
                                break;

                        case "hatena":
                                popupURL   = "?mode=confirm&amp;url=" + encodeURL
                                             + "&amp;title=" + encodeTitle;
                                break;
                }

                return settings.share_url[service] + popupURL;
        }


        var get_countURL = function( service, title, url ){

                var encodeURL     = encodeURIComponent( url );
                var encodeTitle   = encodeURI( title );
                
                switch( service ){
                        case "twitter":
                                countURL   = "?q=" + encodeTitle;
                                break;

                        case "facebook":
                                countURL   = "?u=" + encodeURL
                                             + "&amp;t=" + encodeTitle;
                                break;

                        case "hatena":
                                countURL   = encodeURI(targetURL.replace("http://", ""));
                                break;
                }

                return settings.count_url[service] + countURL;
        }


        var allot_button = function( $button, count, service ){
                var popupURL;
                var countURL;
                var label;

                var targetURL     = $button.attr( settings.data_property.url );
                var title         = $button.attr( settings.data_property.title );

                var popupURL      = get_popupURL( service, title, targetURL );
                var countURL      = get_popupURL( service, title, targetURL );

                $button.append(
                        $("<a>")
                                .addClass("icon")
                                .attr( "href", popupURL )
                                .html( settings.labels[service] )
                                .click(function(){
                                        var $this  = $(this);
                                        var url    = $this.attr("href");

                                        //open window
                                        window.open(
                                                url,
                                                'socialButtonWindow',
                                                'width=600, height=400, menubar=no, toolbar=no, scrollbars=yes, status=no'
                                        );

                                        return false;
                                })
                );

                $button.append(
                        $("<a>")
                                .addClass("count")
                                .attr( "href", countURL )
                                .html( count )
                                .click(function(){
                                        var $this = $( this );
                                        var url   = $this.attr("href");

                                        window.open(url, 'socialCountWindow', 'width=960, height=600, menubar=no, toolbar=no, scrollbars=yes, status=no');

                                        return false;
                                })
                );
        }


        $elements.each(function(){
                
                var $lists = $(this);
                
                $lists.each(function(){
                        var $list    = $(this);
                        var $buttons = $list.find( settings.item_class );

                        $buttons.each(function(){
                                var $button = $(this);

                                init_button( $button );
                        });
                });
        });

        //method chain
        return this;
};
})(jQuery);
