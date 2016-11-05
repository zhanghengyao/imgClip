# imgClip
移动端图片剪裁<br/><br/>
![clip demo](https://zhanghengyao.github.io/imgClip/src/img/demo.jpg)

----------
# demo
请用手机扫描查看<br/><br/>
![clip demo](https://zhanghengyao.github.io/imgClip/src/img/qrcode.png)

# example
``` javascript
new ImgClip({
			el: 'clip_el',
			source:'./src/img/6.jpg',
			cutEvent: function(e) {
				var img = document.createElement('img')
				img.src = e
				this.el.appendChild(img)
			},
			closeEvent: function() {
				alert('关闭')
			}
		})
```