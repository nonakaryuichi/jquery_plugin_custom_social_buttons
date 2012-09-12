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
                        var $anchor       = $button.find("a");
                        var targetURL     = $anchor.attr("data-url");
                        var encodeURL     = encodeURI(targetURL);
                        var targetService = $anchor.attr("data-service");
                        
                        switch(targetService){
                                case "twitter":
                                        $.ajax({
                                                url       : "http://urls.api.twitter.com/1/urls/count.json",
                                                data      : {url : encodeURL, noncache: new Date()},
                                                dataType  : "jsonp",
                                                success   : function(result){
                                                        allot_button($anchor, result.count, targetService);
                                                }
                                        });
                                        break;
                                case "facebook":
                                        $.ajax({
                                                url       : "http://graph.facebook.com/" + encodeURL,
                                                dataType  : "jsonp",
                                                success   : function(result){
                                                        allot_button($anchor, result.shares, targetService);
                                                }
                                        });
                                        break;
                                case "hatena":
                                        $.ajax({
                                                url       : "http://api.b.st-hatena.com/entry.count",
                                                data      : {url : encodeURL},
                                                dataType  : "jsonp",
                                                success   : function(result){
                                                        allot_button($anchor, result, targetService);
                                                }
                                        });
                                        break;
                        
                        }
                };

                var allot_button = function($anchor, count, targetService){
                        var popupURL;
                        var targetURL     = $anchor.attr("data-url");
                        var encodeURL     = encodeURI(targetURL);
                        var title         = $anchor.attr('data-title');
                        var encodeTitle   = encodeURI(title);

                        switch(targetService){
                                case "twitter":
                                        popupURL = "http://twitter.com/share?text=" + encodeTitle + "&amp;url=" + encodeURL;
                                        break;
                                case "facebook":
                                        popupURL = "http://www.facebook.com/sharer.php?u=" + encodeURL + "&amp;t=" + encodeTitle;
                                        break;
                                case "hatena":
                                        popupURL = "http://b.hatena.ne.jp/add?mode=confirm&amp;url=" + encodeURL + "&amp;title=" + encodeTitle;
                                        break;
                        }

                        $anchor.attr("href", popupURL);
                        $anchor.find('.count').html(count);
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
