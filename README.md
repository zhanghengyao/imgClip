# imgClip
移动端图片剪裁<br/><br/>
![demo](https://zhanghengyao.github.io/imgClip/src/img/demo.jpg =400x400)
----------
# demo
请用手机扫描查看<br/><br/>
![clip demo](https://zhanghengyao.github.io/imgClip/src/img/qrcode.png)

# example
``` javascript
new ImgClip({
			el: 'clip_el',//挂载的元素（可选），不设置默认挂载到body上，可以传元素ID、元素class或元素自身
			source: './src/img/6.jpg',//裁剪图片源（必设），可以传图片路径，img元素或canvas元素
			cutRectSize: 200,//剪切框大小（可选），不设置默认是200
			cutEvent: function(e) {//剪切回调，返回剪切图片的base64
				var img = document.createElement('img')
				img.src = e
				this.el.innerHTML = ''
				this.el.appendChild(img)
			},
			closeEvent: function() {//关闭前回调
				alert('关闭')
			}
		})
```