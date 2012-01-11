/*
 * jQuery preloadImages v1.0.0
 * http://www.tentonaxe.com/
 *
 * Copyright 2012 Kevin Boudloche
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: 01/11/2012
 *
 * This jQuery plugin implements the $.fn.preloadImages method and the
 * $.preloadImages method making it easy to preload images ensuring that
 * images are completely done loading before displaying them.
 *
 * There are two ways to use this plugin. The easiest way to use it is 
 * to simply append the images to your page, select the container of the 
 * images, and then call .preloadImages() it.
 *
 * $('body').preloadImages(function(){
 *   alert("All images are loaded!");
 * });
 *
 * The other way of using the plugin is to use the $.preloadImages method.
 *
 * $.preloadImages(["img1.jpg","img2.jpg","img3.jpg"], function(){
 *   alert("All images are loaded!");	
 * });
 * 
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
            //Create an temp image and load the url
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
        var imgArr = (function(){
        	if (this.filter("img").length) {
        		return this.filter("img");
        	}
        	else {
        		return this.find("img");
        	}
        })().map(function() {
            return this.src;
        }).get();
        if (imgArr.length === 0) {
            callback();
            return this;
        }
        $.preloadImages(imgArr, callback);
        return this;
    };
})(jQuery);