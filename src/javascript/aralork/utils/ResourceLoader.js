/**
 * @fileoverview 资源装载类
 * @author Random | Random.Hao.Yang@gmail.com
 * @example
 * 		var rl=aralork.utils.ResourceLoader;
		rl.addEventListener("complete",function(){
			var a=this.getImage("http://pic002.cnblogs.com/images/2010/24266/2010101615481539.jpg");
			a.style.position="absolute";
			a.style.top=0;
			document.body.appendChild(a);
		});
		rl.load("img",["http://bbs.51js.com/images/default/logo.gif","http://pic002.cnblogs.com/images/2010/24266/2010101615481539.jpg"]);
 */
$import("aralork.events.EventDispatcher");
$import("aralork.lib.Lib");


$package("aralork.utils","ResourceLoader",

	/**
	 * 资源装载类
	 * 		event
	 * 			loading 正在装载
	 * 			complete 装载完成
	 */
	{
		/**
		 * 要装载的所有资源的数量
		 */
		totalCount:0,
		
		/**
		 * 所有资源的当前装载数
		 */
		totalCurrent:0,
		
		/**
		 * load操作时要装载的资源的数量
		 */
		loadingCount:0,
		
		/**
		 * load操作时的当前装载数
		 */
		loadingCurrent:0,
		
		__eventDispatcher:null,
		
		__resources:{},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			!this.__eventDispatcher && (this.__eventDispatcher=new aralork.events.EventDispatcher(this));
			this.__eventDispatcher.addEventListener(type,handle);
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			!this.__eventDispatcher && (this.__eventDispatcher=new aralork.events.EventDispatcher(this));
			this.__eventDispatcher.removeEventListener(type,handle);
		},
		
		/**
		 * 装载资源
		 * @param {String} type
		 * 				img 图片
		 * 
		 * @param {String} url
		 */
		load:function(type,url){
			var me=this,
				methods={
					"img":me.__loadImage
				};
				
			this.totalCount=0;
			this.loadingCount=0;
			aralork.lib.Lib.checkFunction(methods[type]) && methods[type].call(this,type,url);
		},
		
		/**
		 * 获取装载完成的图片
		 * @param {String} url
		 */
		getImage:function(url,isCopy){
			var img=this.__resources["img"+"_"+this.__getKey(url)];
			if(!img){
				throw new Error($__ErrorCode__["E10010"]+":"+url);
			}else{
				if(isCopy){
					var retImg=new Image();
					retImg.src=img.src;
					return retImg;
				}else{
					return img;
				}
				
			}
		},
		
		
		__loadImage:function(type,url){
			var i;
			
			if(url instanceof Array){
				this.totalCount+=url.length;
				this.loadingCount=url.length;
				this.loadingCurrent=0;
				i=url.length;
				
				while(i--){
					this.__updateImageLoad(type,url[i]);
				}
				
			}else if(typeof url === "string"){
				this.totalCount++;
				this.loadingCount=1;
				this.loadingCurrent=0;
				this.__updateImageLoad(type,url);
			}
		},
		
		__updateImageLoad:function(type,url){
			var res,
				me=this;
			
			if(typeof this.__resources[type+this.__getKey(url)] === "undefined"){
				res=new Image();
				res.onload=function(){
					me.__checkLoading();
				};
				res.onerror=function(){
					me.__checkLoading();
					throw new Error($__ErrorCode__["E10009"]+":"+this.src);
				};
				res.src=url;
				
				this.__resources[type+"_"+this.__getKey(url)]=res;
			}
		},
		
		__checkLoading:function(){
			this.loadingCurrent++;
			this.totalCurrent++;
			this.__eventDispatcher.dispatchEvent("loading",this.totalCurrent,this.totalCount);
			this.loadingCurrent==this.loadingCount && this.__eventDispatcher.dispatchEvent("complete",this.totalCount);
		},
		
		__getKey:function(url){
			return url.replace(/^http\:\/\//g,"").replace(/\/|\\|\./g,"_");
		}
	}
);
