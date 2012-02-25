;(function($) {
/*
 * jQuery preloadImages v2.1.0
 * http://www.tentonaxe.com/
 *
 * Copyright 2012 Kevin Boudloche
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: 02/24/2012
 */
$.preloadImages = function( imgArr, callback ) {
	var def = $.Deferred(), imagesLoaded = 0, defArr = [];

	/*
	 * This function performs a single image preload
	 */
	function _preloadImage ( url, callback, fail ) {
		var img = new Image();
		img.src = url;
		if ( img.complete || img.readyState === 4 ) {
			callback();
		}
    	else {
			$( img ).bind( "error load onreadystatechange", function ( e ) {
				//clearTimeout(errorTimer);
				if (e.type === "error") {
					fail( "Image failed to load. - " + url);
				}
				else {
					callback(url);
				}
			});
		}

	}

	/*
	 * If a callback was passed to the plugin, bind it
	 * to the always callback of the deferred
	 */
	if ( $.type( callback ) === "function" ) {
		def.always( callback );
	}

	/*
	 * If an empty array is passed to the plugin, 
	 * immediately resolve and exit.
	 */
	if ( $.type( imgArr ) === "array" && imgArr.length === 0 ) {
		def.resolve();
		return def.promise();
	} 

	/*
	 * If a url is passed as the first argument,
	 * preload the url.
	 */
	if ( typeof imgArr === "string" ) {
		_preloadImage( imgArr, def.resolve, def.reject );
		return def.promise();
	}

	/*
	 * One last check to make sure that imgArr is
	 * defined and is an array
	 */
	if ( !imgArr || $.type( imgArr ) !== "array" ) {
		def.resolve();
		return def.promise();
	}

	/*
	 * If we've gotten this far, the first argument
	 * is more than likely an array of images. Loop
	 * through the array and preload each image. When
	 * done, resolve the deferred object.
	 */
	$.each( imgArr, function ( i, url ) {

		// add a new deferred object onto the array at this index
		defArr[ i ] = $.Deferred();

		// preload the image and resolve the deferred when done
		_preloadImage( url, defArr[ i ].resolve, defArr[ i ].reject );

	});

	// When all deferreds in defArr are resolved, resolve the overall deferred object.
	$.when.apply( $, defArr ).then( def.resolve, def.reject );
		return def.promise();
	};

})( jQuery );