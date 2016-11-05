 ;(function(global, AlloyFinger) {
 	var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x) {
        global.requestAnimationFrame = global[vendors[x] + 'RequestAnimationFrame'];
        global.cancelAnimationFrame =
            global[vendors[x] + 'CancelAnimationFrame'] || global[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!global.requestAnimationFrame)
        global.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = global.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!global.cancelAnimationFrame)
        global.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
 	var ImgClip = function(options) {
 		this.opt = options || {}
 		this.el = null
 		this.canvas = null
 		this.context = null
 		this.container = null
 		this.toolbar = null
 		this.source = this.opt.source
 		this.cutRectSize = this.opt.cutRectSize || 200
 		this.cutPosition = null
 		this.img = null
 		this.angle = 0
 		this.moveTimer = null
 		this.imgSize = {
 			width: 0,
 			height: 0
 		}
 		this.scaleSize = {
			width: 0,
			height: 0
		}	
 		this.imgPosition = {
 				x: 0,
 				y: 0
 			}
 		this.offset = {
 			x: 0,
 			y: 0
 		}	
 		this.DIRECTION = {
				left: 'Left',
				right: 'Right'
			}
		this.scaleMin = 0
		this.scaleMax = 1
		this.cutEvent = this.opt.cutEvent
		this.closeEvent = this.opt.closeEvent
		this.isInit = true
 		this.init()
 	}
 	ImgClip.prototype = {
 		init: function() {
 			var _this = this,
 				cs = Math.min.call(null, [global.innerWidth, global.innerHeight]);
 			if(this.cutRectSize > cs)this.cutRectSize = cs;
 			if(this.cutRectSize < 50)this.cutRectSize = 50
 			this.scaleMin = this.cutRectSize
 			this.angle = 0
 			if(typeof this.opt.el === 'string'){
 				this.el = document.getElementById(this.opt.el) || document.querySelector(this.opt.el) || document.body
 			}else{
 				this.el = this.opt.el || document.body
 			}
 			this.createContainer()
 			this.createCanvas()
 			this.createToolbar()
 			this.container.appendChild(this.canvas)
 			this.container.appendChild(this.toolbar)
 			this.el.appendChild(this.container)
 			this.cutPosition = {
 				x: (this.canvas.width - this.cutRectSize) / 2,
 				y: (this.canvas.height - this.cutRectSize - 50) / 2
 			}
 			this.bindEvent()
 			this.renderImg() 
 			if(this.isInit){
 				global.addEventListener('orientationchange', _this.resize.bind(_this), false)
				this.isInit = false
 			} 						
 		},
 		resize: function() {
 			var _this = this
 			setTimeout(function() {
 				_this.init()
 			}, 100)
 		},
 		createContainer: function() {
 			var containerElement = document.createElement('div'),
 				clipContainer = document.getElementById('clip_container');
 			containerElement.id = 'clip_container'
 			if(clipContainer){
 				clipContainer.parentNode.removeChild(clipContainer)
 			}
 			this.container = containerElement
 		},
 		createCanvas: function() {
 			var canvasElement = document.createElement('canvas')
 			canvasElement.width = global.innerWidth
 			canvasElement.height = global.innerHeight
 			this.context = canvasElement.getContext('2d')
 			this.canvas = canvasElement
 		},
 		createToolbar: function() {
 			var tempDiv = document.createElement('div'),
 				tempImg = document.createElement('img'),
 				toolbarElement = tempDiv.cloneNode(),
 				childDiv = tempDiv.cloneNode(),
 				leftRotate,
 				rightRotate,
 				cancel,
 				ok,
 				box1,
				box2,
				box3,
				box4;
 			with(toolbarElement.style) {
 				position = 'fixed'
 				bottom = 0
 				left = 0
 				width = '100%'
 				height = '50px'
 				backgroundColor = '#000'
			    textAlign = 'center'
    			lineHeight = '70px'
 			}	
 			with(childDiv.style) {
 				float = 'left'
 				width = '25%'
 			}
 			box1 = childDiv.cloneNode()
			box2 = childDiv.cloneNode()
			box3 = childDiv.cloneNode()
			box4 = childDiv.cloneNode()

			leftRotate = tempImg.cloneNode()
			rightRotate = tempImg.cloneNode()
			cancel = tempImg.cloneNode()
			ok = tempImg.cloneNode()	
 			cancel.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABTklEQVRYR+2W303EMAzGbSkzVGqyBBvcbQJsABNwNwGMcGxSNmCJ5qEzVAqKlKIqShp/LlJ5uL7WzvfznzhmOvjjg/XpDvA/MzBN08M8z+/MPPR9f93TJ+M4Xpj5ZIx57bruOz+rmAHv/UBEp2gcQrg55541EN77GxE9Jt8va+1ZBJCo3xZjDUQmHgO5OucuIoBoVDhAnIncl4g+rbVPpSxuNqEGAhGPQM1bgECg4iIAaTk04mKAFoRWHAKoQTBzLONy1aJZteHgJiw5FKJdm0HicAYWpQoELP6nAJphpQLYKoEGojkH1gUudXv6/9uEKIQYYOuqIcNK/Ba0Is9nuxaimQFkyGggoMdIMmRQiCoAEnleVwSiCJAvJJLIBRDyhWS9kmnEKxNTvpKlpfQjhDCU1ihkP0zZPBtjXsRLKSKw17Z5DfcKtPzvAIdn4AeHGf8hqLdyawAAAABJRU5ErkJggg=='
 			ok.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABP0lEQVRYR+2WsW3DMBBF7yCqjioVVJMRkhG8QTawM0GQDTyCN7CzQUbIBvEIaUQCapROjYALTogNGxEt6mjKRcRKBYH3RN59HsKNF96YD7PA/zsBa+19kiRZnud7rr9JT8AYswGAFwYT0a4oiufJBIwxOwBYnnYdIi4mEeiDs4hS6jG6gAsOAG9a61VUgSF41CL0gUcT8IUfBcqyXHN7IOJeKfV66FHJOzEG3glUVfXQtu3nAUZE32maLiQSY+GdgLV2RUTb07+VSEjgnUBd11nTNF8AcCeVkMKPNfB7DR8SiRD4WRdIJELhf9pwjMQ14L054CNxLbgziC5JICLXylNPRnTZPjY7nG+BS8IBEMEHo9hTQgwfFOANAxJBcC+BCxLBcG8B3sjDJBHxTJcBwLvWmr+DV9SBxMduFphP4AcU3t8E8fazCwAAAABJRU5ErkJggg=='				
 			rightRotate.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC2UlEQVRYR9WXXW7TQBDH/2ObSkgQe1XnmXICwglIT9ByAtoTEE5AeoK2JyCcoOYEpCcg3KB9TqS1A1Il5HjQOrbjz3jjBlXkJQ+7s/Obj/3PmvDEP3pi//g/AKR8OIqMPyfMfJpkbJD8zwD4MAzPXD27FeL53a4Z3ZoBKX8PVhReAjTUOpgwMaODi11AGgEWMrgC4aOW49ImIowObftax7YCICU7KwpuKlEzBwB5DNwRSKXeYfARAQMQTirOCBPXts/bICoAc+nPiOhNZsgcEGh8KOyrpsMUdIjliMAjENnZPg2IAsBCBhMQPqQHMPNPC/ZQCPLbIlHrqmdChJN8AMy46At73GSfAczlryFR9D3vvC+ctNt1/Md71tkIpnkIkw9eNzVmDsBXRu/iU5jvTdgD3cjLdPHtQTjNysH46gr7rC6KGGB93VY/NnWnc1f0Jtph12ycy2BMhM/pksk9URdQDFDYzHzvCufoMc7TUqxoKduCSgDy6ce1K+zRYwGU/UIGXnZFGd9cYadKmrso8Ubf39SL3rui5+0DIJ9ZZr7tC6eiqHEGFn7Am+43jvvi5bQLgOolWJzpQBRFQ2YkV5B90zQ3GQgpEOLFbO8Ahe5vioI5MGEN9w6wrvvyDMRftmaQN2X+J024FYKLV3xdgtzkY/Cs7zhvu/RA3qasA2t9q8pykoGyDHdvxDxEYbY0qGEmxQvp34HoVUy6pyxkWgD4W6U4aZ5TEN/kFEJrnreVSg0ntadprhTG8VzmFFFZaczzNoC29QJA3ShV5QCbn9rESY1z0OrSYutc3e82x+l6zZMsHqVe2g+ZQoJnBtHEMIz48DAEWRZ4rXZ8BlAywNg32TrWhah9lCaZ8LL3gW44G9rG+V8+auuzPBYURONyNhp5mO8BY7TLMNP6MlrI5SmgPkp4WIGJnarXsuG19UkduBZA2VCVqOtzbacS7Fr6Lvs7ZaCLoyabv5v+ajCtwZRVAAAAAElFTkSuQmCC'
			leftRotate.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC30lEQVRYR+2WbU7bQBCG37EjoUol9qrO77onaHoC0hM0PQHhBA0nIJyg6QmAExBO0HCCpico/E6ktVMkRGVnql3H2HH8SZBQpVrKDzs7O8/OxztLeOGHXtg//k0AKe+6KyM8YOZ+FEHqAXwDQP08GMbEDPevhCCvKsKNIjCXv3tE4UnksPphwri1ap+WgdQCkJLtkPwzgNYnrnaerGAPbBw7on2eZ1UJIOW9G9DDJYG6Gxsw+wBNWIfdmBLYZbBLQBeET1lnKhodyzrOfi8FUCcPyP++4Zz5FjBGRSdSDnTEsByB8CXtkBmnHWGN0t9KAebSmxLRwaMB48JEe1inuCKQu26IYAoiK9mDPjuiPYnfCwEWcjkA8VnauSOsQZPsRxD3boiHWQLBnsnWu/gQJQDeDYjeqk2Y+WdH2Js10IBER4LCH7FJOhW5AAu57IP4MjEwPnbE/rSBz62lC+mfg3AY/cGeY9tCK0jepunFu54+3l+ngv78it9NNj8I8XpWAOB5cc6IcfxGWONdTh/bLmQ6rVFH5AN4Pj9n+BMAf/zYmowrR1h9DaAkttWCdhoyu1hxoloG9U1KaXrQuhXildL8xs9c+iMinKwL+7oj7J4G2Gq5gq1VPbRg9erqQHabQoAIIl2lOQTMvom97lNPv/aRn4JUjlKtkoLQzls9VbWN454ymEtvRkTvoxQUFOGW/OrFu+tAtg3BkSRvdYEeQPDVDNCkYDoqGzx1I5LOP5h9R9h2oRA9QsAYP4fzrBSDcRHPlcJZoEK2S8ElCpgZ6bqeLLdyGNUNbdm6vPtE9k5QeSNKO4j0YnVo8t5RVXTWa78CpHMd1VMS+vhTbYBtsWJVqBPDMGZBAIqVNFit+qRvy+RuRIdxZaI9yIpYLYCtzmiaH8Y3R1jDPLNaALGhbiXwcOOKVQLDzNeAOSq7SzQCSBRzOQBUmLmXhVHzgkBTE+Z5HeV8EkDTDJSt/w/wF0QXejAZ0e4bAAAAAElFTkSuQmCC'
			
			box1.setAttribute('data-box', '_box1_')
			box2.setAttribute('data-box', '_box2_')
			box3.setAttribute('data-box', '_box3_')
			box4.setAttribute('data-box', '_box4_')
 			box1.appendChild(cancel).setAttribute('data-box', '_box1_')
 			box2.appendChild(leftRotate).setAttribute('data-box', '_box2_')
 			box3.appendChild(rightRotate).setAttribute('data-box', '_box3_')
 			box4.appendChild(ok).setAttribute('data-box', '_box4_')
 			toolbarElement.appendChild(box1)
 			toolbarElement.appendChild(box2)
 			toolbarElement.appendChild(box3)
 			toolbarElement.appendChild(box4)

 			this.toolbar = toolbarElement
 		}, 		
 		clearCanvas: function() {
 			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
 			this.context.fillStyle = '#000';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
 		},
 		renderImg: function() {
 			var _this = this;
 			if(!this.source)
 				throw 'no source';
 			this.clearCanvas()
			if(typeof this.source === 'string') {
 				this.img = document.createElement('img')
 				this.img.src = this.source 	
 				this.img.onload = function() { 	
	 				_this.initRenderImg(this)
				}			
 			}else if(this.source instanceof HTMLImageElement || this.source instanceof Image || this.source instanceof HTMLCanvasElement) {
 				this.img = this.source
 				this.initRenderImg(this.img)
 			}else{
 				throw 'source type error';
 			}
 		},
 		initRenderImg: function(img) {
 			var imgSize = this.getImgRenderSize(img)
 			this.scaleSize.width = img.width
 			this.scaleSize.height = img.height
 			this.scaleMax = Math.min.apply(null, [img.width, img.height]) * 1.5
			this.imgSize.width = imgSize.width
			this.imgSize.height = imgSize.height
			this.context.save()
			this.offset.x = global.innerWidth / 2
			this.offset.y = (global.innerHeight - 50) / 2
			this.context.translate(this.offset.x, this.offset.y)
			this.context.drawImage(this.img, -this.imgSize.width / 2, -this.imgSize.height / 2, this.imgSize.width, this.imgSize.height)
			this.context.restore()			
			this.imgPosition.x = (global.innerWidth-imgSize.width) / 2
			this.imgPosition.y = (global.innerHeight - imgSize.height - 50 ) / 2
			this.drawCutRect()
 		},
 		drawImg: function() {
 			this.offset.x = this.imgPosition.x+this.imgSize.width / 2
 			this.offset.y = this.imgPosition.y+this.imgSize.height / 2
 			this.clearCanvas()
 			this.context.save()
 			this.context.translate(this.offset.x, this.offset.y) 		
 			this.context.rotate(this.angle);
			this.context.drawImage(this.img, -this.imgSize.width / 2, -this.imgSize.height / 2, this.imgSize.width, this.imgSize.height)
			this.context.restore()
			this.drawCutRect()
			this.log()
			return this;
 		},
 		drawCutRect: function() {
			this.context.beginPath()
 			this.context.rect(0, 0, this.canvas.width, this.canvas.height)	 			
 			this.context.moveTo(this.cutPosition.x, this.cutPosition.y)
 			this.context.lineTo(this.cutPosition.x, this.cutPosition.y + this.cutRectSize)
 			this.context.lineTo(this.cutPosition.x + this.cutRectSize, this.cutPosition.y + this.cutRectSize)
 			this.context.lineTo(this.cutPosition.x + this.cutRectSize, this.cutPosition.y)
 			this.context.closePath()
 			this.context.fillStyle = 'rgba(0,0,0,0.5)'
			this.context.fill()
 			this.context.strokeStyle = '#E6E6E6'
 			this.context.strokeRect(this.cutPosition.x, this.cutPosition.y, this.cutRectSize, this.cutRectSize)
 		},
 		cutImg: function() {
 			var tempCanvas = document.createElement('canvas'),
 				ctx = tempCanvas.getContext('2d');
 			tempCanvas.width = tempCanvas.height = this.cutRectSize;	
 			ctx.drawImage(this.canvas, this.cutPosition.x, this.cutPosition.y, this.cutRectSize, this.cutRectSize, 0, 0, this.cutRectSize, this.cutRectSize)
			this.cutEvent && this.cutEvent(tempCanvas.toDataURL("image/png"))
 		},
 		rotateImg: function(direction) {
 			if(this.moveTimer === null) {
 				if(this.DIRECTION.left === direction) {
	 				this.angle -= 90 * Math.PI / 180
	 			}else{
	 				this.angle += 90 * Math.PI / 180
	 			} 		
	 			this.drawImg().dockImg()		
 			} 				
 		},
 		bindEvent: function() {
 			var _this = this;
 			new AlloyFinger(_this.toolbar, {
 				singleTap: function(evt) {
 					switch(evt.target.getAttribute('data-box')) {
 						case '_box1_': 
 							_this.destory()
 							break;
 						case '_box2_':
 							_this.rotateImg(_this.DIRECTION.left)
 							break;
 						case '_box3_':
 							_this.rotateImg(_this.DIRECTION.right)
 							break;
 						case '_box4_':
 							_this.cutImg()
 							break;		
 					}
 				}
 			})
 			new AlloyFinger(_this.canvas, {
 				touchMove: function(evt) {					
                    evt.preventDefault();	
				},
 				pressMove: function(evt) {
 					if(_this.moveTimer===null) {
	 					_this.imgPosition.x += evt.deltaX
	 					_this.imgPosition.y += evt.deltaY
	 					_this.drawImg() 	
	 				}
                },
                pinch: function(evt) {     
                	if(_this.moveTimer===null) {
                		var scaleWidth = _this.scaleSize.width * evt.scale,
	                		scaleHeight = _this.scaleSize.height * evt.scale,
	                		temp = Math.min.apply(null, [scaleWidth, scaleHeight]);	 
	                	if(temp<_this.scaleMax && temp > _this.scaleMin) {
	                		_this.imgPosition.x += (_this.imgSize.width - scaleWidth) / 2;
							_this.imgPosition.y += (_this.imgSize.height - scaleHeight) /2;
							_this.imgSize.width = scaleWidth;
							_this.imgSize.height = scaleHeight;
							_this.drawImg()
	                	}
                	} 
                },
                touchEnd: function(evt) {
                	if(_this.moveTimer===null){
                		_this.scaleSize.width = _this.imgSize.width
	                	_this.scaleSize.height = _this.imgSize.height
	                	_this.dockImg()
                	}                	
                }
 			})
 		},
 		//校正图片位置，保证不会脱离剪切框
 		dockImg: function() {
			var x = this.cutPosition.x, 
				y = this.cutPosition.y, 
				w = this.imgSize.width, 
				h = this.imgSize.height,
				ox = this.offset.x,
				oy = this.offset.y,
				dx, dy, ax, ay, isRotate = false,
				ix = this.imgPosition.x,
				iy = this.imgPosition.y,
				px = ix,
				py = iy,
				cr = this.cutRectSize / 2,
				dock = {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0
				};
			ax = w / 2 - cr
			ay = h / 2 - cr	
			//图片旋转横竖时交换坐标
			if(this.angle / (90 * Math.PI / 180) % 2 !== 0) {
				ay = w / 2 - cr
				ax = h / 2 - cr	
			}	
			dx = x + cr
			dy = y + cr
			//计算图片各边不会脱离剪切框的坐标范围
			dock.top = dy - ay
			dock.right = dx + ax
			dock.bottom = dy + ay
			dock.left = dx - ax
			//判断纵坐标是否脱离范围
			if(oy < dock.top) {
				py = dock.top - h / 2
			}else if(oy > dock.bottom){
				py = dock.bottom - h / 2
			}
			//判断横坐标是否脱离范围
			if(ox > dock.right) {
				px = dock.right - w / 2
			}else if(ox < dock.left) {
				px = dock.left - w / 2
			}
			this.moveImg(ix, iy, px, py)
 		},
 		moveImg: function(x, y, tx, ty) {
 			var _x = tx - x,
 				_y = ty - y,
 				_this = this,
 				m = 1,
 				d = 16,
 				p = 1;
 			var move = function() {
 				if(x > tx && _this.imgPosition.x < tx || x < tx && _this.imgPosition.x > tx) {
					_this.imgPosition.x = tx 			
 				}
 				if(y > ty && _this.imgPosition.y < ty || y < ty && _this.imgPosition.y > ty) {
 					_this.imgPosition.y = ty 		
 				}
 				if(_this.imgPosition.x === tx && _this.imgPosition.y === ty) {
 					console.log('fuck')
 					cancelAnimationFrame(_this.moveTimer)
 					_this.drawImg().moveTimer = null 					
 					return;
 				}
 				p = _this.easeOut(m/d)
 				m++;
 				_this.imgPosition.x = x + p * _x
 				_this.imgPosition.y = y + p * _y
 				_this.drawImg().moveTimer = requestAnimationFrame(move)
 			}
 			move()
 		},
 		destory: function() {
 			var _this = this
 			this.closeEvent && this.closeEvent() 
 			global.removeEventListener('orientationchange', _this.resize, false)
 			this.resize = null
 			this.container.parentNode.removeChild(this.container)
 		},
 		getImgRenderSize: function(imgObj) {
			var imgWidth = imgObj.width,
			  	imgHeight = imgObj.height,
			  	clientWidth = global.innerWidth,
				clientHeight = global.innerHeight,				
			 	rateWidth = clientWidth / imgWidth,
			 	rateHeight = clientHeight / imgHeight,
			 	rate = rateWidth < rateHeight ? rateWidth : rateHeight;
			if(rate < 1) {
				imgWidth = imgWidth * rate
				imgHeight = imgHeight * rate
			}
			return {
				width:imgWidth,
				height:imgHeight
			}
		},
		easeOut: function(p) {
			return 1 - Math.pow(1 - p, 2)
		},
		log: function() {
			this.context.font = '14px verdana'
			this.context.fillStyle = '#FFF'
			this.context.fillText('orientation: ' + global.orientation, 10, 20)
			this.context.fillText('scale: ' + this.imgSize.width/this.img.width, 10, 36)
			this.context.fillText('rotate: ' + this.angle, 10, 52)			
		}
 	}
 	global.ImgClip = ImgClip
 })(window, AlloyFinger)