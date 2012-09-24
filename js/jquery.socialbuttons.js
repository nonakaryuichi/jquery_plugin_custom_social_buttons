/* ************************************
 *
 * jQuery Custom Social Buttons Plugin
 * 
 * Aauthor   : Ryuichi Nonaka
 * Version   : 1.0
 * Copyright : 2012 Ryuichi Nonaka
 * Date      : 2012/09/12
 *
 * Released under the MIT license
 *
 *********************************** */
(function($) {
//add name
var name_space = 'customSocialButtons';

$.fn[name_space] = function(options) {

        var settings = $.extend({
                'item_class' : '.button'
        }, options);

        var $elements = this;

        var init_button = function ($button){
                //vars
                var targetURL     = $button.attr("data-url");
                var encodeURL     = encodeURI(targetURL);
                var targetService = $button.attr("data-service");
                
                switch(targetService){
                        case "twitter":
                                $.ajax({
                                        url       : "http://urls.api.twitter.com/1/urls/count.json",
                                        data      : {url : encodeURL, noncache: new Date()},
                                        dataType  : "jsonp",
                                        success   : function(result){
                                                allot_button($button, result.count, targetService);
                                        }
                                });
                                break;
                        case "facebook":
                                $.ajax({
                                        url       : "http://graph.facebook.com/" + encodeURL,
                                        dataType  : "jsonp",
                                        success   : function(result){
                                                allot_button($button, result.shares, targetService);
                                        }
                                });
                                break;
                        case "hatena":
                                $.ajax({
                                        url       : "http://api.b.st-hatena.com/entry.count",
                                        data      : {url : encodeURL},
                                        dataType  : "jsonp",
                                        success   : function(result){
                                                allot_button($button, result, targetService);
                                        }
                                });
                                break;
                
                }
        };

        var allot_button = function($button, count, targetService){
                var popupURL;
                var countURL;
                var label;

                var targetURL     = $button.attr("data-url");
                var title         = $button.attr('data-title');
                var encodeTitle   = encodeURI(title);

                switch(targetService){
                        case "twitter":
                                popupURL = "http://twitter.com/share?text=" + encodeTitle + "&amp;url=" + encodeURIComponent(targetURL);
                                countURL = "http://twitter.com/#!/search/realtime/" + encodeURIComponent(targetURL);
                                label    = "ツイート";
                                break;
                        case "facebook":
                                popupURL = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(targetURL) + "&amp;t=" + encodeTitle;
                                countURL = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(targetURL) + "&amp;t=" + encodeTitle;
                                label    = "いいね！";
                                break;
                        case "hatena":
                                popupURL = "http://b.hatena.ne.jp/add?mode=confirm&amp;url=" + encodeURIComponent(targetURL) + "&amp;title=" + encodeTitle;
                                countURL = "http://b.hatena.ne.jp/entry/" + encodeURI(targetURL.replace("http://", ""));
                                label    = "";
                                break;
                }

                $button.append(
                        $("<a>")
                                .addClass("icon")
                                .attr("href", popupURL)
                                .html(label)
                                .click(function(){
                                        var $this = $(this);
                                        var url   = $this.attr("href");

                                        window.open(url, 'socialButtonWindow', 'width=600, height=400, menubar=no, toolbar=no, scrollbars=yes, status=no');

                                        return false;
                                })
                );
                $button.append(
                        $("<a>")
                                .addClass("count")
                                .attr("href", countURL)
                                .html(count)
                                .click(function(){
                                        var $this = $(this);
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
                        var $buttons = $list.find(settings.item_class);

                        $buttons.each(function(){
                                var $button = $(this);

                                init_button($button);
                        });
                });
        });

        //method chain
        return this;
};
})(jQuery);
