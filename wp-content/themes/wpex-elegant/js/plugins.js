/*
 
 - Superfish
 
 - Supersubs
 
 - Sidr - responsive menu
 
 - Sticky
 
 - PrettyPhoto v3.1.5
 
 - FlexSlider v2.1 - Version 2.2 is buggy, zzz
 
 */





/*
 
 * jQuery Superfish Menu Plugin
 
 * Copyright (c) 2013 Joel Birch
 
 *
 
 * Dual licensed under the MIT and GPL licenses:
 
 *	http://www.opensource.org/licenses/mit-license.php
 
 *	http://www.gnu.org/licenses/gpl.html
 
 */

(function ($) {

    var methods = function () {

        var c = {
            bcClass: "sf-breadcrumb",
            menuClass: "sf-js-enabled",
            anchorClass: "sf-with-ul",
            menuArrowClass: "sf-arrows"

        }, ios = function () {

            var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (ios)
                $(window).load(function () {

                    $("body").children().on("click", $.noop)

                });

            return ios

        }(), wp7 = function () {

            var style = document.documentElement.style;

            return"behavior"in style && ("fill"in style && /iemobile/i.test(navigator.userAgent))

        }(), toggleMenuClasses = function ($menu, o) {

            var classes = c.menuClass;

            if (o.cssArrows)
                classes += " " + c.menuArrowClass;

            $menu.toggleClass(classes)

        }, setPathToCurrent = function ($menu, o) {

            return $menu.find("li." + o.pathClass).slice(0, o.pathLevels).addClass(o.hoverClass + " " + c.bcClass).filter(function () {

                return $(this).children(o.popUpSelector).hide().show().length

            }).removeClass(o.pathClass)

        }, toggleAnchorClass = function ($li) {

            $li.children("a").toggleClass(c.anchorClass)

        }, toggleTouchAction = function ($menu) {

            var touchAction = $menu.css("ms-touch-action");

            touchAction = touchAction === "pan-y" ?
                    "auto" : "pan-y";

            $menu.css("ms-touch-action", touchAction)

        }, applyHandlers = function ($menu, o) {

            var targets = "li:has(" + o.popUpSelector + ")";

            if ($.fn.hoverIntent && !o.disableHI)
                $menu.hoverIntent(over, out, targets);
            else
                $menu.on("mouseenter.superfish", targets, over).on("mouseleave.superfish", targets, out);

            var touchevent = "MSPointerDown.superfish";

            if (!ios)
                touchevent += " touchend.superfish";

            if (wp7)
                touchevent += " mousedown.superfish";

            $menu.on("focusin.superfish", "li", over).on("focusout.superfish", "li", out).on(touchevent,
                    "a", o, touchHandler)

        }, touchHandler = function (e) {

            var $this = $(this), $ul = $this.siblings(e.data.popUpSelector);

            if ($ul.length > 0 && $ul.is(":hidden")) {

                $this.one("click.superfish", false);

                if (e.type === "MSPointerDown")
                    $this.trigger("focus");
                else
                    $.proxy(over, $this.parent("li"))()

            }

        }, over = function () {

            var $this = $(this), o = getOptions($this);

            clearTimeout(o.sfTimer);

            $this.siblings().superfish("hide").end().superfish("show")

        }, out = function () {

            var $this = $(this), o = getOptions($this);

            if (ios)
                $.proxy(close, $this, o)();

            else {

                clearTimeout(o.sfTimer);

                o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay)

            }

        }, close = function (o) {

            o.retainPath = $.inArray(this[0], o.$path) > -1;

            this.superfish("hide");

            if (!this.parents("." + o.hoverClass).length) {

                o.onIdle.call(getMenu(this));

                if (o.$path.length)
                    $.proxy(over, o.$path)()

            }

        }, getMenu = function ($el) {

            return $el.closest("." + c.menuClass)

        }, getOptions = function ($el) {

            return getMenu($el).data("sf-options")

        };



        return{
            hide: function (instant) {

                if (this.length) {

                    var $this = this, o = getOptions($this);

                    if (!o)
                        return this;

                    var not = o.retainPath ===
                            true ? o.$path : "", $ul = $this.find("li." + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector), speed = o.speedOut;

                    if (instant) {

                        $ul.show();

                        speed = 0

                    }

                    o.retainPath = false;

                    o.onBeforeHide.call($ul);

                    $ul.stop(true, true).animate(o.animationOut, speed, function () {

                        var $this = $(this);

                        o.onHide.call($this)

                    })

                }

                return this

            },
            show: function () {

                var o = getOptions(this);

                if (!o)
                    return this;

                var $this = this.addClass(o.hoverClass), $ul = $this.children(o.popUpSelector);

                o.onBeforeShow.call($ul);

                $ul.stop(true, true).animate(o.animation,
                        o.speed, function () {

                            o.onShow.call($ul)

                        });

                return this

            },
            destroy: function () {

                return this.each(function () {

                    var $this = $(this), o = $this.data("sf-options"), $hasPopUp;

                    if (!o)
                        return false;

                    $hasPopUp = $this.find(o.popUpSelector).parent("li");

                    clearTimeout(o.sfTimer);

                    toggleMenuClasses($this, o);

                    toggleAnchorClass($hasPopUp);

                    toggleTouchAction($this);

                    $this.off(".superfish").off(".hoverIntent");

                    $hasPopUp.children(o.popUpSelector).attr("style", function (i, style) {

                        return style.replace(/display[^;]+;?/g, "")

                    });

                    o.$path.removeClass(o.hoverClass +
                            " " + c.bcClass).addClass(o.pathClass);

                    $this.find("." + o.hoverClass).removeClass(o.hoverClass);

                    o.onDestroy.call($this);

                    $this.removeData("sf-options")

                })

            },
            init: function (op) {

                return this.each(function () {

                    var $this = $(this);

                    if ($this.data("sf-options"))
                        return false;

                    var o = $.extend({}, $.fn.superfish.defaults, op), $hasPopUp = $this.find(o.popUpSelector).parent("li");

                    o.$path = setPathToCurrent($this, o);

                    $this.data("sf-options", o);

                    toggleMenuClasses($this, o);

                    toggleAnchorClass($hasPopUp);

                    toggleTouchAction($this);

                    applyHandlers($this,
                            o);

                    $hasPopUp.not("." + c.bcClass).superfish("hide", true);

                    o.onInit.call(this)

                })

            }

        }

    }();

    $.fn.superfish = function (method, args) {

        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        else if (typeof method === "object" || !method)
            return methods.init.apply(this, arguments);
        else
            return $.error("Method " + method + " does not exist on jQuery.fn.superfish")

    };



    $.fn.superfish.defaults = {
        popUpSelector: "ul,.sf-mega",
        hoverClass: "sfHover",
        pathClass: "overrideThisToUse",
        pathLevels: 1,
        delay: 800,
        animation: {
            opacity: "show"

        },
        animationOut: {
            opacity: "hide"

        },
        speed: "normal",
        speedOut: "fast",
        cssArrows: true,
        disableHI: false,
        onInit: $.noop,
        onBeforeShow: $.noop,
        onShow: $.noop,
        onBeforeHide: $.noop,
        onHide: $.noop,
        onIdle: $.noop,
        onDestroy: $.noop

    };



    $.fn.extend({
        hideSuperfishUl: methods.hide,
        showSuperfishUl: methods.show

    })

})(jQuery);



/* ------------------------------------------------------------------------
 
 Class: prettyPhoto
 
 Use: Lightbox clone for jQuery
 
 Author: Stephane Caron (http://www.no-margin-for-errors.com)
 
 Version: 3.1.5
 
 ------------------------------------------------------------------------- */

(function (e) {

    function t() {

        var e = location.href;

        hashtag = e.indexOf("#prettyPhoto") !== -1 ? decodeURI(e.substring(e.indexOf("#prettyPhoto") + 1, e.length)) : false;

        return hashtag

    }

    function n() {

        if (typeof theRel == "undefined")
            return;
        
        var id = jQuery("a[rel^='"+theRel+"']:eq("+rel_index+")").closest( "div.portfolio-item" ).attr("data-item-id");
        console.log("rel_index: "+rel_index);
        console.log("id: "+id);
        location.hash = theRel + "/" + id + "/"

    }

    function r() {

        if (location.href.indexOf("#prettyPhoto") !== -1)
            location.hash = "prettyPhoto"

    }

    function i(e, t) {

        e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        var n = "[\\?&]" + e + "=([^&#]*)";

        var r = new RegExp(n);

        var i = r.exec(t);

        return i == null ? "" : i[1]

    }

    e.prettyPhoto = {
        version: "3.1.5"

    };



    e.fn.prettyPhoto = function (s) {

        function g() {

            e(".pp_loaderIcon").hide();

            projectedTop = scroll_pos["scrollTop"] + (d / 2 - a["containerHeight"] / 2);

            if (projectedTop < 0)
                projectedTop = 0;

            $ppt.fadeTo(settings.animation_speed, 1);

            $pp_pic_holder.find(".pp_content").animate({
                height: a["contentHeight"],
                width: a["contentWidth"]

            }, settings.animation_speed);

            $pp_pic_holder.animate({
                top: projectedTop,
                left: v / 2 - a["containerWidth"] / 2 < 0 ? 0 : v / 2 - a["containerWidth"] / 2,
                width: a["containerWidth"]

            }, settings.animation_speed, function () {

                $pp_pic_holder.find(".pp_hoverContainer,#fullResImage").height(a["height"]).width(a["width"]);

                $pp_pic_holder.find(".pp_fade").fadeIn(settings.animation_speed);

                if (isSet && S(pp_images[set_position]) == "image") {

                    $pp_pic_holder.find(".pp_hoverContainer").show()

                } else {

                    $pp_pic_holder.find(".pp_hoverContainer").hide()

                }

                if (settings.allow_expand) {

                    if (a["resized"]) {

                        e("a.pp_expand,a.pp_contract").show()

                    } else {

                        e("a.pp_expand").hide()

                    }

                }

                if (settings.autoplay_slideshow && !m && !f)
                    e.prettyPhoto.startSlideshow();

                settings.changepicturecallback();

                f = true

            });

            C();

            s.ajaxcallback()

        }

        function y(t) {

            $pp_pic_holder.find("#pp_full_res object,#pp_full_res embed").css("visibility", "hidden");

            $pp_pic_holder.find(".pp_fade").fadeOut(settings.animation_speed, function () {

                e(".pp_loaderIcon").show();

                t()

            })

        }

        function b(t) {

            t > 1 ? e(".pp_nav").show() : e(".pp_nav").hide()

        }

        function w(e, t) {

            resized = false;

            E(e, t);

            imageWidth = e, imageHeight = t;

            if ((p > v || h > d) && doresize && settings.allow_resize && !u) {

                resized = true, fitting = false;

                while (!fitting) {

                    if (p > v) {

                        imageWidth = v - 200;

                        imageHeight = t / e * imageWidth

                    } else if (h > d) {

                        imageHeight = d - 200;

                        imageWidth = e / t * imageHeight

                    } else {

                        fitting = true

                    }

                    h = imageHeight, p = imageWidth

                }

                if (p > v || h > d) {

                    w(p, h)

                }

                E(imageWidth, imageHeight)

            }

            return{
                width: Math.floor(imageWidth),
                height: Math.floor(imageHeight),
                containerHeight: Math.floor(h),
                containerWidth: Math.floor(p) + settings.horizontal_padding * 2,
                contentHeight: Math.floor(l),
                contentWidth: Math.floor(c),
                resized: resized

            }

        }

        function E(t, n) {

            t = parseFloat(t);

            n = parseFloat(n);

            $pp_details = $pp_pic_holder.find(".pp_details");

            $pp_details.width(t);

            detailsHeight = parseFloat($pp_details.css("marginTop")) + parseFloat($pp_details.css("marginBottom"));

            $pp_details = $pp_details.clone().addClass(settings.theme).width(t).appendTo(e("body")).css({
                position: "absolute",
                top: -1e4

            });

            detailsHeight += $pp_details.height();

            detailsHeight = detailsHeight <= 34 ? 36 : detailsHeight;

            $pp_details.remove();

            $pp_title = $pp_pic_holder.find(".ppt");

            $pp_title.width(t);

            titleHeight = parseFloat($pp_title.css("marginTop")) + parseFloat($pp_title.css("marginBottom"));

            $pp_title = $pp_title.clone().appendTo(e("body")).css({
                position: "absolute",
                top: -1e4

            });

            titleHeight += $pp_title.height();

            $pp_title.remove();

            l = n + detailsHeight;

            c = t;

            h = l + titleHeight + $pp_pic_holder.find(".pp_top").height() + $pp_pic_holder.find(".pp_bottom").height();

            p = t

        }

        function S(e) {

            if (e.match(/youtube\.com\/watch/i) || e.match(/youtu\.be/i)) {

                return"youtube"

            } else if (e.match(/vimeo\.com/i)) {

                return"vimeo"

            } else if (e.match(/\b.mov\b/i)) {

                return"quicktime"

            } else if (e.match(/\b.swf\b/i)) {

                return"flash"

            } else if (e.match(/\biframe=true\b/i)) {

                return"iframe"

            } else if (e.match(/\bajax=true\b/i)) {

                return"ajax"

            } else if (e.match(/\bcustom=true\b/i)) {

                return"custom"

            } else if (e.substr(0, 1) == "#") {

                return"inline"

            } else {

                return"image"

            }

        }

        function x() {

            if (doresize && typeof $pp_pic_holder != "undefined") {

                scroll_pos = T();

                contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width();

                projectedTop = d / 2 + scroll_pos["scrollTop"] - contentHeight / 2;

                if (projectedTop < 0)
                    projectedTop = 0;

                if (contentHeight > d)
                    return;

                $pp_pic_holder.css({
                    top: projectedTop,
                    left: v / 2 + scroll_pos["scrollLeft"] - contentwidth / 2

                })

            }

        }

        function T() {

            if (self.pageYOffset) {

                return{
                    scrollTop: self.pageYOffset,
                    scrollLeft: self.pageXOffset

                }

            } else if (document.documentElement && document.documentElement.scrollTop) {

                return{
                    scrollTop: document.documentElement.scrollTop,
                    scrollLeft: document.documentElement.scrollLeft

                }

            } else if (document.body) {

                return{
                    scrollTop: document.body.scrollTop,
                    scrollLeft: document.body.scrollLeft

                }

            }

        }

        function N() {

            d = e(window).height(), v = e(window).width();

            if (typeof $pp_overlay != "undefined")
                $pp_overlay.height(e(document).height()).width(v)

        }

        function C() {

            if (isSet && settings.overlay_gallery && S(pp_images[set_position]) == "image") {

                itemWidth = 52 + 5;

                navWidth = settings.theme == "facebook" || settings.theme == "pp_default" ? 50 : 30;

                itemsPerPage = Math.floor((a["containerWidth"] - 100 - navWidth) / itemWidth);

                itemsPerPage = itemsPerPage < pp_images.length ? itemsPerPage : pp_images.length;

                totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1;

                if (totalPage == 0) {

                    navWidth = 0;

                    $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").hide()

                } else {

                    $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").show()

                }

                galleryWidth = itemsPerPage * itemWidth;

                fullGalleryWidth = pp_images.length * itemWidth;

                $pp_gallery.css("margin-left", -(galleryWidth / 2 + navWidth / 2)).find("div:first").width(galleryWidth + 5).find("ul").width(fullGalleryWidth).find("li.selected").removeClass("selected");

                goToPage = Math.floor(set_position / itemsPerPage) < totalPage ? Math.floor(set_position / itemsPerPage) : totalPage;

                e.prettyPhoto.changeGalleryPage(goToPage);

                $pp_gallery_li.filter(":eq(" + set_position + ")").addClass("selected")

            } else {

                $pp_pic_holder.find(".pp_content").unbind("mouseenter mouseleave")

            }

        }

        function k(t) {

            if (settings.social_tools)
                facebook_like_link = settings.social_tools.replace("{location_href}", encodeURIComponent(location.href));

            settings.markup = settings.markup.replace("{pp_social}", "");

            e("body").append(settings.markup);

            $pp_pic_holder = e(".pp_pic_holder"), $ppt = e(".ppt"), $pp_overlay = e("div.pp_overlay");

            if (isSet && settings.overlay_gallery) {

                currentGalleryPage = 0;

                toInject = "";

                for (var n = 0; n < pp_images.length; n++) {

                    if (!pp_images[n].match(/\b(jpg|jpeg|png|gif)\b/gi)) {

                        classname = "default";

                        img_src = ""

                    } else {

                        classname = "";

                        img_src = pp_images[n]

                    }

                    toInject += "<li class='" + classname + "'><a href='#'><img src='" + img_src + "' width='50' alt='' /></a></li>"

                }

                toInject = settings.gallery_markup.replace(/{gallery}/g, toInject);

                $pp_pic_holder.find("#pp_full_res").after(toInject);

                $pp_gallery = e(".pp_pic_holder .pp_gallery"), $pp_gallery_li = $pp_gallery.find("li");

                $pp_gallery.find(".pp_arrow_next").click(function () {

                    e.prettyPhoto.changeGalleryPage("next");

                    e.prettyPhoto.stopSlideshow();

                    return false

                });

                $pp_gallery.find(".pp_arrow_previous").click(function () {

                    e.prettyPhoto.changeGalleryPage("previous");

                    e.prettyPhoto.stopSlideshow();

                    return false

                });

                $pp_pic_holder.find(".pp_content").hover(function () {

                    $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn()

                }, function () {

                    $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut()

                });

                itemWidth = 52 + 5;

                $pp_gallery_li.each(function (t) {

                    e(this).find("a").click(function () {

                        e.prettyPhoto.changePage(t);

                        e.prettyPhoto.stopSlideshow();

                        return false

                    })

                })

            }

            if (settings.slideshow) {

                $pp_pic_holder.find(".pp_nav").prepend('<a href="#" class="pp_play">Play</a>');

                $pp_pic_holder.find(".pp_nav .pp_play").click(function () {

                    e.prettyPhoto.startSlideshow();

                    return false

                })

            }

            $pp_pic_holder.attr("class", "pp_pic_holder " + settings.theme);

            $pp_overlay.css({
                opacity: 0,
                height: e(document).height(),
                width: e(window).width()

            }).bind("click", function () {

                if (!settings.modal)
                    e.prettyPhoto.close()

            });

            e("a.pp_close").bind("click", function () {

                e.prettyPhoto.close();

                return false

            });

            if (settings.allow_expand) {

                e("a.pp_expand").bind("click", function (t) {

                    if (e(this).hasClass("pp_expand")) {

                        e(this).removeClass("pp_expand").addClass("pp_contract");

                        doresize = false

                    } else {

                        e(this).removeClass("pp_contract").addClass("pp_expand");

                        doresize = true

                    }

                    y(function () {

                        e.prettyPhoto.open()

                    });

                    return false

                })

            }

            $pp_pic_holder.find(".pp_previous, .pp_nav .pp_arrow_previous").bind("click", function () {

                e.prettyPhoto.changePage("previous");

                e.prettyPhoto.stopSlideshow();

                return false

            });

            $pp_pic_holder.find(".pp_next, .pp_nav .pp_arrow_next").bind("click", function () {

                e.prettyPhoto.changePage("next");

                e.prettyPhoto.stopSlideshow();

                return false

            });

            x()

        }

        s = jQuery.extend({
            hook: "rel",
            animation_speed: "fast",
            ajaxcallback: function () {
            },
            slideshow: 5e3,
            autoplay_slideshow: false,
            opacity: .8,
            show_title: true,
            allow_resize: true,
            allow_expand: true,
            default_width: 500,
            default_height: 344,
            counter_separator_label: "/",
            theme: "pp_default",
            horizontal_padding: 20,
            hideflash: false,
            wmode: "opaque",
            autoplay: true,
            modal: false,
            deeplinking: true,
            overlay_gallery: true,
            overlay_gallery_max: 30,
            keyboard_shortcuts: true,
            changepicturecallback: function () {
            },
            callback: function () {
            },
            ie6_fallback: true,
            markup: '<div class="pp_pic_holder"> 						<div class="ppt"> </div> 						<div class="pp_top"> 							<div class="pp_left"></div> 							<div class="pp_middle"></div> 							<div class="pp_right"></div> 						</div> 						<div class="pp_content_container"> 							<div class="pp_left"> 							<div class="pp_right"> 								<div class="pp_content"> 									<div class="pp_loaderIcon"></div> 									<div class="pp_fade"> 										<a href="#" class="pp_expand" title="Expand the image">Expand</a> 										<div class="pp_hoverContainer"> 											<a class="pp_next" href="#">next</a> 											<a class="pp_previous" href="#">previous</a> 										</div> 										<div id="pp_full_res"></div> 										<div class="pp_details"> 											<div class="pp_nav"> 												<a href="#" class="pp_arrow_previous">Previous</a> 												<p class="currentTextHolder">0/0</p> 												<a href="#" class="pp_arrow_next">Next</a> 											</div> 											<p class="pp_description"></p> 											<div class="pp_social">{pp_social}</div> 											<a class="pp_close" href="#">Close</a> 										</div> 									</div> 								</div> 							</div> 							</div> 						</div> 						<div class="pp_bottom"> 							<div class="pp_left"></div> 							<div class="pp_middle"></div> 							<div class="pp_right"></div> 						</div> 					</div> 					<div class="pp_overlay"></div>',
            gallery_markup: '<div class="pp_gallery"> 								<a href="#" class="pp_arrow_previous">Previous</a> 								<div> 									<ul> 										{gallery} 									</ul> 								</div> 								<a href="#" class="pp_arrow_next">Next</a> 							</div>',
            image_markup: '<img id="fullResImage" src="{path}" />',
            flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup: '<div class="pp_inline">{content}</div>',
            custom_markup: "",
            social_tools: '<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&layout=button_count&show_faces=true&width=500&action=like&font&colorscheme=light&height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>'

        }, s);

        var o = this, u = false, a, f, l, c, h, p, d = e(window).height(), v = e(window).width(), m;

        doresize = true, scroll_pos = T();

        e(window).unbind("resize.prettyphoto").bind("resize.prettyphoto", function () {

            x();

            N()

        });

        if (s.keyboard_shortcuts) {

            e(document).unbind("keydown.prettyphoto").bind("keydown.prettyphoto", function (t) {

                if (typeof $pp_pic_holder != "undefined") {

                    if ($pp_pic_holder.is(":visible")) {

                        switch (t.keyCode) {

                            case 37:

                                e.prettyPhoto.changePage("previous");

                                t.preventDefault();

                                break;

                            case 39:

                                e.prettyPhoto.changePage("next");

                                t.preventDefault();

                                break;

                            case 27:

                                if (!settings.modal)
                                    e.prettyPhoto.close();

                                t.preventDefault();

                                break

                        }

                    }

                }

            })

        }

        e.prettyPhoto.initialize = function () {

            settings = s;

            if (settings.theme == "pp_default")
                settings.horizontal_padding = 16;

            theRel = e(this).attr(settings.hook);

            galleryRegExp = /\[(?:.*)\]/;

            isSet = galleryRegExp.exec(theRel) ? true : false;

            pp_images = isSet ? jQuery.map(o, function (t, n) {

                if (e(t).attr(settings.hook).indexOf(theRel) != -1)
                    return e(t).attr("href")

            }) : e.makeArray(e(this).attr("href"));

            pp_titles = isSet ? jQuery.map(o, function (t, n) {

                if (e(t).attr(settings.hook).indexOf(theRel) != -1)
                    return e(t).find("img").attr("alt") ? e(t).find("img").attr("alt") : ""

            }) : e.makeArray(e(this).find("img").attr("alt"));

            pp_descriptions = isSet ? jQuery.map(o, function (t, n) {

                if (e(t).attr(settings.hook).indexOf(theRel) != -1)
                    return e(t).attr("title") ? e(t).attr("title") : ""

            }) : e.makeArray(e(this).attr("title"));

            if (pp_images.length > settings.overlay_gallery_max)
                settings.overlay_gallery = false;

            set_position = jQuery.inArray(e(this).attr("href"), pp_images);

            rel_index = isSet ? set_position : e("a[" + settings.hook + "^='" + theRel + "']").index(e(this));

            k(this);

            if (settings.allow_resize)
                e(window).bind("scroll.prettyphoto", function () {

                    x()

                });

            e.prettyPhoto.open();

            return false

        };



        e.prettyPhoto.open = function (t) {

            if (typeof settings == "undefined") {

                settings = s;

                pp_images = e.makeArray(arguments[0]);

                pp_titles = arguments[1] ? e.makeArray(arguments[1]) : e.makeArray("");

                pp_descriptions = arguments[2] ? e.makeArray(arguments[2]) : e.makeArray("");

                isSet = pp_images.length > 1 ? true : false;

                set_position = arguments[3] ? arguments[3] : 0;

                k(t.target)

            }

            if (settings.hideflash)
                e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility", "hidden");

            b(e(pp_images).size());

            e(".pp_loaderIcon").show();

            if (settings.deeplinking)
                n();

            if (settings.social_tools) {

                facebook_like_link = settings.social_tools.replace("{location_href}", encodeURIComponent(location.href));

                $pp_pic_holder.find(".pp_social").html(facebook_like_link)

            }

            if ($ppt.is(":hidden"))
                $ppt.css("opacity", 0).show();

            $pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity);

            $pp_pic_holder.find(".currentTextHolder").text(set_position + 1 + settings.counter_separator_label + e(pp_images).size());

            if (typeof pp_descriptions[set_position] != "undefined" && pp_descriptions[set_position] != "") {

                $pp_pic_holder.find(".pp_description").show().html(unescape(pp_descriptions[set_position]))

            } else {

                $pp_pic_holder.find(".pp_description").hide()

            }

            movie_width = parseFloat(i("width", pp_images[set_position])) ? i("width", pp_images[set_position]) : settings.default_width.toString();

            movie_height = parseFloat(i("height", pp_images[set_position])) ? i("height", pp_images[set_position]) : settings.default_height.toString();

            u = false;

            if (movie_height.indexOf("%") != -1) {

                movie_height = parseFloat(e(window).height() * parseFloat(movie_height) / 100 - 150);

                u = true

            }

            if (movie_width.indexOf("%") != -1) {

                movie_width = parseFloat(e(window).width() * parseFloat(movie_width) / 100 - 150);

                u = true

            }

            $pp_pic_holder.fadeIn(function () {

                settings.show_title && pp_titles[set_position] != "" && typeof pp_titles[set_position] != "undefined" ? $ppt.html(unescape(pp_titles[set_position])) : $ppt.html(" ");

                imgPreloader = "";

                skipInjection = false;

                switch (S(pp_images[set_position])) {

                    case"image":

                        imgPreloader = new Image;

                        nextImage = new Image;

                        if (isSet && set_position < e(pp_images).size() - 1)
                            nextImage.src = pp_images[set_position + 1];

                        prevImage = new Image;

                        if (isSet && pp_images[set_position - 1])
                            prevImage.src = pp_images[set_position - 1];

                        $pp_pic_holder.find("#pp_full_res")[0].innerHTML = settings.image_markup.replace(/{path}/g, pp_images[set_position]);

                        imgPreloader.onload = function () {

                            a = w(imgPreloader.width, imgPreloader.height);

                            g()

                        };



                        imgPreloader.onerror = function () {

                            alert("Image cannot be loaded. Make sure the path is correct and image exist.");

                            e.prettyPhoto.close()

                        };



                        imgPreloader.src = pp_images[set_position];

                        break;

                    case"youtube":

                        a = w(movie_width, movie_height);

                        movie_id = i("v", pp_images[set_position]);

                        if (movie_id == "") {

                            movie_id = pp_images[set_position].split("youtu.be/");

                            movie_id = movie_id[1];

                            if (movie_id.indexOf("?") > 0)
                                movie_id = movie_id.substr(0, movie_id.indexOf("?"));

                            if (movie_id.indexOf("&") > 0)
                                movie_id = movie_id.substr(0, movie_id.indexOf("&"))

                        }

                        movie = "http://www.youtube.com/embed/" + movie_id;

                        i("rel", pp_images[set_position]) ? movie += "?rel=" + i("rel", pp_images[set_position]) : movie += "?rel=1";

                        if (settings.autoplay)
                            movie += "&autoplay=1";

                        toInject = settings.iframe_markup.replace(/{width}/g, a["width"]).replace(/{height}/g, a["height"]).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, movie);

                        break;

                    case"vimeo":

                        a = w(movie_width, movie_height);

                        movie_id = pp_images[set_position];

                        var t = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/;

                        var n = movie_id.match(t);

                        movie = "http://player.vimeo.com/video/" + n[3] + "?title=0&byline=0&portrait=0";

                        if (settings.autoplay)
                            movie += "&autoplay=1;";

                        vimeo_width = a["width"] + "/embed/?moog_width=" + a["width"];

                        toInject = settings.iframe_markup.replace(/{width}/g, vimeo_width).replace(/{height}/g, a["height"]).replace(/{path}/g, movie);

                        break;

                    case"quicktime":

                        a = w(movie_width, movie_height);

                        a["height"] += 15;

                        a["contentHeight"] += 15;

                        a["containerHeight"] += 15;

                        toInject = settings.quicktime_markup.replace(/{width}/g, a["width"]).replace(/{height}/g, a["height"]).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, pp_images[set_position]).replace(/{autoplay}/g, settings.autoplay);

                        break;

                    case"flash":

                        a = w(movie_width, movie_height);

                        flash_vars = pp_images[set_position];

                        flash_vars = flash_vars.substring(pp_images[set_position].indexOf("flashvars") + 10, pp_images[set_position].length);

                        filename = pp_images[set_position];

                        filename = filename.substring(0, filename.indexOf("?"));

                        toInject = settings.flash_markup.replace(/{width}/g, a["width"]).replace(/{height}/g, a["height"]).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, filename + "?" + flash_vars);

                        break;

                    case"iframe":

                        a = w(movie_width, movie_height);

                        frame_url = pp_images[set_position];

                        frame_url = frame_url.substr(0, frame_url.indexOf("iframe") - 1);

                        toInject = settings.iframe_markup.replace(/{width}/g, a["width"]).replace(/{height}/g, a["height"]).replace(/{path}/g, frame_url);

                        break;

                    case"ajax":

                        doresize = false;

                        a = w(movie_width, movie_height);

                        doresize = true;

                        skipInjection = true;

                        e.get(pp_images[set_position], function (e) {

                            toInject = settings.inline_markup.replace(/{content}/g, e);

                            $pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject;

                            g()

                        });

                        break;

                    case"custom":

                        a = w(movie_width, movie_height);

                        toInject = settings.custom_markup;

                        break;

                    case"inline":

                        myClone = e(pp_images[set_position]).clone().append('<br clear="all" />').css({
                            width: settings.default_width

                        }).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo(e("body")).show();

                        doresize = false;

                        a = w(e(myClone).width(), e(myClone).height());

                        doresize = true;

                        e(myClone).remove();

                        toInject = settings.inline_markup.replace(/{content}/g, e(pp_images[set_position]).html());

                        break

                }

                if (!imgPreloader && !skipInjection) {

                    $pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject;

                    g()

                }

            });

            return false

        };



        e.prettyPhoto.changePage = function (t) {

            currentGalleryPage = 0;

            if (t == "previous") {

                set_position--;

                if (set_position < 0)
                    set_position = e(pp_images).size() - 1

            } else if (t == "next") {

                set_position++;

                if (set_position > e(pp_images).size() - 1)
                    set_position = 0

            } else {

                set_position = t

            }

            rel_index = set_position;

            if (!doresize)
                doresize = true;

            if (settings.allow_expand) {

                e(".pp_contract").removeClass("pp_contract").addClass("pp_expand")

            }

            y(function () {

                e.prettyPhoto.open()

            })

        };



        e.prettyPhoto.changeGalleryPage = function (e) {

            if (e == "next") {

                currentGalleryPage++;

                if (currentGalleryPage > totalPage)
                    currentGalleryPage = 0

            } else if (e == "previous") {

                currentGalleryPage--;

                if (currentGalleryPage < 0)
                    currentGalleryPage = totalPage

            } else {

                currentGalleryPage = e

            }

            slide_speed = e == "next" || e == "previous" ? settings.animation_speed : 0;

            slide_to = currentGalleryPage * itemsPerPage * itemWidth;

            $pp_gallery.find("ul").animate({
                left: -slide_to

            }, slide_speed)

        };



        e.prettyPhoto.startSlideshow = function () {

            if (typeof m == "undefined") {

                $pp_pic_holder.find(".pp_play").unbind("click").removeClass("pp_play").addClass("pp_pause").click(function () {

                    e.prettyPhoto.stopSlideshow();

                    return false

                });

                m = setInterval(e.prettyPhoto.startSlideshow, settings.slideshow)

            } else {

                e.prettyPhoto.changePage("next")

            }

        };



        e.prettyPhoto.stopSlideshow = function () {

            $pp_pic_holder.find(".pp_pause").unbind("click").removeClass("pp_pause").addClass("pp_play").click(function () {

                e.prettyPhoto.startSlideshow();

                return false

            });

            clearInterval(m);

            m = undefined

        };



        e.prettyPhoto.close = function () {

            if ($pp_overlay.is(":animated"))
                return;

            e.prettyPhoto.stopSlideshow();

            $pp_pic_holder.stop().find("object,embed").css("visibility", "hidden");

            e("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(settings.animation_speed, function () {

                e(this).remove()

            });

            $pp_overlay.fadeOut(settings.animation_speed, function () {

                if (settings.hideflash)
                    e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility", "visible");

                e(this).remove();

                e(window).unbind("scroll.prettyphoto");

                r();

                settings.callback();

                doresize = true;

                f = false;

                delete settings

            })

        };



        if (!pp_alreadyInitialized && t()) {

            pp_alreadyInitialized = true;

            hashIndex = t();

            hashRel = hashIndex;

            hashIndex = hashIndex.substring(hashIndex.indexOf("/") + 1, hashIndex.length - 1);

            hashRel = hashRel.substring(0, hashRel.indexOf("/"));

            setTimeout(function () {

                e("a[" + s.hook + "^='" + hashRel + "']:eq(" + hashIndex + ")").trigger("click")

            }, 50)

        }

        return this.unbind("click.prettyphoto").bind("click.prettyphoto", e.prettyPhoto.initialize)

    };



})(jQuery);

var pp_alreadyInitialized = false;



/*
 
 * Sidr
 
 * https://github.com/artberri/sidr
 
 *
 
 * Copyright (c) 2013 Alberto Varela
 
 * Licensed under the MIT license.
 
 */

(function (e) {

    var t = false, n = false;

    var r = {
        isUrl: function (e) {

            var t = new RegExp("^(https?:\\/\\/)?" + "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + "((\\d{1,3}\\.){3}\\d{1,3}))" + "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + "(\\?[;&a-z\\d%_.~+=-]*)?" + "(\\#[-a-z\\d_]*)?$", "i");

            if (!t.test(e)) {

                return false

            } else {

                return true

            }

        },
        loadContent: function (e, t) {

            e.html(t)

        },
        addPrefix: function (e) {

            var t = e.attr("id"), n = e.attr("class");

            if (typeof t === "string" && "" !== t) {

                e.attr("id", t.replace(/([A-Za-z0-9_.\-]+)/g, "sidr-id-$1"))

            }

            if (typeof n === "string" && "" !== n && "sidr-inner" !== n) {

                e.attr("class", n.replace(/([A-Za-z0-9_.\-]+)/g, "sidr-class-$1"))

            }

            e.removeAttr("style")

        },
        execute: function (r, s, o) {

            if (typeof s === "function") {

                o = s;

                s = "sidr"

            } else if (!s) {

                s = "sidr"

            }

            var u = e("#" + s), a = e(u.data("body")), f = e("html"), l = u.outerWidth(true), c = u.data("speed"), h = u.data("side"), p, d, v;

            if ("open" === r || "toogle" === r && !u.is(":visible")) {

                if (u.is(":visible") || t) {

                    return

                }

                if (n !== false) {

                    i.close(n, function () {

                        i.open(s)

                    });

                    return

                }

                t = true;

                if (h === "left") {

                    p = {
                        left: l + "px"

                    };



                    d = {
                        left: "0px"

                    }

                } else {

                    p = {
                        right: l + "px"

                    };



                    d = {
                        right: "0px"

                    }

                }

                v = f.scrollTop();

                f.css("overflow-x", "hidden").scrollTop(v);

                a.css({
                    width: a.width(),
                    position: "absolute"

                }).animate(p, c);

                u.css("display", "block").animate(d, c, function () {

                    t = false;

                    n = s;

                    if (typeof o === "function") {

                        o(s)

                    }

                })

            } else {

                if (!u.is(":visible") || t) {

                    return

                }

                t = true;

                if (h === "left") {

                    p = {
                        left: 0

                    };



                    d = {
                        left: "-" + l + "px"

                    }

                } else {

                    p = {
                        right: 0

                    };



                    d = {
                        right: "-" + l + "px"

                    }

                }

                v = f.scrollTop();

                f.removeAttr("style").scrollTop(v);

                a.animate(p, c);

                u.animate(d, c, function () {

                    u.removeAttr("style");

                    a.removeAttr("style");

                    e("html").removeAttr("style");

                    t = false;

                    n = false;

                    if (typeof o === "function") {

                        o(s)

                    }

                })

            }

        }

    };



    var i = {
        open: function (e, t) {

            r.execute("open", e, t)

        },
        close: function (e, t) {

            r.execute("close", e, t)

        },
        toogle: function (e, t) {

            r.execute("toogle", e, t)

        }

    };



    e.sidr = function (t) {

        if (i[t]) {

            return i[t].apply(this, Array.prototype.slice.call(arguments, 1))

        } else if (typeof t === "function" || typeof t === "string" || !t) {

            return i.toogle.apply(this, arguments)

        } else {

            e.error("Method " + t + " does not exist on jQuery.sidr")

        }

    };



    e.fn.sidr = function (t) {

        var n = e.extend({
            name: "sidr",
            speed: 200,
            side: "left",
            source: null,
            renaming: true,
            body: "body"

        }, t);

        var s = n.name, o = e("#" + s);

        if (o.length === 0) {

            o = e("<div />").attr("id", s).appendTo(e("body"))

        }

        o.addClass("sidr").addClass(n.side).data({
            speed: n.speed,
            side: n.side,
            body: n.body

        });

        if (typeof n.source === "function") {

            var u = n.source(s);

            r.loadContent(o, u)

        } else if (typeof n.source === "string" && r.isUrl(n.source)) {

            e.get(n.source, function (e) {

                r.loadContent(o, e)

            })

        } else if (typeof n.source === "string") {

            var a = "", f = n.source.split(",");

            e.each(f, function (t, n) {

                a += '<div class="sidr-inner">' + e(n).html() + "</div>"

            });

            if (n.renaming) {

                var l = e("<div />").html(a);

                l.find("*").each(function (t, n) {

                    var i = e(n);

                    r.addPrefix(i)

                });

                a = l.html()

            }

            r.loadContent(o, a)

        } else if (n.source !== null) {

            e.error("Invalid Sidr Source")

        }

        return this.each(function () {

            var t = e(this), n = t.data("sidr");

            if (!n) {

                t.data("sidr", s);

                t.click(function (e) {

                    e.preventDefault();

                    i.toogle(s)

                })

            }

        })

    }

})(jQuery);





// Sticky Plugin

// =============

// Author: Anthony Garand

// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)

// Improvements by Leonardo C. Daronco (daronco)

// Created: 2011-02-14

// Date: 2012-08-30

// Website: http://labs.anthonygarand.com/sticky

// Description: Makes an element on the page stick on the screen as you scroll

//              It will only set the 'top' and 'position' of your element, you

//              might need to adjust the width in some cases.



(function ($) {

    var defaults = {
        topSpacing: 0,
        bottomSpacing: 0,
        elementClassName: "is-sticky",
        wrapperClassName: "sticky-wrapper"

    }, $window = $(window), $document = $(document), sticked = typeof sticked != "undefined" && sticked instanceof Array ? sticked : [];

    windowHeight = $window.height(), scroller = function (forceRefresh) {

        var scrollTop = $window.scrollTop(), documentHeight = $document.height(), dwh = documentHeight - windowHeight, extra = scrollTop > dwh ? dwh - scrollTop : 0;

        for (var i = 0; i < sticked.length; i++) {

            var s = sticked[i], elementTop = s.stickyWrapper.offset().top,
                    etse = elementTop - s.topSpacing - extra;

            if (scrollTop <= etse) {

                if (s.currentTop !== null) {

                    s.stickyElement.css("position", "").css("top", "").removeClass(s.elementClassName);

                    s.stickyElement.parent().removeClass(s.elementClassName);

                    s.currentTop = null

                }

            } else {

                var newTop = documentHeight - s.stickyElement.outerHeight() - s.topSpacing - s.bottomSpacing - scrollTop - extra;

                if (newTop < 0)
                    newTop = newTop + s.topSpacing;
                else
                    newTop = s.topSpacing;

                if (s.currentTop != newTop || forceRefresh == true) {

                    s.stickyElement.css("position", "fixed").css("top",
                            newTop).addClass(s.elementClassName);

                    s.stickyElement.parent().addClass(s.elementClassName);

                    s.currentTop = newTop

                }

            }

        }

    }, resizer = function () {

        windowHeight = $window.height()

    }, methods = {
        init: function (options) {

            var o = $.extend(defaults, options);

            return this.each(function () {

                var stickyElement = $(this);

                stickyId = stickyElement.attr("id");

                wrapper = $("<div></div>").attr("id", stickyId + "-sticky-wrapper").addClass(o.wrapperClassName);

                stickyElement.wrapAll(wrapper);

                var stickyWrapper = stickyElement.parent();

                stickyWrapper.css("height",
                        stickyElement.outerHeight());

                stickyElement.attr("data-position", stickyElement.css("position"));

                stickyElement.attr("data-top", stickyElement.css("top"));

                sticked.push({
                    topSpacing: o.topSpacing,
                    bottomSpacing: o.bottomSpacing,
                    stickyElement: stickyElement,
                    currentTop: null,
                    stickyWrapper: stickyWrapper,
                    elementClassName: o.elementClassName

                });

                scroller(true)

            })

        },
        destroy: function (options) {

            var o = $.extend(defaults, options);

            return this.each(function () {

                var stickyElement = $(this);

                var stickyWrapper = stickyElement.parent();

                stickyElement.css("position", stickyElement.attr("data-position")).css("top", stickyElement.attr("data-top")).removeAttr("data-position").removeAttr("data-top").removeClass(o.elementClassName).unwrap();

                var elementsToRemove = [];

                for (var i = 0; i < sticked.length; i++) {

                    var s = sticked[i];

                    if (s.stickyElement.attr("id") === stickyElement.attr("id"))
                        elementsToRemove.push(i)

                }

                for (var i = 0; i < elementsToRemove.length; i++)
                    sticked.splice(elementsToRemove[i], 1);

                elementsToRemove = null

            })

        },
        update: scroller

    };



    if (window.addEventListener) {

        window.addEventListener("scroll",
                scroller, false);

        window.addEventListener("resize", resizer, false)

    } else if (window.attachEvent) {

        window.attachEvent("onscroll", scroller);

        window.attachEvent("onresize", resizer)

    }

    $.fn.sticky = function (method) {

        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        else if (typeof method === "object" || !method)
            return methods.init.apply(this, arguments);
        else
            $.error("Method " + method + " does not exist on jQuery.sticky")

    };



    $(function () {

        setTimeout(scroller, 0)

    })

})(jQuery);





/*
 
 * jQuery FlexSlider v2.2.2
 
 * Copyright 2012 WooThemes
 
 * Contributing Author: Tyler Smith
 
 */

(function (d) {

    d.flexslider = function (j, l) {

        var a = d(j), c = d.extend({}, d.flexslider.defaults, l), e = c.namespace, q = "ontouchstart"in window || window.DocumentTouch && document instanceof DocumentTouch, u = q ? "touchend" : "click", m = "vertical" === c.direction, n = c.reverse, h = 0 < c.itemWidth, s = "fade" === c.animation, t = "" !== c.asNavFor, f = {};



        d.data(j, "flexslider", a);

        f = {
            init: function () {

                a.animating = !1;

                a.currentSlide = c.startAt;

                a.animatingTo = a.currentSlide;

                a.atEnd = 0 === a.currentSlide || a.currentSlide === a.last;

                a.containerSelector = c.selector.substr(0,
                        c.selector.search(" "));

                a.slides = d(c.selector, a);

                a.container = d(a.containerSelector, a);

                a.count = a.slides.length;

                a.syncExists = 0 < d(c.sync).length;

                "slide" === c.animation && (c.animation = "swing");

                a.prop = m ? "top" : "marginLeft";

                a.args = {};



                a.manualPause = !1;

                var b = a, g;

                if (g = !c.video)
                    if (g = !s)
                        if (g = c.useCSS)
                            a:{

                                g = document.createElement("div");

                                var p = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"], e;

                                for (e in p)
                                    if (void 0 !== g.style[p[e]]) {

                                        a.pfx = p[e].replace("Perspective", "").toLowerCase();

                                        a.prop = "-" + a.pfx + "-transform";

                                        g = !0;

                                        break a

                                    }

                                g = !1

                            }

                b.transitions = g;

                "" !== c.controlsContainer && (a.controlsContainer = 0 < d(c.controlsContainer).length && d(c.controlsContainer));

                "" !== c.manualControls && (a.manualControls = 0 < d(c.manualControls).length && d(c.manualControls));

                c.randomize && (a.slides.sort(function () {

                    return Math.round(Math.random()) - 0.5

                }), a.container.empty().append(a.slides));

                a.doMath();

                t && f.asNav.setup();

                a.setup("init");

                c.controlNav && f.controlNav.setup();

                c.directionNav && f.directionNav.setup();

                c.keyboard &&
                        (1 === d(a.containerSelector).length || c.multipleKeyboard) && d(document).bind("keyup", function (b) {

                    b = b.keyCode;

                    if (!a.animating && (39 === b || 37 === b))
                        b = 39 === b ? a.getTarget("next") : 37 === b ? a.getTarget("prev") : !1, a.flexAnimate(b, c.pauseOnAction)

                });

                c.mousewheel && a.bind("mousewheel", function (b, g) {

                    b.preventDefault();

                    var d = 0 > g ? a.getTarget("next") : a.getTarget("prev");

                    a.flexAnimate(d, c.pauseOnAction)

                });

                c.pausePlay && f.pausePlay.setup();

                c.slideshow && (c.pauseOnHover && a.hover(function () {

                    !a.manualPlay && !a.manualPause && a.pause()

                },
                        function () {

                            !a.manualPause && !a.manualPlay && a.play()

                        }), 0 < c.initDelay ? setTimeout(a.play, c.initDelay) : a.play());

                q && c.touch && f.touch();

                (!s || s && c.smoothHeight) && d(window).bind("resize focus", f.resize);

                setTimeout(function () {

                    c.start(a)

                }, 200)

            },
            asNav: {
                setup: function () {

                    a.asNav = !0;

                    a.animatingTo = Math.floor(a.currentSlide / a.move);

                    a.currentItem = a.currentSlide;

                    a.slides.removeClass(e + "active-slide").eq(a.currentItem).addClass(e + "active-slide");

                    a.slides.click(function (b) {

                        b.preventDefault();

                        b = d(this);

                        var g = b.index();

                        !d(c.asNavFor).data("flexslider").animating && !b.hasClass("active") && (a.direction = a.currentItem < g ? "next" : "prev", a.flexAnimate(g, c.pauseOnAction, !1, !0, !0))

                    })

                }

            },
            controlNav: {
                setup: function () {

                    a.manualControls ? f.controlNav.setupManual() : f.controlNav.setupPaging()

                },
                setupPaging: function () {

                    var b = 1, g;

                    a.controlNavScaffold = d('<ol class="' + e + "control-nav " + e + ("thumbnails" === c.controlNav ? "control-thumbs" : "control-paging") + '"></ol>');

                    if (1 < a.pagingCount)
                        for (var p = 0; p < a.pagingCount; p++)
                            g = "thumbnails" === c.controlNav ?
                                    '<img src="' + a.slides.eq(p).attr("data-thumb") + '"/>' : "<a>" + b + "</a>", a.controlNavScaffold.append("<li>" + g + "</li>"), b++;

                    a.controlsContainer ? d(a.controlsContainer).append(a.controlNavScaffold) : a.append(a.controlNavScaffold);

                    f.controlNav.set();

                    f.controlNav.active();

                    a.controlNavScaffold.delegate("a, img", u, function (b) {

                        b.preventDefault();

                        b = d(this);

                        var g = a.controlNav.index(b);

                        b.hasClass(e + "active") || (a.direction = g > a.currentSlide ? "next" : "prev", a.flexAnimate(g, c.pauseOnAction))

                    });

                    q && a.controlNavScaffold.delegate("a",
                            "click touchstart", function (a) {

                                a.preventDefault()

                            })

                },
                setupManual: function () {

                    a.controlNav = a.manualControls;

                    f.controlNav.active();

                    a.controlNav.live(u, function (b) {

                        b.preventDefault();

                        b = d(this);

                        var g = a.controlNav.index(b);

                        b.hasClass(e + "active") || (g > a.currentSlide ? a.direction = "next" : a.direction = "prev", a.flexAnimate(g, c.pauseOnAction))

                    });

                    q && a.controlNav.live("click touchstart", function (a) {

                        a.preventDefault()

                    })

                },
                set: function () {

                    a.controlNav = d("." + e + "control-nav li " + ("thumbnails" === c.controlNav ? "img" : "a"),
                            a.controlsContainer ? a.controlsContainer : a)

                },
                active: function () {

                    a.controlNav.removeClass(e + "active").eq(a.animatingTo).addClass(e + "active")

                },
                update: function (b, c) {

                    1 < a.pagingCount && "add" === b ? a.controlNavScaffold.append(d("<li><a>" + a.count + "</a></li>")) : 1 === a.pagingCount ? a.controlNavScaffold.find("li").remove() : a.controlNav.eq(c).closest("li").remove();

                    f.controlNav.set();

                    1 < a.pagingCount && a.pagingCount !== a.controlNav.length ? a.update(c, b) : f.controlNav.active()

                }

            },
            directionNav: {
                setup: function () {

                    var b = d('<ul class="' +
                            e + 'direction-nav"><li><a class="' + e + 'prev" href="#">' + c.prevText + '</a></li><li><a class="' + e + 'next" href="#">' + c.nextText + "</a></li></ul>");

                    a.controlsContainer ? (d(a.controlsContainer).append(b), a.directionNav = d("." + e + "direction-nav li a", a.controlsContainer)) : (a.append(b), a.directionNav = d("." + e + "direction-nav li a", a));

                    f.directionNav.update();

                    a.directionNav.bind(u, function (b) {

                        b.preventDefault();

                        b = d(this).hasClass(e + "next") ? a.getTarget("next") : a.getTarget("prev");

                        a.flexAnimate(b, c.pauseOnAction)

                    });

                    q && a.directionNav.bind("click touchstart", function (a) {

                        a.preventDefault()

                    })

                },
                update: function () {

                    var b = e + "disabled";

                    1 === a.pagingCount ? a.directionNav.addClass(b) : c.animationLoop ? a.directionNav.removeClass(b) : 0 === a.animatingTo ? a.directionNav.removeClass(b).filter("." + e + "prev").addClass(b) : a.animatingTo === a.last ? a.directionNav.removeClass(b).filter("." + e + "next").addClass(b) : a.directionNav.removeClass(b)

                }

            },
            pausePlay: {
                setup: function () {

                    var b = d('<div class="' + e + 'pauseplay"><a></a></div>');

                    a.controlsContainer ?
                            (a.controlsContainer.append(b), a.pausePlay = d("." + e + "pauseplay a", a.controlsContainer)) : (a.append(b), a.pausePlay = d("." + e + "pauseplay a", a));

                    f.pausePlay.update(c.slideshow ? e + "pause" : e + "play");

                    a.pausePlay.bind(u, function (b) {

                        b.preventDefault();

                        d(this).hasClass(e + "pause") ? (a.manualPause = !0, a.manualPlay = !1, a.pause()) : (a.manualPause = !1, a.manualPlay = !0, a.play())

                    });

                    q && a.pausePlay.bind("click touchstart", function (a) {

                        a.preventDefault()

                    })

                },
                update: function (b) {

                    "play" === b ? a.pausePlay.removeClass(e + "pause").addClass(e +
                            "play").text(c.playText) : a.pausePlay.removeClass(e + "play").addClass(e + "pause").text(c.pauseText)

                }

            },
            touch: function () {

                function b(b) {

                    k = m ? d - b.touches[0].pageY : d - b.touches[0].pageX;

                    q = m ? Math.abs(k) < Math.abs(b.touches[0].pageX - e) : Math.abs(k) < Math.abs(b.touches[0].pageY - e);

                    if (!q || 500 < Number(new Date) - l)
                        b.preventDefault(), !s && a.transitions && (c.animationLoop || (k /= 0 === a.currentSlide && 0 > k || a.currentSlide === a.last && 0 < k ? Math.abs(k) / r + 2 : 1), a.setProps(f + k, "setTouch"))

                }

                function g() {

                    j.removeEventListener("touchmove",
                            b, !1);

                    if (a.animatingTo === a.currentSlide && !q && null !== k) {

                        var h = n ? -k : k, m = 0 < h ? a.getTarget("next") : a.getTarget("prev");

                        a.canAdvance(m) && (550 > Number(new Date) - l && 50 < Math.abs(h) || Math.abs(h) > r / 2) ? a.flexAnimate(m, c.pauseOnAction) : s || a.flexAnimate(a.currentSlide, c.pauseOnAction, !0)

                    }

                    j.removeEventListener("touchend", g, !1);

                    f = k = e = d = null

                }

                var d, e, f, r, k, l, q = !1;

                j.addEventListener("touchstart", function (k) {

                    a.animating ? k.preventDefault() : 1 === k.touches.length && (a.pause(), r = m ? a.h : a.w, l = Number(new Date), f = h && n && a.animatingTo ===
                            a.last ? 0 : h && n ? a.limit - (a.itemW + c.itemMargin) * a.move * a.animatingTo : h && a.currentSlide === a.last ? a.limit : h ? (a.itemW + c.itemMargin) * a.move * a.currentSlide : n ? (a.last - a.currentSlide + a.cloneOffset) * r : (a.currentSlide + a.cloneOffset) * r, d = m ? k.touches[0].pageY : k.touches[0].pageX, e = m ? k.touches[0].pageX : k.touches[0].pageY, j.addEventListener("touchmove", b, !1), j.addEventListener("touchend", g, !1))

                }, !1)

            },
            resize: function () {

                !a.animating && a.is(":visible") && (h || a.doMath(), s ? f.smoothHeight() : h ? (a.slides.width(a.computedW),
                        a.update(a.pagingCount), a.setProps()) : m ? (a.viewport.height(a.h), a.setProps(a.h, "setTotal")) : (c.smoothHeight && f.smoothHeight(), a.newSlides.width(a.computedW), a.setProps(a.computedW, "setTotal")))

            },
            smoothHeight: function (b) {

                if (!m || s) {

                    var c = s ? a : a.viewport;

                    b ? c.animate({
                        height: a.slides.eq(a.animatingTo).height()

                    }, b) : c.height(a.slides.eq(a.animatingTo).height())

                }

            },
            sync: function (b) {

                var g = d(c.sync).data("flexslider"), e = a.animatingTo;

                switch (b) {

                    case "animate":

                        g.flexAnimate(e, c.pauseOnAction, !1, !0);

                        break;

                    case "play":

                        !g.playing &&
                                !g.asNav && g.play();

                        break;

                    case "pause":

                        g.pause()

                }

            }

        };



        a.flexAnimate = function (b, g, p, j, l) {

            t && 1 === a.pagingCount && (a.direction = a.currentItem < b ? "next" : "prev");

            if (!a.animating && (a.canAdvance(b, l) || p) && a.is(":visible")) {

                if (t && j)
                    if (p = d(c.asNavFor).data("flexslider"), a.atEnd = 0 === b || b === a.count - 1, p.flexAnimate(b, !0, !1, !0, l), a.direction = a.currentItem < b ? "next" : "prev", p.direction = a.direction, Math.ceil((b + 1) / a.visible) - 1 !== a.currentSlide && 0 !== b)
                        a.currentItem = b, a.slides.removeClass(e + "active-slide").eq(b).addClass(e +
                                "active-slide"), b = Math.floor(b / a.visible);
                    else
                        return a.currentItem = b, a.slides.removeClass(e + "active-slide").eq(b).addClass(e + "active-slide"), !1;

                a.animating = !0;

                a.animatingTo = b;

                c.before(a);

                g && a.pause();

                a.syncExists && !l && f.sync("animate");

                c.controlNav && f.controlNav.active();

                h || a.slides.removeClass(e + "active-slide").eq(b).addClass(e + "active-slide");

                a.atEnd = 0 === b || b === a.last;

                c.directionNav && f.directionNav.update();

                b === a.last && (c.end(a), c.animationLoop || a.pause());

                if (s)
                    q ? (a.slides.eq(a.currentSlide).css({
                        opacity: 0,
                        zIndex: 1

                    }), a.slides.eq(b).css({
                        opacity: 1,
                        zIndex: 2

                    }), a.slides.unbind("webkitTransitionEnd transitionend"), a.slides.eq(a.currentSlide).bind("webkitTransitionEnd transitionend", function () {

                        c.after(a)

                    }), a.animating = !1, a.currentSlide = a.animatingTo) : (a.slides.eq(a.currentSlide).fadeOut(c.animationSpeed, c.easing), a.slides.eq(b).fadeIn(c.animationSpeed, c.easing, a.wrapup));

                else {

                    var r = m ? a.slides.filter(":first").height() : a.computedW;

                    h ? (b = c.itemWidth > a.w ? 2 * c.itemMargin : c.itemMargin, b = (a.itemW + b) * a.move * a.animatingTo,
                            b = b > a.limit && 1 !== a.visible ? a.limit : b) : b = 0 === a.currentSlide && b === a.count - 1 && c.animationLoop && "next" !== a.direction ? n ? (a.count + a.cloneOffset) * r : 0 : a.currentSlide === a.last && 0 === b && c.animationLoop && "prev" !== a.direction ? n ? 0 : (a.count + 1) * r : n ? (a.count - 1 - b + a.cloneOffset) * r : (b + a.cloneOffset) * r;

                    a.setProps(b, "", c.animationSpeed);

                    if (a.transitions) {

                        if (!c.animationLoop || !a.atEnd)
                            a.animating = !1, a.currentSlide = a.animatingTo;

                        a.container.unbind("webkitTransitionEnd transitionend");

                        a.container.bind("webkitTransitionEnd transitionend",
                                function () {

                                    a.wrapup(r)

                                })

                    } else
                        a.container.animate(a.args, c.animationSpeed, c.easing, function () {

                            a.wrapup(r)

                        })

                }

                c.smoothHeight && f.smoothHeight(c.animationSpeed)

            }

        };



        a.wrapup = function (b) {

            !s && !h && (0 === a.currentSlide && a.animatingTo === a.last && c.animationLoop ? a.setProps(b, "jumpEnd") : a.currentSlide === a.last && (0 === a.animatingTo && c.animationLoop) && a.setProps(b, "jumpStart"));

            a.animating = !1;

            a.currentSlide = a.animatingTo;

            c.after(a)

        };



        a.animateSlides = function () {

            a.animating || a.flexAnimate(a.getTarget("next"))

        };



        a.pause =
                function () {

                    clearInterval(a.animatedSlides);

                    a.playing = !1;

                    c.pausePlay && f.pausePlay.update("play");

                    a.syncExists && f.sync("pause")

                };



        a.play = function () {

            a.animatedSlides = setInterval(a.animateSlides, c.slideshowSpeed);

            a.playing = !0;

            c.pausePlay && f.pausePlay.update("pause");

            a.syncExists && f.sync("play")

        };



        a.canAdvance = function (b, g) {

            var d = t ? a.pagingCount - 1 : a.last;

            return g ? !0 : t && a.currentItem === a.count - 1 && 0 === b && "prev" === a.direction ? !0 : t && 0 === a.currentItem && b === a.pagingCount - 1 && "next" !== a.direction ? !1 : b === a.currentSlide &&
                    !t ? !1 : c.animationLoop ? !0 : a.atEnd && 0 === a.currentSlide && b === d && "next" !== a.direction ? !1 : a.atEnd && a.currentSlide === d && 0 === b && "next" === a.direction ? !1 : !0

        };



        a.getTarget = function (b) {

            a.direction = b;

            return"next" === b ? a.currentSlide === a.last ? 0 : a.currentSlide + 1 : 0 === a.currentSlide ? a.last : a.currentSlide - 1

        };



        a.setProps = function (b, g, d) {

            var e, f = b ? b : (a.itemW + c.itemMargin) * a.move * a.animatingTo;

            e = -1 * function () {

                if (h)
                    return"setTouch" === g ? b : n && a.animatingTo === a.last ? 0 : n ? a.limit - (a.itemW + c.itemMargin) * a.move * a.animatingTo : a.animatingTo ===
                            a.last ? a.limit : f;

                switch (g) {

                    case "setTotal":

                        return n ? (a.count - 1 - a.currentSlide + a.cloneOffset) * b : (a.currentSlide + a.cloneOffset) * b;

                    case "setTouch":

                        return b;

                    case "jumpEnd":

                        return n ? b : a.count * b;

                    case "jumpStart":

                        return n ? a.count * b : b;

                    default:

                        return b

                }

            }() + "px";

            a.transitions && (e = m ? "translate3d(0," + e + ",0)" : "translate3d(" + e + ",0,0)", d = void 0 !== d ? d / 1E3 + "s" : "0s", a.container.css("-" + a.pfx + "-transition-duration", d));

            a.args[a.prop] = e;

            (a.transitions || void 0 === d) && a.container.css(a.args)

        };



        a.setup = function (b) {

            if (s)
                a.slides.css({
                    width: "100%",
                    "float": "left",
                    marginRight: "-100%",
                    position: "relative"

                }), "init" === b && (q ? a.slides.css({
                    opacity: 0,
                    display: "block",
                    webkitTransition: "opacity " + c.animationSpeed / 1E3 + "s ease",
                    zIndex: 1

                }).eq(a.currentSlide).css({
                    opacity: 1,
                    zIndex: 2

                }) : a.slides.eq(a.currentSlide).fadeIn(c.animationSpeed, c.easing)), c.smoothHeight && f.smoothHeight();

            else {

                var g, p;

                "init" === b && (a.viewport = d('<div class="' + e + 'viewport"></div>').css({
                    overflow: "hidden",
                    position: "relative"

                }).appendTo(a).append(a.container), a.cloneCount = 0, a.cloneOffset =
                        0, n && (p = d.makeArray(a.slides).reverse(), a.slides = d(p), a.container.empty().append(a.slides)));

                c.animationLoop && !h && (a.cloneCount = 2, a.cloneOffset = 1, "init" !== b && a.container.find(".clone").remove(), a.container.append(a.slides.first().clone().addClass("clone")).prepend(a.slides.last().clone().addClass("clone")));

                a.newSlides = d(c.selector, a);

                g = n ? a.count - 1 - a.currentSlide + a.cloneOffset : a.currentSlide + a.cloneOffset;

                m && !h ? (a.container.height(200 * (a.count + a.cloneCount) + "%").css("position", "absolute").width("100%"),
                        setTimeout(function () {

                            a.newSlides.css({
                                display: "block"

                            });

                            a.doMath();

                            a.viewport.height(a.h);

                            a.setProps(g * a.h, "init")

                        }, "init" === b ? 100 : 0)) : (a.container.width(200 * (a.count + a.cloneCount) + "%"), a.setProps(g * a.computedW, "init"), setTimeout(function () {

                    a.doMath();

                    a.newSlides.css({
                        width: a.computedW,
                        "float": "left",
                        display: "block"

                    });

                    c.smoothHeight && f.smoothHeight()

                }, "init" === b ? 100 : 0))

            }

            h || a.slides.removeClass(e + "active-slide").eq(a.currentSlide).addClass(e + "active-slide")

        };



        a.doMath = function () {

            var b = a.slides.first(),
                    d = c.itemMargin, e = c.minItems, f = c.maxItems;

            a.w = a.width();

            a.h = b.height();

            a.boxPadding = b.outerWidth() - b.width();

            h ? (a.itemT = c.itemWidth + d, a.minW = e ? e * a.itemT : a.w, a.maxW = f ? f * a.itemT : a.w, a.itemW = a.minW > a.w ? (a.w - d * e) / e : a.maxW < a.w ? (a.w - d * f) / f : c.itemWidth > a.w ? a.w : c.itemWidth, a.visible = Math.floor(a.w / (a.itemW + d)), a.move = 0 < c.move && c.move < a.visible ? c.move : a.visible, a.pagingCount = Math.ceil((a.count - a.visible) / a.move + 1), a.last = a.pagingCount - 1, a.limit = 1 === a.pagingCount ? 0 : c.itemWidth > a.w ? (a.itemW + 2 * d) * a.count - a.w -
                    d : (a.itemW + d) * a.count - a.w - d) : (a.itemW = a.w, a.pagingCount = a.count, a.last = a.count - 1);

            a.computedW = a.itemW - a.boxPadding

        };



        a.update = function (b, d) {

            a.doMath();

            h || (b < a.currentSlide ? a.currentSlide += 1 : b <= a.currentSlide && 0 !== b && (a.currentSlide -= 1), a.animatingTo = a.currentSlide);

            if (c.controlNav && !a.manualControls)
                if ("add" === d && !h || a.pagingCount > a.controlNav.length)
                    f.controlNav.update("add");

                else if ("remove" === d && !h || a.pagingCount < a.controlNav.length)
                    h && a.currentSlide > a.last && (a.currentSlide -= 1, a.animatingTo -= 1),
                            f.controlNav.update("remove", a.last);

            c.directionNav && f.directionNav.update()

        };



        a.addSlide = function (b, e) {

            var f = d(b);

            a.count += 1;

            a.last = a.count - 1;

            m && n ? void 0 !== e ? a.slides.eq(a.count - e).after(f) : a.container.prepend(f) : void 0 !== e ? a.slides.eq(e).before(f) : a.container.append(f);

            a.update(e, "add");

            a.slides = d(c.selector + ":not(.clone)", a);

            a.setup();

            c.added(a)

        };



        a.removeSlide = function (b) {

            var e = isNaN(b) ? a.slides.index(d(b)) : b;

            a.count -= 1;

            a.last = a.count - 1;

            isNaN(b) ? d(b, a.slides).remove() : m && n ? a.slides.eq(a.last).remove() :
                    a.slides.eq(b).remove();

            a.doMath();

            a.update(e, "remove");

            a.slides = d(c.selector + ":not(.clone)", a);

            a.setup();

            c.removed(a)

        };



        f.init()

    };



    d.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: !1,
        animationLoop: !0,
        smoothHeight: !1,
        startAt: 0,
        slideshow: !0,
        slideshowSpeed: 7E3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: !1,
        pauseOnAction: !0,
        pauseOnHover: !1,
        useCSS: !0,
        touch: !0,
        video: !1,
        controlNav: !0,
        directionNav: !0,
        prevText: "Previous",
        nextText: "Next",
        keyboard: !0,
        multipleKeyboard: !1,
        mousewheel: !1,
        pausePlay: !1,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 0,
        maxItems: 0,
        move: 0,
        start: function () {
        },
        before: function () {
        },
        after: function () {
        },
        end: function () {
        },
        added: function () {
        },
        removed: function () {
        }

    };



    d.fn.flexslider = function (j) {

        void 0 === j && (j = {});

        if ("object" === typeof j)
            return this.each(function () {

                var a = d(this), c = a.find(j.selector ? j.selector : ".slides > li");

                1 === c.length ? (c.fadeIn(400),
                        j.start && j.start(a)) : void 0 == a.data("flexslider") && new d.flexslider(this, j)

            });

        var l = d(this).data("flexslider");

        switch (j) {

            case "play":

                l.play();

                break;

            case "pause":

                l.pause();

                break;

            case "next":

                l.flexAnimate(l.getTarget("next"), !0);

                break;

            case "prev":
            case "previous":

                l.flexAnimate(l.getTarget("prev"), !0);

                break;

            default:

                "number" === typeof j && l.flexAnimate(j, !0)

        }

    }

})(jQuery);


/*!
 * Isotope PACKAGED v2.0.0
 * Filter & sort magical layouts
 * http://isotope.metafizzy.co
 */

(function (t) {
    function e() {
    }
    function i(t) {
        function i(e) {
            e.prototype.option || (e.prototype.option = function (e) {
                t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e))
            })
        }
        function n(e, i) {
            t.fn[e] = function (n) {
                if ("string" == typeof n) {
                    for (var s = o.call(arguments, 1), a = 0, u = this.length; u > a; a++) {
                        var p = this[a], h = t.data(p, e);
                        if (h)
                            if (t.isFunction(h[n]) && "_" !== n.charAt(0)) {
                                var f = h[n].apply(h, s);
                                if (void 0 !== f)
                                    return f
                            } else
                                r("no such method '" + n + "' for " + e + " instance");
                        else
                            r("cannot call methods on " + e + " prior to initialization; " + "attempted to call '" + n + "'")
                    }
                    return this
                }
                return this.each(function () {
                    var o = t.data(this, e);
                    o ? (o.option(n), o._init()) : (o = new i(this, n), t.data(this, e, o))
                })
            }
        }
        if (t) {
            var r = "undefined" == typeof console ? e : function (t) {
                console.error(t)
            };
            return t.bridget = function (t, e) {
                i(e), n(t, e)
            }, t.bridget
        }
    }
    var o = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], i) : i(t.jQuery)
})(window), function (t) {
    function e(e) {
        var i = t.event;
        return i.target = i.target || i.srcElement || e, i
    }
    var i = document.documentElement, o = function () {
    };
    i.addEventListener ? o = function (t, e, i) {
        t.addEventListener(e, i, !1)
    } : i.attachEvent && (o = function (t, i, o) {
        t[i + o] = o.handleEvent ? function () {
            var i = e(t);
            o.handleEvent.call(o, i)
        } : function () {
            var i = e(t);
            o.call(t, i)
        }, t.attachEvent("on" + i, t[i + o])
    });
    var n = function () {
    };
    i.removeEventListener ? n = function (t, e, i) {
        t.removeEventListener(e, i, !1)
    } : i.detachEvent && (n = function (t, e, i) {
        t.detachEvent("on" + e, t[e + i]);
        try {
            delete t[e + i]
        } catch (o) {
            t[e + i] = void 0
        }
    });
    var r = {bind: o, unbind: n};
    "function" == typeof define && define.amd ? define("eventie/eventie", r) : "object" == typeof exports ? module.exports = r : t.eventie = r
}(this), function (t) {
    function e(t) {
        "function" == typeof t && (e.isReady ? t() : r.push(t))
    }
    function i(t) {
        var i = "readystatechange" === t.type && "complete" !== n.readyState;
        if (!e.isReady && !i) {
            e.isReady = !0;
            for (var o = 0, s = r.length; s > o; o++) {
                var a = r[o];
                a()
            }
        }
    }
    function o(o) {
        return o.bind(n, "DOMContentLoaded", i), o.bind(n, "readystatechange", i), o.bind(t, "load", i), e
    }
    var n = t.document, r = [];
    e.isReady = !1, "function" == typeof define && define.amd ? (e.isReady = "function" == typeof requirejs, define("doc-ready/doc-ready", ["eventie/eventie"], o)) : t.docReady = o(t.eventie)
}(this), function () {
    function t() {
    }
    function e(t, e) {
        for (var i = t.length; i--; )
            if (t[i].listener === e)
                return i;
        return -1
    }
    function i(t) {
        return function () {
            return this[t].apply(this, arguments)
        }
    }
    var o = t.prototype, n = this, r = n.EventEmitter;
    o.getListeners = function (t) {
        var e, i, o = this._getEvents();
        if (t instanceof RegExp) {
            e = {};
            for (i in o)
                o.hasOwnProperty(i) && t.test(i) && (e[i] = o[i])
        } else
            e = o[t] || (o[t] = []);
        return e
    }, o.flattenListeners = function (t) {
        var e, i = [];
        for (e = 0; t.length > e; e += 1)
            i.push(t[e].listener);
        return i
    }, o.getListenersAsObject = function (t) {
        var e, i = this.getListeners(t);
        return i instanceof Array && (e = {}, e[t] = i), e || i
    }, o.addListener = function (t, i) {
        var o, n = this.getListenersAsObject(t), r = "object" == typeof i;
        for (o in n)
            n.hasOwnProperty(o) && -1 === e(n[o], i) && n[o].push(r ? i : {listener: i, once: !1});
        return this
    }, o.on = i("addListener"), o.addOnceListener = function (t, e) {
        return this.addListener(t, {listener: e, once: !0})
    }, o.once = i("addOnceListener"), o.defineEvent = function (t) {
        return this.getListeners(t), this
    }, o.defineEvents = function (t) {
        for (var e = 0; t.length > e; e += 1)
            this.defineEvent(t[e]);
        return this
    }, o.removeListener = function (t, i) {
        var o, n, r = this.getListenersAsObject(t);
        for (n in r)
            r.hasOwnProperty(n) && (o = e(r[n], i), -1 !== o && r[n].splice(o, 1));
        return this
    }, o.off = i("removeListener"), o.addListeners = function (t, e) {
        return this.manipulateListeners(!1, t, e)
    }, o.removeListeners = function (t, e) {
        return this.manipulateListeners(!0, t, e)
    }, o.manipulateListeners = function (t, e, i) {
        var o, n, r = t ? this.removeListener : this.addListener, s = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
            for (o = i.length; o--; )
                r.call(this, e, i[o]);
        else
            for (o in e)
                e.hasOwnProperty(o) && (n = e[o]) && ("function" == typeof n ? r.call(this, o, n) : s.call(this, o, n));
        return this
    }, o.removeEvent = function (t) {
        var e, i = typeof t, o = this._getEvents();
        if ("string" === i)
            delete o[t];
        else if (t instanceof RegExp)
            for (e in o)
                o.hasOwnProperty(e) && t.test(e) && delete o[e];
        else
            delete this._events;
        return this
    }, o.removeAllListeners = i("removeEvent"), o.emitEvent = function (t, e) {
        var i, o, n, r, s = this.getListenersAsObject(t);
        for (n in s)
            if (s.hasOwnProperty(n))
                for (o = s[n].length; o--; )
                    i = s[n][o], i.once === !0 && this.removeListener(t, i.listener), r = i.listener.apply(this, e || []), r === this._getOnceReturnValue() && this.removeListener(t, i.listener);
        return this
    }, o.trigger = i("emitEvent"), o.emit = function (t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e)
    }, o.setOnceReturnValue = function (t) {
        return this._onceReturnValue = t, this
    }, o._getOnceReturnValue = function () {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, o._getEvents = function () {
        return this._events || (this._events = {})
    }, t.noConflict = function () {
        return n.EventEmitter = r, t
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function () {
        return t
    }) : "object" == typeof module && module.exports ? module.exports = t : this.EventEmitter = t
}.call(this), function (t) {
    function e(t) {
        if (t) {
            if ("string" == typeof o[t])
                return t;
            t = t.charAt(0).toUpperCase() + t.slice(1);
            for (var e, n = 0, r = i.length; r > n; n++)
                if (e = i[n] + t, "string" == typeof o[e])
                    return e
        }
    }
    var i = "Webkit Moz ms Ms O".split(" "), o = document.documentElement.style;
    "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function () {
        return e
    }) : "object" == typeof exports ? module.exports = e : t.getStyleProperty = e
}(window), function (t) {
    function e(t) {
        var e = parseFloat(t), i = -1 === t.indexOf("%") && !isNaN(e);
        return i && e
    }
    function i() {
        for (var t = {width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0}, e = 0, i = s.length; i > e; e++) {
            var o = s[e];
            t[o] = 0
        }
        return t
    }
    function o(t) {
        function o(t) {
            if ("string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
                var o = r(t);
                if ("none" === o.display)
                    return i();
                var n = {};
                n.width = t.offsetWidth, n.height = t.offsetHeight;
                for (var h = n.isBorderBox = !(!p || !o[p] || "border-box" !== o[p]), f = 0, c = s.length; c > f; f++) {
                    var d = s[f], l = o[d];
                    l = a(t, l);
                    var y = parseFloat(l);
                    n[d] = isNaN(y) ? 0 : y
                }
                var m = n.paddingLeft + n.paddingRight, g = n.paddingTop + n.paddingBottom, v = n.marginLeft + n.marginRight, _ = n.marginTop + n.marginBottom, I = n.borderLeftWidth + n.borderRightWidth, L = n.borderTopWidth + n.borderBottomWidth, z = h && u, S = e(o.width);
                S !== !1 && (n.width = S + (z ? 0 : m + I));
                var b = e(o.height);
                return b !== !1 && (n.height = b + (z ? 0 : g + L)), n.innerWidth = n.width - (m + I), n.innerHeight = n.height - (g + L), n.outerWidth = n.width + v, n.outerHeight = n.height + _, n
            }
        }
        function a(t, e) {
            if (n || -1 === e.indexOf("%"))
                return e;
            var i = t.style, o = i.left, r = t.runtimeStyle, s = r && r.left;
            return s && (r.left = t.currentStyle.left), i.left = e, e = i.pixelLeft, i.left = o, s && (r.left = s), e
        }
        var u, p = t("boxSizing");
        return function () {
            if (p) {
                var t = document.createElement("div");
                t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[p] = "border-box";
                var i = document.body || document.documentElement;
                i.appendChild(t);
                var o = r(t);
                u = 200 === e(o.width), i.removeChild(t)
            }
        }(), o
    }
    var n = t.getComputedStyle, r = n ? function (t) {
        return n(t, null)
    } : function (t) {
        return t.currentStyle
    }, s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
    "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], o) : "object" == typeof exports ? module.exports = o(require("get-style-property")) : t.getSize = o(t.getStyleProperty)
}(window), function (t, e) {
    function i(t, e) {
        return t[a](e)
    }
    function o(t) {
        if (!t.parentNode) {
            var e = document.createDocumentFragment();
            e.appendChild(t)
        }
    }
    function n(t, e) {
        o(t);
        for (var i = t.parentNode.querySelectorAll(e), n = 0, r = i.length; r > n; n++)
            if (i[n] === t)
                return!0;
        return!1
    }
    function r(t, e) {
        return o(t), i(t, e)
    }
    var s, a = function () {
        if (e.matchesSelector)
            return"matchesSelector";
        for (var t = ["webkit", "moz", "ms", "o"], i = 0, o = t.length; o > i; i++) {
            var n = t[i], r = n + "MatchesSelector";
            if (e[r])
                return r
        }
    }();
    if (a) {
        var u = document.createElement("div"), p = i(u, "div");
        s = p ? i : r
    } else
        s = n;
    "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function () {
        return s
    }) : window.matchesSelector = s
}(this, Element.prototype), function (t) {
    function e(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    function i(t) {
        for (var e in t)
            return!1;
        return e = null, !0
    }
    function o(t) {
        return t.replace(/([A-Z])/g, function (t) {
            return"-" + t.toLowerCase()
        })
    }
    function n(t, n, r) {
        function a(t, e) {
            t && (this.element = t, this.layout = e, this.position = {x: 0, y: 0}, this._create())
        }
        var u = r("transition"), p = r("transform"), h = u && p, f = !!r("perspective"), c = {WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "otransitionend", transition: "transitionend"}[u], d = ["transform", "transition", "transitionDuration", "transitionProperty"], l = function () {
            for (var t = {}, e = 0, i = d.length; i > e; e++) {
                var o = d[e], n = r(o);
                n && n !== o && (t[o] = n)
            }
            return t
        }();
        e(a.prototype, t.prototype), a.prototype._create = function () {
            this._transn = {ingProperties: {}, clean: {}, onEnd: {}}, this.css({position: "absolute"})
        }, a.prototype.handleEvent = function (t) {
            var e = "on" + t.type;
            this[e] && this[e](t)
        }, a.prototype.getSize = function () {
            this.size = n(this.element)
        }, a.prototype.css = function (t) {
            var e = this.element.style;
            for (var i in t) {
                var o = l[i] || i;
                e[o] = t[i]
            }
        }, a.prototype.getPosition = function () {
            var t = s(this.element), e = this.layout.options, i = e.isOriginLeft, o = e.isOriginTop, n = parseInt(t[i ? "left" : "right"], 10), r = parseInt(t[o ? "top" : "bottom"], 10);
            n = isNaN(n) ? 0 : n, r = isNaN(r) ? 0 : r;
            var a = this.layout.size;
            n -= i ? a.paddingLeft : a.paddingRight, r -= o ? a.paddingTop : a.paddingBottom, this.position.x = n, this.position.y = r
        }, a.prototype.layoutPosition = function () {
            var t = this.layout.size, e = this.layout.options, i = {};
            e.isOriginLeft ? (i.left = this.position.x + t.paddingLeft + "px", i.right = "") : (i.right = this.position.x + t.paddingRight + "px", i.left = ""), e.isOriginTop ? (i.top = this.position.y + t.paddingTop + "px", i.bottom = "") : (i.bottom = this.position.y + t.paddingBottom + "px", i.top = ""), this.css(i), this.emitEvent("layout", [this])
        };
        var y = f ? function (t, e) {
            return"translate3d(" + t + "px, " + e + "px, 0)"
        } : function (t, e) {
            return"translate(" + t + "px, " + e + "px)"
        };
        a.prototype._transitionTo = function (t, e) {
            this.getPosition();
            var i = this.position.x, o = this.position.y, n = parseInt(t, 10), r = parseInt(e, 10), s = n === this.position.x && r === this.position.y;
            if (this.setPosition(t, e), s && !this.isTransitioning)
                return this.layoutPosition(), void 0;
            var a = t - i, u = e - o, p = {}, h = this.layout.options;
            a = h.isOriginLeft ? a : -a, u = h.isOriginTop ? u : -u, p.transform = y(a, u), this.transition({to: p, onTransitionEnd: {transform: this.layoutPosition}, isCleaning: !0})
        }, a.prototype.goTo = function (t, e) {
            this.setPosition(t, e), this.layoutPosition()
        }, a.prototype.moveTo = h ? a.prototype._transitionTo : a.prototype.goTo, a.prototype.setPosition = function (t, e) {
            this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
        }, a.prototype._nonTransition = function (t) {
            this.css(t.to), t.isCleaning && this._removeStyles(t.to);
            for (var e in t.onTransitionEnd)
                t.onTransitionEnd[e].call(this)
        }, a.prototype._transition = function (t) {
            if (!parseFloat(this.layout.options.transitionDuration))
                return this._nonTransition(t), void 0;
            var e = this._transn;
            for (var i in t.onTransitionEnd)
                e.onEnd[i] = t.onTransitionEnd[i];
            for (i in t.to)
                e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
            if (t.from) {
                this.css(t.from);
                var o = this.element.offsetHeight;
                o = null
            }
            this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
        };
        var m = p && o(p) + ",opacity";
        a.prototype.enableTransition = function () {
            this.isTransitioning || (this.css({transitionProperty: m, transitionDuration: this.layout.options.transitionDuration}), this.element.addEventListener(c, this, !1))
        }, a.prototype.transition = a.prototype[u ? "_transition" : "_nonTransition"], a.prototype.onwebkitTransitionEnd = function (t) {
            this.ontransitionend(t)
        }, a.prototype.onotransitionend = function (t) {
            this.ontransitionend(t)
        };
        var g = {"-webkit-transform": "transform", "-moz-transform": "transform", "-o-transform": "transform"};
        a.prototype.ontransitionend = function (t) {
            if (t.target === this.element) {
                var e = this._transn, o = g[t.propertyName] || t.propertyName;
                if (delete e.ingProperties[o], i(e.ingProperties) && this.disableTransition(), o in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[o]), o in e.onEnd) {
                    var n = e.onEnd[o];
                    n.call(this), delete e.onEnd[o]
                }
                this.emitEvent("transitionEnd", [this])
            }
        }, a.prototype.disableTransition = function () {
            this.removeTransitionStyles(), this.element.removeEventListener(c, this, !1), this.isTransitioning = !1
        }, a.prototype._removeStyles = function (t) {
            var e = {};
            for (var i in t)
                e[i] = "";
            this.css(e)
        };
        var v = {transitionProperty: "", transitionDuration: ""};
        return a.prototype.removeTransitionStyles = function () {
            this.css(v)
        }, a.prototype.removeElem = function () {
            this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
        }, a.prototype.remove = function () {
            if (!u || !parseFloat(this.layout.options.transitionDuration))
                return this.removeElem(), void 0;
            var t = this;
            this.on("transitionEnd", function () {
                return t.removeElem(), !0
            }), this.hide()
        }, a.prototype.reveal = function () {
            delete this.isHidden, this.css({display: ""});
            var t = this.layout.options;
            this.transition({from: t.hiddenStyle, to: t.visibleStyle, isCleaning: !0})
        }, a.prototype.hide = function () {
            this.isHidden = !0, this.css({display: ""});
            var t = this.layout.options;
            this.transition({from: t.visibleStyle, to: t.hiddenStyle, isCleaning: !0, onTransitionEnd: {opacity: function () {
                        this.isHidden && this.css({display: "none"})
                    }}})
        }, a.prototype.destroy = function () {
            this.css({position: "", left: "", right: "", top: "", bottom: "", transition: "", transform: ""})
        }, a
    }
    var r = t.getComputedStyle, s = r ? function (t) {
        return r(t, null)
    } : function (t) {
        return t.currentStyle
    };
    "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property"], n) : (t.Outlayer = {}, t.Outlayer.Item = n(t.EventEmitter, t.getSize, t.getStyleProperty))
}(window), function (t) {
    function e(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    function i(t) {
        return"[object Array]" === f.call(t)
    }
    function o(t) {
        var e = [];
        if (i(t))
            e = t;
        else if (t && "number" == typeof t.length)
            for (var o = 0, n = t.length; n > o; o++)
                e.push(t[o]);
        else
            e.push(t);
        return e
    }
    function n(t, e) {
        var i = d(e, t);
        -1 !== i && e.splice(i, 1)
    }
    function r(t) {
        return t.replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + "-" + i
        }).toLowerCase()
    }
    function s(i, s, f, d, l, y) {
        function m(t, i) {
            if ("string" == typeof t && (t = a.querySelector(t)), !t || !c(t))
                return u && u.error("Bad " + this.constructor.namespace + " element: " + t), void 0;
            this.element = t, this.options = e({}, this.constructor.defaults), this.option(i);
            var o = ++g;
            this.element.outlayerGUID = o, v[o] = this, this._create(), this.options.isInitLayout && this.layout()
        }
        var g = 0, v = {};
        return m.namespace = "outlayer", m.Item = y, m.defaults = {containerStyle: {position: "relative"}, isInitLayout: !0, isOriginLeft: !0, isOriginTop: !0, isResizeBound: !0, isResizingContainer: !0, transitionDuration: "0.4s", hiddenStyle: {opacity: 0, transform: "scale(0.001)"}, visibleStyle: {opacity: 1, transform: "scale(1)"}}, e(m.prototype, f.prototype), m.prototype.option = function (t) {
            e(this.options, t)
        }, m.prototype._create = function () {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
        }, m.prototype.reloadItems = function () {
            this.items = this._itemize(this.element.children)
        }, m.prototype._itemize = function (t) {
            for (var e = this._filterFindItemElements(t), i = this.constructor.Item, o = [], n = 0, r = e.length; r > n; n++) {
                var s = e[n], a = new i(s, this);
                o.push(a)
            }
            return o
        }, m.prototype._filterFindItemElements = function (t) {
            t = o(t);
            for (var e = this.options.itemSelector, i = [], n = 0, r = t.length; r > n; n++) {
                var s = t[n];
                if (c(s))
                    if (e) {
                        l(s, e) && i.push(s);
                        for (var a = s.querySelectorAll(e), u = 0, p = a.length; p > u; u++)
                            i.push(a[u])
                    } else
                        i.push(s)
            }
            return i
        }, m.prototype.getItemElements = function () {
            for (var t = [], e = 0, i = this.items.length; i > e; e++)
                t.push(this.items[e].element);
            return t
        }, m.prototype.layout = function () {
            this._resetLayout(), this._manageStamps();
            var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, t), this._isLayoutInited = !0
        }, m.prototype._init = m.prototype.layout, m.prototype._resetLayout = function () {
            this.getSize()
        }, m.prototype.getSize = function () {
            this.size = d(this.element)
        }, m.prototype._getMeasurement = function (t, e) {
            var i, o = this.options[t];
            o ? ("string" == typeof o ? i = this.element.querySelector(o) : c(o) && (i = o), this[t] = i ? d(i)[e] : o) : this[t] = 0
        }, m.prototype.layoutItems = function (t, e) {
            t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
        }, m.prototype._getItemsForLayout = function (t) {
            for (var e = [], i = 0, o = t.length; o > i; i++) {
                var n = t[i];
                n.isIgnored || e.push(n)
            }
            return e
        }, m.prototype._layoutItems = function (t, e) {
            function i() {
                o.emitEvent("layoutComplete", [o, t])
            }
            var o = this;
            if (!t || !t.length)
                return i(), void 0;
            this._itemsOn(t, "layout", i);
            for (var n = [], r = 0, s = t.length; s > r; r++) {
                var a = t[r], u = this._getItemLayoutPosition(a);
                u.item = a, u.isInstant = e || a.isLayoutInstant, n.push(u)
            }
            this._processLayoutQueue(n)
        }, m.prototype._getItemLayoutPosition = function () {
            return{x: 0, y: 0}
        }, m.prototype._processLayoutQueue = function (t) {
            for (var e = 0, i = t.length; i > e; e++) {
                var o = t[e];
                this._positionItem(o.item, o.x, o.y, o.isInstant)
            }
        }, m.prototype._positionItem = function (t, e, i, o) {
            o ? t.goTo(e, i) : t.moveTo(e, i)
        }, m.prototype._postLayout = function () {
            this.resizeContainer()
        }, m.prototype.resizeContainer = function () {
            if (this.options.isResizingContainer) {
                var t = this._getContainerSize();
                t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
            }
        }, m.prototype._getContainerSize = h, m.prototype._setContainerMeasure = function (t, e) {
            if (void 0 !== t) {
                var i = this.size;
                i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
            }
        }, m.prototype._itemsOn = function (t, e, i) {
            function o() {
                return n++, n === r && i.call(s), !0
            }
            for (var n = 0, r = t.length, s = this, a = 0, u = t.length; u > a; a++) {
                var p = t[a];
                p.on(e, o)
            }
        }, m.prototype.ignore = function (t) {
            var e = this.getItem(t);
            e && (e.isIgnored = !0)
        }, m.prototype.unignore = function (t) {
            var e = this.getItem(t);
            e && delete e.isIgnored
        }, m.prototype.stamp = function (t) {
            if (t = this._find(t)) {
                this.stamps = this.stamps.concat(t);
                for (var e = 0, i = t.length; i > e; e++) {
                    var o = t[e];
                    this.ignore(o)
                }
            }
        }, m.prototype.unstamp = function (t) {
            if (t = this._find(t))
                for (var e = 0, i = t.length; i > e; e++) {
                    var o = t[e];
                    n(o, this.stamps), this.unignore(o)
                }
        }, m.prototype._find = function (t) {
            return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = o(t)) : void 0
        }, m.prototype._manageStamps = function () {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var t = 0, e = this.stamps.length; e > t; t++) {
                    var i = this.stamps[t];
                    this._manageStamp(i)
                }
            }
        }, m.prototype._getBoundingRect = function () {
            var t = this.element.getBoundingClientRect(), e = this.size;
            this._boundingRect = {left: t.left + e.paddingLeft + e.borderLeftWidth, top: t.top + e.paddingTop + e.borderTopWidth, right: t.right - (e.paddingRight + e.borderRightWidth), bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)}
        }, m.prototype._manageStamp = h, m.prototype._getElementOffset = function (t) {
            var e = t.getBoundingClientRect(), i = this._boundingRect, o = d(t), n = {left: e.left - i.left - o.marginLeft, top: e.top - i.top - o.marginTop, right: i.right - e.right - o.marginRight, bottom: i.bottom - e.bottom - o.marginBottom};
            return n
        }, m.prototype.handleEvent = function (t) {
            var e = "on" + t.type;
            this[e] && this[e](t)
        }, m.prototype.bindResize = function () {
            this.isResizeBound || (i.bind(t, "resize", this), this.isResizeBound = !0)
        }, m.prototype.unbindResize = function () {
            this.isResizeBound && i.unbind(t, "resize", this), this.isResizeBound = !1
        }, m.prototype.onresize = function () {
            function t() {
                e.resize(), delete e.resizeTimeout
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var e = this;
            this.resizeTimeout = setTimeout(t, 100)
        }, m.prototype.resize = function () {
            this.isResizeBound && this.needsResizeLayout() && this.layout()
        }, m.prototype.needsResizeLayout = function () {
            var t = d(this.element), e = this.size && t;
            return e && t.innerWidth !== this.size.innerWidth
        }, m.prototype.addItems = function (t) {
            var e = this._itemize(t);
            return e.length && (this.items = this.items.concat(e)), e
        }, m.prototype.appended = function (t) {
            var e = this.addItems(t);
            e.length && (this.layoutItems(e, !0), this.reveal(e))
        }, m.prototype.prepended = function (t) {
            var e = this._itemize(t);
            if (e.length) {
                var i = this.items.slice(0);
                this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
            }
        }, m.prototype.reveal = function (t) {
            var e = t && t.length;
            if (e)
                for (var i = 0; e > i; i++) {
                    var o = t[i];
                    o.reveal()
                }
        }, m.prototype.hide = function (t) {
            var e = t && t.length;
            if (e)
                for (var i = 0; e > i; i++) {
                    var o = t[i];
                    o.hide()
                }
        }, m.prototype.getItem = function (t) {
            for (var e = 0, i = this.items.length; i > e; e++) {
                var o = this.items[e];
                if (o.element === t)
                    return o
            }
        }, m.prototype.getItems = function (t) {
            if (t && t.length) {
                for (var e = [], i = 0, o = t.length; o > i; i++) {
                    var n = t[i], r = this.getItem(n);
                    r && e.push(r)
                }
                return e
            }
        }, m.prototype.remove = function (t) {
            t = o(t);
            var e = this.getItems(t);
            if (e && e.length) {
                this._itemsOn(e, "remove", function () {
                    this.emitEvent("removeComplete", [this, e])
                });
                for (var i = 0, r = e.length; r > i; i++) {
                    var s = e[i];
                    s.remove(), n(s, this.items)
                }
            }
        }, m.prototype.destroy = function () {
            var t = this.element.style;
            t.height = "", t.position = "", t.width = "";
            for (var e = 0, i = this.items.length; i > e; e++) {
                var o = this.items[e];
                o.destroy()
            }
            this.unbindResize(), delete this.element.outlayerGUID, p && p.removeData(this.element, this.constructor.namespace)
        }, m.data = function (t) {
            var e = t && t.outlayerGUID;
            return e && v[e]
        }, m.create = function (t, i) {
            function o() {
                m.apply(this, arguments)
            }
            return Object.create ? o.prototype = Object.create(m.prototype) : e(o.prototype, m.prototype), o.prototype.constructor = o, o.defaults = e({}, m.defaults), e(o.defaults, i), o.prototype.settings = {}, o.namespace = t, o.data = m.data, o.Item = function () {
                y.apply(this, arguments)
            }, o.Item.prototype = new y, s(function () {
                for (var e = r(t), i = a.querySelectorAll(".js-" + e), n = "data-" + e + "-options", s = 0, h = i.length; h > s; s++) {
                    var f, c = i[s], d = c.getAttribute(n);
                    try {
                        f = d && JSON.parse(d)
                    } catch (l) {
                        u && u.error("Error parsing " + n + " on " + c.nodeName.toLowerCase() + (c.id ? "#" + c.id : "") + ": " + l);
                        continue
                    }
                    var y = new o(c, f);
                    p && p.data(c, t, y)
                }
            }), p && p.bridget && p.bridget(t, o), o
        }, m.Item = y, m
    }
    var a = t.document, u = t.console, p = t.jQuery, h = function () {
    }, f = Object.prototype.toString, c = "object" == typeof HTMLElement ? function (t) {
        return t instanceof HTMLElement
    } : function (t) {
        return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName
    }, d = Array.prototype.indexOf ? function (t, e) {
        return t.indexOf(e)
    } : function (t, e) {
        for (var i = 0, o = t.length; o > i; i++)
            if (t[i] === e)
                return i;
        return -1
    };
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item"], s) : t.Outlayer = s(t.eventie, t.docReady, t.EventEmitter, t.getSize, t.matchesSelector, t.Outlayer.Item)
}(window), function (t) {
    function e(t) {
        function e() {
            t.Item.apply(this, arguments)
        }
        return e.prototype = new t.Item, e.prototype._create = function () {
            this.id = this.layout.itemGUID++, t.Item.prototype._create.call(this), this.sortData = {}
        }, e.prototype.updateSortData = function () {
            if (!this.isIgnored) {
                this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
                var t = this.layout.options.getSortData, e = this.layout._sorters;
                for (var i in t) {
                    var o = e[i];
                    this.sortData[i] = o(this.element, this)
                }
            }
        }, e
    }
    "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], e) : (t.Isotope = t.Isotope || {}, t.Isotope.Item = e(t.Outlayer))
}(window), function (t) {
    function e(t, e) {
        function i(t) {
            this.isotope = t, t && (this.options = t.options[this.namespace], this.element = t.element, this.items = t.filteredItems, this.size = t.size)
        }
        return function () {
            function t(t) {
                return function () {
                    return e.prototype[t].apply(this.isotope, arguments)
                }
            }
            for (var o = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], n = 0, r = o.length; r > n; n++) {
                var s = o[n];
                i.prototype[s] = t(s)
            }
        }(), i.prototype.needsVerticalResizeLayout = function () {
            var e = t(this.isotope.element), i = this.isotope.size && e;
            return i && e.innerHeight !== this.isotope.size.innerHeight
        }, i.prototype._getMeasurement = function () {
            this.isotope._getMeasurement.apply(this, arguments)
        }, i.prototype.getColumnWidth = function () {
            this.getSegmentSize("column", "Width")
        }, i.prototype.getRowHeight = function () {
            this.getSegmentSize("row", "Height")
        }, i.prototype.getSegmentSize = function (t, e) {
            var i = t + e, o = "outer" + e;
            if (this._getMeasurement(i, o), !this[i]) {
                var n = this.getFirstItemSize();
                this[i] = n && n[o] || this.isotope.size["inner" + e]
            }
        }, i.prototype.getFirstItemSize = function () {
            var e = this.isotope.filteredItems[0];
            return e && e.element && t(e.element)
        }, i.prototype.layout = function () {
            this.isotope.layout.apply(this.isotope, arguments)
        }, i.prototype.getSize = function () {
            this.isotope.getSize(), this.size = this.isotope.size
        }, i.modes = {}, i.create = function (t, e) {
            function o() {
                i.apply(this, arguments)
            }
            return o.prototype = new i, e && (o.options = e), o.prototype.namespace = t, i.modes[t] = o, o
        }, i
    }
    "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], e) : (t.Isotope = t.Isotope || {}, t.Isotope.LayoutMode = e(t.getSize, t.Outlayer))
}(window), function (t) {
    function e(t, e) {
        var o = t.create("masonry");
        return o.prototype._resetLayout = function () {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var t = this.cols;
            for (this.colYs = []; t--; )
                this.colYs.push(0);
            this.maxY = 0
        }, o.prototype.measureColumns = function () {
            if (this.getContainerWidth(), !this.columnWidth) {
                var t = this.items[0], i = t && t.element;
                this.columnWidth = i && e(i).outerWidth || this.containerWidth
            }
            this.columnWidth += this.gutter, this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
        }, o.prototype.getContainerWidth = function () {
            var t = this.options.isFitWidth ? this.element.parentNode : this.element, i = e(t);
            this.containerWidth = i && i.innerWidth
        }, o.prototype._getItemLayoutPosition = function (t) {
            t.getSize();
            var e = t.size.outerWidth % this.columnWidth, o = e && 1 > e ? "round" : "ceil", n = Math[o](t.size.outerWidth / this.columnWidth);
            n = Math.min(n, this.cols);
            for (var r = this._getColGroup(n), s = Math.min.apply(Math, r), a = i(r, s), u = {x: this.columnWidth * a, y: s}, p = s + t.size.outerHeight, h = this.cols + 1 - r.length, f = 0; h > f; f++)
                this.colYs[a + f] = p;
            return u
        }, o.prototype._getColGroup = function (t) {
            if (2 > t)
                return this.colYs;
            for (var e = [], i = this.cols + 1 - t, o = 0; i > o; o++) {
                var n = this.colYs.slice(o, o + t);
                e[o] = Math.max.apply(Math, n)
            }
            return e
        }, o.prototype._manageStamp = function (t) {
            var i = e(t), o = this._getElementOffset(t), n = this.options.isOriginLeft ? o.left : o.right, r = n + i.outerWidth, s = Math.floor(n / this.columnWidth);
            s = Math.max(0, s);
            var a = Math.floor(r / this.columnWidth);
            a -= r % this.columnWidth ? 0 : 1, a = Math.min(this.cols - 1, a);
            for (var u = (this.options.isOriginTop ? o.top : o.bottom) + i.outerHeight, p = s; a >= p; p++)
                this.colYs[p] = Math.max(u, this.colYs[p])
        }, o.prototype._getContainerSize = function () {
            this.maxY = Math.max.apply(Math, this.colYs);
            var t = {height: this.maxY};
            return this.options.isFitWidth && (t.width = this._getContainerFitWidth()), t
        }, o.prototype._getContainerFitWidth = function () {
            for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; )
                t++;
            return(this.cols - t) * this.columnWidth - this.gutter
        }, o.prototype.needsResizeLayout = function () {
            var t = this.containerWidth;
            return this.getContainerWidth(), t !== this.containerWidth
        }, o
    }
    var i = Array.prototype.indexOf ? function (t, e) {
        return t.indexOf(e)
    } : function (t, e) {
        for (var i = 0, o = t.length; o > i; i++) {
            var n = t[i];
            if (n === e)
                return i
        }
        return -1
    };
    "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], e) : t.Masonry = e(t.Outlayer, t.getSize)
}(window), function (t) {
    function e(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    function i(t, i) {
        var o = t.create("masonry"), n = o.prototype._getElementOffset, r = o.prototype.layout, s = o.prototype._getMeasurement;
        e(o.prototype, i.prototype), o.prototype._getElementOffset = n, o.prototype.layout = r, o.prototype._getMeasurement = s;
        var a = o.prototype.measureColumns;
        o.prototype.measureColumns = function () {
            this.items = this.isotope.filteredItems, a.call(this)
        };
        var u = o.prototype._manageStamp;
        return o.prototype._manageStamp = function () {
            this.options.isOriginLeft = this.isotope.options.isOriginLeft, this.options.isOriginTop = this.isotope.options.isOriginTop, u.apply(this, arguments)
        }, o
    }
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], i) : i(t.Isotope.LayoutMode, t.Masonry)
}(window), function (t) {
    function e(t) {
        var e = t.create("fitRows");
        return e.prototype._resetLayout = function () {
            this.x = 0, this.y = 0, this.maxY = 0
        }, e.prototype._getItemLayoutPosition = function (t) {
            t.getSize(), 0 !== this.x && t.size.outerWidth + this.x > this.isotope.size.innerWidth && (this.x = 0, this.y = this.maxY);
            var e = {x: this.x, y: this.y};
            return this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight), this.x += t.size.outerWidth, e
        }, e.prototype._getContainerSize = function () {
            return{height: this.maxY}
        }, e
    }
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], e) : e(t.Isotope.LayoutMode)
}(window), function (t) {
    function e(t) {
        var e = t.create("vertical", {horizontalAlignment: 0});
        return e.prototype._resetLayout = function () {
            this.y = 0
        }, e.prototype._getItemLayoutPosition = function (t) {
            t.getSize();
            var e = (this.isotope.size.innerWidth - t.size.outerWidth) * this.options.horizontalAlignment, i = this.y;
            return this.y += t.size.outerHeight, {x: e, y: i}
        }, e.prototype._getContainerSize = function () {
            return{height: this.y}
        }, e
    }
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], e) : e(t.Isotope.LayoutMode)
}(window), function (t) {
    function e(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    function i(t) {
        return"[object Array]" === h.call(t)
    }
    function o(t) {
        var e = [];
        if (i(t))
            e = t;
        else if (t && "number" == typeof t.length)
            for (var o = 0, n = t.length; n > o; o++)
                e.push(t[o]);
        else
            e.push(t);
        return e
    }
    function n(t, e) {
        var i = f(e, t);
        -1 !== i && e.splice(i, 1)
    }
    function r(t, i, r, u, h) {
        function f(t, e) {
            return function (i, o) {
                for (var n = 0, r = t.length; r > n; n++) {
                    var s = t[n], a = i.sortData[s], u = o.sortData[s];
                    if (a > u || u > a) {
                        var p = void 0 !== e[s] ? e[s] : e, h = p ? 1 : -1;
                        return(a > u ? 1 : -1) * h
                    }
                }
                return 0
            }
        }
        var c = t.create("isotope", {layoutMode: "masonry", isJQueryFiltering: !0, sortAscending: !0});
        c.Item = u, c.LayoutMode = h, c.prototype._create = function () {
            this.itemGUID = 0, this._sorters = {}, this._getSorters(), t.prototype._create.call(this), this.modes = {}, this.filteredItems = this.items, this.sortHistory = ["original-order"];
            for (var e in h.modes)
                this._initLayoutMode(e)
        }, c.prototype.reloadItems = function () {
            this.itemGUID = 0, t.prototype.reloadItems.call(this)
        }, c.prototype._itemize = function () {
            for (var e = t.prototype._itemize.apply(this, arguments), i = 0, o = e.length; o > i; i++) {
                var n = e[i];
                n.id = this.itemGUID++
            }
            return this._updateItemsSortData(e), e
        }, c.prototype._initLayoutMode = function (t) {
            var i = h.modes[t], o = this.options[t] || {};
            this.options[t] = i.options ? e(i.options, o) : o, this.modes[t] = new i(this)
        }, c.prototype.layout = function () {
            return!this._isLayoutInited && this.options.isInitLayout ? (this.arrange(), void 0) : (this._layout(), void 0)
        }, c.prototype._layout = function () {
            var t = this._getIsInstant();
            this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, t), this._isLayoutInited = !0
        }, c.prototype.arrange = function (t) {
            this.option(t), this._getIsInstant(), this.filteredItems = this._filter(this.items), this._sort(), this._layout()
        }, c.prototype._init = c.prototype.arrange, c.prototype._getIsInstant = function () {
            var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            return this._isInstant = t, t
        }, c.prototype._filter = function (t) {
            function e() {
                f.reveal(n), f.hide(r)
            }
            var i = this.options.filter;
            i = i || "*";
            for (var o = [], n = [], r = [], s = this._getFilterTest(i), a = 0, u = t.length; u > a; a++) {
                var p = t[a];
                if (!p.isIgnored) {
                    var h = s(p);
                    h && o.push(p), h && p.isHidden ? n.push(p) : h || p.isHidden || r.push(p)
                }
            }
            var f = this;
            return this._isInstant ? this._noTransition(e) : e(), o
        }, c.prototype._getFilterTest = function (t) {
            return s && this.options.isJQueryFiltering ? function (e) {
                return s(e.element).is(t)
            } : "function" == typeof t ? function (e) {
                return t(e.element)
            } : function (e) {
                return r(e.element, t)
            }
        }, c.prototype.updateSortData = function (t) {
            this._getSorters(), t = o(t);
            var e = this.getItems(t);
            e = e.length ? e : this.items, this._updateItemsSortData(e)
        }, c.prototype._getSorters = function () {
            var t = this.options.getSortData;
            for (var e in t) {
                var i = t[e];
                this._sorters[e] = d(i)
            }
        }, c.prototype._updateItemsSortData = function (t) {
            for (var e = 0, i = t.length; i > e; e++) {
                var o = t[e];
                o.updateSortData()
            }
        };
        var d = function () {
            function t(t) {
                if ("string" != typeof t)
                    return t;
                var i = a(t).split(" "), o = i[0], n = o.match(/^\[(.+)\]$/), r = n && n[1], s = e(r, o), u = c.sortDataParsers[i[1]];
                return t = u ? function (t) {
                    return t && u(s(t))
                } : function (t) {
                    return t && s(t)
                }
            }
            function e(t, e) {
                var i;
                return i = t ? function (e) {
                    return e.getAttribute(t)
                } : function (t) {
                    var i = t.querySelector(e);
                    return i && p(i)
                }
            }
            return t
        }();
        c.sortDataParsers = {parseInt: function (t) {
                return parseInt(t, 10)
            }, parseFloat: function (t) {
                return parseFloat(t)
            }}, c.prototype._sort = function () {
            var t = this.options.sortBy;
            if (t) {
                var e = [].concat.apply(t, this.sortHistory), i = f(e, this.options.sortAscending);
                this.filteredItems.sort(i), t !== this.sortHistory[0] && this.sortHistory.unshift(t)
            }
        }, c.prototype._mode = function () {
            var t = this.options.layoutMode, e = this.modes[t];
            if (!e)
                throw Error("No layout mode: " + t);
            return e.options = this.options[t], e
        }, c.prototype._resetLayout = function () {
            t.prototype._resetLayout.call(this), this._mode()._resetLayout()
        }, c.prototype._getItemLayoutPosition = function (t) {
            return this._mode()._getItemLayoutPosition(t)
        }, c.prototype._manageStamp = function (t) {
            this._mode()._manageStamp(t)
        }, c.prototype._getContainerSize = function () {
            return this._mode()._getContainerSize()
        }, c.prototype.needsResizeLayout = function () {
            return this._mode().needsResizeLayout()
        }, c.prototype.appended = function (t) {
            var e = this.addItems(t);
            if (e.length) {
                var i = this._filterRevealAdded(e);
                this.filteredItems = this.filteredItems.concat(i)
            }
        }, c.prototype.prepended = function (t) {
            var e = this._itemize(t);
            if (e.length) {
                var i = this.items.slice(0);
                this.items = e.concat(i), this._resetLayout(), this._manageStamps();
                var o = this._filterRevealAdded(e);
                this.layoutItems(i), this.filteredItems = o.concat(this.filteredItems)
            }
        }, c.prototype._filterRevealAdded = function (t) {
            var e = this._noTransition(function () {
                return this._filter(t)
            });
            return this.layoutItems(e, !0), this.reveal(e), t
        }, c.prototype.insert = function (t) {
            var e = this.addItems(t);
            if (e.length) {
                var i, o, n = e.length;
                for (i = 0; n > i; i++)
                    o = e[i], this.element.appendChild(o.element);
                var r = this._filter(e);
                for (this._noTransition(function () {
                    this.hide(r)
                }), i = 0; n > i; i++)
                    e[i].isLayoutInstant = !0;
                for (this.arrange(), i = 0; n > i; i++)
                    delete e[i].isLayoutInstant;
                this.reveal(r)
            }
        };
        var l = c.prototype.remove;
        return c.prototype.remove = function (t) {
            t = o(t);
            var e = this.getItems(t);
            if (l.call(this, t), e && e.length)
                for (var i = 0, r = e.length; r > i; i++) {
                    var s = e[i];
                    n(s, this.filteredItems)
                }
        }, c.prototype._noTransition = function (t) {
            var e = this.options.transitionDuration;
            this.options.transitionDuration = 0;
            var i = t.call(this);
            return this.options.transitionDuration = e, i
        }, c
    }
    var s = t.jQuery, a = String.prototype.trim ? function (t) {
        return t.trim()
    } : function (t) {
        return t.replace(/^\s+|\s+$/g, "")
    }, u = document.documentElement, p = u.textContent ? function (t) {
        return t.textContent
    } : function (t) {
        return t.innerText
    }, h = Object.prototype.toString, f = Array.prototype.indexOf ? function (t, e) {
        return t.indexOf(e)
    } : function (t, e) {
        for (var i = 0, o = t.length; o > i; i++)
            if (t[i] === e)
                return i;
        return -1
    };
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "matches-selector/matches-selector", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], r) : t.Isotope = r(t.Outlayer, t.getSize, t.matchesSelector, t.Isotope.Item, t.Isotope.LayoutMode)
}(window);
       