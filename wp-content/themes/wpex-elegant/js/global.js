(function ($) {
    $(document).ready(function () { 

        $(window).scroll(function () {
            if ($(window).scrollTop() > 400) {
                $("#header-wrap").addClass("scrolling-fixed").removeClass("no-scrolling-fixed");
            }
            else {
                $("#header-wrap").removeClass("scrolling-fixed").addClass("no-scrolling-fixed");
            }
        });
        // Main menu superfish
        $('ul.sf-menu').superfish({
            delay: 200,
            animation: {
                opacity: 'show',
                height: 'show'
            },
            speed: 'fast',
            cssArrows: false,
            disableHI: true
        });
        // Mobile Menu
        $('#navigation-toggle').sidr({
            name: 'sidr-main',
            source: '#sidr-close, #site-navigation, #mobile-search',
            side: 'right'
        });
        $(".sidr-class-toggle-sidr-close").click(function () {
            $.sidr('close', 'sidr-main');
            return false;
        });
        // Close the menu on window change
        $(window).resize(function () {
            //$.sidr('close', 'sidr-main');
        });
        //Prettyphoto - for desktops only
        if ($(window).width() > 767) {

            // PrettyPhoto Without gallery
            $(".wpex-lightbox").prettyPhoto({
                show_title: false,
                social_tools: false,
                slideshow: false,
                autoplay_slideshow: false,
                wmode: 'opaque',
                deeplinking:false,
            });
            //PrettyPhoto With Gallery
            $("a[rel^='wpexLightboxGallery']").prettyPhoto({
                show_title: false,
                social_tools: false,
                autoplay_slideshow: false,
                overlay_gallery: true,
                wmode: 'opaque',
                deeplinking:false, 
            });
        }

        if (jQuery().isotope) {
            jQuery('.portfolio-three .portfolio-wrapper').isotope({
                // options
                itemSelector: '.portfolio-item',
                resizable: true,
                layoutMode: "fitRows",
                transformsEnabled: false,
                isOriginLeft: jQuery('.rtl').length ? false : true
            });
            jQuery('.portfolio-tabs a.deprecated').click(function (e) {
                e.preventDefault();

                var selector = jQuery(this).attr('data-filter');
                jQuery(this).parents('.portfolio').find('.portfolio-wrapper').isotope({filter: selector});

                jQuery(this).parents('ul').find('li').removeClass('active');
                jQuery(this).parent().addClass('active');
            });
        }
        if (jQuery().prettyPhoto) {
            var ppArgs = {
                overlay_gallery: Boolean(Number("1")),
                autoplay_slideshow: Boolean(Number("0")),
                show_title: Boolean(Number("0")),
                show_desc: Boolean(Number("1")),
                deeplinking: true,
                callback: function(){
                    if ( location.href.indexOf('#video') !== -1 ) location.hash = "";
                },
                changepicturecallback: function(){}
            };
            // jQuery("a[rel^='prettyPhoto']").prettyPhoto(ppArgs);
            jQuery("a[rel^='video']").prettyPhoto(ppArgs);
            if(getHashtag()){
                hashIndex = getHashtag();
                hashRel = hashIndex;
                hashIndex = hashIndex.substring(hashIndex.indexOf('/')+1,hashIndex.length-1);
                hashRel = hashRel.substring(0,hashRel.indexOf('/')); 
                console.log("hashIndex: "+hashIndex);
                console.log("hashRel: "+hashRel);
                $("#pitem-"+hashIndex+" a[rel^='"+hashRel+"']").trigger('click');
                // $("a[rel^='"+hashRel+"']:eq("+hashIndex+")").trigger('click');
            }

            function getHashtag(){
                var url = location.href;
                hashtag = (url.indexOf('#video') !== -1) ? decodeURI(url.substring(url.indexOf('#video')+1,url.length)) : false;
                return hashtag;
            };
    
        }

        if (jQuery().accordion) {

            $(".symple-accordion-first-item").accordion({
                heightStyle: "content",
                collapsible: true
            });

            $(".symple-accordion-item").accordion({
                heightStyle: "content",
                collapsible: true
            });

         }

        $('.symple-accordion-item .symple-accordion-trigger').trigger('click');
        //var contentAreas = $('.symple-accordion-item .ui-accordion-content').hide();
        
    }); // End doc ready

    $(window).load(function () {
        if (jQuery().flexslider) {
            // Homepage FlexSlider
            $('#homepage-slider').flexslider({
                animation: 'slide',
                slideshow: true,
                smoothHeight: true,
                controlNav: true,
                directionNav: false,
                prevText: '<span class="fa fa-angle-left"></span>',
                nextText: '<span class="fa fa-angle-right"></span>',
                controlsContainer: ".flexslider-container",
                pauseOnHover: false,
                easing: "easeOutQuad",
                animationLoop: true,
                animationSpeed: 1800,
                slideshowSpeed: 7000
            });
            // Post FlexSlider
            $('div.post-slider').flexslider({
                animation: 'slide',
                slideshow: true,
                smoothHeight: true,
                controlNav: false,
                directionNav: true,
                prevText: '<span class="fa fa-angle-left"></span>',
                nextText: '<span class="fa fa-angle-right"></span>',
                controlsContainer: ".flexslider-container"
            });
            $('.flexslider').flexslider({
                animation: "slide",
                directionNav: false,
                smoothHeight: true
            });
            $(".searchform").submit(function () {
                var isFormValid = true;
                $(".searchform .field-search", $(this)).each(function () {
                    if ($.trim($(this).val()).length == 0) {
                        isFormValid = false;
                        $(this).addClass("highlight-red");
                    } else {
                        $(this).removeClass("highlight-red");
                    }
                });
                return isFormValid;
            });
        }
    }); // End on window load

})(jQuery);