$package("aralork.lib","Style",
	{
		setOpacity:function(obj,v){
			v=isNaN(v)?0:v;
			v=Math.max(Math.min(1,v),0);
			if ($IE) {
				if(obj.style.filter.indexOf("progid:DXImageTransform.Microsoft.Alpha(opacity=")>-1){
					
					obj.style.filter=obj.style.filter.replace(/progid\:DXImageTransform\.Microsoft\.Alpha\(opacity\=\d*\)/,
											"progid:DXImageTransform.Microsoft.Alpha(opacity=" + v * 100 + ")");
				}else{
					obj.style.filter+="progid:DXImageTransform.Microsoft.Alpha(opacity=" + v * 100 + ")";
				}
			}else {
				typeof obj.style.MozOpacity !=="undefined" && (obj.style.MozOpacity = v);
				typeof obj.style.opacity !=="undefined" && (obj.style.opacity = v);
			}
		},
		
		/**
		 * 设置对象的水平翻转
		 * @param {Object} obj
		 * @param {Boolean} state
		 */
		setFlipH:function(obj,state){
			var mtx="matrix(-1,0,0,1,0,0)";
			
			if($IE){
				if (state) {
					obj.style.filter.indexOf("progid:DXImageTransform.Microsoft.BasicImage(mirror=1)") === -1 &&
						(obj.style.filter += "progid:DXImageTransform.Microsoft.BasicImage(mirror=1)");
				}else{
					obj.style.filter=obj.style.filter.replace("progid:DXImageTransform.Microsoft.BasicImage(mirror=1)","");
				}
			}else{
				typeof obj.style.MozTransform !=="undefined" && (obj.style.MozTransform=state?mtx:"");
				typeof obj.style.webkitTransform !=="undefined" && (obj.style.webkitTransform=state?mtx:"");
				typeof obj.style.OTransform !=="undefined" && (obj.style.OTransform=state?mtx:"");
				typeof obj.style.transform !=="undefined" && (obj.style.transform=state?mtx:"");
			}
		}
	}
);
