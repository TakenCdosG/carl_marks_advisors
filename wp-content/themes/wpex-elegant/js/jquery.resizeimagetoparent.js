/*
 * Plugin Name: Resize Image to Parent Container
 *
 * Author: Christian Varga
 * Author URI: http://christianvarga.com
 * Plugin Source: https://github.com/levymetal/jquery-resize-image-to-parent/
 *
 */

(function($) {
    $.fn.resizeToParent = function(opts) {
        var defaults = {
            parent: 'div',
            delay: 100
        }

        var opts = $.extend(defaults, opts);

        function positionImage(obj) {
            // reset image (in case we're calling this a second time, for example on resize)
            obj.css({
                'width': '', 
                'height': '', 
                'margin-left': '', 
                'margin-top': ''
            });
            // dimensions of the image
            var imageWidth = 1400;//obj.width();
            var imageHeight = obj.height();
            // dimensions of the parent
            var parentWidth = obj.parents(opts.parent).width();
            var parentHeight = obj.parents(opts.parent).height();
      
            var targetHeight = 525; 
            var targetWidth = (imageWidth *targetHeight)/imageHeight;
            
            console.log("//->imageWidth: "+imageWidth);
            
            
            
            obj.css({
                'width': targetWidth, 
                'height': targetHeight
            });

            // step 3 - center image in container
            var leftOffset = (targetWidth - parentWidth) / -2;
            var topOffset = (targetHeight - parentHeight) / -2;

            obj.css({
                'margin-left': leftOffset
            });
        }

        // run the position function on window resize (to make it responsive)
        var tid;
        var elems = this;

        $(window).on('resize', function() {
            clearTimeout(tid);
            tid = setTimeout(function() {
                elems.each(function() {
                    positionImage($(this));
                });
            }, opts.delay);
        });

        return this.each(function() {
            var obj = $(this);
            // hack to force ie to run the load function... ridiculous bug 
            // http://stackoverflow.com/questions/7137737/ie9-problems-with-jquery-load-event-not-firing
            obj.attr("src", obj.attr("src"));

            // bind to load of image
            obj.load(function() {
                positionImage(obj);
            });

            // run the position function if the image is cached
            if (this.complete) {
                positionImage(obj);
            }
        });
    }
})( jQuery );