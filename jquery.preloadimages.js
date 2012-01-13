/*
 * jQuery preloadImages v1.0.0
 * http://www.tentonaxe.com/
 *
 * Copyright 2012 Kevin Boudloche
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: 01/13/2012
 */
(function($) {
    $.preloadImages = function(imgArr, callback) {
        if ($.type(imgArr) !== "array" || imgArr.length === 0) {
            callback();
            return;
        }
        //Keep track of the images that are loaded
        var imagesLoaded = 0;

        function _loadAllImages() {
            //Create a temp image and load the url
            var img = new Image();
            $(img).attr('src', imgArr[imagesLoaded]);
            if (img.complete || img.readyState === 4) {
                // image is cached
                imagesLoaded++;
                //Check if all images are loaded
                if (imagesLoaded == imgArr.length) {
                    //If all images loaded do the callback
                    callback();
                } else {
                    //If not all images are loaded call own function again
                    _loadAllImages();
                }
            } else {
                $(img).load(function() {
                    //Increment the images loaded variable
                    imagesLoaded++;
                    //Check if all images are loaded
                    if (imagesLoaded == imgArr.length) {
                        //If all images loaded do the callback
                        callback();
                    } else {
                        //If not all images are loaded call own function again
                        _loadAllImages();
                    }
                });
            }
        }
        _loadAllImages();
        return imgArr;
    };

    $.fn.preloadImages = function(callback) {
        var imgArr = (function() {
            if (this.filter("img").length) {
                return this.filter("img");
            }
            else {
                return this.find("img");
            }
        }).call(this),
            def = $.Deferred(),
            counter = imgArr.length - 1;
        this.done = def.promise().done;

		// loop through each image, sending each one individually to the
		// $.preloadImages method
        imgArr.each(function() {
            var img = this;
            $.preloadImages([this.src], function() {
            	
            	// if callback is defined, run it with img as context
                callback && callback.call(img);
                
                // decrement the counter, and if it is 0, resolve deferred object
                if (!counter--) {
                    def.resolve();
                }
            });
        });
        
        // if imgArr was empty, go ahead and resolve the deferred object
        if (imgArr.length === 0) {
            def.resolve();
        }
        return this;
    };
})(jQuery);