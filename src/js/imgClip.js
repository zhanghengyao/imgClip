 ;(function(global) {
 	var ImgClip = function(options){
 		var opt = options || {}
 		this.el = opt.el || document.body
 		this.canvas = document.createElement('canvas')
 	}
 	ImgClip.prototype = {
 		init: function() {

 		}
 	}
 	global.ImgClip = ImgClip
 })(window)