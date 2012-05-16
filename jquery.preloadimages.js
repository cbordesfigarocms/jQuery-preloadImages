;(function($) {
/*
 * jQuery preloadImages v2.1.3
 * http://www.tentonaxe.com/
 *
 * Copyright 2012 Kevin Boudloche
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: 05/16/2012
 */
$.preloadImages = function(){
	var def = $.Deferred(), args = arguments, arg0type = $.type(args[0]);

	/*
	 * If a callback was passed to the plugin, bind it
	 * to the always callback of the deferred object
	 */
	if ( $.type( args[1] ) === "function" ) {
		def.always( args[1] );
	}
	
	/*
	 * Under certain conditions, the deferred object
	 * should resolve instantly.
	 */
	if (
			// empty string
			( args[0] === "" ) ||
			// empty array
			( arg0type === "array" && args[0].length === 0 ) ||
			// not a string or array
			( arg0type !== "array" || arg0type !== "string" )
		){
		def.resolve();
	}	
	else {		
		// Add the image to the queue
		this.addImage(args[0],def.resolve,def.reject);
		if ( !this.loading ) {
			this.processQueue();
		}
	}	
	return def.promise();
};
$.extend( $.preloadImages, {
	queue: [],
	loading: false,
	simultaneous: 1,
	addImage: function( url, done, fail ) {
		if ( url ) {
			switch ( $.type( obj ) ) {
				case "string":
					this.queue.push( { url: obj } );
					break;
				case "object":
					this.queue.push( obj );
					break;
				case "array":
					for ( var i = 0; i < obj.length; i++ ) {
						this.addImage( obj[i] );
					}
					break;
			}
		}
		return this;
	},
	removeImage: function( url ) {
		if ( $.type( url ) === "object" ) {
			url = url.url;
		}
		else if ( $.type( url ) === "array" ) {
			for (var i = 0; i < url.length; i++) {
				this.removeImage(url[i]);
			}
		}
		else {
			for (var i = 0; i < this.queue.length; i++) {
				if (this.queue[i].url = url) {
					this.queue.splice(i,1);
				}
			}
		}
		return this;
	},
	preloadImage: function(url, done, fail){
		var img = new Image();
		$(img).load(done).error(fail)[0].src = url;
		return this;
	},
	processQueue: function() {
		var defArr = [], self = this;
		
		for (var i = 0; i < this.simultaneous; i++) {
			defArr.push($.Deferred(function(deferred){
				var img = self.queue.shift();
				self.preloadImage(img.url,function(){
					deferred.resolve();
					img.done();
				},function(){
					deferred.reject();
					img.fail();
				});
			}))
		}

		$.when.apply($,defArr).done(function(){
			if ( self.queue.length > 0) {
				self.processQueue();
			}
			else {
				this.loading = false;
			}
		});
	}
});

})(jQuery);