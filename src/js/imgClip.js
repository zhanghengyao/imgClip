 ;(function(global, AlloyFinger) {
 	var ImgClip = function(options){
 		this.opt = options || {}
 		this.el = this.opt.el || document.body
 		this.canvas = null
 		this.context = null
 		this.container = null
 		this.toolbar = null
 		this.source = this.opt.source
 		this.cutRectSize = this.opt.cutRectSize || 200
 		this.cutPosition = null
 		this.img = null
 		this.angle = 0
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
		this.scaleMin = this.cutRectSize
		this.scaleMax = 1
 		this.init()
 	}
 	ImgClip.prototype = {
 		init: function() {
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
 		},
 		createContainer: function() {
 			var containerElement = document.createElement('div')
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
 		destory: function() {
 			this.container.parentNode.removeChild(this.container)
 		},
 		clearCanvas: function() {
 			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
 			this.context.fillStyle = '#000';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
 		},
 		renderImg: function(x, y) {
 			var _this = this;
 			if(!this.source)
 				throw 'source is null';
 			this.clearCanvas()
			if(typeof this.source === 'string'){
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
 		initRenderImg: function(img){
 			var imgSize = this.getImgRenderSize(img)
 			this.scaleSize.width = img.width
 			this.scaleSize.height = img.height
 			this.scaleMax = Math.min.apply(null, [img.width, img.height]) * 1.5
			this.imgSize.width = imgSize.width
			this.imgSize.height = imgSize.height
			this.context.save()
			this.context.translate(global.innerWidth/2, (global.innerHeight-50)/2)
			this.context.drawImage(this.img, -this.imgSize.width/2, -this.imgSize.height/2, this.imgSize.width, this.imgSize.height)
			this.context.restore()
			this.drawCutRect()
			this.imgPosition.x = (global.innerWidth-imgSize.width)/2
			this.imgPosition.y = (global.innerHeight-imgSize.height-50)/2
 		},
 		drawImg: function() {
 			this.offset.x = this.imgPosition.x+this.imgSize.width/2
 			this.offset.y = this.imgPosition.y+this.imgSize.height/2
 			this.clearCanvas()
 			this.context.save()
 			this.context.translate(this.offset.x, this.offset.y) 		
 			this.context.rotate(this.angle);
			this.context.drawImage(this.img, -this.imgSize.width/2, -this.imgSize.height/2, this.imgSize.width, this.imgSize.height)
			this.context.restore()
			this.drawCutRect()
 		},
 		drawCutRect: function() {
			this.context.beginPath()
 			this.context.rect(0, 0, this.canvas.width, this.canvas.height)	 			
 			this.context.moveTo(this.cutPosition.x, this.cutPosition.y)
 			this.context.lineTo(this.cutPosition.x, this.cutPosition.y+this.cutRectSize)
 			this.context.lineTo(this.cutPosition.x+this.cutRectSize, this.cutPosition.y+this.cutRectSize)
 			this.context.lineTo(this.cutPosition.x+this.cutRectSize, this.cutPosition.y)
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
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)	
			this.source = tempCanvas
			this.renderImg()
 		},
 		rotateImg: function(direction) {
 			if(this.DIRECTION.left===direction){
 				this.angle -= 90*Math.PI/180
 			}else{
 				this.angle += 90*Math.PI/180
 			} 		
 			this.drawImg();				
 		},
 		bindEvent: function(){
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
 					_this.imgPosition.x += evt.deltaX
 					_this.imgPosition.y += evt.deltaY
 					_this.drawImg() 	
                },
                pinch: function(evt) {      
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
					
                },
                touchEnd: function(evt) {
                	_this.scaleSize.width = _this.imgSize.width
                	_this.scaleSize.height = _this.imgSize.height
                	_this.dockImg()
                }
 			})
 		},
 		dockImg: function() {
 			this.context.beginPath()
 			this.context.arc(this.cutPosition.x+this.cutRectSize/2,this.cutPosition.y+this.cutRectSize/2,5,0,Math.PI*180,false) 			
 			this.context.fillStyle = 'red'
			this.context.fill()
			this.context.beginPath()
			this.context.arc(this.offset.x,this.offset.y,5,0,Math.PI*180,false)
			this.context.fillStyle = 'green'
			this.context.fill()
			var x = this.cutPosition.x, 
				y = this.cutPosition.y, 
				ox = this.offset.x, 
				oy = this.offset.y, 
				w = this.imgSize.width, 
				h = this.imgSize.height,
				dx, dy;
			dx = ox-x-w/2	
			dy = oy-y-h/2		
			// if(this.angle/90*Math.PI/180%2!==0){
			// 	dx = ox-x-h/2	
			// 	dy = oy-y-w/2
			// }
			
			
			// if(dx > 0 && dy > 0){
			// 	this.imgPosition.x -= dx
			// 	this.imgPosition.y -= dy
			// }else if(dx > 0 && dy < 0){
			// 	this.imgPosition.x -= dx
			// }else if(dx < 0 && dy > 0){
			// 	this.imgPosition.y -= dy				
			// }
			
			// this.drawImg()
			document.getElementById('log').innerHTML = 'cut: '+x+' X '+y 
											                	+'<br> offset: '+ox+' X '+oy
											                	+'<br> imgSize: '+w+' X '+h
											                	+'<br> dock: '+dx+' X '+dy
											                	+'<br> imgPosition: '+this.imgPosition.x+' X '+this.imgPosition.y

 		},
 		getImgRenderSize: function(imgObj) {
			var imgWidth = imgObj.width,
			  	imgHeight = imgObj.height,
			  	clientWidth = global.innerWidth,
				clientHeight = global.innerHeight,				
			 	rateWidth = clientWidth/imgWidth,
			 	rateHeight = clientHeight/imgHeight,
			 	rate = rateWidth < rateHeight ? rateWidth : rateHeight;
			if(rate<1) {
				imgWidth = imgWidth * rate
				imgHeight = imgHeight * rate
			}
			return {
				width:imgWidth,
				height:imgHeight
			}
		},
		reverse: function(numA, numB) {
			numA = numA + numB
			numB = numA - numB
			numA = numA - numB
		}
 	}
 	global.ImgClip = ImgClip
 })(window, AlloyFinger)