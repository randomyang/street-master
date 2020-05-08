
/**
 * @fileoverview 错误代码
 * @author Random | Random.Hao.Yang@gmail.com
 */

$__ErrorCode__={
	"E10001":"Class name must be uppercase first letter",
	"E10002":"Name space must be lowercase first letter",
	"E10003":"The import of the path is invalid",
	"E10004":"Parent class is not specified",
	"E10005":"Parameter type must be an object",
	"E10006":"\"$extends\" statement can not be after at \"$implements\"",
	"E10007":"Interface method has not been implemented",
	"E10008":"\"$extends\",\"$implements\" or \"define\" statement can not be after at \"define\"",
	"E10009":"Image load failed",
	"E10010":"Image not loaded",
	"E10011":"invalid image object"
};
/**
 * @fileoverview package
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		$package("aralork.common.test","Class1",function(){
 * 			this.x=10;
 * 		});
 */

$package=function(ns,clzName,clz){
	function defineNamespace(root,ns){
		ns=ns || "";
		ns=ns.replace(/\s/g,"");
		
		if (ns.length == 0) {
			return root;
		}else {
			var nsc = ns.substr(0, 1);
			if (nsc != nsc.toLowerCase()) {
				throw new Error("Error \""+ns+"\":"+$__ErrorCode__["E10002"]);
			}
			
			if (ns.indexOf(".") == -1) {
				typeof(root[ns]) != "object" && (root[ns] = {});
				return root[ns];
			}
			else {
				var _ns = ns.split(".")[0];
				typeof(root[_ns]) != "object" && (root[_ns] = {});
				return defineNamespace(root[_ns], ns.replace(/[^\.]*\./, ""));
			}
		}
	}
	
	var c=clzName.substr(0,1);
	
	if(c!=c.toUpperCase()){
		throw new Error("Error \""+clzName+"\":"+$__ErrorCode__["E10001"]);
	}
	
	defineNamespace(window,ns)[clzName]=clz;
};
/**
 * @fileoverview 浏览器和操作系统检测
 * @author Random | Random.Hao.Yang@gmail.com
 */
var	$IE,
	$IE5,
	$IE55,
	$IE6,
	$IE7,
	$IE8,
	$OPERA,
	$MOZ,
	$SAFARI,
	$FF2,
	$FF,
	$CHROME,
	$WEBKIT,
	$TT,
	$360,
	$Maxthon=false,
	$XP,
	$Vista;
	
(function(){
	var _ua = navigator.userAgent.toLowerCase();
	$IE = /msie/.test(_ua);
	$IE5 = /msie 5 /.test(_ua);
	$IE55 = /msie 5.5/.test(_ua);
	$IE6 = /msie 6/.test(_ua);
	$IE7 = /msie 7/.test(_ua);
	$IE8 = /msie 8/.test(_ua);
	$OPERA = /opera/.test(_ua);
	$MOZ = /gecko/.test(_ua);
	$SAFARI = /safari/.test(_ua);
	$XP=/windows nt 5.1/.test(_ua);
	$Vista=/windows nt 6.0/.test(_ua);
	$FF2=/firefox\/2/i.test(_ua);
	$FF = /firefox/i.test(_ua);
	$CHROME = /chrome/i.test(_ua);
	$TT=/tencenttraveler/.test(_ua);
	$360=/360se/.test(_ua);
	$WEBKIT=/webkit/i.test(_ua);
	try{
		var t=window.external;
		$Maxthon=!!t.max_version;
	}catch(e){}
})();

/**
 * @fileoverview 接口实现的定义
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		
		var IExampleInterface={
			show:function(){},
			hidden:function(){}
		};
		
		var Class1=function(){
		
		}.$implements(IExampleInterface).define({
			show:function(){
				alert("show");
			},
			hidden:function(){
				alert("hidden");
			}
		});
		
 		var Class1=function(){

		}.$extends(SuperClass).$implements(IExampleInterface).define({
			show:function(){
				alert("show");
			},
			hidden:function(){
				alert("hidden");
			}
		});
 */

Function.prototype.$implements = function() {
	var arg = Array.prototype.slice.call(arguments, 0),
		fn,
		i=arg.length,
		k;
		
	while(i--){
		if(typeof arg[i]!=="object"){
			throw new Error("interface implements error:"+$__ErrorCode__["E10005"]);
		}
		
		for(k in arg[i]){
			typeof this.prototype[k]==="undefined" && (this.prototype[k]="NI");
		}
	}
	
	this.__interface__=true;
	
	this.$extends = function(){
		throw new Error("interface implements error:"+$__ErrorCode__["E10006"]);
	};
	
	return this;
};
/**
 * @fileoverview class define
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		var SuperClass=function(name){
			this.name=name;
			this.list=["a","b"];
		}.define({
			show:function(){
				alert(this.name);
			}
		});
		
		var SubClass=function(name,age){
			this.age=age;
		}.$extends(SuperClass).define({
			display:function(){
				alert(this.age);
			}
		});
		
		var Sub=function(name,age){
			
		}.$extends(SubClass).define({
			show:function(){
				Sub.$super.show.call(this);
				alert("haahh");
			}
		});
 */

(function(){
	function object(o){
		function F(){}
		F.prototype=o;
		return new F();
	}
	
	Function.prototype.define=function(def){
		var k;
	    for(k in def){
	        this.prototype[k]=def[k];
	    }
		
		if(this.__interface__){
			for(k in this.prototype){
				if(this.prototype[k]==="NI"){
					throw new Error("class define error ["+k+"]:"+$__ErrorCode__["E10007"]);
				}
			}
		}
		
		this.prototype.constructor=this;
		this.$extends = this.define = this.$implements = function(){
			throw new Error("class define error:"+$__ErrorCode__["E10008"]);
		};
	    return this;
	};
	
	Function.prototype.$extends=function(){
		var me=this,
			i=arguments.length,
			k,
			sup,
			fn;
			
		if(i===0){
			throw new Error("$extend error:"+$__ErrorCode__["E10004"]);
		}
		
		sup=arguments[0];
		fn=function(){
            sup.apply(this,arguments);
			me.apply(this,arguments);
        };
        fn.prototype=object(sup.prototype);
        fn.prototype.constructor=fn;
		fn.$super=sup.prototype;
		
		return fn;
	};
})();


/**
 * @fileoverview core 包括错误代码、包的定义、类的定义、浏览器检测
 * @author Random | Random.Hao.Yang@gmail.com
 */







var $E = function(id){
	return document.getElementById(id);
};
var $C=function(tag){
	return document.createElement(tag);
};
/**
 * @fileoverview 事件静态类
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.events","Event",
	{
		/**
		 * 获取触发事件的目标对象
		 */
		getTarget:function(){
			var e=aralork.events.Event.getEvent();
			return e.target || e.srcElement;
		},
		
		/**
		 * 获取被触发的事件
		 */
		getEvent:function(){
			if (window.event) {
				return window.event;
			}else {
				var fn=arguments.callee.caller,
					e=null,
					n=30;

				while(fn!=null && n--){
					e=fn.arguments[0];
					if(e && (e.constructor==Event || e.constructor==MouseEvent)){
						return e;
					}
					fn=fn.caller;
				}
				return e;
			}
		},
		
		/**
		 * 如果是触发的按键事件,可以获取到按键的值
		 */
		getKeyCode:function(){
			return aralork.events.Event.getEvent().keyCode;
		},
		
		/**
		 * 停止事件的传播
		 */
		stop:function(){
			var e=aralork.events.Event.getEvent();
			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble=true;
			}
		},
		
		/**
		 * 取消事件,以阻止浏览器响应事件
		 */
		cancel:function(){
			var e=aralork.events.Event.getEvent();
			if(e.preventDefault){
				e.preventDefault();
			}else{
				e.returnValue=false;
			}
		}
	}
);

/**
 * @fileoverview 事件管理静态类
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		aralork.events.EventManager.addEventListener(node,"click",function(){
 * 			alert("click");
 * 		},true);
 */

$package("aralork.events","EventManager",
	{
		/**
		 * 为页面节点添加事件
		 * @param {Object} node
		 * @param {String} type
		 * @param {Function} handle
		 * @param {Boolean} isCapture
		 */
		addEventListener:function(node,type,handle,isCapture){
			if(!this.__checkedNode(node)){
				return;
			}

			if(node.addEventListener){
				node.addEventListener(type,handle,!!isCapture);
			}else if(node.attachEvent){
				node.attachEvent("on"+type,handle);
			}else{
				node["on"+type]=handle;
			}
		},
		
		/**
		 * 从指定的页面节点移除已经添加的事件
		 * @param {Object} node
		 * @param {String} type
		 * @param {Function} handle
		 * @param {Boolean} isCapture
		 */
		removeEventListener:function(node,type,handle,isCapture){
			if(!this.__checkedNode(node)){
				return;
			}
			
			if(node.removeEventListener){
				node.removeEventListener(type,handle,!!isCapture);
			}else if(node.detachEvent){
				node.detachEvent("on"+type,handle);
			}else{
				node["on"+type]="";
			}
		},
		
		/**
		 * 检测节点合法性
		 * @param {Object} node
		 */
		__checkedNode:function(node){
			return (typeof node==="object");
		}
	}
);

/**
 * @fileoverview 键盘按键事件静态类
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.utils","KeyListenerType",
	{
		DOWN:"keydown",
		UP:"keyup",
		PRESS:"keypress"
	}
);

/**
 * @fileoverview 键盘按键监听类
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		var kl=new aralork.utils.KeyListener(document);
		kl.add(66,"keydown",function(){
			alert(this.node)
		});
 */





$package("aralork.utils","KeyListener",
	function(node){
		this.node=node || document;
		this.__types={};
		this.__events={};
	}.define({
		
		/**
		 * 添加按键侦听
		 * @param {Number} code
		 * @param {String} type
		 * @param {Function} handle
		 */
		add:function(code,type,handle){
			if(!this.__checkedType(type)){
				return;
			}
			var me=this;
			
			!this.__events[type+"_"+code] && (this.__events[type+"_"+code]={
				code:code,
				type:type,
				handles:[]
			});
			
			this.__events[type+"_"+code].handles.unshift(handle);
			
			if(!this.__types[type]){
				this.__types[type]=1;
				aralork.events.EventManager.addEventListener(this.node,type,function(){
					me.__callHandle(type);
				});
			}
			
			return this;
		},
		
		/**
		 * 移除按键侦听
		 * @param {Number} code
		 * @param {String} type
		 * @param {Function} handle 要移除的function,如果不指定则移除当前code和type的所有function
		 */
		remove:function(code,type,handle){
			if(!this.__events[type+"_"+code]){
				return;
			}
			var k,
				evt,
				i;
			
			for(k in this.__events){
				evt=this.__events[k];
				if(evt.code==code && evt.type==type){
					if(handle){
						i=evt.handles.length;
						while(i--){
							evt.handles[i]==handle && evt.handles.splice(i,1);
						}
					}else{
						evt.handles=[];
					}
				} 
			}
			
			return this;
		},
		
		/**
		 * 调用绑定的function
		 */
		__callHandle:function(type){
			var k,
				evt,
				i,
				keyCode=aralork.events.Event.getKeyCode();
				
			for(k in this.__events){
				evt=this.__events[k];
				if(evt.code==keyCode && evt.type==type){
					i=evt.handles.length;
					while(i--){
						evt.handles[i].call(this,evt.code);
					}
				}
			}
		},
		
		/**
		 * 检测事件类型的合法性,事件类型必须包括在KeyListenerType中
		 * @param {String} type 
		 */
		__checkedType:function(type){
			var k,
				klt=aralork.utils.KeyListenerType;
				
			for(k in klt){
				if(klt[k]===type){
					return true;
				}
			}
			return false;
		}
	})
);

/**
 * @fileoverview 自定义事件调度器
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.events","EventDispatcher",
	function(target){
		this.__target=target;
		this.__events={};
	}.define({
		addEventListener:function(type,handle){
			if (!this.__checkFunction(handle)) {
				return;
			}
			
			var evts=this.__events;
			type=type.toLowerCase();
			
			!evts[type] && (evts[type]=[]);
			evts[type].push(handle);
		},
		removeEventListener:function(type,handle){
			var evts=this.__events[type];
			type=type.toLowerCase();
			
			if (!this.__checkFunction(handle) || !evts || !evts.length) {
				return;
			}
			for(var i=evts.length-1;i>=0;i--){
				evts[i]==handle && evts.splice(i,1);
			}
		},
		dispatchEvent:function(type){
			type=type.toLowerCase();
			var evts=this.__events[type];
			if (!evts || !evts.length) {
				return;
			}

			var args=Array.prototype.slice.call(arguments,1);
			for(var i=0,l=evts.length;i<l;i++){
				evts[i].apply(this.__target,args);
			}
		},
		
		__checkFunction:function(func){
			return typeof func !=="string" && String.prototype.slice.call(func, 0, 8) == "function";
		}
	})
);

/**
 * @fileoverview Lib静态类，公用方法的集合
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.lib","Lib",
	{
		/**
		 * 给对象定义getter的方法，只适合返回Number和String类型的数据
		 * @param {Object} obj 要定义getter的对象
		 * @param {Object} p 定义的属性
		 * @param {Object} fn 操作的function
		 */
		defineGetter : function(obj, p, fn){
			var me=this;
			if (p instanceof Array && fn instanceof Array) {
				var i = Math.min(p.length, fn.length);
				while (i--) {
					if (typeof p[i] === "string" && me.checkFunction(fn[i])) {
						obj[p[i]] = {
							valueOf: (function(j){
								return function(){
									var ret = fn[j].call(obj);
									return typeof ret === "number" || typeof ret ==="string" ? ret : null;
								};
							})(i),
							toString: this.valueOf
						};
					}
				}
			}else if (typeof p === "string" && me.checkFunction(fn)) {
				obj[p] = {
					valueOf: function(){
						var ret = fn.call(obj);
						return typeof ret === "number" || typeof ret ==="string" ? ret : null;
					},
					toString: this.valueOf
				};
			}
		},
		
		/**
		 * 检测对象是否为Function类型(最简陋的方式。。。- -！)
		 * @param {Object} fn
		 */
		checkFunction:function(fn){
			return fn && typeof fn !=="string" && String.prototype.slice.call(fn, 0, 8) == "function";
		},
		
		/**
		 * 交换字符串，把主串str里的subStr1和subStr2作交换
		 * @param {String} str 主串
		 * @param {String} subStr1 需要交换的第一个子串
		 * @param {String} subStr2 需要交换的第二个子串
		 */
		swapString:function(str,subStr1,subStr2){
			var p=new RegExp("("+subStr1+"|"+subStr2+")","g");
					
			return str.replace(p,function(m){
				if(m===subStr1){
					return subStr2;
				}else if(m===subStr2){
					return subStr1;
				}
			});
		},
		
		/**
		 * 获取唯一ID
		 */
		getUniqueID:function(){
			return parseInt(Math.random()*10000).toString()+(new Date()).getTime().toString();
		}
	}
);

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

/**
 * @fileoverview IRenderer接口，所有呈现对象的显示和隐藏方法的接口
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.display","IRenderer",{
	
		/**
		 * 显示对象的方法
		 * @param {Object} node
		 */
		show:function(node){},
		
		/**
		 * 隐藏对象的方法
		 * @param {Object} node
		 */
		hidden:function(node){}
	}
);

/**
 * @fileoverview SimpleRenderer类，简单的显示隐藏效果
 * @author Random | Random.Hao.Yang@gmail.com
 */



$package("aralork.display.renderer","SimpleRenderer",
	function(){
		
	}.$implements(aralork.display.IRenderer).define({
		
		/**
		 * 显示对象
		 */
		show:function(node){
			if(!node){
				return;
			}
			
			node.style.display="";
		},
		
		/**
		 * 隐藏对象
		 */
		hidden:function(node){
			if(!node){
				return;
			}
			
			node.style.display="none";
		}
	})
);

/**
 * @fileoverview DisplayObject类，所有显示对象的基类
 * @author Random | Random.Hao.Yang@gmail.com
 */






$package("aralork.display","DisplayObject",
	function(parent,tagName,w,h){
		var Lib=aralork.lib.Lib;
		var me=this;
		
		Lib.defineGetter(this,
			["x","y","z","width","height","scale"],
			[this.__getX,this.__getY,this.__getZ,this.__getWidth,this.__getHeight,this.__getScale]);
		
		this.__entity=null;
		this.__simpleRenderer=new aralork.display.renderer.SimpleRenderer();
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__orgW=w || 0;
		this.__orgH=h || 0;
		this.__scale=1;
		this.__parent=parent;

		this.__initEntity(parent,tagName,w,h);
		
	}.define({
		
		/**
		 * 设置位置
		 * @param {Object} param
		 * 					x:Number
		 * 					y:Number
		 * 					zIndex:Number
		 */
		setPosition:function(param){
			typeof param.x!=="undefined" && (this.__entity.style.left=param.x+"px");
			typeof param.y!=="undefined" && (this.__entity.style.top=param.y+"px");
			typeof param.z!=="undefined" && (this.__entity.style.zIndex=param.z);
			return this;
		},
		
		/**
		 * 设置大小
		 * @param {Object} param
		 * 					w:宽度
		 * 					h:高度
		 */
		setSize:function(param){
			typeof param.w!=="undefined" && (this.__entity.style.width=param.w+"px");
			typeof param.h!=="undefined" && (this.__entity.style.height=param.h+"px");
			return this;
		},
		
		/**
		 * 设置缩放比例
		 * @param {Number} sc
		 */
		setScale:function(sc){
			sc=isNaN(sc)?1:sc;
			this.__entity.style.width=this.__orgW*sc+"px";
			this.__entity.style.height=this.__orgH*sc+"px";
			this.__scale=sc;
			return this;
		},
		
		/**
		 * 显示对象
		 * @param {IRenderer} renderer
		 */
		show:function(renderer){
			if(renderer){
				renderer.show(this.__entity);
			}else{
				this.__simpleRenderer.show(this.__entity);
			}
			return this;
		},
		
		/**
		 * 隐藏对象
		 * @param {IRenderer} renderer
		 */
		hidden:function(renderer){
			if(renderer){
				renderer.hidden(this.__entity);
			}else{
				this.__simpleRenderer.hidden(this.__entity);
			}
			return this;
		},
		
		getEntity:function(){
			return this.__entity;
		},
		
		/**
		 * 添加事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		destroy:function(){
			this.__entity && this.__entity.parentNode && this.__entity.parentNode.removeChild(this.__entity);
			this.__entity=null;
		},
		
		/**
		 * 初始化显示的对象节点
		 */
		__initEntity:function(parent,tagName,w,h){
			var st,
				tgn=!tagName || tagName==="none"?
					"div":
					tagName;
			
			parent=parent || document.body;
			
			if(typeof tgn==="object"){
				this.__entity=tgn;
			}else{
				this.__entity=$C(tgn);
			}
			
			st=this.__entity.style;
			st.position="absolute";
			st.left=0;
			st.top=0;
			st.fontSize=0;
			st.zIndex=0;
			st.width=w+"px";
			st.height=h+"px";
			
			if(tagName!=="none"){
				parent.appendChild(this.__entity);
			}
		},
		
		/**
		 * 获取X坐标值
		 */
		__getX:function(){
			return parseInt(this.__entity.style.left);
		},
		
		/**
		 * 获取Y坐标值
		 */
		__getY:function(){
			return parseInt(this.__entity.style.top);
		},
		
		/**
		 * 获取对象深度(z坐标)
		 */
		__getZ:function(){
			return parseInt(this.__entity.style.zIndex);
		},
		
		/**
		 * 获取宽度
		 */
		__getWidth:function(){
			var w=parseInt(this.__entity.style.width);
			return w || this.__getSize(this.__entity,"offsetWidth");
		},
		
		/**
		 * 获取高度
		 */
		__getHeight:function(){
			var h=parseInt(this.__entity.style.height);
			return h || this.__getSize(this.__entity,"offsetHeight");
		},
		
		/**
		 * 获取比例
		 */
		__getScale:function(){
			return this.__scale;
		},
		
		/**
		 * 获取尺寸，对象在不可见状态下也能获取到真实的尺寸
		 * @param {String} p
		 */
		__getSize:function(node,p){
			var et=node,
				v,
				ov=et.style.visibility;
				
			if(et.style.display=="none"){
				et.style.visibility="hidden";
				et.style.display="";
				v=et[p];
				et.style.display="none";
				et.style.visibility=ov;
			}else{
				v=et[p];
			}
			
			return v;
		}
	})
);

/**
 * @fileoverview AI动作列表管理类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-22
 */



$package("game.ai","AIActionManager",

	/**
	 * 
	 * @param {Fighter} fighter
	 * @event
	 * 		complete
	 */
	function(fighter){
		
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__fighter=fighter;
		this.__queue=[];
		this.__isPlaying=false;
		
		this.__initEvent();
		
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		/**
		 * 播放队列动作
		 * @param {Array} queue
		 * 			[
		 * 				{
		 * 					act:"jump",
		 * 					p:"forward",
		 * 					t:10
		 * 				},
		 * 				{
		 * 					act:"attack",
		 * 					p:["light","boxing"],
		 * 					t:0
		 * 				}
		 * 			]
		 */
		play:function(queue){
			if(!this.__isPlaying && !this.__queue.length){
				this.__queue=this.__queue.concat(queue);
				this.__isPlaying=true;
				this.__update(this.__queue.shift());
			}
		},
		
		__update:function(cfg){
			var	ft=this.__fighter,
				i,
				l;
				
			function update(cfg){
				window.setTimeout(function(){
					ft[cfg.act] && ft[cfg.act].apply(ft,
									cfg.p instanceof Array ?
									cfg.p :
									[cfg.p]
								);
				},cfg.t);
			}
			
			if(cfg instanceof Array){
				l=cfg.length;
				for(i=0;i<l;i++){
					update(cfg[i]);
				}
			}else{
				update(cfg);
			}
			
			
		},
		
		__initEvent:function(){
			var ft=this.__fighter,
				ed=this.__eventDispatcher,
				me=this;
			
			ft.action.addEventListener("actionComplete",function(currentAction,nextAction){

				if (!ft.isSpecialAttacking && currentAction!=="wait" && (nextAction==="wait" || !nextAction)) {
					if(me.__queue.length){
						me.__update(me.__queue.shift());
						
					}else if (me.__isPlaying) {
						me.__isPlaying = false;
						ed.dispatchEvent("complete");
					}
				}
			});
			
			ft.addEventListener("specialAttackComplete",function(){
				if(me.__queue.length){
						me.__update(me.__queue.shift());
						
					}else if (me.__isPlaying) {
						me.__isPlaying = false;
						ed.dispatchEvent("complete");
					}
			});
		}
	})
);

/**
 * @fileoverview 声音管理器
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-14
 */


(function(){
	$package("game","SoundManager",

		/**
		 * 声音管理器类
		 * @param {String} entityID
		 * @event
		 * 		loading
		 * 		complete
		 */
		{
			sounds:{},
			
			totalCount:0,
			
			currentCount:0,
			
			__isInited:false,
			
			__soundNames:{},
			
			__eventDispatcher:new aralork.events.EventDispatcher(this),
			
			/**
			 * 添加事件监听
			 * @param {String} type
			 * @param {Function} handle
			 */
			addEventListener:function(type,handle){
				this.__eventDispatcher.addEventListener(type,handle);
				return this;
			},
			
			/**
			 * 移除事件监听
			 * @param {String} type
			 * @param {Function} handle
			 */
			removeEventListener:function(type,handle){
				this.__eventDispatcher.removeEventListener(type,handle);
				return this;
			},
			
			/**
			 * 加载声音文件，参数必须为数组。。。
			 * @param {Array} urls 地址数组
			 * @param {Array} names 名称数组
			 */
			load:function(urls,names){
				// if(!(urls instanceof Array) || !(names instanceof Array)){
				// 	return;
				// }
				
				// var i=urls.length,
				// 	ed=this.__eventDispatcher,
				// 	count=0;
		
				// this.totalCount=i;
				// while(i--){
				// 	if(!this.__soundNames[names[i]]){
				// 		this.__soundNames[names[i]]=true;
						
				// 		this.__entity && this.__entity.load(urls[i],names[i]);
				// 	}else{
				// 		ed.dispatchEvent("loading",++count,this.totalCount);
				// 		count===this.totalCount && ed.dispatchEvent("complete",this.totalCount);
				// 	}
				// }
			},
			
			/**
			 * 播放指定名称的声音文件
			 * @param {String} name
			 * @param {Number} count
			 */
			play:function(name,count){
				//this.__entity && this.__entity.playSound(name,count || 0);
			},
			
			init:function(entityID){
				// if(this.__isInited){
				// 	return;
				// }
				
				// var ed=this.__eventDispatcher,
				// 	me=this,
				// 	et;
				
				// //页面输出的flashvars的onComplete=soundLoadComplete
				// window.soundLoadComplete=function(){
				// 	ed.dispatchEvent("loading",++me.currentCount,me.totalCount);
				// 	me.currentCount===me.totalCount && ed.dispatchEvent("complete",me.totalCount);
				// };
				
				// et=$E(entityID);
				// !et && (et=window[entityID]);
				// !et && (et=document[entityID]);
				
				// this.__entity=et;
				// this.__isInited=true;
			}
		}
	);
	
	//初始化哦～～～～
	game.SoundManager.init("swfSoundManager");
	
})();


/**
 * @fileoverview {content}
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("config","Configure",
	{
		//url:"http://aralork/Aralork/"
		url:"http://dev.me/javascript/streetMaster/"
	}
);

/**
 * @fileoverview Timer类，实现计时器的功能
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		var timer=new aralork.utils.Timer(1000,10);
		timer.addEventListener("timer",function(){
			alert("timer");
		});
		timer.addEventListener("complete",function(){
			alert("complete");
		});
		timer.start();
 */



$package("aralork.utils","Timer",
	function(delay,repetCount){
		
		/**
		 * 间隔时间
		 */
		this.delay=delay || 40;
		
		/**
		 * 重复的次数,<=0为无限
		 */
		this.repetCount=repetCount || 0;
		
		this.state="stop";
		
		this.__time=0;
		this.__timerID=0;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
	}.define({
		
		/**
		 * 开始计时并在时间间隔内触发timer事件
		 */
		start:function(){
			if(this.state==="start"){
				return;
			}
			
			var me=this,
				rc=this.repetCount;
			
			this.state="start";
			
//			this.__timerID=window.setInterval(function(){
//				if(rc>0 && ++me.__time ===rc){
//					me.__eventDispatcher.dispatchEvent("timer");
//					window.setTimeout(function(){
//						me.stop();
//					},me.delay);
//				}else{
//					me.__eventDispatcher.dispatchEvent("timer");
//				}
//			},this.delay);
			
			(function timer(){
				if(rc>0 && ++me.__time ===rc){
					me.__eventDispatcher.dispatchEvent("timer");
					window.setTimeout(function(){
						me.stop();
					},me.delay);
				}else{
					window.clearTimeout(me.__timerID);
					me.__eventDispatcher.dispatchEvent("timer");
					me.state==="start" && (me.__timerID=window.setTimeout(arguments.callee,me.delay));
				}
			})();
			
			return this;
		},
		
		/**
		 * 暂停计时，保留当前的时间点
		 */
		pause:function(){
			window.clearTimeout(this.__timerID);
			//window.clearInterval(this.__timerID);
			this.__isStarted=false;
			this.state="pause";
			this.__eventDispatcher.dispatchEvent("pause");

			return this;
		},
		
		/**
		 * 停止计时，重置时间点
		 */
		stop:function(isCancelEvent){
			window.clearTimeout(this.__timerID);
			this.__time=0;
			this.__isStarted=false;
			this.state="stop";
			!isCancelEvent && this.__eventDispatcher.dispatchEvent("complete");
			
			return this;
		},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * 					"timer"
		 * 					"pause"
		 * 					"complete"
		 * 
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * 					"timer"
		 * 					"pause"
		 * 					"complete"
		 * 
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		}
	})
);


/**
 * @fileoverview 屏幕类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-01-22
 */






$package("stage","Screen",
	{
		entity:null,
		scale:1,
		canScroll:true,
		__elements:[],
		__backgroundMaxWidth:0,
		__backgroundMaxHeight:0,
		__eventDispatcher:new aralork.events.EventDispatcher(this),
		__flashEntity:null,
		__flashTimer:new aralork.utils.Timer(40,10),
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		setScale:function(sc){
			if(!sc || isNaN(sc)){
				return this;
			}
			var et=this.entity,
				els=this.__elements,
				i=els.length,
				x;
				
			this.scale=sc;
			et.style.width=384 * sc + "px";
			et.style.height=224 * sc + "px";

			while(i--){
				els[i].setScale(sc);
				els[i].width > this.__backgroundMaxWidth && (this.__backgroundMaxWidth= +els[i].width);
				els[i].height > this.__backgroundMaxHeight && (this.__backgroundMaxHeight= +els[i].height);
				
				x=-(els[i].width-et.offsetWidth)/2;
				els[i].setPosition({
					x:x
				});
				
				els[i].scrollValueX = x;
			}
			
			return this;
		},
		
		addBackground:function(displayObject,zIndex){
			var et=this.entity,
				w=et.offsetWidth;
				
			displayObject.setPosition({
				z:zIndex
			});
			
			displayObject.scrollValueY = 0;
			
			et.appendChild(displayObject.getEntity());
			this.__elements.push(displayObject);
			this.setScale(1);
			return this;
		},
		
		clearBackground:function(){
			var et=this.entity,
				eles=this.__elements,
				i=eles.length;
				
			while(i--){
				et.removeChild(eles[i].getEntity());
				eles[i].destroy();
			}
			
			this.__elements.length=0;
			this.__backgroundMaxWidth=0;
			this.__backgroundMaxHeight=0;
			
			return this;
		},
		
		scroll:function(scrollX,scrollY){
			var et=this.entity,
				els=this.__elements,
				w=et.offsetWidth,
				h=et.offsetHeight,
				i=els.length,
				deltaX=els[1].width / this.__backgroundMaxWidth * scrollX;
				
			if((scrollX>0 && els[1].scrollValueX+deltaX>0)
			|| (scrollX<0 && els[1].scrollValueX+deltaX+els[1].width<this.entity.offsetWidth)){
				this.canScroll=false;
				return this;
			}
			
			this.canScroll=true;
			while(i--){
				els[i].scrollValueX+=els[i].width / this.__backgroundMaxWidth * scrollX;
				els[i].scrollValueX+=els[i].height / this.__backgroundMaxHeight * scrollY;
				
				els[i].setPosition({
					x:els[i].scrollValueX,
					y:els[i].scrollValueY
				});
			}
			this.__eventDispatcher.dispatchEvent("scroll",scrollX,scrollY);
			
			return this;
		},
		
		getWidth:function(){
			return this.entity.offsetWidth;
		},
		
		getHeight:function(){
			return this.entity.offsetHeight;
		},
		
		/**
		 * 获取第一层背景图的x值
		 */
		getX:function(){
			if(this.__elements[1]){
				return +this.__elements[1].x;
			}else{
				return 0;
			}
		},
		
		/**
		 * 获取背景图层的宽度
		 */
		getInnerWidth:function(){
			if(this.__elements[1]){
				return +this.__elements[1].width;
			}else{
				return 0;
			}
		},
		
		/**
		 * 屏幕闪烁
		 */
		flash:function(){
			var fe,
				i=0,
				p=["show","hidden"];
			
			if(!this.__flashEntity){
				fe=this.__flashEntity=new aralork.display.DisplayObject(this.entity,"div",this.getWidth(),this.getHeight());
				fe.setPosition({
					z:32
				});
				fe.getEntity().style.backgroundColor="red";
				
				this.__flashTimer.addEventListener("timer",function(){
					fe[p[i++ % 2]].call(fe);
				})
				.addEventListener("complete",function(){
					fe.hidden();
				});
				
			}
			
			this.__flashTimer.start();
		}
	}
);

/**
 * @fileoverview 控制器类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-25 (Merry Xmas ^o^)
 * @example
 * 		var ctrlr=new role.controller.Controller();
		ctrlr.configure({
			"UP":87,
			"RIGHT":68,
			"DOWN":83,
			"LEFT":65,
			"A":74,
			"B":75,
			"C":76,
			"D":85,
			"E":73,
			"F":79
		});
		
		ctrlr.addEventListener("controlsKeyDown",function(code,keyCode,keyName){
			alert(code+","+keyCode+","+keyName);
		});
		ctrlr.addEventListener("controlsKeyUp",function(code,keyCode,keyName){
			alert(code+","+keyCode+","+keyName);
		});
		ctrlr.addEventListener("functionKeyDown",function(code,keyCode,keyName){
			alert(code+","+keyCode+","+keyName);
		});
		ctrlr.addEventListener("functionKeyUp",function(code,keyCode,keyName){
			alert(code+","+keyCode+","+keyName);
		});
		
 */




$package("role.controller","Controller",

	/**
	 * 控制器类
	 * @event
	 * 		controlsKeyDown 方向控制键按下时触发
	 * 		functionKeyDown 功能键按下时触发
	 */
	function(){
		this.__keys={
			"UP":0,
			"RIGHT":0,
			"DOWN":0,
			"LEFT":0,
			"A":0,
			"B":0,
			"C":0,
			"D":0,
			"E":0,
			"F":0
		};
		
		this.__reverseKeys={};
		this.__hashKeyCode={};
		
		this.__keyListener=new aralork.utils.KeyListener();
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		
		this.__controlsCode=0;
		this.__functionCode=0;
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		configure:function(p){
			var keys=this.__keys,
				rvsKeys=this.__reverseKeys,
				k;
			
			for(k in keys){
				if(typeof p[k]==="number" || typeof p[k]==="string"){
					keys[k]=p[k];
					rvsKeys["k_"+p[k]]=k;
				}
			}
			
			this.__initKeyCodes();
			this.__initKeys("controls");
			this.__initKeys("function");
			
			return this;

		},
		
		__initKeyCodes:function(){
			var hkc=this.__hashKeyCode,
				keys=this.__keys;
			
			hkc[keys.UP]=17;    //10001;
			hkc[keys.RIGHT]=18; //10010;
			hkc[keys.DOWN]=20;  //10100;
			hkc[keys.LEFT]=24;  //11000;
			
			hkc[keys.A]=65; 	//1000001;
			hkc[keys.B]=66;		//1000010;
			hkc[keys.C]=68; 	//1000100;
			hkc[keys.D]=72; 	//1001000;
			hkc[keys.E]=80; 	//1010000;
			hkc[keys.F]=96; 	//1100000;
		},
		
		
		__initKeys:function(type){
			var kl=this.__keyListener,
				keys=this.__keys,
				me=this,
				keySet= type==="controls"
						?["UP","RIGHT","DOWN","LEFT"]
						:["A","B","C","D","E","F"],
				i=keySet.length;
				
			while(i--){
				kl.add(keys[keySet[i]],"keydown",function(keyCode){
						me.__updateKeyCode(keyCode,true,type);
					})
					.add(keys[keySet[i]],"keyup",function(keyCode){
						me.__updateKeyCode(keyCode,false,type);
					});
			}
		},
		
		/**
		 * 更新当前的按键状态
		 * @param {Number} keyCode
		 * @param {Boolean} isKeyDown
		 * @param {String} type
		 * 					"controls"
		 * 					"function"					
		 */
		__updateKeyCode:function(keyCode,isKeyDown,type){
			var hkc=this.__hashKeyCode,
				rvsKeys=this.__reverseKeys,
				hash={
					"controls":"__controlsCode",
					"function":"__functionsCode"
				},
				opNumber= type==="controls"?16:64;
			
			if(isKeyDown){
				this[hash[type]] |= hkc[keyCode];
				hkc[keyCode] > opNumber && this.__eventDispatcher.dispatchEvent(type+"KeyDown",this[hash[type]],keyCode,rvsKeys["k_"+keyCode]);
				hkc[keyCode] &= opNumber-1;
			}else{
				this[hash[type]] ^= hkc[keyCode];
				this.__eventDispatcher.dispatchEvent(type+"KeyUp",this[hash[type]],keyCode,rvsKeys["k_"+keyCode]);
				hkc[keyCode] |= opNumber;
			}
		}
		
		
	})
);

/**
 * @fileoverview 斗士的特殊攻击配置
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-30
 */

$package("config","SpecialAttacked",{
	
	"RYU":{

		/**
		 * 波动拳
		 */
		"wave_boxing":{
			keySequence:[["DOWN","RIGHT","A"],["DOWN","RIGHT","B"],["DOWN","RIGHT","C"]],
			keyValue:"10010" //10010代表RIGHT键或不按键(通过与当前键的代码按位"与"来判断)
		},
		
		/**
		 * 冲天拳
		 */
		"impact_boxing":{
			keySequence:[["RIGHT","DOWN","RIGHT","A"],["RIGHT","DOWN","RIGHT","B"],["RIGHT","DOWN","RIGHT","C"]],
			keyValue:"10110" //10110代表向前键，或前下键，或不按键(通过与当前键的代码按位"与"来判断)，当前按键与keyValue 与 操作后，结果等于当前按键
		},
		
		/**
		 * 旋风腿
		 */
		"whirl_kick":{
			keySequence:[["DOWN","LEFT","D"],["DOWN","LEFT","E"],["DOWN","LEFT","F"]],
			keyValue:"11000" ////11000代表LEFT键或不按键
		}
	}
});

/**
 * @fileoverview 斗士的控制器类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-29
 */





$package("role.controller","FighterController",
	function(fighter,keyCfg){

		this.keyCfg=keyCfg;
		
		this.__keySequence=[];
		this.__fighter=fighter;
		this.__controller=new role.controller.Controller();
		this.__sequenceTimeoutValue=150;
		this.__keyDownStartTime=0;
		this.__specialAttackedConfig=config.SpecialAttacked[this.__fighter.name.replace(/\d+$/,"")];
		this.__controlsKeyCode=0;
		this.__hashKeyToLevel={
			"A":1,
			"B":2,
			"C":3,
			"D":1,
			"E":2,
			"F":3
		};
		
		this.__initController(keyCfg || {});
		this.__initFighter();
		
	}.define({
		
		clearKeyState:function(){
			this.__controlsKeyCode=0;
		},
		
		__initFighter:function(){
			var me=this,
				ft=this.__fighter,
				adv=ft.adversary;
			
			ft.addEventListener("stateChanged",function(s1,s2){
				if(/^jump(up|left|right)/.test(s1) && s2==="wait"){
					me.keyCfg && !ft.isSpecialAttacking &&  me.__updateFighterControlKeysAction(me.__controlsKeyCode);
				}
			});
			
			
			ft.action.addEventListener("actionComplete",function(actionName,nextActionName){

				//非跳跃的攻击结束
				if(!(/^jump/).test(actionName) && /(boxing|kick)$/.test(actionName)
				&& !ft.isJumping){
					ft.isAttacking=false;
					if(ft.state!=="beAttacked"){
						ft.state="wait";
						me.__updateFighterControlKeysAction(me.__controlsKeyCode);
					}else{
						ft.state="wait";
					}
				}
				
				//状态转变为wait时
				nextActionName==="wait" && (ft.state="wait");
				
				//翻身站起时
				actionName==="somesault_up" && me.keyCfg && me.__updateFighterControlKeysAction(me.__controlsKeyCode);
			});
			
			ft.addEventListener("specialAttackComplete",function(name){
				this.isAttacking=false;
				this.isSpecialAttacking=false;
				this.state==="specialAttacking" && (this.state="");
				
				if (me.keyCfg) {
					me.__updateFighterControlKeysAction(me.__controlsKeyCode,1);
				}else{

					!this.isAttacking
					&& !this.isJumping
					&& this.state!=="beAttacked"
					&& this.state!=="wait" && this.wait();
				}
			})
			.addEventListener("beAttackedComplete",function(name){
				me.keyCfg && me.__updateFighterControlKeysAction(me.__controlsKeyCode);
			});
			
			
			//对手的攻击
			adv.action.addEventListener("actionComplete",function(actionName,nextActionName){
				if(/(boxing|kick)$/.test(nextActionName)){
					!adv.isSpecialAttacking && me.__checkFighterDefense(me.__controlsKeyCode.toString(2));
				}
				
				if((/\w{0,20}(light|middle|heavy)_(boxing|kick)$/.test(actionName))){
					adv.isAttacking=false;
					me.keyCfg && me.__updateFighterControlKeysAction(me.__controlsKeyCode);
				}
			});

			adv.addEventListener("specialAttackStart",function(name){
				me.keyCfg && me.__updateFighterControlKeysAction(me.__controlsKeyCode);
			})
			.addEventListener("specialAttackComplete",function(name){
				if (me.keyCfg) {
					me.__updateFighterControlKeysAction(me.__controlsKeyCode);
				}else{
					!ft.isAttacking
					&& !ft.isJumping
					&& ft.state!=="beAttacked"
					&& ft.state!=="wait" && ft.wait();
				}
			})
			.addEventListener("beAttacked",function(){
				me.__keySequence=[];
			});
			
		},
		
		__initController:function(keyCfg){
			var ctr=this.__controller,
				me=this;
			
			ctr.configure(keyCfg)
				.addEventListener("controlsKeyDown",function(code,keyCode,keyName){
					me.__controlsKeyCode=code;
					me.__updateSequence(keyName);
					me.__updateFighterControlKeysAction(code);
				})
				.addEventListener("controlsKeyUp",function(code,keyCode,keyName){
					me.__controlsKeyCode=code;
					me.__updateFighterControlKeysAction(code);
				})
				.addEventListener("functionKeyDown",function(code,keyCode,keyName){
					me.__updateSequence(keyName);
					if(me.__keySequence.length > 1){
						me.__updateFigtherSpeicalAttack(keyName);
					}else{
						me.__updateFighterFunctionKeysAction(keyName);
					}
				})
				.addEventListener("functionKeyUp",function(code,keyCode,keyName){

				});
		},
		
		/**
		 * 更新按键序列
		 * @param {String} keyName
		 */
		__updateSequence:function(keyName){
			var ksq=this.__keySequence;
			
			if(ksq.length===0 || (new Date()).getTime() - this.__keyDownStartTime < this.__sequenceTimeoutValue){
				ksq.push(keyName);
			}else{
				this.__keySequence=[keyName];
			}
			
			this.__keyDownStartTime=(new Date()).getTime();
			
		},
		
		/**
		 * 更新按控制键时斗士的动作
		 */
		__updateFighterControlKeysAction:function(code){
			var ft=this.__fighter;
			//arguments[1] && console.log(ft.name+","+ft.state+","+code.toString(2));

			switch(code.toString(2)){
				case "10001":
					ft.jump("up");
					break;
					
				case "10010":
					!this.__checkFighterDefense("10010") && ft.walk("right");
					break;
				
				case "11100":
				case "10110":
				case "10100":
					ft.stand("crouch");
					this.__checkFighterDefense(code.toString(2));
					break;
				
				case "11000":
					!this.__checkFighterDefense("11000") && ft.walk("left");
					break;
				
				case "10011":
					ft.jump("right");
					break;
				
				case "11001":
					ft.jump("left");
					break;
				
				default:
					if(!ft.isAttacking
					&& !ft.isJumping
					&& !ft.isSpecialAttacking
					&& ft.state!=="beAttacked"){
						ft.wait();
					}
			}
		},
		
		/**
		 * 更新按功能键时斗士的动作
		 */
		__updateFighterFunctionKeysAction:function(keyName){
			var ft=this.__fighter,
				hash={
					"A":["light","boxing"],
					"B":["middle","boxing"],
					"C":["heavy","boxing"],
					"D":["light","kick"],
					"E":["middle","kick"],
					"F":["heavy","kick"]
				};

				ft.attack.apply(ft,hash[keyName]);
		},
		
		/**
		 * 检测斗士的防守状态
		 */
		__checkFighterDefense:function(keyCodeString){

			var ft=this.__fighter,
				adv=ft.adversary,
				hash={
					"10010":1,
					"10110":1,
					"11000":0,
					"11100":0
				},
				ret=false;

				if((adv.isAttacking || adv.isMagicPlaying)
				&& !ft.isJumping
				&& ((ft.lookAt==="right" && hash[keyCodeString]===0)
				|| (ft.lookAt==="left" && hash[keyCodeString]===1))){
					
					ret=true;
					ft.defense();
				}else{
					ft.defenseState="";
				}

				return ret;
		},
		
		/**
		 * 更新斗士特殊攻击的动作
		 */
		__updateFigtherSpeicalAttack:function(keyName){
			var Lib=aralork.lib.Lib,
				saCfg=this.__specialAttackedConfig,
				ft=this.__fighter,
				lookAt=ft.lookAt,
				ksq=this.__keySequence,
				cfgKsq,
				k,
				i,
				ckc,
				ksqStr;
				
			if(lookAt==="right"){
				ksqStr=ksq.join(",");
				ckc=this.__controlsKeyCode;
				
			}else if(lookAt==="left"){
				ksqStr=Lib.swapString(ksq.join(","),"RIGHT","LEFT");
				ckc=this.__controlsKeyCode ^ parseInt("01010",2); //将11000换为10010，10010换为11000，即把方向左键和方向右键交换
			}

			for(k in saCfg){
				cfgKsq=saCfg[k].keySequence;
				i=cfgKsq.length;
				while(i--){
					if(cfgKsq[i].join(",")===ksqStr && (parseInt(saCfg[k].keyValue,2) & ckc)===ckc){
						ft.specialAttack(k,this.__hashKeyToLevel[keyName]);
						this.__keySequence=[];
						return;
					}
				}
			}
			
			this.__updateFighterFunctionKeysAction(keyName);
		}
	})
);

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

/**
 * @fileoverview Animation类，继承于DisplayObject类，实现了帧动画的效果
 * @author Random | Random.Hao.Yang@gmail.com
 */






$package("aralork.display","Animation",

	/**
	 * 动画类
	 * @event
	 * 		stop 播放停止时触发
	 * 		playing 正在播放时触发
	 */
	function(parent,tagName,w,h,img,fps,frameTimes){
		this.fps=fps || 25;
		
		/**
		 * 播放的顺序,>=0序播放,<0逆序播放
		 */
		this.direction=1;
		
		/**
		 * 当前状态
		 * 		playing	正在播放
		 * 		pause 暂停
		 * 		stop 停止
		 */
		this.state="stop";
		
		this.isFlipH=false;
		
		this.__timer=new aralork.utils.Timer(Math.floor(1000/fps));
		this.__frame=0;
		this.__frameCount=0;
		this.__img=null;
		this.__isCoerceStop=false;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		
		//帧相对fps的倍率
		this.__frameTimes=frameTimes || [];
		
		this.__initTimerEvent();
		this.load(img);
	}.$extends(aralork.display.DisplayObject).define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		/**
		 * 装载由动画帧组成的图片
		 * @param {Image} img
		 */
		load:function(img){
			if(!img){
				throw new Error($__ErrorCode__["E10011"]);
			}
			
			var et=this.__entity;
			
			et.innerHTML="";
			et.appendChild(img);
			this.__img=img;
			this.__frameCount=Math.floor(img.width/this.width);
			this.__orgW=et.offsetWidth;
			this.__orgH=et.offsetHeight;
			this.setScale(this.__scale);
			this.__formatFrameTimes(this.__frameCount);
			return this;
		},
		
		/**
		 * 播放动画
		 * @param {Number} count 播放的次数,<=0或不传值为一直播放
		 */
		play:function(count,isContinue){
			if(!isContinue){
				(isNaN(count) || !count) && (count=0);
				this.__timer.repetCount=count*this.__frameCount;
				this.__timer.delay=1000 / this.fps / this.__frameTimes[
														this.direction===1 ? Math.max(this.__frame,1)-1 : this.__frameCount-Math.max(this.__frame,1)
														];
			}
			this.__timer.start();
			this.state="playing";
			return this;
		},
		
		/**
		 * 跳转到指定的帧数
		 * @param {Number} idx
		 */
		go:function(idx){
			
			if (idx <=0) {
				this.__frame = Math.min(this.__frameCount+idx+1,this.__frameCount);
			}
			else {
				this.__frame = Math.max(1, idx % (this.__frameCount + 1));
			}
			
			var f=this.__frame;
			this.__timer.delay=1000 / this.fps / this.__frameTimes[
													this.direction===1 ? f-1 : this.__frameCount-f
												];
			this.__img.style.marginLeft=(-(f-1)*this.width)+"px";
			//this.__img.src==="http://aralork/Aralork/images/fighter/RYU2/RYU2_goBack.gif" && alert(this.__img.offsetWidth);
			
			return this;
		},
		
		/**
		 * 暂定播放的动画，保留当前的播放帧数
		 */
		pause:function(){
			this.__timer.pause();
			//this.__frame--;
			this.state="pause";
			return this;
		},
		
		/**
		 * 设置缩放比例，重写了父类的setScale方法
		 * @param {Number} sc
		 */
		setScale:function(sc){
			zm=isNaN(sc)?1:sc;
			aralork.display.Animation.$super.setScale.call(this,sc);
			this.__img.width=this.__orgW * this.__frameCount * sc;
			this.__img.height=this.__orgH * sc;
			return this;
		},
		
		/**
		 * 停止播放的动画，重置当前的播放帧数
		 */
		stop:function(){
			this.__isCoerceStop=true;
			this.__timer.stop();
			this.__frame=0;
			this.state="stop";
			return this;
		},
		
		/**
		 * 设置水平翻转效果
		 * @param {Boolean} state
		 */
		setFlipH:function(state){
			aralork.lib.Style.setFlipH(this.__img,state);
			this.isFlipH=!!state;
			this.direction=state?-1:1;
			return this;
		},
		
		/**
		 * 销毁对象，重写了父类的destroy方法
		 */
		destroy:function(){
			this.__timer.stop();
			this.__img=null;
			aralork.display.Animation.$super.destroy.call(this);
		},
		
		/**
		 * 初始化容器，重写了父类的__initEntity方法
		 */
		__initEntity:function(parent,tagName,w,h){
			aralork.display.Animation.$super.__initEntity.call(this,parent,tagName,w,h);
			this.__entity.style.overflow="hidden";
		},
		
		/**
		 * 初始化timer对象的事件绑定
		 */
		__initTimerEvent:function(){
			var me=this;
			
			this.__timer.addEventListener("timer",function(){
				var f;

				(isNaN(me.direction) || me.direction==0) && (me.direction=1);
				me.go(me.__frame + me.direction/Math.abs(me.direction));
				f= me.isFlipH ? me.__frameCount+1-me.__frame : me.__frame;
				me.__eventDispatcher.dispatchEvent("playing",f,me.__frameCount);
			})
			.addEventListener("complete",function(){
				var f = me.isFlipH ? me.__frameCount+1-me.__frame : me.__frame;
				
				if(me.state!=="stop"){
					me.state="stop";
					me.__eventDispatcher.dispatchEvent("stop",f,me.__frameCount,me.__isCoerceStop);
				}
				me.__frame=0;
				me.__isCoerceStop=false;
			});
		},
		
		/**
		 * 格式化帧相对fps的倍率数组
		 */
		__formatFrameTimes:function(fc){
			var i=fc;
			while(i--){
				!this.__frameTimes[i] && (this.__frameTimes[i]=1);
			}
		}
	})
);

/**
 * @fileoverview 击中效果
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-03-09
 */



$package("config","HitEffect",
		{
			defense:{
					IMG:config.Configure.url+"images/hitEffect/defense.gif",
					WIDTH:32,
					HEIGHT:32,
					FPS:8,
					FRAME_TIMES:[1,1,1,1,1]
			},
			light:{
					IMG:config.Configure.url+"images/hitEffect/light.gif",
					WIDTH:20,
					HEIGHT:19,
					FPS:8,
					FRAME_TIMES:[1,1,1]
			},
			heavy:{
					IMG:config.Configure.url+"images/hitEffect/heavy.gif",
					WIDTH:32,
					HEIGHT:31,
					FPS:8,
					FRAME_TIMES:[1,1,1,1]
			}
		}
);
/**
 * @fileoverview 击打时的效果
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-03-09
 */





$package("game","HitEffectManager",

	function(parent,sc){
		
		this.effects={};
		
		this.__parent=parent;
		this.__scale=sc || 1;
		
		this.__initEffects();
	}.define({
		
		setScale:function(sc){
			var k,
				efs=this.effects;
				
			for(k in efs){
				efs[k].setScale(sc);
			}
			
			this.__scale=sc;
		},
		
		__initEffects:function(){
			var Animation=aralork.display.Animation,
				loader=aralork.utils.ResourceLoader,
				cfg=config.HitEffect,
				parent=this.__parent,
				types=["defense","light","heavy"],
				i=types.length;

			while(i--){
				this.effects[types[i]] = new Animation(parent,
											null,
											cfg[types[i]].WIDTH,
											cfg[types[i]].HEIGHT,
											loader.getImage(cfg[types[i]].IMG,true),
											cfg[types[i]].FPS,
											cfg[types[i]].FRAME_TIMES);
											
				this.effects[types[i]].addEventListener("stop",function(){
					this.hidden();
				})
				.hidden();
			}
		}
	})
);

/**
 * @fileoverview 血槽
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-31
 */





$package("game","HPBar",

	/**
	 * 血槽类
	 * @param {Object} bar
	 * @event
	 * 		decreaseComplete 
	 */
	function(bar){
		
		/**
		 * 方向
		 * 		1,从左向右
		 * 		2,从右向左
		 */
		this.direction=1;
		
		this.max=200;
		this.value=0;
		
		this.__bar=bar;
		this.__decWidthQueue=[];
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__timer=new aralork.utils.Timer(20);
		this.__barWidth=0;
		this.__decWidth=0;
		this.__scale=1;
		
		this.__init();
		this.__initTimer();
		
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * 					"timer"
		 * 					"pause"
		 * 					"complete"
		 * 
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * 					"timer"
		 * 					"pause"
		 * 					"complete"
		 * 
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		/**
		 * 减少指定值
		 * @param {Number} v
		 */
		decrease:function(v){
			this.__decWidthQueue.push(v/this.max*this.__barWidth);
			this.value-=v;
			if(this.__decWidthQueue.length===1 && this.__timer.state==="stop"){
				this.__decWidth=this.__decWidthQueue.pop();
				this.__timer.start();
			}
		},
		
		/**
		 * 重置长度
		 */
		reset:function(){
			this.__bar.style.width=this.__barWidth+"px";
			this.direction===1 && (this.__bar.style.left=(parseInt(this.__bar.style.left)-this.__barWidth)+"px");
			this.value=this.max;
		},
		
		__init:function(){
			this.__barWidth=parseInt(this.__bar.style.width);
			this.value=this.max;
		},
		
		__initTimer:function(){
			var timer=this.__timer,
				me=this,
				bar=this.__bar,
				
				sum=0;
			
			timer.addEventListener("timer",function(){
				bar.style.width=(parseInt(bar.style.width)-1)+"px";
				me.direction===1 && (bar.style.left=(parseInt(bar.style.left)+1)+"px");
				(sum++ >= me.__decWidth || !parseInt(bar.style.width)) && this.stop();
			})
			
			.addEventListener("complete",function(){
				sum=0;
				if(me.__decWidthQueue.length > 0 && me.value>0){
					me.__decWidth=me.__decWidthQueue.pop();
					me.__timer.start();
				}
				
				me.__eventDispatcher.dispatchEvent("decreaseComplete",me.value,parseInt(me.__bar.style.width));
			});
		}
	})
);

/**
 * @fileoverview 所有斗士的AI复杂动作的集合，简单动作会在程序中直接写，这里只包括复杂的组合动作的集合
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-22
 * @example
 * 		{
 * 			act:fighter的方法名称(attack、jump、walk、wait、specialAttack、stand、defense),
 * 			p:方法的参数，多个参数用数组形式,
 * 			t:延迟执行动作的毫秒数 (ms)
 * 		}
 * 	
 * 		[
 * 					//队列里的第一个动作
					{
						act:"attack",
						p:["light","boxing"],
						t:3000
					},
					
					//队列里的第二个动作
					[
						{
							act:"jump",
							p:"forward",
							t:100
						},
						{
							act:"attack",
							p:["heavy","kick"],
							t:600
						}						
					],
					
					//队列里的第三个动作
					[
						{act:"stand",
						p:"crouch",
						t:100},
						{
							act: "attack",
							p: ["heavy","kick"],
							t: 101
						}
					],
					
					//队列里的第四个动作
					{
						act:"specialAttack",
						p:["impact_boxing",3],
						t:1000
					}
				]
 */

(function(){
	
	var crouch_kick=[{
							act:"stand",
							p:"crouch",
							t:100
						},
						{
							act: "attack",
							p: ["heavy","kick"],
							t: 101
						}
		],
		
		jumpForwardKick=[{
							act:"jump",
							p:"forward",
							t:100
						},
						{
							act:"attack",
							p:["heavy","kick"],
							t:600
						}
		];
		
		
		
		
	$package("config.ai","AIActionTable",{
		
		//下蹲踢腿
		CMB_CROUCH_KICK:crouch_kick,
		
		//向前起跳踢腿
		CMB_JUMP_FORWARD_KICK:jumpForwardKick,
		
		//向后起跳
		CMB_JUMP_BACK:{
			act:"jump",
			p:"back",
			t:50
		},
		
		//向前起跳踢腿，落地后下蹲踢腿
		CMB_JUMP_FORWARD_KICK_CROUCH_KICK:[
					jumpForwardKick,
					crouch_kick
		],
		
		//向前起跳出拳
		CMB_JUMP_FORWARD_BOXING:[
						{
							act:"jump",
							p:"forward",
							t:100
						},
						{
							act:"attack",
							p:["heavy","boxing"],
							t:800
						}
		],
		
		//下蹲出重拳
		CMB_CROUCH_HEAVY_BOXING:[
						{
							act:"stand",
							p:"crouch",
							t:100
						},
						{
							act:"attack",
							p:["heavy","boxing"],
							t:500
						}
		],
		
		
		//出拳
		CMB_HEAVY_BOXING:[
			{
				act: "attack",
				p: ["heavy","boxing"],
				t: 300
			}
		],
		
		//踢腿
		CMB_HEAVY_KICK:[
			{
				act: "attack",
				p: ["heavy","kick"],
				t: 300
			}
		],
		
		//向后起跳踢腿
		CMB_JUMP_BACK_KICK:[
						{
							act:"jump",
							p:"back",
							t:100
						},
						{
							act:"attack",
							p:["heavy","kick"],
							t:600
						}
		],
		
		//防守
		CMB_DEFENSE:{
			act:"defense",
			p:"",
			t:100
		},
		
		//下蹲防守
		CMB_CROUCH_DEFENSE:[
			{
				act:"stand",
				p:"crouch",
				t:100
			},
			{
				act: "defense",
				p: "",
				t: 100
			}
		]

	});
})();

/**
 * @fileoverview 斗士的AI动作组合，每个斗士有十种类型
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-23
 */

$package("config.ai","FighterAIAction",
	{
		RYU:{
			
			//短冲天拳
			TYPE_1:{
				act:"specialAttack",
					p:["impact_boxing",1],
					t:100
			},

			//慢速波动拳
			TYPE_2:{
				act:"specialAttack",
				p:["wave_boxing","1"],
				t:100
			},
			
			//旋风腿
			TYPE_3:{
					act:"specialAttack",
					p:["whirl_kick",3],
					t:50
			},
			
			//长冲天拳
			TYPE_4:{
					act:"specialAttack",
					p:["impact_boxing",3],
					t:100
			},
			
			//快速波动拳
			TYPE_5:{
				act:"specialAttack",
				p:["wave_boxing","3"],
				t:100
			}
			
//			//旋风腿+冲天拳
//			TYPE_6:[{
//					act:"specialAttack",
//					p:["whirl_kick",3],
//					t:50
//				},
//				{
//					act:"specialAttack",
//					p:["impact_boxing",3],
//					t:100
//			}]
		}
	}
);

/**
 * @fileoverview 动作响应配置，根据对手的动作响应相应的动作
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-23
 */

$package("config.ai","AIActionRespond",
	{
			/**
			 * 原地等待
			 */
			wait:["TYPE_1","TYPE_2","TYPE_3","TYPE_4","TYPE_5","CMB_JUMP_FORWARD_KICK_CROUCH_KICK","CMB_HEAVY_BOXING","CMB_JUMP_FORWARD_KICK","CMB_CROUCH_KICK","CMB_JUMP_BACK"],
			
			/**
			 * 下蹲
			 */
			stand_crouch:["CMB_CROUCH_KICK","TYPE_2","CMB_HEAVY_BOXING"],
			
			/**
			 * 站起
			 */
			stand_up:["TYPE_3"],
			
			/**
			 * 站立防守
			 */
			stand_up_defense:["CMB_CROUCH_KICK","TYPE_2","TYPE_4","TYPE_5"],
			
			/**
			 * 下蹲防守
			 */
			stand_crouch_defense:["CMB_HEAVY_BOXING","CMB_JUMP_FORWARD_KICK","TYPE_2","TYPE_5"],
			
			/**
			 * 后退
			 */
			walk_back:["CMB_JUMP_FORWARD_BOXING","CMB_HEAVY_KICK","TYPE_2","TYPE_3"],
			
			/**
			 * 前进
			 */
			walk_forward:["CMB_JUMP_BACK_KICK","CMB_CROUCH_KICK","TYPE_3","TYPE_4"],
			
			
			/**
			 * 出拳
			 */
			light_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			middle_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			heavy_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			
			
			/**
			 * 踢腿
			 */
			light_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			middle_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			heavy_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			
			
			/**
			 * 跳跃
			 */
			jump_up:["TYPE_1","CMB_JUMP_FORWARD_KICK"],
			jump_down:["CMB_CROUCH_KICK"],
			jump_forward:["CMB_JUMP_BACK_KICK","TYPE_4"],
			jump_back:["TYPE_5","CMB_JUMP_FORWARD_BOXING","CMB_JUMP_FORWARD_KICK"],

			/**
			 * 近距离出拳
			 */
			near_light_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			near_middle_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			near_heavy_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			
			
			/**
			 * 近距离踢腿
			 */
			near_light_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			near_middle_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			near_heavy_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			
			
			/**
			 * 下蹲出拳
			 */
			crouch_light_boxing:["CMB_CROUCH_DEFENSE","CMB_CROUCH_KICK","CMB_JUMP_BACK","TYPE_5"],
			crouch_middle_boxing:["CMB_CROUCH_DEFENSE","CMB_CROUCH_KICK","CMB_JUMP_BACK","TYPE_5"],
			crouch_heavy_boxing: ["CMB_CROUCH_DEFENSE","CMB_CROUCH_KICK","CMB_JUMP_BACK","TYPE_5"],
			
			
			/**
			 * 下蹲踢腿
			 */
			crouch_light_kick:["CMB_JUMP_BACK","CMB_CROUCH_KICK","TYPE_5"],
			crouch_middle_kick:["CMB_JUMP_BACK","CMB_CROUCH_KICK","TYPE_5"],
			crouch_heavy_kick:["CMB_JUMP_BACK","CMB_CROUCH_KICK","TYPE_5"],
			
			
			/**
			 * 跳跃出拳
			 */
			jump_light_boxing:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			jump_middle_boxing:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			jump_heavy_boxing:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			
			
			/**
			 * 跳跃踢腿
			 */
			jump_light_kick:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			jump_middle_kick:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			jump_heavy_kick:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],


			/**
			 * 往前或往后跳跃出拳
			 */
			jumpMoved_light_boxing:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			
			jumpMoved_middle_boxing:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			
			jumpMoved_heavy_boxing:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			
			
			/**
			 * 往前或往后跳跃踢腿
			 */
			jumpMoved_light_kick:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			jumpMoved_middle_kick:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			jumpMoved_heavy_kick:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			
			
			/**
			 * 被攻击
			 */
			beAttacked_top:["CMB_CROUCH_KICK","TYPE_3","TYPE_1","TYPE_4"],
			beAttacked_bottom:["CMB_CROUCH_KICK","TYPE_3","TYPE_1","TYPE_4"],
			beAttacked_heavy:["CMB_CROUCH_KICK","TYPE_3","TYPE_1","TYPE_4"],
			beAttacked_impact:["CMB_CROUCH_KICK","TYPE_3","TYPE_1","TYPE_4"],
//			beAttacked_fire:[],
//			beAttacked_electric:[],
//			
//			beAttacked_fall:[],
//			
//			
//			beAttacked_before_fall_down:[],
//
//
//			beAttacked_fall_down:[],
//			
//			
//			/**
//			 * 翻身站起
//			 */
//			somesault_up:[],
			
			
			
			/*以下开始为特殊招式，不同的人物的招式名称不一样*/
			
			/**
			 * 波动拳
			 */
			wave_boxing:["CMB_DEFENSE","CMB_JUMP_FORWARD_KICK_CROUCH_KICK","TYPE_5","CMB_JUMP_FORWARD_KICK"],
			
			/**
			 * 旋风腿
			 */
			before_whirl_kick:[],
			whirl_kick:["CMB_CROUCH_HEAVY_BOXING","TYPE_5","CMB_JUMP_FORWARD_BOXING"],
			after_whirl_kick:[],
			
			
			/**
			 * 冲天拳
			 */
			impact_boxing:["TYPE_4","TYPE_1"],
			after_impact_boxing:["TYPE_4","TYPE_1","CMB_JUMP_FORWARD_KICK"]
	}
);
/**
 * @fileoverview 斗士管理类,其实。。。这个类。。。写得挺烂的。。。。。。将就用着吧。。
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-03-08
 */















$package("game","FighterManager",
	function(fighter1,fighter2,menu){
		this.__fighter1=fighter1;
		this.__fighter2=fighter2;
		this.__hitEffect1=new game.HitEffectManager(fighter1.parent,fighter1.scale);
		this.__hitEffect2=new game.HitEffectManager(fighter2.parent,fighter2.scale);
		this.__aiManagers={};
		this.__fighterShadow1=null;
		this.__fighterShadow2=null;
		this.__hpBars={};
		this.__fighterControllers={};
		this.__menu=menu;
		
		this.__init();
		
	}.define({
		
		setScale:function(sc){
			this.__fighter1.setScale(sc);
			this.__fighter2.setScale(sc);
			this.__hitEffect1.setScale(sc);
			this.__hitEffect2.setScale(sc);
		},
		
		__init:function(){
			var ft1=this.__fighter1,
				ft2=this.__fighter2,
				me=this,
				efs1=me.__hitEffect1.effects,
				efs2=me.__hitEffect2.effects;
				
			ft1.setAdversary(ft2);
			ft2.setAdversary(ft1);
			
			ft1.addEventListener("specialAttackComplete",function(){
				me.__updateFighterLookAt(this);
				me.__checkBodyOverlay(this);
			})
			.addEventListener("positionChanged",function(){
				if(!this.checkState("jump")){
					me.__updateFighterLookAt(this);
					!this.isSpecialAttacking && !ft2.isSpecialAttacking && me.__checkBodyOverlay(this);
				}
				
				me.__fighterShadow1.setPosition({
					x:this.x + this.width/2-me.__fighterShadow1.width/2
				});
				
			})
			
			//击中的效果
			.addEventListener("beAttacked",function(type,power,defensedPower,point){
					var crt=this.defenseState?
						efs1.defense:
						(power<10?efs1.light:efs1.heavy);

				crt.setPosition({
					x: point.x-crt.width/2,
					y: point.y-crt.height/2,
					z:128
				})
				.show()
				.play(1);
				
			});
			
			ft2.addEventListener("specialAttackComplete",function(){
				me.__updateFighterLookAt(this);
				me.__checkBodyOverlay(this);
			})
			.addEventListener("positionChanged",function(){
				if(!this.checkState("jump")){
					me.__updateFighterLookAt(this);
					!this.isSpecialAttacking && !ft1.isSpecialAttacking && me.__checkBodyOverlay(this);
				}
				
				me.__fighterShadow2.setPosition({
					x:this.x + this.width/2-me.__fighterShadow2.width/2
				});
				
			})
			
			//击中的效果
			.addEventListener("beAttacked",function(type,power,defensedPower,point){
				var crt=this.defenseState?
						efs2.defense:
						(power<10?efs2.light:efs2.heavy);
						
				crt.setPosition({
					x: point.x-crt.width/2,
					y: point.y-crt.height/2,
					z:128
				})
				.show()
				.play(1);
			});
			
			this.__hitEffect1.setScale(ft1.scale);
			this.__hitEffect2.setScale(ft2.scale);
			
			this.__initController();
			
//			setInterval(function(){
//				//ft2.specialAttack("wave_boxing",3);
//				//ft2.specialAttack("whirl_kick",3);
//				
//				//ft2.specialAttack("impact_boxing",3);
//				//ft2.jump("up");
//			},3000);
			
			this.__initAI(ft1);
			this.__menu.getIndex()!==2 && this.__initAI(ft2);
			
			
			this.__initHPBars(ft1,"ft1",1,$E("hpBar1"));
			this.__initHPBars(ft2,"ft2",-1,$E("hpBar2"));
			
			this.__initFighterShadow();
		},
		
		/**
		 * 初始化血槽
		 * @param {Fighter} ft
		 */
		__initHPBars:function(ft,ftType,direction,node){
			var me=this;
			
			if(!this.__hpBars[ftType]){
				this.__hpBars[ftType]=new game.HPBar(node);
				
				this.__hpBars[ftType].direction=direction;
				
				this.__hpBars[ftType].addEventListener("decreaseComplete",function(v,w){
					if(w<=0){
						stage.Screen.flash();
						this.reset();
					}
				});
				
				ft.addEventListener("beAttacked",function(type,power,defensedPower,point,hitSoundName){
					me.__hpBars[ftType].decrease(this.defenseState?defensedPower:power);
				});
				
			}else{
				this.__hpBars[ftType].reset();
			}
		},
		
		/**
		 * 初始化斗士的阴影
		 */
		__initFighterShadow:function(){
			var sdImg1=aralork.utils.ResourceLoader.getImage(config.Configure.url+"images/background/fighterShadow.gif",true),
				sdImg2=aralork.utils.ResourceLoader.getImage(config.Configure.url+"images/background/fighterShadow.gif",true),
				ft1=this.__fighter1,
				ft2=this.__fighter2,
				sc=ft1.scale,
				w=68 * sc,
				h=11 * sc;
				
				this.__fighterShadow1=new aralork.display.DisplayObject(ft1.parent,sdImg1,w,h);
				this.__fighterShadow1.setPosition({
					x:ft1.x + ft1.width/2-this.__fighterShadow1.width/2,
					y:ft1.y + ft1.height-this.__fighterShadow1.height+sc,
					z:32
				})
				.show();
				
				this.__fighterShadow2=new aralork.display.DisplayObject(ft2.parent,sdImg2,w,h);
				this.__fighterShadow2.setPosition({
					x:ft2.x + ft2.width/2-this.__fighterShadow2.width/2,
					y:ft2.y + ft2.height-this.__fighterShadow2.height+sc,
					z:32
				})
				.show();
				
		},
		
		
		/**
		 * 检测斗士的身体碰撞，这个方法写得很恶心。。。而且为了效率而直接调原始属性。。。原谅我这次这么写吧～～～～～~(￣▽￣)~
		 */
		__checkBodyOverlay:function(ft){
			var adv=ft.adversary,
				sc= +ft.scale,
				anm1=ft.action.animations["wait"],
				anm2=adv.action.animations["wait"],
				w1= 40*sc,
				w2= 40*sc,
				h1= 90*sc,
				h2= 90*sc,
				crtAnm1=ft.action.currentAnimation,
				crtAnm2=adv.action.currentAnimation,
				x1= parseInt(crtAnm1.__entity.style.left)+crtAnm1.__entity.offsetWidth/2-w1/2,
				x2= parseInt(crtAnm2.__entity.style.left)+crtAnm2.__entity.offsetWidth/2-w2/2,
				y1= parseInt(crtAnm1.__entity.style.top)+crtAnm1.__entity.offsetHeight/2-h1/2,
				y2= parseInt(crtAnm2.__entity.style.top)+crtAnm2.__entity.offsetHeight/2-h2/2;

			if(this.__checkOverlay(x1,x2,y1,y2,w1,w2,h1,h1)){
				
				if(x1<x2){

					crtAnm1.setPosition({
						x:crtAnm1.x-ft.scale*1.5
					});

					adv.setPosition({
						x:x1+w1-(adv.width-w2)/2
					});
					
				}else{
					crtAnm1.setPosition({
						x:crtAnm1.x+ft.scale*1.5
					});
					
					adv.setPosition({
						x:x1-w2-(adv.width-w2)/2
					});
				}
			}
				
				
		},
		
		__checkOverlay:function(x1,x2,y1,y2,w1,w2,h1,h2){
			return	x2 < x1 + w1
					&& x2 + w2 > x1
					&& y2 < y1 + h1
					&& y2 + h2 > y1;
		},
		
		
		
		/**
		 * 更新朝向
		 */
		__updateFighterLookAt:function(ft){
			var adv=ft.adversary;
				
			function updateAnimation(){
				!ft.checkState("jump") && ft.state!=="beAttacked" && !ft.isAttacking && ft.action.updateAnimation(null,ft.lookAt);
				!adv.checkState("jump") && adv.state!="beAttacked" && !adv.isAttacking && adv.action.updateAnimation(null,adv.lookAt);
			}
			
			if(!adv){
				return;
			}
			

//			if(ft.lookAt==="right"){
//				if(ft.x > adv.x+adv.action.animations["wait"].witdh-adv.scale*40){
//					ft.lookAt="left";
//					adv.lookAt="right";
//					updateAnimation();
//				}
//				
//			}else if(ft.lookAt==="left"){
//				if(adv.x > ft.x+ft.action.animations["wait"].witdh-ft.scale*40){
//					ft.lookAt="right";
//					adv.lookAt="left";
//					updateAnimation();
//				}
//			}


			if(ft.__isLookAtChanged && ft.x < adv.x){
				ft.__isLookAtChanged=false;
				ft.lookAt="right";
				adv.lookAt="left";
				updateAnimation();
				
			}else if(!ft.__isLookAtChanged && ft.x>=adv.x){
				ft.__isLookAtChanged=true;
				ft.lookAt="left";
				adv.lookAt="right";
				updateAnimation();
			}
		},
		
		
		__initController:function(){
//			var fc=new role.controller.FighterController(this.__fighter1,
//				Menu.keyConfig
//			);

			var ft1KeyConfig={
					"UP":87,
					"RIGHT":68,
					"DOWN":83,
					"LEFT":65,
					"A":74,
					"B":75,
					"C":76,
					"D":85,
					"E":73,
					"F":79
				},
				ft2KeyConfig={
					"UP":38,
					"RIGHT":39,
					"DOWN":40,
					"LEFT":37,
					"A":97,
					"B":98,
					"C":99,
					"D":100,
					"E":101,
					"F":102
				};

			!this.__fighterControllers[this.__fighter1.name] && (this.__fighterControllers[this.__fighter1.name]=new role.controller.FighterController(this.__fighter1,
				ft1KeyConfig
			));
			
			!this.__fighterControllers[this.__fighter2.name] && (this.__fighterControllers[this.__fighter2.name]=new role.controller.FighterController(this.__fighter2,
				this.__menu.getIndex()===1?ft2KeyConfig:null
			));

		},
		
		__initAI: function(fighter){
			var me=this,
				aim,
				AITable=config.ai.AIActionTable,
				ftAITable=config.ai.FighterAIAction[fighter.name.replace(/\d/g, "")],
				AIRespondTable=config.ai.AIActionRespond,
				types="",
				i;
				
				function update(actionName){
					types=AIRespondTable[actionName];
					if (types && types instanceof Array
					&& fighter.action.currentActionName==="wait"
					&& fighter.y+fighter.action.animations["wait"].height===fighter.basicY) {
						
						var tp = types[Math.floor(Math.random() * types.length)];
						if (typeof tp === "object") {
							aim.play(tp);
						}
						else 
							if (typeof tp === "string") {
								AITable[tp] && aim.play(AITable[tp]);
								ftAITable[tp] && aim.play(ftAITable[tp]);
							}
					}
				}
				
			
			if (!this.__fighterControllers[fighter.name].keyCfg) {
				
				aim=this.__aiManagers[fighter.name] = new game.ai.AIActionManager(fighter);
				
				fighter.adversary.action.addEventListener("actionStart",function(actionName){
					update(actionName);
				});
				
				//一直wait时的处理
				window.setInterval(function(){
					if(fighter.adversary.state==="wait" && fighter.state==="wait"){
						update("wait");
					}
				},4000);
			}
		}
	})
);

/**
 * @fileoverview RYU1的动作的动画配置
 * @author Random | Random.Hao.Yang@gmail.com
 */


/*
				IMG
				IS_COPY_IMG
				OFFSET_X
				FPS
				WIDTH
				HEIGHT
				COUNT
				POWER
				DEFENCED_POWER
				FRAME_TIMES
				CALL_ANIMATION
				BODY_OVERLAYS
				ATTACK_OVERLAYS
				MAGIC_FRAMES
				
				
*/
$package("config.fighterAction","RYU1",
		{
			/**
			 * 原地等待
			 */
			wait:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_wait.gif",
				FPS:12,
				WIDTH:60,
				HEIGHT:93,
				FRAME_TIMES:[],
				BODY_OVERLAYS:[
					{x:7,y:9,w:46,h:84},
					{x:5,y:8,w:49,h:85},
					{x:5,y:5,w:49,h:88},
					{x:5,y:5,w:49,h:88},
					{x:5,y:5,w:49,h:88},
					{x:5,y:5,w:49,h:88}
				]
			},
			
			/**
			 * 下蹲
			 */
			stand_crouch:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_crouch.gif",
				FPS:20,
				WIDTH:61,
				HEIGHT:83,
				COUNT:1,
				FRAME_TIMES:[],
				BODY_OVERLAYS:[{x:6,y:23,w:50,h:58}]
			},
			
			/**
			 * 站起
			 */
			stand_up:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_stand_up.gif",
				FPS:20,
				WIDTH:61,
				HEIGHT:83,
				COUNT:1,
				CALL_ANIMATION:"wait",
				FRAME_TIMES:[],
				BODY_OVERLAYS:[{x:7,y:27,w:51,h:53},{x:5,y:18,w:51,h:62},{x:6,y:2,w:43,h:80}]
			},
			
			/**
			 * 站立防守
			 */
			stand_up_defense:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_stand_up_defense.gif",
				FPS:14,
				WIDTH:65,
				HEIGHT:93,
				COUNT:1,
				FRAME_TIMES:[],
				BODY_OVERLAYS:[{x:3,y:4,w:52,h:86},{x:5,y:4,w:53,h:87}]
			},
			
			/**
			 * 下蹲防守
			 */
			stand_crouch_defense:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_stand_crouch_defense.gif",
				FPS:14,
				WIDTH:58,
				HEIGHT:64,
				COUNT:1,
				FRAME_TIMES:[],
				BODY_OVERLAYS:[{x:6,y:7,w:46,h:55},{x:4,y:3,w:53,h:58}]
			},
			
			/**
			 * 后退
			 */
			walk_back:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_goBack.gif",
				FPS:15,
				WIDTH:61,
				HEIGHT:91,
				BODY_OVERLAYS:[{x:4,y:8,w:52,h:81},{x:6,y:4,w:48,h:85},{x:5,y:4,w:51,h:82},{x:6,y:4,w:50,h:83},{x:3,y:4,w:52,h:83},{x:4,y:5,w:51,h:83}],
				FRAME_TIMES:[1,0.5,1,1,1,0.5]
			},
			
			/**
			 * 前进
			 */
			walk_forward:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_goForward.gif",
				FPS:22,
				WIDTH:64,
				HEIGHT:92,
				BODY_OVERLAYS:[{x:10,y:6,w:42,h:83},{x:9,y:12,w:42,h:78},{x:12,y:6,w:47,h:83},{x:8,y:3,w:48,h:85},{x:6,y:5,w:46,h:85},{x:13,y:5,w:41,h:85}],
				FRAME_TIMES:[0.4,1,0.5,0.5,0.5,1]
			},
			
			
			/**
			 * 出拳
			 */
			light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_light_boxing.gif",
				FPS:18,
				WIDTH:92,
				HEIGHT:91,
				HIT_SOUND_NAME:"hit_light",
				COUNT:1,
				POWER:5,
				DEFENCED_POWER:0,
				ATTACK_TYPE:"top",
				FRAME_TIMES:[1.2,1,1.2],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:4,y:3,w:47,h:85},{x:4,y:4,w:50,h:83},{x:4,y:3,w:47,h:85}],
				ATTACK_OVERLAYS:[0,{x:47,y:13,w:45,h:11},0]
			},
			middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_middle_boxing.gif",
				FPS:12,
				WIDTH:115,
				HEIGHT:95,
				HIT_SOUND_NAME:"hit_middle_boxing",
				COUNT:1,
				POWER:10,
				DEFENCED_POWER:0,
				ATTACK_TYPE:"heavy",
				FRAME_TIMES:[1.1,1.1,1,1,1],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:4,y:6,w:45,h:86},{x:16,y:4,w:51,h:88},{x:17,y:4,w:53,h:88},{x:16,y:3,w:51,h:91},{x:4,y:2,w:46,h:91}],
				ATTACK_OVERLAYS:[0,0,{x:61,y:16,w:53,h:11},0,0]
			},
			heavy_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_middle_boxing.gif",
				IS_COPY_IMG:true,
				FPS:8,
				WIDTH:115,
				HEIGHT:95,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				COUNT:1,
				POWER:20,
				DEFENCED_POWER:0,
				ATTACK_TYPE:"impact",
				FRAME_TIMES:[1.2,1.2,1,0.8,1],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:4,y:6,w:45,h:86},{x:16,y:4,w:51,h:88},{x:17,y:4,w:53,h:88},{x:16,y:3,w:51,h:91},{x:4,y:2,w:46,h:91}],
				ATTACK_OVERLAYS:[0,0,{x:61,y:16,w:53,h:11},0,0]
			},
			
			
			/**
			 * 踢腿
			 */
			light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_light_kick.gif",
				OFFSET_X:-35,
				IS_COPY_IMG:false,
				FPS:14,
				WIDTH:114,
				HEIGHT:94,
				HIT_SOUND_NAME:"hit_light",
				COUNT:1,
				POWER:5,
				DEFENCED_POWER:0,
				ATTACK_TYPE:"top",
				FRAME_TIMES:[1.1,1.2,0.9,1.2,1.1],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:43,y:6,w:46,h:85},{x:27,y:5,w:48,h:86},[{x:85,y:2,w:28,h:16},{x:37,y:46,w:25,h:46},{x:2,y:4,w:83,h:41}],{x:27,y:4,w:51,h:88},{x:42,y:4,w:46,h:87}],
				ATTACK_OVERLAYS:[0,0,[{x:55,y:11,w:38,h:18},{x:87,y:2,w:30,h:17}],0,0]
			},
			middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_light_kick.gif",
				OFFSET_X:-35,
				IS_COPY_IMG:true,
				HIT_SOUND_NAME:"hit_middle_kick",
				FPS:10,
				WIDTH:114,
				HEIGHT:94,
				COUNT:1,
				POWER:10,
				DEFENCED_POWER:0,
				ATTACK_TYPE:"top",
				FRAME_TIMES:[1,1.2,0.6,1.2,1.2],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:43,y:6,w:46,h:85},{x:27,y:5,w:48,h:86},[{x:85,y:2,w:28,h:16},{x:37,y:46,w:25,h:46},{x:2,y:4,w:83,h:41}],{x:27,y:4,w:51,h:88},{x:42,y:4,w:46,h:87}],
				ATTACK_OVERLAYS:[0,0,[{x:55,y:11,w:38,h:18},{x:87,y:2,w:30,h:17}],0,0]
			},
			heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_heavy_kick.gif",
				OFFSET_X:-12,
				IS_COPY_IMG:false,
				HIT_SOUND_NAME:"hit_heavy_kick",
				FPS:8,
				WIDTH:120,
				HEIGHT:94,
				COUNT:1,
				POWER:20,
				DEFENCED_POWER:0,
				ATTACK_TYPE:"impact",
				FRAME_TIMES:[1.2,1.2,1,1,1.2],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[[{x:47,y:59,w:26,h:33},{x:11,y:20,w:62,h:38}],[{x:67,y:3,w:25,h:25},{x:48,y:58,w:25,h:33},{x:4,y:22,w:68,h:35}],[{x:44,y:6,w:26,h:8},{x:69,y:17,w:30,h:17},{x:91,y:2,w:30,h:16},{x:44,y:52,w:25,h:40},{x:4,y:17,w:66,h:35}],[{x:43,y:51,w:23,h:41},{x:2,y:19,w:95,h:31}],[{x:25,y:35,w:32,h:56},{x:8,y:11,w:30,h:37}]],
				ATTACK_OVERLAYS:[0,[{x:59,y:14,w:20,h:22},{x:77,y:0,w:15,h:25}],[{x:69,y:13,w:28,h:20},{x:94,y:0,w:25,h:18}],0,0]
			},
			
			
			/**
			 * 跳跃
			 */
			jump_up:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jumpUp.gif",
				FPS:12,
				COUNT:1,
				WIDTH:56,
				HEIGHT:109,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:5,y:28,w:42,h:77},{x:3,y:8,w:51,h:96},{x:7,y:12,w:43,h:85},{x:5,y:20,w:42,h:71},{x:10,y:22,w:41,h:67},{x:6,y:16,w:43,h:77},{x:4,y:9,w:45,h:91},{x:4,y:28,w:45,h:78}],
				FRAME_TIMES:[0.375,1.1,1.1,1,1,1,0.625,0.625]
			},
			jump_down:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_down.gif",
				FPS:12,
				COUNT:1,
				WIDTH:55,
				HEIGHT:109,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:4,y:14,w:41,h:78},{x:5,y:13,w:45,h:88}],
				FRAME_TIMES:[1,1]
			},
			jump_forward:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_forward.gif",
				FPS:12,
				OFFSET_X:-30,
				COUNT:1,
				WIDTH:122,
				HEIGHT:109,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:37,y:27,w:46,h:78},{x:38,y:12,w:46,h:93},{x:41,y:27,w:48,h:73},{x:4,y:37,w:103,h:33},{x:36,y:15,w:47,h:72},[{x:57,y:34,w:67,h:25},{x:6,y:41,w:62,h:37}],[{x:58,y:44,w:36,h:60},{x:25,y:17,w:47,h:46}],{x:42,y:12,w:46,h:91},{x:39,y:27,w:42,h:78}],
				FRAME_TIMES:[0.375,1.1,1.1,1,1,1,0.625,0.625]
			},
			jump_back:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_back.gif",
				FPS:12,
				OFFSET_X:-30,
				COUNT:1,
				WIDTH:122,
				HEIGHT:109,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:39,y:26,w:42,h:77},{x:40,y:13,w:45,h:91},[{x:60,y:47,w:36,h:56},{x:24,y:18,w:56,h:40}],[{x:59,y:34,w:60,h:27},{x:0,y:44,w:62,h:33}],{x:35,y:20,w:51,h:71},{x:5,y:37,w:96,h:36},{x:44,y:23,w:47,h:75},{x:43,y:8,w:40,h:97},{x:40,y:26,w:42,h:80}],
				FRAME_TIMES:[0.375,1.1,1.1,1,1,1,0.625,0.625]
			},

			/**
			 * 近距离出拳
			 */
			near_light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_near_light_boxing.gif",
				FPS:18,
				COUNT:1,
				WIDTH:62,
				HEIGHT:98,
				HIT_SOUND_NAME:"hit_light",
				POWER:5,
				CALL_ANIMATION:"",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:4,y:7,w:46,h:87},{x:3,y:8,w:51,h:87},{x:4,y:8,w:48,h:86}],
				ATTACK_OVERLAYS:[0,{x:37,y:0,w:25,h:25},0],
				FRAME_TIMES:[1.2,1,1.2]
			},
			near_middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_near_middle_boxing.gif",
				FPS:14,
				COUNT:1,
				WIDTH:86,
				HEIGHT:94,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_boxing",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:13,y:4,w:47,h:86},{x:19,y:4,w:45,h:87},{x:13,y:6,w:53,h:85},{x:15,y:5,w:50,h:87},{x:13,y:6,w:53,h:85},{x:19,y:4,w:45,h:87},{x:13,y:4,w:47,h:86}],
				ATTACK_OVERLAYS:[0,0,{x:60,y:16,w:27,h:16},{x:57,y:20,w:11,h:18},0,0,0],
				FRAME_TIMES:[1.2,1,1,0.6,1,1.2,1.2]
			},
			near_heavy_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_near_heavy_boxing.gif",
				FPS:10,
				COUNT:1,
				WIDTH:89,
				HEIGHT:113,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"impact",
				BODY_OVERLAYS:[{x:3,y:26,w:51,h:83},{x:13,y:25,w:48,h:86},{x:12,y:23,w:53,h:87},[{x:6,y:72,w:22,h:37},{x:29,y:18,w:40,h:92}],{x:15,y:24,w:51,h:87},{x:3,y:25,w:51,h:86}],
				ATTACK_OVERLAYS:[0,0,{x:65,y:32,w:25,h:21},{x:62,y:0,w:20,h:42},0,0],
				FRAME_TIMES:[1,1.4,1,0.6,0.8,1]
			},
			
			
			/**
			 * 近距离踢腿
			 */
			near_light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_near_light_kick.gif",
				FPS:18,
				OFFSET_X:-4,
				COUNT:1,
				WIDTH:88,
				HEIGHT:94,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:9,y:5,w:43,h:86},{x:4,y:3,w:36,h:87},[{x:44,y:38,w:25,h:18},{x:15,y:4,w:30,h:87}],{x:6,y:5,w:33,h:86},{x:8,y:5,w:47,h:86}],
				ATTACK_OVERLAYS:[0,0,[{x:62,y:49,w:25,h:17},{x:45,y:39,w:25,h:17}],0,0],
				FRAME_TIMES:[1,0.8,0.8,1,1]
			},
			near_middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_near_middle_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:86,
				HEIGHT:102,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_kick",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"heavy",
				BODY_OVERLAYS:[{x:14,y:16,w:52,h:83},{x:29,y:10,w:42,h:88},{x:39,y:1,w:41,h:101},{x:29,y:10,w:42,h:88},{x:14,y:16,w:52,h:83}],
				ATTACK_OVERLAYS:[0,0,{x:61,y:31,w:25,h:40},0,0],
				FRAME_TIMES:[1.2,0.8,0.8,0.8,1.2]
			},
			near_heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_near_heavy_kick.gif",
				FPS:10,
				COUNT:1,
				WIDTH:97,
				HEIGHT:122,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_kick",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"heavy",
				BODY_OVERLAYS:[{x:5,y:33,w:46,h:86},{x:4,y:32,w:40,h:86},{x:9,y:7,w:40,h:113},[{x:37,y:42,w:41,h:25},{x:6,y:18,w:35,h:102}],{x:3,y:29,w:37,h:92},{x:5,y:30,w:45,h:88}],
				ATTACK_OVERLAYS:[0,0,{x:31,y:1,w:18,h:55},[{x:67,y:32,w:30,h:21},{x:37,y:49,w:38,h:20}],0,0],
				FRAME_TIMES:[1.2,1,0.8,1,1.2,1.2]
			},
			
			
			/**
			 * 下蹲出拳
			 */
			crouch_light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_crouch_light_boxing.gif",
				FPS:18,
				COUNT:1,
				WIDTH:95,
				HEIGHT:61,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"bottom",
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:6,y:1,w:56,h:57},{x:5,y:7,w:56,h:51},{x:6,y:1,w:56,h:57}],
				ATTACK_OVERLAYS:[0,{x:51,y:11,w:45,h:11},0],
				FRAME_TIMES:[1.2,1,1.2]
			},
			crouch_middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_crouch_middle_boxing.gif",
				FPS:12,
				COUNT:1,
				WIDTH:92,
				HEIGHT:62,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_boxing",
				ATTACK_TYPE:"bottom",
				BODY_OVERLAYS:[{x:8,y:3,w:52,h:57},{x:8,y:3,w:48,h:56},{x:6,y:4,w:55,h:55}],
				ATTACK_OVERLAYS:[0,{x:47,y:10,w:46,h:11},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,0.8,1]
			},
			crouch_heavy_boxing: {
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_crouch_heavy_boxing.gif",
				FPS:10,
				COUNT:1,
				WIDTH:73,
				HEIGHT:125,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				ATTACK_TYPE:"heavy",
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:6,y:56,w:45,h:68},{x:5,y:37,w:48,h:87},{x:11,y:29,w:45,h:95},{x:6,y:36,w:47,h:87},{x:6,y:58,w:46,h:67}],
				ATTACK_OVERLAYS:[{x:39,y:72,w:21,h:18},{x:55,y:34,w:18,h:27},[{x:43,y:14,w:15,h:13},{x:40,y:0,w:12,h:13}],{x:53,y:35,w:21,h:25},{x:43,y:72,w:18,h:21}],
				FRAME_TIMES:[1,1.2,0.8,0.6,0.6]
			},
			
			
			/**
			 * 下蹲踢腿
			 */
			crouch_light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_crouch_light_kick.gif",
				FPS:18,
				COUNT:1,
				WIDTH:112,
				HEIGHT:64,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"bottom",
				BODY_OVERLAYS:[{x:7,y:3,w:56,h:57},[{x:39,y:41,w:71,h:18},{x:6,y:1,w:41,h:61}],{x:7,y:3,w:56,h:57}],
				ATTACK_OVERLAYS:[0,{x:47,y:44,w:62,h:16},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,1,1]
			},
			crouch_middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_crouch_middle_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:146,
				HEIGHT:64,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_kick",
				ATTACK_TYPE:"bottom",
				BODY_OVERLAYS:[{x:9,y:2,w:52,h:60},[{x:5,y:41,w:85,h:21},{x:4,y:5,w:48,h:36}],[{x:74,y:41,w:63,h:18},{x:20,y:12,w:52,h:50}],0,0],
				ATTACK_OVERLAYS:[0,0,{x:72,y:43,w:71,h:18},0,0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,1,1,1]
			},
			crouch_heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_crouch_heavy_kick.gif",
				FPS:8,
				COUNT:1,
				WIDTH:121,
				HEIGHT:61,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_kick",
				ATTACK_TYPE:"fall",
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:3,y:6,w:43,h:51},{x:9,y:6,w:57,h:53},{x:3,y:5,w:42,h:53},{x:9,y:5,w:53,h:53},{x:3,y:4,w:50,h:53}],
				ATTACK_OVERLAYS:[0,{x:52,y:37,w:68,h:20},{x:43,y:45,w:20,h:15},0,0],
				FRAME_TIMES:[1.2,1,1,1.2,1.2]
			},
			
			
			/**
			 * 跳跃出拳
			 */
			jump_light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_light_boxing.gif",
				FPS:16,
				COUNT:1,
				WIDTH:81,
				HEIGHT:71,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:9,y:4,w:48,h:62},{x:2,y:4,w:52,h:65}],
				ATTACK_OVERLAYS:[0,[{x:63,y:28,w:18,h:15},{x:50,y:20,w:17,h:13}]],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,0.01]
			},
			jump_middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_middle_boxing.gif",
				FPS:12,
				OFFSET_X:-13,
				COUNT:1,
				WIDTH:88,
				HEIGHT:77,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_boxing",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:16,y:13,w:47,h:60},{x:9,y:6,w:48,h:67},[{x:44,y:24,w:38,h:15},{x:10,y:12,w:40,h:55}],{x:17,y:12,w:45,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:46,y:27,w:40,h:20},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,1.2,0.4,1]
			},
			jump_heavy_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_middle_boxing.gif",
				IS_COPY_IMG:true,
				FPS:12,
				OFFSET_X:-13,
				COUNT:1,
				WIDTH:88,
				HEIGHT:77,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:16,y:13,w:47,h:60},{x:9,y:6,w:48,h:67},[{x:44,y:24,w:38,h:15},{x:10,y:12,w:40,h:55}],{x:17,y:12,w:45,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:46,y:27,w:40,h:20},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1.2,1,1]
			},
			
			
			/**
			 * 跳跃踢腿
			 */
			jump_light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_light_kick.gif",
				FPS:16,
				COUNT:1,
				WIDTH:76,
				HEIGHT:92,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:17,y:4,w:40,h:82},{x:8,y:2,w:45,h:83}],
				ATTACK_OVERLAYS:[0,[{x:38,y:14,w:25,h:21},{x:57,y:0,w:20,h:18}]],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,0.01]
			},
			jump_middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_middle_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:76,
				HEIGHT:92,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_kick",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:17,y:4,w:40,h:82},{x:8,y:2,w:45,h:83},{x:17,y:4,w:40,h:82}],
				ATTACK_OVERLAYS:[0,[{x:38,y:14,w:25,h:21},{x:57,y:0,w:20,h:18}]],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,0.4,1]
			},
			jump_heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_heavy_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:94,
				HEIGHT:104,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_kick",
				ATTACK_TYPE:"heavy",
				BODY_OVERLAYS:[{x:11,y:7,w:46,h:93},{x:5,y:12,w:41,h:71},[{x:40,y:41,w:40,h:17},{x:5,y:12,w:35,h:83}],{x:8,y:14,w:38,h:87},[{x:30,y:69,w:25,h:25},{x:4,y:17,w:42,h:50}]],
				ATTACK_OVERLAYS:[0,0,{x:33,y:42,w:58,h:15},0,0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1.2,1,1.2,1.2]
			},


			/**
			 * 往前或往后跳跃出拳
			 */
			jumpMoved_light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_light_boxing.gif",
				IS_COPY_IMG:true,
				FPS:16,
				COUNT:1,
				WIDTH:81,
				HEIGHT:71,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:9,y:4,w:48,h:62},{x:2,y:4,w:52,h:65}],
				ATTACK_OVERLAYS:[0,[{x:63,y:28,w:18,h:15},{x:50,y:20,w:17,h:13}]],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,0.01]
			},
			
			jumpMoved_middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_middle_boxing.gif",
				IS_COPY_IMG:true,
				FPS:12,
				OFFSET_X:-13,
				COUNT:1,
				WIDTH:88,
				HEIGHT:77,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_boxing",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:16,y:13,w:47,h:60},{x:9,y:6,w:48,h:67},[{x:44,y:24,w:38,h:15},{x:10,y:12,w:40,h:55}],{x:17,y:12,w:45,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:46,y:27,w:40,h:20},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,1.2,0.4,1]
			},
			
			jumpMoved_heavy_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jump_middle_boxing.gif",
				IS_COPY_IMG:true,
				FPS:12,
				OFFSET_X:-13,
				COUNT:1,
				WIDTH:88,
				HEIGHT:77,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:16,y:13,w:47,h:60},{x:9,y:6,w:48,h:67},[{x:44,y:24,w:38,h:15},{x:10,y:12,w:40,h:55}],{x:17,y:12,w:45,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:46,y:27,w:40,h:20},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1.2,1,1]
			},
			
			
			/**
			 * 往前或往后跳跃踢腿
			 */
			jumpMoved_light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jumpMoved_light_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:77,
				HEIGHT:76,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:14,y:3,w:42,h:71},{x:16,y:6,w:43,h:66},{x:7,y:8,w:51,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:56,y:21,w:18,h:42}],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,0.01]
			},
			jumpMoved_middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jumpMoved_middle_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:110,
				HEIGHT:76,
				HIT_SOUND_NAME:"hit_middle_kick",
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,1,1],
				POWER:10,
				ATTACK_TYPE:"top",
				ATTACK_OVERLAYS:[0,0,{x:42,y:45,w:68,h:20},0],
				BODY_OVERLAYS:[{x:5,y:4,w:45,h:70},[{x:24,y:53,w:27,h:20},{x:9,y:3,w:42,h:50}],{x:4,y:11,w:51,h:55},[{x:29,y:55,w:25,h:18},{x:4,y:5,w:52,h:48}]]
			},
			jumpMoved_heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_jumpMoved_middle_kick.gif",
				IS_COPY_IMG:true,
				FPS:12,
				COUNT:1,
				WIDTH:110,
				HEIGHT:76,
				HIT_SOUND_NAME:"hit_heavy_kick",
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,1.2,0.8,1],
				POWER:20,
				ATTACK_TYPE:"top",
				ATTACK_OVERLAYS:[0,0,{x:42,y:45,w:68,h:20},0],
				BODY_OVERLAYS:[{x:5,y:4,w:45,h:70},[{x:24,y:53,w:27,h:20},{x:9,y:3,w:42,h:50}],{x:4,y:11,w:51,h:55},[{x:29,y:55,w:25,h:18},{x:4,y:5,w:52,h:48}]]
			},
			
			
			/**
			 * 被攻击
			 */
			beAttacked_top:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_beAttacked_top.gif",
				FPS:10,
				WIDTH:68,
				HEIGHT:90,
				COUNT:1,
				FRAME_TIMES:[1,0.4],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[0,{x:5,y:5,w:48,h:82}]
			},
			beAttacked_bottom:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_beAttacked_bottom.gif",
				FPS:6,
				WIDTH:66,
				HEIGHT:85,
				COUNT:1,
				FRAME_TIMES:[1,0.5],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[0,{x:7,y:6,w:41,h:77}]
			},
			beAttacked_heavy:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_beAttacked_heavy.gif",
				FPS:6,
				WIDTH:75,
				HEIGHT:84,
				COUNT:1,
				FRAME_TIMES:[0.4,0.6,0.8],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[0,{x:7,y:9,w:55,h:71},{x:3,y:14,w:55,h:63}]
			},
			beAttacked_impact:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_beAttacked_impact.gif",
				FPS:6,
				WIDTH:81,
				HEIGHT:93,
				COUNT:1,
				FRAME_TIMES:[0.5,0.4,1],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[0,[{x:28,y:48,w:45,h:42},{x:2,y:6,w:42,h:47}],{x:14,y:8,w:42,h:82}]
			},
			beAttacked_fire:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_beAttacked_fire.gif",
				FPS:40,
				WIDTH:121,
				HEIGHT:71,
				FRAME_TIMES:[1,1,1,1],
				CALL_ANIMATION:"wait"
			},
			beAttacked_electric:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_beAttacked_electric.gif",
				FPS:40,
				WIDTH:85,
				HEIGHT:101,
				FRAME_TIMES:[1,1],
				CALL_ANIMATION:"wait"
			},
			
			beAttacked_fall:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_beAttacked_fall.gif",
				FPS:10,
				WIDTH:120,
				HEIGHT:80,
				OFFSET_X:-30,
				COUNT:1,
				FRAME_TIMES:[1,1,1,0.6],
				CALL_ANIMATION:"somesault_up"
			},
			
			//被旋风腿之类的击中上半身而摔倒
			beAttacked_up_fall:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_beAttacked_fall.gif",
				FPS:10,
				IS_COPY_IMG:true,
				WIDTH:120,
				HEIGHT:80,
				OFFSET_X:-30,
				COUNT:1,
				FRAME_TIMES:[1,1,1,0.6],
				CALL_ANIMATION:"somesault_up"
			},
			
			
			beAttacked_before_fall_down:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_before_fall_down.gif",
				FPS:4,
				WIDTH:76,
				HEIGHT:66,
				COUNT:1,
				FRAME_TIMES:[1],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[],
				ATTACK_OVERLAYS:[]
			},


			beAttacked_fall_down:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_fall_down.gif",
				FPS:6,
				WIDTH:128,
				HEIGHT:44,
				COUNT:1,
				FRAME_TIMES:[1.4,1.4,1],
				CALL_ANIMATION:"somesault_up",
				BODY_OVERLAYS:[],
				ATTACK_OVERLAYS:[]
			},
			
			
			/**
			 * 翻身站起
			 */
			somesault_up:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_somesault_up.gif",
				FPS:8,
				WIDTH:93,
				HEIGHT:115,
				COUNT:1,
				FRAME_TIMES:[1,1,1,1,1],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[],
				ATTACK_OVERLAYS:[]
			},
			
			
			
			/*以下开始为特殊招式，不同的人物的招式名称不一样*/
			
			/**
			 * 波动拳
			 */
			wave_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_wave_boxing.gif",
				FPS:12,
				COUNT:1,
				WIDTH:106,
				HEIGHT:90,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:8,y:4,w:51,h:82},[{x:5,y:57,w:72,h:31},{x:9,y:6,w:43,h:46}],[{x:7,y:55,w:73,h:31},{x:21,y:10,w:41,h:42}],[{x:7,y:58,w:87,h:28},{x:39,y:14,w:58,h:40}]],
				FRAME_TIMES:[1,0.5,0.8,0.2],
				MAGIC_FRAMES:{
					frame_4:{
						x:80,
						y:20
					}
				}
			},
			
			/**
			 * 旋风腿
			 */
			before_whirl_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_before_whirl_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:69,
				HEIGHT:120,
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,1]
			},
			whirl_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_whirl_kick.gif",
				FPS:18,
				OFFSET_X:-40,
				COUNT:1,
				WIDTH:150,
				HEIGHT:132,
				POWER:15,
				DEFENCED_POWER:5,
				HIT_SOUND_NAME:"hit_heavy_kick",
				ATTACK_TYPE:"up_fall",
				BODY_OVERLAYS:[{x:55,y:10,w:45,h:83},[{x:96,y:38,w:45,h:20},{x:53,y:5,w:41,h:93}],{x:54,y:6,w:41,h:88},[{x:12,y:35,w:47,h:18},{x:61,y:6,w:35,h:85}]],
				ATTACK_OVERLAYS:[0,{x:87,y:38,w:57,h:20},0,{x:9,y:36,w:58,h:17}],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,1,1]
			},
			after_whirl_kick:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_after_whirl_kick.gif",
				FPS:16,
				COUNT:1,
				WIDTH:55,
				HEIGHT:132,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:8,y:11,w:42,h:86},{x:10,y:16,w:41,h:83},{x:6,y:22,w:41,h:83},{x:4,y:39,w:41,h:78},{x:7,y:52,w:40,h:77}],
				FRAME_TIMES:[1,1,1,1,1]
			},
			
			
			/**
			 * 冲天拳
			 */
			impact_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_impact_boxing.gif",
				FPS:10,
				COUNT:1,
				WIDTH:68,
				HEIGHT:125,
				CALL_ANIMATION:"",
				HIT_SOUND_NAME:"hit_heavy_boxing",
				POWER:20,
				DEFENCED_POWER:5,
				ATTACK_TYPE:"up_fall",
				ATTACK_OVERLAYS:[0,{x:39,y:52,w:28,h:25},{x:39,y:0,w:17,h:52}],
				FRAME_TIMES:[1,0.8,1]
			},
			after_impact_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU1/RYU1_after_impact_boxing.gif",
				FPS:12,
				COUNT:1,
				WIDTH:59,
				HEIGHT:119,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:13,y:5,w:40,h:108},{x:10,y:16,w:40,h:96},{x:9,y:28,w:43,h:86}],
				FRAME_TIMES:[1,1,1]
			}
			
			
			
		}
);

/**
 * @fileoverview RYU2的动作的动画配置
 * @author Random | Random.Hao.Yang@gmail.com
 */


$package("config.fighterAction","RYU2",
		{
			/**
			 * 原地等待
			 */
			wait:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_wait.gif",
				FPS:12,
				WIDTH:60,
				HEIGHT:93,
				FRAME_TIMES:[],
				BODY_OVERLAYS:[
					{x:7,y:9,w:46,h:84},
					{x:5,y:8,w:49,h:85},
					{x:5,y:5,w:49,h:88},
					{x:5,y:5,w:49,h:88},
					{x:5,y:5,w:49,h:88},
					{x:5,y:5,w:49,h:88}
				]
			},
			
			/**
			 * 下蹲
			 */
			stand_crouch:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_crouch.gif",
				FPS:20,
				WIDTH:61,
				HEIGHT:83,
				COUNT:1,
				FRAME_TIMES:[],
				BODY_OVERLAYS:[{x:6,y:23,w:50,h:58}]
			},
			
			/**
			 * 站起
			 */
			stand_up:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_stand_up.gif",
				FPS:20,
				WIDTH:61,
				HEIGHT:83,
				COUNT:1,
				CALL_ANIMATION:"wait",
				FRAME_TIMES:[],
				BODY_OVERLAYS:[{x:7,y:27,w:51,h:53},{x:5,y:18,w:51,h:62},{x:6,y:2,w:43,h:80}]
			},
			
			/**
			 * 站立防守
			 */
			stand_up_defense:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_stand_up_defense.gif",
				FPS:14,
				WIDTH:65,
				HEIGHT:93,
				COUNT:1,
				FRAME_TIMES:[],
				BODY_OVERLAYS:[{x:3,y:4,w:52,h:86},{x:5,y:4,w:53,h:87}]
			},
			
			/**
			 * 下蹲防守
			 */
			stand_crouch_defense:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_stand_crouch_defense.gif",
				FPS:14,
				WIDTH:58,
				HEIGHT:64,
				COUNT:1,
				FRAME_TIMES:[],
				BODY_OVERLAYS:[{x:6,y:7,w:46,h:55},{x:4,y:3,w:53,h:58}]
			},
			
			/**
			 * 后退
			 */
			walk_back:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_goBack.gif",
				FPS:15,
				WIDTH:61,
				HEIGHT:91,
				BODY_OVERLAYS:[{x:4,y:8,w:52,h:81},{x:6,y:4,w:48,h:85},{x:5,y:4,w:51,h:82},{x:6,y:4,w:50,h:83},{x:3,y:4,w:52,h:83},{x:4,y:5,w:51,h:83}],
				FRAME_TIMES:[1,0.5,1,1,1,0.5]
			},
			
			/**
			 * 前进
			 */
			walk_forward:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_goForward.gif",
				FPS:22,
				WIDTH:64,
				HEIGHT:92,
				BODY_OVERLAYS:[{x:10,y:6,w:42,h:83},{x:9,y:12,w:42,h:78},{x:12,y:6,w:47,h:83},{x:8,y:3,w:48,h:85},{x:6,y:5,w:46,h:85},{x:13,y:5,w:41,h:85}],
				FRAME_TIMES:[0.4,1,0.5,0.5,0.5,1]
			},
			
			
			/**
			 * 出拳
			 */
			light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_light_boxing.gif",
				FPS:18,
				WIDTH:92,
				HEIGHT:91,
				COUNT:1,
				POWER:5,
				DEFENCED_POWER:0,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				FRAME_TIMES:[1.2,1,1.2],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:4,y:3,w:47,h:85},{x:4,y:4,w:50,h:83},{x:4,y:3,w:47,h:85}],
				ATTACK_OVERLAYS:[0,{x:47,y:13,w:45,h:11},0]
			},
			middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_middle_boxing.gif",
				FPS:12,
				WIDTH:115,
				HEIGHT:95,
				COUNT:1,
				POWER:10,
				DEFENCED_POWER:0,
				HIT_SOUND_NAME:"hit_middle_boxing",
				ATTACK_TYPE:"heavy",
				FRAME_TIMES:[1.1,1.1,1,1,1],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:4,y:6,w:45,h:86},{x:16,y:4,w:51,h:88},{x:17,y:4,w:53,h:88},{x:16,y:3,w:51,h:91},{x:4,y:2,w:46,h:91}],
				ATTACK_OVERLAYS:[0,0,{x:61,y:16,w:53,h:11},0,0]
			},
			heavy_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_middle_boxing.gif",
				IS_COPY_IMG:true,
				FPS:8,
				WIDTH:115,
				HEIGHT:95,
				COUNT:1,
				POWER:20,
				DEFENCED_POWER:0,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				ATTACK_TYPE:"impact",
				FRAME_TIMES:[1.2,1.2,1,0.8,1],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:4,y:6,w:45,h:86},{x:16,y:4,w:51,h:88},{x:17,y:4,w:53,h:88},{x:16,y:3,w:51,h:91},{x:4,y:2,w:46,h:91}],
				ATTACK_OVERLAYS:[0,0,{x:61,y:16,w:53,h:11},0,0]
			},
			
			
			/**
			 * 踢腿
			 */
			light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_light_kick.gif",
				OFFSET_X:-35,
				IS_COPY_IMG:false,
				FPS:14,
				WIDTH:114,
				HEIGHT:94,
				COUNT:1,
				POWER:5,
				DEFENCED_POWER:0,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				FRAME_TIMES:[1.1,1.2,0.9,1.2,1.1],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:43,y:6,w:46,h:85},{x:27,y:5,w:48,h:86},[{x:85,y:2,w:28,h:16},{x:37,y:46,w:25,h:46},{x:2,y:4,w:83,h:41}],{x:27,y:4,w:51,h:88},{x:42,y:4,w:46,h:87}],
				ATTACK_OVERLAYS:[0,0,[{x:55,y:11,w:38,h:18},{x:87,y:2,w:30,h:17}],0,0]
			},
			middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_light_kick.gif",
				OFFSET_X:-35,
				IS_COPY_IMG:true,
				FPS:10,
				WIDTH:114,
				HEIGHT:94,
				COUNT:1,
				POWER:10,
				DEFENCED_POWER:0,
				HIT_SOUND_NAME:"hit_middle_kick",
				ATTACK_TYPE:"top",
				FRAME_TIMES:[1,1.2,0.6,1.2,1.2],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:43,y:6,w:46,h:85},{x:27,y:5,w:48,h:86},[{x:85,y:2,w:28,h:16},{x:37,y:46,w:25,h:46},{x:2,y:4,w:83,h:41}],{x:27,y:4,w:51,h:88},{x:42,y:4,w:46,h:87}],
				ATTACK_OVERLAYS:[0,0,[{x:55,y:11,w:38,h:18},{x:87,y:2,w:30,h:17}],0,0]
			},
			heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_heavy_kick.gif",
				OFFSET_X:-12,
				IS_COPY_IMG:false,
				FPS:8,
				WIDTH:120,
				HEIGHT:94,
				COUNT:1,
				POWER:20,
				DEFENCED_POWER:0,
				HIT_SOUND_NAME:"hit_heavy_kick",
				ATTACK_TYPE:"impact",
				FRAME_TIMES:[1.2,1.2,1,1,1.2],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[[{x:47,y:59,w:26,h:33},{x:11,y:20,w:62,h:38}],[{x:67,y:3,w:25,h:25},{x:48,y:58,w:25,h:33},{x:4,y:22,w:68,h:35}],[{x:44,y:6,w:26,h:8},{x:69,y:17,w:30,h:17},{x:91,y:2,w:30,h:16},{x:44,y:52,w:25,h:40},{x:4,y:17,w:66,h:35}],[{x:43,y:51,w:23,h:41},{x:2,y:19,w:95,h:31}],[{x:25,y:35,w:32,h:56},{x:8,y:11,w:30,h:37}]],
				ATTACK_OVERLAYS:[0,[{x:59,y:14,w:20,h:22},{x:77,y:0,w:15,h:25}],[{x:69,y:13,w:28,h:20},{x:94,y:0,w:25,h:18}],0,0]
			},
			
			
			/**
			 * 跳跃
			 */
			jump_up:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jumpUp.gif",
				FPS:12,
				COUNT:1,
				WIDTH:56,
				HEIGHT:109,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:5,y:28,w:42,h:77},{x:3,y:8,w:51,h:96},{x:7,y:12,w:43,h:85},{x:5,y:20,w:42,h:71},{x:10,y:22,w:41,h:67},{x:6,y:16,w:43,h:77},{x:4,y:9,w:45,h:91},{x:4,y:28,w:45,h:78}],
				FRAME_TIMES:[0.375,1.1,1.1,1,1,1,0.625,0.625]
			},
			jump_down:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_down.gif",
				FPS:12,
				COUNT:1,
				WIDTH:55,
				HEIGHT:109,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:4,y:14,w:41,h:78},{x:5,y:13,w:45,h:88}],
				FRAME_TIMES:[1,1]
			},
			jump_forward:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_forward.gif",
				FPS:12,
				OFFSET_X:-30,
				COUNT:1,
				WIDTH:122,
				HEIGHT:109,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:37,y:27,w:46,h:78},{x:38,y:12,w:46,h:93},{x:41,y:27,w:48,h:73},{x:4,y:37,w:103,h:33},{x:36,y:15,w:47,h:72},[{x:57,y:34,w:67,h:25},{x:6,y:41,w:62,h:37}],[{x:58,y:44,w:36,h:60},{x:25,y:17,w:47,h:46}],{x:42,y:12,w:46,h:91},{x:39,y:27,w:42,h:78}],
				FRAME_TIMES:[0.375,1.1,1.1,1,1,1,0.625,0.625]
			},
			jump_back:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_back.gif",
				FPS:12,
				OFFSET_X:-30,
				COUNT:1,
				WIDTH:122,
				HEIGHT:109,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:39,y:26,w:42,h:77},{x:40,y:13,w:45,h:91},[{x:60,y:47,w:36,h:56},{x:24,y:18,w:56,h:40}],[{x:59,y:34,w:60,h:27},{x:0,y:44,w:62,h:33}],{x:35,y:20,w:51,h:71},{x:5,y:37,w:96,h:36},{x:44,y:23,w:47,h:75},{x:43,y:8,w:40,h:97},{x:40,y:26,w:42,h:80}],
				FRAME_TIMES:[0.375,1.1,1.1,1,1,1,0.625,0.625]
			},

			/**
			 * 近距离出拳
			 */
			near_light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_near_light_boxing.gif",
				FPS:18,
				COUNT:1,
				WIDTH:62,
				HEIGHT:98,
				HIT_SOUND_NAME:"hit_light",
				POWER:5,
				CALL_ANIMATION:"",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:4,y:7,w:46,h:87},{x:3,y:8,w:51,h:87},{x:4,y:8,w:48,h:86}],
				ATTACK_OVERLAYS:[0,{x:37,y:0,w:25,h:25},0],
				FRAME_TIMES:[1.2,1,1.2]
			},
			near_middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_near_middle_boxing.gif",
				FPS:14,
				COUNT:1,
				WIDTH:86,
				HEIGHT:94,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_boxing",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:13,y:4,w:47,h:86},{x:19,y:4,w:45,h:87},{x:13,y:6,w:53,h:85},{x:15,y:5,w:50,h:87},{x:13,y:6,w:53,h:85},{x:19,y:4,w:45,h:87},{x:13,y:4,w:47,h:86}],
				ATTACK_OVERLAYS:[0,0,{x:60,y:16,w:27,h:16},{x:57,y:20,w:11,h:18},0,0,0],
				FRAME_TIMES:[1.2,1,1,0.6,1,1.2,1.2]
			},
			near_heavy_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_near_heavy_boxing.gif",
				FPS:10,
				COUNT:1,
				WIDTH:89,
				HEIGHT:113,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"impact",
				BODY_OVERLAYS:[{x:3,y:26,w:51,h:83},{x:13,y:25,w:48,h:86},{x:12,y:23,w:53,h:87},[{x:6,y:72,w:22,h:37},{x:29,y:18,w:40,h:92}],{x:15,y:24,w:51,h:87},{x:3,y:25,w:51,h:86}],
				ATTACK_OVERLAYS:[0,0,{x:65,y:32,w:25,h:21},{x:62,y:0,w:20,h:42},0,0],
				FRAME_TIMES:[1,1.4,1,0.6,0.8,1]
			},
			
			
			/**
			 * 近距离踢腿
			 */
			near_light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_near_light_kick.gif",
				FPS:18,
				OFFSET_X:-4,
				COUNT:1,
				WIDTH:88,
				HEIGHT:94,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:9,y:5,w:43,h:86},{x:4,y:3,w:36,h:87},[{x:44,y:38,w:25,h:18},{x:15,y:4,w:30,h:87}],{x:6,y:5,w:33,h:86},{x:8,y:5,w:47,h:86}],
				ATTACK_OVERLAYS:[0,0,[{x:62,y:49,w:25,h:17},{x:45,y:39,w:25,h:17}],0,0],
				FRAME_TIMES:[1,0.8,0.8,1,1]
			},
			near_middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_near_middle_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:86,
				HEIGHT:102,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_kick",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"heavy",
				BODY_OVERLAYS:[{x:14,y:16,w:52,h:83},{x:29,y:10,w:42,h:88},{x:39,y:1,w:41,h:101},{x:29,y:10,w:42,h:88},{x:14,y:16,w:52,h:83}],
				ATTACK_OVERLAYS:[0,0,{x:61,y:31,w:25,h:40},0,0],
				FRAME_TIMES:[1.2,0.8,0.8,0.8,1.2]
			},
			near_heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_near_heavy_kick.gif",
				FPS:10,
				COUNT:1,
				WIDTH:97,
				HEIGHT:122,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_kick",
				CALL_ANIMATION:"",
				ATTACK_TYPE:"heavy",
				BODY_OVERLAYS:[{x:5,y:33,w:46,h:86},{x:4,y:32,w:40,h:86},{x:9,y:7,w:40,h:113},[{x:37,y:42,w:41,h:25},{x:6,y:18,w:35,h:102}],{x:3,y:29,w:37,h:92},{x:5,y:30,w:45,h:88}],
				ATTACK_OVERLAYS:[0,0,{x:31,y:1,w:18,h:55},[{x:67,y:32,w:30,h:21},{x:37,y:49,w:38,h:20}],0,0],
				FRAME_TIMES:[1.2,1,0.8,1,1.2,1.2]
			},
			
			
			/**
			 * 下蹲出拳
			 */
			crouch_light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_crouch_light_boxing.gif",
				FPS:18,
				COUNT:1,
				WIDTH:95,
				HEIGHT:61,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"bottom",
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:6,y:1,w:56,h:57},{x:5,y:7,w:56,h:51},{x:6,y:1,w:56,h:57}],
				ATTACK_OVERLAYS:[0,{x:51,y:11,w:45,h:11},0],
				FRAME_TIMES:[1.2,1,1.2]
			},
			crouch_middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_crouch_middle_boxing.gif",
				FPS:12,
				COUNT:1,
				WIDTH:92,
				HEIGHT:62,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_boxing",
				ATTACK_TYPE:"bottom",
				BODY_OVERLAYS:[{x:8,y:3,w:52,h:57},{x:8,y:3,w:48,h:56},{x:6,y:4,w:55,h:55}],
				ATTACK_OVERLAYS:[0,{x:47,y:10,w:46,h:11},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,0.8,1]
			},
			crouch_heavy_boxing: {
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_crouch_heavy_boxing.gif",
				FPS:10,
				COUNT:1,
				WIDTH:73,
				HEIGHT:125,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				ATTACK_TYPE:"heavy",
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:6,y:56,w:45,h:68},{x:5,y:37,w:48,h:87},{x:11,y:29,w:45,h:95},{x:6,y:36,w:47,h:87},{x:6,y:58,w:46,h:67}],
				ATTACK_OVERLAYS:[{x:39,y:72,w:21,h:18},{x:55,y:34,w:18,h:27},[{x:43,y:14,w:15,h:13},{x:40,y:0,w:12,h:13}],{x:53,y:35,w:21,h:25},{x:43,y:72,w:18,h:21}],
				FRAME_TIMES:[1,1.2,0.8,0.6,0.6]
			},
			
			
			/**
			 * 下蹲踢腿
			 */
			crouch_light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_crouch_light_kick.gif",
				FPS:18,
				COUNT:1,
				WIDTH:112,
				HEIGHT:64,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"bottom",
				BODY_OVERLAYS:[{x:7,y:3,w:56,h:57},[{x:39,y:41,w:71,h:18},{x:6,y:1,w:41,h:61}],{x:7,y:3,w:56,h:57}],
				ATTACK_OVERLAYS:[0,{x:47,y:44,w:62,h:16},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,1,1]
			},
			crouch_middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_crouch_middle_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:146,
				HEIGHT:64,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_kick",
				ATTACK_TYPE:"bottom",
				BODY_OVERLAYS:[{x:9,y:2,w:52,h:60},[{x:5,y:41,w:85,h:21},{x:4,y:5,w:48,h:36}],[{x:74,y:41,w:63,h:18},{x:20,y:12,w:52,h:50}],0,0],
				ATTACK_OVERLAYS:[0,0,{x:72,y:43,w:71,h:18},0,0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,1,1,1]
			},
			crouch_heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_crouch_heavy_kick.gif",
				FPS:8,
				COUNT:1,
				WIDTH:121,
				HEIGHT:61,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_kick",
				ATTACK_TYPE:"fall",
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:3,y:6,w:43,h:51},{x:9,y:6,w:57,h:53},{x:3,y:5,w:42,h:53},{x:9,y:5,w:53,h:53},{x:3,y:4,w:50,h:53}],
				ATTACK_OVERLAYS:[0,{x:52,y:37,w:68,h:20},{x:43,y:45,w:20,h:15},0,0],
				FRAME_TIMES:[1.2,1,1,1.2,1.2]
			},
			
			
			/**
			 * 跳跃出拳
			 */
			jump_light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_light_boxing.gif",
				FPS:16,
				COUNT:1,
				WIDTH:81,
				HEIGHT:71,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:9,y:4,w:48,h:62},{x:2,y:4,w:52,h:65}],
				ATTACK_OVERLAYS:[0,[{x:63,y:28,w:18,h:15},{x:50,y:20,w:17,h:13}]],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,0.01]
			},
			jump_middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_middle_boxing.gif",
				FPS:12,
				OFFSET_X:-13,
				COUNT:1,
				WIDTH:88,
				HEIGHT:77,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_boxing",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:16,y:13,w:47,h:60},{x:9,y:6,w:48,h:67},[{x:44,y:24,w:38,h:15},{x:10,y:12,w:40,h:55}],{x:17,y:12,w:45,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:46,y:27,w:40,h:20},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,1.2,0.4,1]
			},
			jump_heavy_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_middle_boxing.gif",
				IS_COPY_IMG:true,
				FPS:12,
				OFFSET_X:-13,
				COUNT:1,
				WIDTH:88,
				HEIGHT:77,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:16,y:13,w:47,h:60},{x:9,y:6,w:48,h:67},[{x:44,y:24,w:38,h:15},{x:10,y:12,w:40,h:55}],{x:17,y:12,w:45,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:46,y:27,w:40,h:20},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1.2,1,1]
			},
			
			
			/**
			 * 跳跃踢腿
			 */
			jump_light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_light_kick.gif",
				FPS:16,
				COUNT:1,
				WIDTH:76,
				HEIGHT:92,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:17,y:4,w:40,h:82},{x:8,y:2,w:45,h:83}],
				ATTACK_OVERLAYS:[0,[{x:38,y:14,w:25,h:21},{x:57,y:0,w:20,h:18}]],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,0.01]
			},
			jump_middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_middle_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:76,
				HEIGHT:92,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_kick",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:17,y:4,w:40,h:82},{x:8,y:2,w:45,h:83},{x:17,y:4,w:40,h:82}],
				ATTACK_OVERLAYS:[0,[{x:38,y:14,w:25,h:21},{x:57,y:0,w:20,h:18}]],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,0.4,1]
			},
			jump_heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_heavy_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:94,
				HEIGHT:104,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_kick",
				ATTACK_TYPE:"heavy",
				BODY_OVERLAYS:[{x:11,y:7,w:46,h:93},{x:5,y:12,w:41,h:71},[{x:40,y:41,w:40,h:17},{x:5,y:12,w:35,h:83}],{x:8,y:14,w:38,h:87},[{x:30,y:69,w:25,h:25},{x:4,y:17,w:42,h:50}]],
				ATTACK_OVERLAYS:[0,0,{x:33,y:42,w:58,h:15},0,0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1.2,1,1.2,1.2]
			},


			/**
			 * 往前或往后跳跃出拳
			 */
			jumpMoved_light_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_light_boxing.gif",
				IS_COPY_IMG:true,
				FPS:16,
				COUNT:1,
				WIDTH:81,
				HEIGHT:71,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:9,y:4,w:48,h:62},{x:2,y:4,w:52,h:65}],
				ATTACK_OVERLAYS:[0,[{x:63,y:28,w:18,h:15},{x:50,y:20,w:17,h:13}]],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,0.01]
			},
			
			jumpMoved_middle_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_middle_boxing.gif",
				IS_COPY_IMG:true,
				FPS:12,
				OFFSET_X:-13,
				COUNT:1,
				WIDTH:88,
				HEIGHT:77,
				POWER:10,
				HIT_SOUND_NAME:"hit_middle_boxing",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:16,y:13,w:47,h:60},{x:9,y:6,w:48,h:67},[{x:44,y:24,w:38,h:15},{x:10,y:12,w:40,h:55}],{x:17,y:12,w:45,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:46,y:27,w:40,h:20},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,1.2,0.4,1]
			},
			
			jumpMoved_heavy_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jump_middle_boxing.gif",
				IS_COPY_IMG:true,
				FPS:12,
				OFFSET_X:-13,
				COUNT:1,
				WIDTH:88,
				HEIGHT:77,
				POWER:20,
				HIT_SOUND_NAME:"hit_heavy_boxing",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:16,y:13,w:47,h:60},{x:9,y:6,w:48,h:67},[{x:44,y:24,w:38,h:15},{x:10,y:12,w:40,h:55}],{x:17,y:12,w:45,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:46,y:27,w:40,h:20},0],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1.2,1,1]
			},
			
			
			/**
			 * 往前或往后跳跃踢腿
			 */
			jumpMoved_light_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jumpMoved_light_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:77,
				HEIGHT:76,
				POWER:5,
				HIT_SOUND_NAME:"hit_light",
				ATTACK_TYPE:"top",
				BODY_OVERLAYS:[{x:14,y:3,w:42,h:71},{x:16,y:6,w:43,h:66},{x:7,y:8,w:51,h:61}],
				ATTACK_OVERLAYS:[0,0,{x:56,y:21,w:18,h:42}],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,0.01]
			},
			jumpMoved_middle_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jumpMoved_middle_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:110,
				HEIGHT:76,
				HIT_SOUND_NAME:"hit_middle_kick",
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,1,1],
				POWER:10,
				ATTACK_TYPE:"top",
				ATTACK_OVERLAYS:[0,0,{x:42,y:45,w:68,h:20},0],
				BODY_OVERLAYS:[{x:5,y:4,w:45,h:70},[{x:24,y:53,w:27,h:20},{x:9,y:3,w:42,h:50}],{x:4,y:11,w:51,h:55},[{x:29,y:55,w:25,h:18},{x:4,y:5,w:52,h:48}]]
			},
			jumpMoved_heavy_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_jumpMoved_middle_kick.gif",
				IS_COPY_IMG:true,
				FPS:12,
				COUNT:1,
				WIDTH:110,
				HEIGHT:76,
				HIT_SOUND_NAME:"hit_heavy_kick",
				CALL_ANIMATION:"",
				FRAME_TIMES:[1.2,1.2,0.8,1],
				POWER:20,
				ATTACK_TYPE:"top",
				ATTACK_OVERLAYS:[0,0,{x:42,y:45,w:68,h:20},0],
				BODY_OVERLAYS:[{x:5,y:4,w:45,h:70},[{x:24,y:53,w:27,h:20},{x:9,y:3,w:42,h:50}],{x:4,y:11,w:51,h:55},[{x:29,y:55,w:25,h:18},{x:4,y:5,w:52,h:48}]]
			},
			
			
			/**
			 * 被攻击
			 */
			beAttacked_top:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_beAttacked_top.gif",
				FPS:10,
				WIDTH:68,
				HEIGHT:90,
				COUNT:1,
				FRAME_TIMES:[1,0.4],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[0,{x:5,y:5,w:48,h:82}]
			},
			beAttacked_bottom:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_beAttacked_bottom.gif",
				FPS:6,
				WIDTH:66,
				HEIGHT:85,
				COUNT:1,
				FRAME_TIMES:[1,0.5],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[0,{x:7,y:6,w:41,h:77}]
			},
			beAttacked_heavy:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_beAttacked_heavy.gif",
				FPS:6,
				WIDTH:75,
				HEIGHT:84,
				COUNT:1,
				FRAME_TIMES:[0.4,0.6,0.8],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[0,{x:7,y:9,w:55,h:71},{x:3,y:14,w:55,h:63}]
			},
			beAttacked_impact:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_beAttacked_impact.gif",
				FPS:6,
				WIDTH:81,
				HEIGHT:93,
				COUNT:1,
				FRAME_TIMES:[0.5,0.4,1],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[0,[{x:28,y:48,w:45,h:42},{x:2,y:6,w:42,h:47}],{x:14,y:8,w:42,h:82}]
			},
			beAttacked_fire:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_beAttacked_fire.gif",
				FPS:40,
				WIDTH:121,
				HEIGHT:71,
				FRAME_TIMES:[1,1,1,1],
				CALL_ANIMATION:"wait"
			},
			beAttacked_electric:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_beAttacked_electric.gif",
				FPS:40,
				WIDTH:85,
				HEIGHT:101,
				FRAME_TIMES:[1,1],
				CALL_ANIMATION:"wait"
			},
			
			beAttacked_fall:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_beAttacked_fall.gif",
				FPS:10,
				OFFSET_X:-30,
				WIDTH:120,
				HEIGHT:80,
				COUNT:1,
				FRAME_TIMES:[1,1,1,0.6],
				CALL_ANIMATION:"somesault_up"
			},
			
			//被旋风腿之类的击中上半身而摔倒
			beAttacked_up_fall:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_beAttacked_fall.gif",
				FPS:10,
				IS_COPY_IMG:true,
				OFFSET_X:-30,
				WIDTH:120,
				HEIGHT:80,
				COUNT:1,
				FRAME_TIMES:[1,1,1,0.6],
				CALL_ANIMATION:"somesault_up"
			},
			

			beAttacked_before_fall_down:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_before_fall_down.gif",
				FPS:4,
				WIDTH:76,
				HEIGHT:66,
				COUNT:1,
				FRAME_TIMES:[1],
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[],
				ATTACK_OVERLAYS:[]
			},


			beAttacked_fall_down:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_fall_down.gif",
				FPS:6,
				WIDTH:128,
				HEIGHT:44,
				COUNT:1,
				FRAME_TIMES:[1.4,1.4,1],
				CALL_ANIMATION:"somesault_up",
				BODY_OVERLAYS:[],
				ATTACK_OVERLAYS:[]
			},
			
			
			/**
			 * 翻身站起
			 */
			somesault_up:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_somesault_up.gif",
				FPS:8,
				WIDTH:93,
				HEIGHT:115,
				COUNT:1,
				FRAME_TIMES:[1,1,1,1,1],
				CALL_ANIMATION:"wait",
				BODY_OVERLAYS:[],
				ATTACK_OVERLAYS:[]
			},
			
			
			
			
			/*以下开始为特殊招式，不同的人物的招式名称不一样*/
			
			/**
			 * 波动拳
			 */
			wave_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_wave_boxing.gif",
				FPS:12,
				COUNT:1,
				WIDTH:106,
				HEIGHT:90,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:8,y:4,w:51,h:82},[{x:5,y:57,w:72,h:31},{x:9,y:6,w:43,h:46}],[{x:7,y:55,w:73,h:31},{x:21,y:10,w:41,h:42}],[{x:7,y:58,w:87,h:28},{x:39,y:14,w:58,h:40}]],
				FRAME_TIMES:[1,0.5,0.8,0.2],
				MAGIC_FRAMES:{
					frame_4:{
						x:80,
						y:20
					}
				}
			},
			
			/**
			 * 旋风腿
			 */
			before_whirl_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_before_whirl_kick.gif",
				FPS:12,
				COUNT:1,
				WIDTH:69,
				HEIGHT:120,
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,1]
			},
			whirl_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_whirl_kick.gif",
				FPS:18,
				OFFSET_X:-40,
				COUNT:1,
				WIDTH:150,
				HEIGHT:132,
				POWER:15,
				DEFENCED_POWER:5,
				ATTACK_TYPE:"up_fall",
				HIT_SOUND_NAME:"hit_heavy_kick",
				BODY_OVERLAYS:[{x:55,y:10,w:45,h:83},[{x:96,y:38,w:45,h:20},{x:53,y:5,w:41,h:93}],{x:54,y:6,w:41,h:88},[{x:12,y:35,w:47,h:18},{x:61,y:6,w:35,h:85}]],
				ATTACK_OVERLAYS:[0,{x:87,y:38,w:57,h:20},0,{x:9,y:36,w:58,h:17}],
				CALL_ANIMATION:"",
				FRAME_TIMES:[1,1,1,1]
			},
			after_whirl_kick:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_after_whirl_kick.gif",
				FPS:16,
				COUNT:1,
				WIDTH:55,
				HEIGHT:132,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:8,y:11,w:42,h:86},{x:10,y:16,w:41,h:83},{x:6,y:22,w:41,h:83},{x:4,y:39,w:41,h:78},{x:7,y:52,w:40,h:77}],
				FRAME_TIMES:[1,1,1,1,1]
			},
			
			
			/**
			 * 冲天拳
			 */
			impact_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_impact_boxing.gif",
				FPS:10,
				COUNT:1,
				WIDTH:68,
				HEIGHT:125,
				CALL_ANIMATION:"",
				HIT_SOUND_NAME:"hit_heavy_boxing",
				POWER:20,
				DEFENCED_POWER:5,
				ATTACK_TYPE:"up_fall",
				ATTACK_OVERLAYS:[0,{x:39,y:52,w:28,h:25},{x:39,y:0,w:17,h:52}],
				FRAME_TIMES:[1,0.8,1]
			},
			after_impact_boxing:{
				IMG:config.Configure.url+"images/fighter/RYU2/RYU2_after_impact_boxing.gif",
				FPS:12,
				COUNT:1,
				WIDTH:59,
				HEIGHT:119,
				CALL_ANIMATION:"",
				BODY_OVERLAYS:[{x:13,y:5,w:40,h:108},{x:10,y:16,w:40,h:96},{x:9,y:28,w:43,h:86}],
				FRAME_TIMES:[1,1,1]
			}
			
		}
);

/**
 * @fileoverview Overlay，碰撞检测类
 * @author Random | Random.Hao.Yang@gmail.com
 */



$package("aralork.display","Overlay",

	/**
	 * 碰撞检测类，继承于DisplayObject类
	 * @param {Obejct} parent 添加对象的父节点
	 * @param {String} group 组名
	 * @param {Number} w 宽
	 * @param {Number} h 高
	 * @param {Array} ol 碰撞检测对象列表，用于跟当前检测对象遍历判断是否有重叠产生
	 * @event
	 * 		"overlaying" 两个碰撞检测对象发生重叠时触发
	 * 	
	 */
	function(parent,tagName,w,h,group,ol){
		
		/**
		 * 分组的标识，不同实例可以通过设置相同的分组标识来判断分组(我发现我写注释的水平有待提高╮(╯▽╰)╭。。。)
		 */
		this.group=group || null;
		
		this.enabled=true;
		
		this.__overlayList=ol || [];
		
		this.hidden();
		
		//调试用
		this.updateEnabled=function(){
			//this.__entity.style.borderColor=this.enabled?"red":"#c8c8c8";
			//this.__entity.style.display=this.enabled?"":"none";
		};
		
	}.$extends(aralork.display.DisplayObject).define({
		
		/**
		 * 设置位置，重写了父类的setPosition方法
		 * @param {Object} param
		 * 					x:Number
		 * 					y:Number
		 * 
		 */
		setPosition:function(param){
			aralork.display.Overlay.$super.setPosition.call(this,param);

			//调试用
//			var st=this.__entity.style;
//			st.border="1px solid red";
//			st.display="";
			
			this.check();

			return this;
		},
		
		/**
		 * 设置要碰撞的碰撞元素列表
		 * @param {Array} ol
		 */
		setOverlayList:function(ol){
			this.__overlayList=ol instanceof Array ? ol:[ol];
			return this;
		},
		
		/**
		 * 添加要碰撞的碰撞元素列表
		 * @param {Object} ol
		 */
		addOverlayList:function(ol){
			this.__overlayList=this.__overlayList.concat(ol instanceof Array ? ol:[ol]);
			return this;
		},

		/**
		 * 强制触发事件
		 * @param {String} type
		 */
		fireEvent:function(type){
			var args=Array.prototype.slice.call(arguments,1),
				eventDispatcher=this.__eventDispatcher;
				
			args.unshift(type);
			eventDispatcher.dispatchEvent.apply(eventDispatcher,args);
			return this;
		},
		
		/**
		 * 遍历检测对象的重叠情况
		 */
		check:function(){
			if(!this.enabled){
				return this;
			}
			var ol=this.__overlayList,
				i=ol.length,
				o;
			
			while(i--){
				o=ol[i];
				if(o && o!==this && o.enabled && this.__checkOverlaying(o)){
					this.fireEvent("overlaying",o,this.__checkRect(this,o));
					o.fireEvent("overlaying",this,this.__checkRect(o,this));
				}
			}
			return this;
		},
		
		destroy:function(){
			
		},
		
		/**
		 * 判断对象是否有矩形重叠
		 * @param {DisplayObject} dispObj
		 */
		__checkOverlaying:function(dispObj){
			var x1= +this.x,
				y1= +this.y,
				w1= +this.width,
				h1= +this.height,
				x2= +dispObj.x,
				y2= +dispObj.y,
				w2= +dispObj.width,
				h2= +dispObj.height;
			
			return	x2 < x1 + w1
					&& x2 + w2 > x1
					&& y2 < y1 + h1
					&& y2 + h2 > y1;
		},
		
		/**
		 * 检测两个对象碰撞的矩形区域,4个坐标分别为左上、右上、右下、左下
		 * @param {DisplayObject} dispObj1
		 * @param {DisplayObject} dispObj2
		 * @return 
		 * 		[
		 * 			{x:1,y:1},
		 * 			{x:2,y:1},
		 * 			{x:2,y:2},
		 * 			{x:1,y:2},
		 * 		]
		 */
		__checkRect:function(dispObj1,dispObj2){
			var x1=Math.max(+dispObj1.x,+dispObj2.x),
				y1=Math.max(+dispObj1.y,+dispObj2.y),
				
				x2= x1===dispObj1.x?
						dispObj1.x+dispObj1.width:
						dispObj2.x+dispObj2.width,
						
				y2= y1===dispObj1.y?
						dispObj1.y+dispObj1.height:
						dispObj2.y+dispObj2.height;
						
			return [
						{x:x1,y:y1},
						{x:x2,y:y1},
						{x:x2,y:y2},
						{x:x1,y:y2}
					];

		}
		
	})
);

/**
 * @fileoverview 动作碰撞检测类
 * @author Random | Random.Hao.Yang@gmail.com
 */



$package("role","ActionOverlay",
	function(parent,tagName,w,h,group,ol){
		this.cfgDelta={
			x:0,
			y:0
		};
		this.attackType="";
		this.power=0;
		this.defencedPower=0;
		this.hitSoundName="";
		
		/**
		 * 类型
		 * 		attack
		 * 		body
		 */
		this.type="";
		
		/**
		 * 对象的管理者(FrameOverlayList类的实例)
		 */
		this.manager=null;
	}.$extends(aralork.display.Overlay).define({
		
	})
);

/**
 * @fileoverview 帧的碰撞检测列表类
 * @author Random | Random.Hao.Yang@gmail.com
 */





$package("role","FrameOverlayList",

	/**
	 * 帧的碰撞检测列表类
	 * @param {Object} overlayCfg 碰撞检测配置信息
	 * @param {Object} actCfg 每个动作的配置信息对象{
	 * 						attackType:{String}
							power:{Number}
							defencedPower:{Number}
							soundName:{String}
	 * 					}
	 * @param {String} actName 动作名称
	 * @param {Object} animation 所附的动画对象
	 * @param {String} type 碰撞检测对象类型
	 * 					attack
	 * 					body
	 * @param {Object} parent 父节点
	 * @event
	 * 		overlaying
	 * 		otherOverlaying
	 */
	function(overlayCfg,actCfg,actName,animation,type,parent){
		this.queue=[];
		this.enabled=true;
		
		this.__list=[];
		this.__parent=parent || document.body;
		this.__overlayConfig=overlayCfg || [];
		this.__animation=animation;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__lastIndex=0;
		
		this.__initList(overlayCfg,actCfg,actName,type);
		this.__initQueue();
		
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		/**
		 * 强制触发事件
		 * @param {String} type
		 */
		fireEvent:function(type){
			this.__eventDispatcher.dispatchEvent(type);
			return this;
		},
		
		/**
		 * 根据动画的帧呈现当前的碰撞检测对象状态
		 * @param {Number} frame
		 */
		refresh:function(frame){
			var list=this.__list,
				anm=this.__animation,
				idx= typeof frame ==="undefined" ?this.__lastIndex:frame-1,
				l=list.length,
				ovlCfg=this.__overlayConfig,
				width=anm.width,
				scale=anm.scale,
				isFlipH=anm.isFlipH,
				startX=anm.x,
				startY=anm.y,
				preIdx = (idx-1+l)%l,
				preOverlay =list[preIdx];

			if(!ovlCfg.length){
				return;
			}
			
			this.__lastIndex=idx;
			preOverlay && this.__updateOverlay(preOverlay,false,ovlCfg[preIdx],width,scale,isFlipH,startX,startY);
			list[idx] && this.__updateOverlay(list[idx],this.enabled,ovlCfg[idx],width,scale,isFlipH,startX,startY);
			
			return this;
		},
		
		disabled:function(){
			var queue=this.queue,
				i=queue.length;
				
			while(i--){
				queue[i] && (queue[i].enabled=false);
				
				//调试用
				//queue[i] && queue[i].updateEnabled();
			}
			
			this.enabled=false;
			return this;
		},
		
		/**
		 * 将指定group名称的overlay队列元素设置为enabled=false;
		 * @param {String} group
		 */
		disableOverlaysByGroup:function(group,queue){
			var queue=queue || this.queue,
				i=queue.length;
				
			while(i--){
				queue[i].group===group && (queue[i].enabled=false);
				//queue[i].group===group && alert(queue[i].enabled.toString()+"----"+queue[i].group)
			}
		},
		
		/**
		 * 更新碰撞检测对象
		 * @param {Object} ovl
		 * @param {Boolean} state
		 * @param {Object} cfg
		 * @param {Number} width
		 * @param {Number} scale
		 * @param {Boolean} isFlipH
		 * @param {Number} startX
		 */
		__updateOverlay:function(ovl,state,cfg,width,scale,isFlipH,startX,startY){
			if(!ovl){
				return;
			}
			
			var i,
				x;
				
			if(ovl instanceof Array){
				i=ovl.length;
				while(i--){
					x=isFlipH ? (width/scale-cfg[i].x-cfg[i].w) * scale : cfg[i].x * scale;
					ovl[i].enabled=state && this.enabled;
					
					ovl[i].setSize({
						w:cfg[i].w * scale,
						h:cfg[i].h * scale
					})
					.setPosition({
						x:startX + x,
						y:startY + cfg[i].y * scale
					});
					
					//调试用
					//ovl[i].updateEnabled();
				}
			}else{
				x=isFlipH ? (width/scale-cfg.x-cfg.w) * scale : cfg.x * scale;
				ovl.enabled=state && this.enabled;

				ovl.setSize({
					w:cfg.w * scale,
					h:cfg.h * scale
				})
				.setPosition({
					x:startX + x,
					y:startY + cfg.y * scale
				});
			
				//调试用
				//ovl.updateEnabled();
			}
		},
		
		/**
		 * 初始化以帧为序列的碰撞检测列表
		 * @param {Object} overlayCfg
		 * @param {Object} actCfg
		 * @param {String} actName
		 * @param {String} type
		 */
		__initList:function(overlayCfg,actCfg,actName,type){
			if(!overlayCfg || !(overlayCfg instanceof Array)){
				return;
			}
			
			var i=overlayCfg.length,
				j,
				me=this,
				list=this.__list;
			
			while(i--){
				if(overlayCfg[i]){
					if(overlayCfg[i] instanceof Array){
						list[i]=[];
						j=overlayCfg[i].length;
						while(j--){
							list[i][j]=this.__createActionOverlay(overlayCfg[i][j],actName+"_"+type+"_"+i,actCfg,type);
						}
					}else{
						list[i]=this.__createActionOverlay(overlayCfg[i],actName+"_"+type+"_"+i,actCfg,type);
					}
				}else{
					list[i]=0;
				}
			}
		},
		
		/**
		 * 创建ActionOverlay对象
		 * @param {Object} cfg
		 * @param {String} group
		 * @param {Object} actCfg
		 * @param {String} type
		 */
		__createActionOverlay:function(cfg,group,actCfg,type){
			var o=new role.ActionOverlay(this.__parent,
									"none",
									cfg.w * this.__animation.scale,
									cfg.h * this.__animation.scale,
									group);
			o.cfgDelta=cfg;
			o.enabled=false;
			o.attackType=actCfg.attackType;
			o.power=actCfg.power;
			o.hitSoundName=actCfg.hitSoundName;
			o.defencedPower=actCfg.defencedPower;
			o.type=type;
			o.manager=this;

			return o;
		},
		
		/**
		 * 初始化碰撞检测列表为展开的线形队列
		 */
		__initQueue:function(){
			var list=this.__list,
				i=list.length,
				j;
			
			while(i--){
				if (list[i]) {
					if (list[i] instanceof Array) {
						j = list[i].length;
						while (j--) {
							this.queue.unshift(list[i][j]);
						}
					}
					else {
						this.queue.unshift(list[i]);
					}
				}
			}
		}
	})
);

/**
 * @fileoverview 动作动画类
 * @author Random | Random.Hao.Yang@gmail.com
 */




$package("role","ActionAnimation",

	/**
	 * 
	 * @param {Object} frameOverlayListParam 帧的碰撞检测列表对象的配置参数{
	 						actCfg 动作配置对象
	 						actName 动作名称
	 					}
	   @event
	   		overlaying
	   		otherOverlaying
	 */
	function(parent,tagName,w,h,img,fps,frameTimes,frameOverlayListParam,offsetX){
		this.attackOverlayList=null;
		this.bodyOverlayList=null;
		this.offsetX=offsetX || 0;
		
		this.__initOverlayList(frameOverlayListParam);
		this.__initEvent();
		
	}.$extends(aralork.display.Animation).define({
		
		/**
		 * 隐藏并disabled掉碰撞检测功能
		 * @param {IRenderer} renderer
		 */
		hidden:function(renderer){
			role.ActionAnimation.$super.hidden.call(this,renderer);
			this.attackOverlayList.disabled();
			this.bodyOverlayList.disabled();
			
			return this;
		},
		
		/**
		 * 显示并开启碰撞检测功能
		 * @param {IRenderer} renderer
		 */
		show:function(renderer){
			role.ActionAnimation.$super.show.call(this,renderer);
			this.attackOverlayList.enabled=true;
			this.bodyOverlayList.enabled=true;
			
			return this;
		},
		
		/**
		 * 刷新
		 */
		refresh:function(frame){
			this.attackOverlayList.refresh(frame);
			this.bodyOverlayList.refresh(frame);
			return this;
		},

		/**
		 * 初始化动作动画的身体部分和攻击部分的碰撞检测对象
		 * @param {Object} frameOverlayListParam
		 */
		__initOverlayList:function(frameOverlayListParam){
			var actionConfig=frameOverlayListParam.actCfg;
			
			this.attackOverlayList=new role.FrameOverlayList(
				actionConfig.ATTACK_OVERLAYS,
				{
					attackType:actionConfig.ATTACK_TYPE,
					power:actionConfig.POWER,
					defencedPower:actionConfig.DEFENCED_POWER,
					hitSoundName:actionConfig.HIT_SOUND_NAME
				},
				frameOverlayListParam.actName,
				this,
				"attack",
				this.__parent
			);
			
			this.bodyOverlayList=new role.FrameOverlayList(
				actionConfig.BODY_OVERLAYS,
				{
					attackType:actionConfig.ATTACK_TYPE,
					power:actionConfig.POWER,
					defencedPower:actionConfig.DEFENCED_POWER
				},
				frameOverlayListParam.actName,
				this,
				"body",
				this.__parent
			);
		},
		
		/**
		 * 初始化动画的事件
		 */
		__initEvent:function(){
			var me=this;
			
			this.addEventListener("playing",function(frame,frameCount){
				this.refresh(frame);
			});
		}
	})
);

/**
 * @fileoverview 动作类,播放动作对应的动画
 * @author Random | Random.Hao.Yang@gmail.com
 */











$package("role","Action",
	
	/**
	 * 动作类,播放动作对应的动画
	 * 
	 * 
	 * @event
	 * 		playing 正常播放动作时触发
	 * 		actionStart 开始播放一个动作时触发
	 * 		actionComplete 完成一个动作的播放后触发
	 * 		adversaryBodyOverlaying 敌人的身体动作区域被碰撞时触发
	 * 		attackOverlaying 进攻的动作区域有碰撞时触发
	 */
	function(fighter,scale,parent){
		this.animations={};
		this.currentAnimation=null;
		this.currentActionName="";
		
		this.__fighter=fighter;
		this.__nextActionName="";
		this.__scale=scale;
		this.__parent=parent || document.body;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__lookAt="right";
		
		this.__initAnimations(this.__fighter.name);
	}.define({
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		/**
		 * 强制触发事件
		 * @param {String} type
		 */
		fireEvent:function(type){
			var args=Array.prototype.slice.call(arguments,1),
				eventDispatcher=this.__eventDispatcher;
				
			args.unshift(type);
			eventDispatcher.dispatchEvent.apply(eventDispatcher,args);
			return this;
		},
		
		/**
		 * 更新当前动画为要播放的动画
		 * @param {String} actionName 动画名称
		 * @param {String} lookAt 斗士朝向 
		 * 					left
		 * 					right
		 * 
		 * @param {Number} playCount 播放的次数,为空时为动作配置信息里的COUNT值
		 */
		updateAnimation: function(actionName,lookAt,playCount){
			
			actionName=actionName || this.currentActionName;
			
			var crtAnm=this.currentAnimation,
				newAnm=this.animations[actionName],
				_x=0,
				_y=0,
				_z=0,
				_crtX=crtAnm.x,
				_crtW=crtAnm.width,
				_newW=newAnm.width;
			
			this.__lookAt=lookAt=lookAt.toLowerCase();
			
			_x=lookAt==="left"  
						? _crtX -_newW + _crtW + crtAnm.offsetX * this.__scale
						: _crtX - crtAnm.offsetX * this.__scale;

			_y=this.__fighter.dynamicBasicY - newAnm.height;
			_z=crtAnm.z;
			
			this.__nextActionName=actionName;
			crtAnm.state!=="stop" && crtAnm.stop();
			crtAnm.hidden();
			
			this.currentActionName=actionName;
			this.__eventDispatcher.dispatchEvent("actionStart",actionName);
			this.currentAnimation=
				newAnm.setFlipH(lookAt==="left")
					.setPosition({
						x:_x + (lookAt==="left"? - newAnm.offsetX * this.__scale : newAnm.offsetX * this.__scale),
						y:_y,
						z:_z
					})
					.show()
					.play(typeof playCount === "undefined" ?
						config.fighterAction[this.__fighter.name][actionName].COUNT :
						playCount);
		},
		
		/**
		 * 设置显示比例
		 * @param {Number} sc
		 */
		setScale:function(sc){
			sc=sc || 1;
			var k,
				anm=this.animations;
				
			for(k in anm){
				anm[k].setScale(sc);
			}
			this.__scale=sc;
			
			return this;
		},
		
		/**
		 * 设置当前动作与对手动作的碰撞检测情况
		 * @param {Fighter} adversary
		 */
		setAdversaryActionOverlay:function(adversary){
			var attackOverlayQueue=this.__fighter.getAttackOverlayListQueue();
				adversaryBodyOverlayQueue=adversary.getBodyOverlayListQueue();
				
			this.__updateOverlayListCheckedQueue(attackOverlayQueue,
												"attackOverlaying",
												adversaryBodyOverlayQueue);
			
			this.__updateOverlayListCheckedQueue(adversaryBodyOverlayQueue,
												"adversaryBodyOverlaying");

			return this;
		},
		
		__updateOverlayListCheckedQueue:function(queue,eventName,checkeQueue){
			var k,
				p,
				i,
				me=this,
				adv=this.__fighter.adversary;
			
			i=queue.length;

			while(i--){
				checkeQueue && queue[i].setOverlayList(checkeQueue);
				queue[i].addEventListener("overlaying",function(actionOverlay,rect){
					//当前碰撞检测的是对手的身体时，检测对手是否是防守状态
					if ((eventName==="adversaryBodyOverlaying" && !adv.defenseState)
					|| eventName==="attackOverlaying") {
						this.manager.enabled=false;
						this.manager.constructor===role.FrameOverlayList && this.manager.disableOverlaysByGroup(this.group,queue);
					}
					
					me.__eventDispatcher.dispatchEvent(eventName,actionOverlay,rect);
				});
			}
		},
		
		/**
		 * 初始化要播放的动画列表
		 * @param {String} fighterName
		 */
		__initAnimations:function(fighterName){
			var actionCfg=config.fighterAction[fighterName],
				ResourceLoader=aralork.utils.ResourceLoader,
				k,
				me=this;
				
			for(k in actionCfg){
				if(!this.animations[k]){
					this.animations[k]=new role.ActionAnimation(
						this.__parent,
						null,
						actionCfg[k].WIDTH,
						actionCfg[k].HEIGHT,
						ResourceLoader.getImage(actionCfg[k].IMG,actionCfg[k].IS_COPY_IMG),
						actionCfg[k].FPS,
						actionCfg[k].FRAME_TIMES,
						{
							actCfg:actionCfg[k],
							actName:k
						},
						actionCfg[k].OFFSET_X
					);
					
					this.animations[k].addEventListener("stop",(function(actionName){
						return function(frame,frameCount,isCoerceStop){
							var nextName = me.__nextActionName===me.currentActionName?"":me.__nextActionName;
							me.__eventDispatcher.dispatchEvent("actionComplete",me.currentActionName,actionName || nextName);
							actionName && !isCoerceStop && me.updateAnimation(actionName,me.__lookAt);
						};
					})(actionCfg[k].CALL_ANIMATION))
					
					.addEventListener("playing",(function(actionName){
						return function(frame){
							me.__eventDispatcher.dispatchEvent("playing",actionName,frame);
						};
					})(k))
					
					.hidden();
				}
			}
			
			this.currentAnimation=this.animations.wait;
			
		}
	})
);

/**
 * @fileoverview 抛物线公式
 * @author Random | Random.Hao.Yang@gmail.com
 * @example
 * 		var d=parseInt($E("debug").style.top);
		var pa=new aralork.animation.Parabola(1,40);
		pa.addEventListener("throw",function(v){
			$E("debug").style.top=v+d+"px";
			$E("debug").style.left=parseInt($E("debug").style.left)+10+"px";
		})
		.addEventListener("complete",function(v){
			alert("ok");
		});
		pa.start(40);
 */



$package("aralork.animation","Parabola",

	/**
	 * 抛物线公式计算类
	 * @param {Number} deltaT 时间的增量
	 * @param {Number} fps
	 * @event
	 * 		throw 正在进行抛物计算时触发
	 * 		complete 计算完成时触发
	 */
	function(deltaT,fps){
		fps=fps || 25;
		
		this.__timer=new aralork.utils.Timer(1000/fps);
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__deltaY=0;
		this.__deltaT=deltaT || 1;
		this.__t=0;
		this.__endValue=0;
		this.__g=0;
		
		this.__initTimer();
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		/**
		 * 开始执行动画，如果不传参数则从暂停点继续执行
		 * @param {Number} deltaY
		 * @param {Number} g
		 * @param {Number} endValue
		 */
		start:function(deltaY,g,endValue){
			if(arguments.length){
				this.__deltaY=deltaY || 0;
				this.__g=g;
				this.__endValue=endValue || this.__fn(deltaY,0,g);
				this.__t=0;
			}
			
			this.__timer.start();
			return this;
		},
		
		pause:function(){
			this.__timer.pause();
			return this;
		},
		
		stop:function(){
			this.__timer.stop();
			return this;
		},
		
		__fn:function(v,t,g){
			typeof g==="undefined" && (g=0.98);
			return v*t-0.5*g*t*t;
		},
		
		__initTimer:function(){
			var me=this,
				v;
			
			this.__timer.addEventListener("timer",function(){
				
				v=Math.min(-me.__fn(me.__deltaY,me.__t,me.__g),me.__endValue);
				me.__eventDispatcher.dispatchEvent("throw",v);
				if (v === me.__endValue && me.__t!==0) {
					me.stop();
					me.__eventDispatcher.dispatchEvent("complete");
				}
				me.__t+=me.__deltaT;
			});
		}
	})
);

/**
 * @fileoverview 位移动作类的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-31
 */

$package("role.movementAction","IMovementAction",{
	
	play:function(){},
	
	pause:function(){},
	
	continuePlay:function(){},
	
	stop:function(){}
	
});

/**
 * @fileoverview 跳跃的位移和动作
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-31
 */





$package("role.movementAction","JumpingMovementAction",
	function(fighter){
		
		this.__fighter=fighter;
		this.__directionValue=0;
		this.__startY=0;
		this.__parabola=new aralork.animation.Parabola(1.25,50);
		this.__deltaX=3*fighter.scale;
		this.__v0=this.__getV0(fighter.scale*100);
		this.__g=0.392*fighter.scale;
		this.__isPlaying=false;
		
		this.__initFighter();
		this.__initParabola();
		
	}.$implements(role.movementAction.IMovementAction).define({
		
		/**
		 * 播放跳跃动作
		 * @param {String} direction
		 * 					"up"
		 * 					"left"
		 * 					"right"
		 * 
		 * @param {Number} startY
		 */
		play:function(direction,startY){
			var ft=this.__fighter,
				type,
				me=this;
			
			if(direction==="left"){
				type = ft.lookAt==="right"?"back":"forward";
				this.__directionValue= -this.__deltaX;
			}else if(direction==="right"){
				type = ft.lookAt==="right"?"forward":"back";
				this.__directionValue=this.__deltaX;
			}else{
				type="up";
				this.__directionValue=0;
			}
			
			ft.action.updateAnimation("jump_"+type,ft.lookAt);
			this.__startY= ft.basicY-ft.height;
			window.setTimeout(function(){
				me.__isPlaying=true;
				me.__parabola.start(me.__v0,me.__g);
			},80);
		},
		
		stop:function(){
			this.__parabola.stop();
		},
		
		pause:function(){
			this.__parabola.pause();
		},
	
		continuePlay:function(){
			this.__parabola.start();
		},
		
		__initFighter:function(){
			var me=this,
				ft=this.__fighter;
			
			ft.action.addEventListener("actionComplete",function(actionName,nextActionName){
				if(me.__isPlaying && ft.state!=="beAttacked" && (/^jump/).test(actionName) && /(boxing|kick)$/.test(actionName)){
					ft.action.updateAnimation("jump_down",ft.lookAt,1);
				}
			});
		},
		
		__initParabola:function(){
			var ft=this.__fighter,
				me=this,
				pb=this.__parabola;
				
			pb.addEventListener("throw",function(v){
				ft.setPosition({
					x:ft.x+me.__directionValue,
					y:me.__startY+v
				});
			})
			.addEventListener("complete",function(){
				me.__isPlaying=false;
				ft.isJumping=false;
				game.SoundManager.play("footfall");
				ft.setPosition({
					y:ft.basicY-ft.height
				});
				ft.wait();
			});
		},
		
		/**
		 * 根据跳跃的高度获取初速度
		 * @param {String} h
		 */
		__getV0:function(h){
			var g=0.392*this.__fighter.scale;
			return Math.sqrt(h*2*g);
		}
	})
);

/**
 * @fileoverview 行走的位移动作类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-1-1 液。。。Happy new year~!!!
 */






$package("role.movementAction","WalkingMovementAction",
	function(fighter){
		
		this.__fighter=fighter;
		this.__walkTimer=new aralork.utils.Timer();
		this.__deltaX=0;
		
		this.__initWalkTimer();
		
	}.$implements(role.movementAction.IMovementAction).define({
		
		/**
		 * 播放行走动作
		 * @param {String} direction
		 * 					"left"
		 * 					"right"
		 * 					"forward"
		 * 					"back"
		 */
		play:function(direction){
			var ft=this.__fighter,
				type,
				hash={
					"left":"1",
					"right":"0"
				};
			if(direction==="forward" || direction==="back"){
				type=direction;
			}else{
				switch(hash[direction]+hash[ft.lookAt]){
					case "00":
						this.__deltaX=ft.scale*4;
						type="forward";
						break;
					
					case "01":
						this.__deltaX=ft.scale*3;
						type="back";
						break;
						
					case "10":
						this.__deltaX=-ft.scale*3;
						type="back";
						break;
						
					case "11":
						this.__deltaX=-ft.scale*4;
						type="forward";
						break;
				}
			}
			ft.action.updateAnimation("walk_"+type,ft.lookAt);
			this.__walkTimer.start();
			
		},
		
		stop:function(){
			this.__walkTimer.stop();
		},
		
		pause:function(){},
	
		continuePlay:function(){},
		
		/**
		 * 行走的运动方式
		 */
		__initWalkTimer:function(){
			var me=this,
				ft=this.__fighter;
				
			this.__walkTimer.addEventListener("timer",function(){
				ft.setPosition({
					x:ft.x + me.__deltaX
				});
			});
		}
		
	})
);
$package("aralork.animation.tween","Transition",
	{
		simple:function(t,b,c,d){
			return c*t/d+b;
		},
		backEaseIn: function(t, b, c, d){
			var s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		backEaseOut: function(t, b, c, d){
			var s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		backEaseInOut: function(t, b, c, d){
			var s = 1.70158;
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		bounceEaseOut: function(t, b, c, d){
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			}
			else 
				if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
				}
				else 
					if (t < (2.5 / 2.75)) {
						return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
					}
					else {
						return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
					}
		},
		bounceEaseIn: function(t, b, c, d){
			return c - Transition.bounceEaseOut(d - t, 0, c, d) + b;
		},
		bounceEaseInOut: function(t, b, c, d){
			if (t < d / 2) {
				return Transition.bounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
			}
			else {
				return Transition.bounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
			}
			
		},
		regularEaseIn: function(t, b, c, d){
			return c * (t /= d) * t + b;
		},
		regularEaseOut: function(t, b, c, d){
			return -c * (t /= d) * (t - 2) + b;
		},
		regularEaseInOut: function(t, b, c, d){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		strongEaseIn: function(t, b, c, d){
			return c * (t /= d) * t * t * t * t + b;
		},
		strongEaseOut: function(t, b, c, d){
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		strongEaseInOut: function(t, b, c, d){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t * t + b;
			}
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		elasticEaseIn: function(t, b, c, d){
			var a,p;
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
		
			p = d * 0.3;
			
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		elasticEaseOut: function(t, b, c, d){
			var a,p;
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
			
		},
		elasticEaseInOut: function(t, b, c, d){
			var a,p;
			if (t == 0) {
				return b;
			}
			if ((t /= d / 2) == 2) {
				return b + c;
			}
			if (!p) {
				var p = d * (0.3 * 1.5);
			}
			if (!a || a < Math.abs(c)) {
				var a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			if (t < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			}
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
		}
	}
);



$package("aralork.animation.tween","Tween",
	function(fps,startValue,endValue,duration,motion){
		
		/**
		 * 起始值
		 */
		this.startValue=startValue || 0;
		
		/**
		 * 结束值
		 */
		this.endValue=endValue || 0;
		
		/**
		 * 执行区间所需的时间(ms)
		 */
		this.duration=duration || 0;
		
		/**
		 * 运动公式的引用
		 */
		this.motion=motion || aralork.animation.tween.Transition.simple;
		
		this.fps=fps || 25;
		
		this.__itvID=0;
		this.__isTweenning=false;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
	}.define({
		
		/**
		 * 添加事件
		 * @param {String} type 事件类型
		 * 					"tween"
		 * 					"end"
		 * 
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			
			return this;
		},
		
		/**
		 * 移除事件
		 * @param {String} type 事件类型
		 * 					"tween"
		 * 					"end"
		 * 
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			
			return this;
		},
		
		/**
		 * 开始执行动画
		 */
		start:function(sv,ev,d,m){
			if(this.__isTweenning){
				return;
			}
			this.__isTweenning=true;
			
			var me=this,
				t,
				startTime=(new Date()).getTime(),
				dl=1000/this.fps;
			
			sv= typeof sv === "undefined" ? this.startValue : sv;
			ev= typeof ev === "undefined" ? this.endValue : ev;
			d && (this.duration=d);
			m && (this.motion=m);

			this.__itvID=window.setInterval(function(){
				t=((new Date()).getTime()-startTime)/1000;
				t>me.duration && (t=me.duration);
				me.__dispatchEvent(sv,ev,t);
				//me.__eventDispatcher.dispatchEvent("tween",me.motion(t,sv,ev-sv,me.duration));
				t===me.duration && me.stop();
			},dl);
			
			return this;
		},
		
		/**
		 * 停止动画
		 * @param {Boolean} isCancelEvent 是否取消onEnd事件
		 */
		stop:function(isCancelEvent){
			window.clearInterval(this.__itvID);
			this.__isTweenning=false;
			!isCancelEvent && this.__eventDispatcher.dispatchEvent("end");
			
			return this;
		},
		
		__dispatchEvent:function(sv,ev,t){
			var dpr=this.__eventDispatcher,
				i,
				retArr=[];
			
			if(typeof sv === "undefined"){
				this.stop();
				return;
			}else if(sv instanceof Array && ev instanceof Array){
				
				i=Math.min(sv.length,ev.length);
				while(i--){
					retArr.unshift(this.motion(t,sv[i],ev[i]-sv[i],this.duration));
				}
				dpr.dispatchEvent("tween",retArr);
				
			}else if(typeof sv === "number" && typeof ev === "number"){
				dpr.dispatchEvent("tween",this.motion(t,sv,ev-sv,this.duration));
			}
		}
	})
);

/**
 * @fileoverview 被击打的位移动作类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-02-20
 */






$package("role.movementAction","BeAttackedMovementAction",

	function(fighter){
		this.__fighter=fighter;
		this.__beAttackTween=new aralork.animation.tween.Tween(20,0,0,1,aralork.animation.tween.Transition.strongEaseOut);
		this.__parabola=new aralork.animation.Parabola(1,40);
		this.__startY=0;
		this.__direction=1;
		this.__g=0.392*fighter.scale;
		this.__lastValue=0;
		
		this.__initBeAttacked();
		this.__initParabola();
		
	}.$implements(role.movementAction.IMovementAction).define({
		
		play:function(type,power,isDefensed){

			var ft=this.__fighter,
				d=ft.lookAt==="right"?-1:1,
				deltaX=d * ft.scale * Math.min(power*3,40),
				ev=ft.x + (isDefensed ? deltaX/2 : deltaX),
				me=this,
				adv=ft.adversary,
				delayT=Math.min(power*30,250);
			
			//暂停动作
			if (!adv.isSpecialAttacking) {
				adv.action.currentAnimation.pause();
				adv.isJumping && adv.movementAction.pause("jumping");
			}
			if(!ft.isSpecialAttacking){
				ft.action.currentAnimation.pause();
				ft.isJumping && ft.movementAction.pause("jumping");
			}
			
			if(ft.isJumping){
				me.__fallDown(delayT);
			}else{
				setTimeout(function(){
					ft.action.currentAnimation.play(0,true);
					me.__beAttackTween.stop(true);
					me.__lastValue=ft.x;
					me.__beAttackTween.start(+ft.x,ev,0.4+power/100);
					
					if(!adv.isSpecialAttacking){
						adv.action.currentAnimation.play(0,true);
						adv.isJumping && adv.movementAction.continuePlay("jumping");
					}
				},delayT);
			}
			
		},
		
		stop:function(){
			this.__beAttackTween.stop(true);
		},
		
		pause:function(){},
	
		continuePlay:function(){},
		
		__initBeAttacked:function(){
			var ft=this.__fighter,
				me=this;
				
			this.__beAttackTween.addEventListener("tween",function(value){
				ft.setPosition({
					x:ft.x+(value-me.__lastValue)
				});
				me.__lastValue=value;
			});
			this.__beAttackTween.addEventListener("end",function(value){
				me.__lastValue=ft.x;
				(ft.action.currentActionName==="stand_up_defense" || ft.action.currentActionName==="stand_crouch_defense") && (ft.state="wait");
				ft.fireEvent("beAttackedComplete");
			});
		},
		
		__initParabola:function(){
			var pa=this.__parabola,
				ft=this.__fighter,
				me=this;
			
			pa.addEventListener("throw",function(v){
				ft.setPosition({
					x:ft.x + ft.scale*4*me.__direction,
					y:me.__startY+v
				});
			})
			.addEventListener("complete",function(v){
				ft.isJumping=false;
				game.SoundManager.play("fall");
				ft.action.updateAnimation("beAttacked_fall_down",ft.lookAt);
			});
		},
		
		__fallDown:function(delayT){
			var ft=this.__fighter,
				adv=ft.adversary,
				me=this;
				
			function update(){
				me.__startY= +ft.y;
				ft.movementAction.stopAll();
				ft.isSpecialAttacking && ft.stopSpecialAttack("beAttacked");
				ft.action.updateAnimation("beAttacked_before_fall_down",ft.lookAt);
				
				if(!adv.isSpecialAttacking){
					adv.action.currentAnimation.play(0,true);
					adv.isJumping && adv.movementAction.continuePlay("jumping");
				}
				
				me.__direction= ft.x < ft.adversary.x?-1:1;
				me.__parabola.start(me.__getV0(50),
									me._g,
									ft.basicY-me.__startY-ft.action.animations["beAttacked_before_fall_down"].height);
			}
				
			if(!ft.isSpecialAttacking){
				setTimeout(function(){
					update();
				},delayT);
			}else{
				update();
			}
			
			
			
		},
		
		/**
		 * 根据高度获取初速度
		 * @param {String} h
		 */
		__getV0:function(h){
			var g=0.392*this.__fighter.scale;
			return Math.sqrt(h*2*g);
		}
	})
);
/**
 * @fileoverview 位移动作类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-31
 */





$package("role.movementAction","MovementAction",
	function(fighter){
		this.__fighter=fighter;
		this.__hashConstructors={};
		this.__hashInstances={};
		
		this.__initConstructors();
		
	}.define({
		play:function(name){
			var args=[].slice.call(arguments,1);
			!this.__hashInstances[name] && (this.__hashInstances[name]=new this.__hashConstructors[name](this.__fighter)); 
			this.__hashInstances[name].play.apply(this.__hashInstances[name],args);
			return this;
		},
		
		stop:function(name){
			if(!this.__hashInstances[name]){
				return this;
			}
			var args=[].slice.call(arguments,1);
			this.__hashInstances[name].stop.apply(this.__hashInstances[name],args);
			return this;
		},
		
		pause:function(name){
			if(!this.__hashInstances[name]){
				return this;
			}
			var args=[].slice.call(arguments,1);
			this.__hashInstances[name].pause.apply(this.__hashInstances[name],args);
			return this;
		},
		
		continuePlay:function(name){
			if(!this.__hashInstances[name]){
				return this;
			}
			var args=[].slice.call(arguments,1);
			this.__hashInstances[name].continuePlay.apply(this.__hashInstances[name],args);
			return this;
		},
		
		stopAll:function(){
			var k,
				hash=this.__hashInstances;
				
			for(k in hash){
				hash[k].stop();
			}
			return this;
		},
		
		__initConstructors:function(){
			var ns=role.movementAction;
			this.__hashConstructors = {
				"jumping": ns.JumpingMovementAction,
				"walking": ns.WalkingMovementAction,
				"beAttacked":ns.BeAttackedMovementAction
			};
		}
	})
);

/**
 * @fileoverview 魔法装配器
 * @author Random | Random.Hao.Yang@gmail.com
 * @date 2010-12-06
 */

$package("role.magic","MagicAssembler",
	function(fighter){
		this.magicList={};
		
		this.__fighter=fighter;
		
		/**
		 * 帧配置数据
		 * 		"frame_{n}":{
					x:{x},
					y:{y}
				}
		 */
		this.__frameConfig={};
		
		this.__isFlipH=false;
		this.__scale=1;
		
		this.__initFighterEvent();
		
	}.define({
		
		/**
		 * 为指定动作添加魔法
		 * @param {String} actionName
		 * @param {IMagic} magicContructor
		 * @param {Object} frameConfig
		 * @param {Object} magicConfig
		 */
		addMagic:function(actionName,magicContructor,frameConfig,magicConfig){
			if(!actionName || !magicContructor || !config || this.magicList[actionName]){
				return;
			}
			var ft=this.__fighter;

			this.magicList[actionName]=new magicContructor(ft.parent,
												magicConfig,
												ft,
												"");
			
			this.magicList[actionName].addEventListener("complete",function(){

			});
			
			this.__frameConfig=frameConfig;
			this.setScale(+ft.scale);
			
			return this;
		},
		
		/**
		 * 设置比例
		 * @param {Number} sc
		 */
		setScale:function(sc){
			var k,
				list=this.magicList;
				
			for(k in list){
				list[k].setScale(sc);
			}
			this.__scale=sc;
			
			return this;
		},
		
		/**
		 * 设置被击打的对象
		 * @param {Fighter} adversary
		 */
		setAdversary:function(adversary){
			var k,
				list=this.magicList,
				adversaryQueue=(adversary.getBodyOverlayListQueue()).concat(adversary.getMagicBodyOverlayListQueue());

			for(k in list){
				this.__updateOverlayListCheckedQueue(list[k].attackOverlayList.queue,adversaryQueue);
			}
			
			return this;
		},
		
		clear:function(){
			var k,
				list=this.magicList;
				
			for(k in list){
				list[k].disappear();
			}
			
			return this;
		},
		
		__updateOverlayListCheckedQueue:function(queue,checkeQueue){
			var k,
				p,
				i,
				me=this;
			
			i=queue.length;
			
			while(i--){
				checkeQueue && queue[i].setOverlayList(checkeQueue);
				queue[i].addEventListener("overlaying",function(actionOverlay){
					me.clear();
				});
			}
		},
		
		/**
		 * 初始化斗士的事件绑定
		 */
		__initFighterEvent:function(){
			var me=this,
				ft=this.__fighter,
				cfg,
				mgc,
				_x,
				isFlipH;
				
			this.__fighter.addEventListener("playing",function(actionName,frame){
				cfg=me.__frameConfig["frame_"+frame];
				mgc=me.magicList[actionName];
				
				if(mgc && cfg){
					isFlipH=ft.lookAt==="left";
					//是否水平反转X
					_x=isFlipH ? (ft.width / me.__scale-cfg.x-mgc.width) * me.__scale : cfg.x * me.__scale;
					//是否右对齐
					isFlipH && (_x = _x - mgc.width + ft.width);

					mgc.setFlipH(isFlipH)
						.setPosition({
							x:ft.x + _x,
							y:ft.y + cfg.y * me.__scale
						});

					if (mgc.state !== "playing") {
						mgc.play(this.specialAttackLevel);
					}
				}
			});
		}
	})
);

/**
 * @fileoverview 特殊功击动作的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-01-13
 */

$package("role.specialAttack","ISpecialAttack",{
		
		/**
		 * 播放特殊攻击动作
		 * @param {Number} level 攻击级别
		 */
		play:function(level){},
		
		/**
		 * 停止特殊攻击动作
		 */
		stop:function(type){},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){}
	}
);

/**
 * @fileoverview 波动拳的特殊攻击类，实现了特殊攻击的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-01-13
 */




$package("role.specialAttack","WaveBoxing",
	function(fighter){
		this.__fighter=fighter;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__magic=fighter.getMagic("wave_boxing");
		
		this.__init();
		
	}.$implements(role.specialAttack.ISpecialAttack).define({
		play:function(){
			var ft=this.__fighter;
			if(!ft.isMagicPlaying){
				ft.isAttacking=true;
				this.__eventDispatcher.dispatchEvent("start","wave_boxing");
				game.SoundManager.play("wave_boxing");
				ft.action.updateAnimation("wave_boxing",ft.lookAt);
			}
		},
		
		stop:function(type){
			this.__fighter.action.currentAnimation.stop();
		},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		__init:function(){
			var me=this,
				ft=this.__fighter;
			
			this.__magic.addEventListener("complete",function(){
				ft.isMagicPlaying=false;
				ft.isSpecialAttacking=false;
				ft.isAttacking=false;
				me.__eventDispatcher.dispatchEvent("complete","wave_boxing");
			});
		}
	})
);

/**
 * @fileoverview 重力下落
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-20
 * @example
 * 		var gravity=new aralork.animation.Gravity(3,30);
		gravity.addEventListener("falling",function(v){
			fighter.setPosition({
				y:v
			});
		});
		gravity.fallDown(0,500)	
 */




$package("aralork.animation","Gravity",

	/**
	 * 重力下落类
	 * @param {Number} deltaT
	 * @param {Number} fps
	 * @event
	 * 		falling
	 * 		complete
	 * 
	 */
	function(deltaT,fps){
		this.fps=fps || 25;
		
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__timer=new aralork.utils.Timer(1000/fps);
		this.__deltaT=deltaT || 1;
		this.__endY=0;
		this.__startY=0;
		this.__g=0.98;
		this.__t=0;
		this.__value=0;
		
		this.__initTimer();
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		fallDown:function(startY,endY,g){
			this.__t=0;
			this.__g=g || 0.98;
			this.__startY=startY;
			this.__endY=endY;
			this.__timer.start();
		},
		
		stop:function(){
			this.__timer.stop();
			this.__eventDispatcher.dispatchEvent("complete",this.__value);
		},
		
		__fn:function(t){
			return this.__g*t*t/2;
		},
		
		__initTimer:function(){
			var me=this;
			
			this.__timer.addEventListener("timer",function(){
				me.__value=Math.min(me.__startY + me.__fn(me.__t),me.__endY);
				me.__eventDispatcher.dispatchEvent("falling",me.__value);
				if (me.__value === me.__endY && me.__t !== 0) {
					this.stop();
					me.__eventDispatcher.dispatchEvent("complete",me.__value);
				}
				me.__t+=me.__deltaT;
			});
		}
	})
);
/**
 * @fileoverview 冲天拳的特殊攻击类，实现了特殊攻击的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-01-15
 */









$package("role.specialAttack","ImpactBoxing",
	/**
	 * 
	 * @param {Fighter} fighter
	 * @events
	 * 		complete
	 */
	function(fighter){
		this.__fighter=fighter;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__tween=new aralork.animation.tween.Tween(40,0,0,0,aralork.animation.tween.Transition.strongEaseOut);
		this.__gravity=new aralork.animation.Gravity(3.5,40);
		this.__deltaX=0;
		this.__lastV=[];
		this.__stopType="";
		
		this.__initEvent();
		this.__initTween();
		this.__initGravity();
		
	}.$implements(role.specialAttack.ISpecialAttack).define({
		play:function(){
			var ft=this.__fighter;
			
			this.__stopType="";
			game.SoundManager.play("impact_boxing");
			ft.isJumping=true;
			ft.isAttacking=ft.isSpecialAttacking=true;
			this.__eventDispatcher.dispatchEvent("start","impact_boxing");
			ft.action.updateAnimation("impact_boxing",ft.lookAt);
		},
		
		stop:function(type){
			this.__stopType=type;
			this.__fighter.action.currentAnimation.stop();
			this.__tween.stop();
			this.__gravity.stop();
		},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		__initEvent:function(){
			var ft=this.__fighter,
				tw=this.__tween,
				me=this;
			
			ft.action.addEventListener("actionComplete",function(actionName){
				if(actionName==="impact_boxing"){
					var sc=ft.scale,
						level=ft.specialAttackLevel,
						direction=ft.lookAt==="right"?1:-1,
						sx=+ft.x,
						ex=ft.x + (level-1) * 20 * sc * direction,
						sy=+ft.y,
						ey=ft.y-(5 + level * 40) * sc;
					
					ft.isAttacking=ft.isSpecialAttacking=true;
					me.__lastV[0]= +ft.x;
					tw.start([sx,sy],[ex,ey],(level+1)/10);
				}
			});
		},
		
		__initTween:function(){
			var ft=this.__fighter,
				me=this;
	
			this.__tween.addEventListener("tween",function(v){
				ft.setPosition({
					x: ft.x+(v[0]-me.__lastV[0]),
					y: v[1]
				});
				me.__lastV[0]=v[0];
			})
			.addEventListener("end",function(){
				ft.action.updateAnimation("after_impact_boxing",ft.lookAt);
				me.__gravity.fallDown(+ft.y,ft.basicY-ft.height,0.392*ft.scale);
				me.__lastV[0]= +ft.x;
			});
		},
		
		/**
		 * 下落
		 */
		__initGravity:function(){
			var ft=this.__fighter,
				me=this;
			
			this.__gravity.addEventListener("falling",function(v){
				ft.setPosition({
					y:v
				});
			})
			.addEventListener("complete",function(){
				ft.isSpecialAttacking=false;
				ft.isJumping=false;
				ft.isAttacking=false;
				if(me.__stopType!=="beAttacked"){
					game.SoundManager.play("footfall");
					ft.state="wait";
				}
				me.__eventDispatcher.dispatchEvent("complete","impact_boxing");
			});
		}
	})
);

/**
 * @fileoverview 旋风腿的特殊攻击类，实现了特殊攻击的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-01-15
 */







$package("role.specialAttack","WhirlKick",

	/**
	 * @param {Fighter} fighter
	 * @evnets
	 * 		compelte
	 */
	function(fighter){
		this.__fighter=fighter;
		this.__timer=new aralork.utils.Timer();
		this.__deltaX=0;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__stopType="";
		this.__isPlaying=false;
		
		this.__initEvent();
		this.__initTimer();
		
	}.$implements(role.specialAttack.ISpecialAttack).define({
		play:function(){
			
			if(this.__isPlaying){
				return this;
			}
			
			var ft=this.__fighter,
				direction=ft.lookAt==="right"?1:-1;
			
			this.__isPlaying=true;
			game.SoundManager.play("whirl_kick");
			ft.isAttacking=ft.isSpecialAttacking=true;
			ft.isJumping=true;
			this.__eventDispatcher.dispatchEvent("start","whirl_kick");
			ft.action.updateAnimation("before_whirl_kick",ft.lookAt);
			this.__stopType="";
			this.__deltaX=(3.5+ft.specialAttackLevel*0.5)*ft.scale*direction;		
			this.__timer.start();
		},
		
		stop:function(type){
			this.__stopType=type;
			this.__fighter.action.currentAnimation.stop();
			this.__timer.stop();
			this.__fighter.isSpecialAttacking=false;
			this.__isPlaying=false;
		},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		__initEvent:function(){
			var ft=this.__fighter,
				tm=this.__timer,
				me=this;
			
			ft.action.addEventListener("actionComplete",function(actionName){
				if (me.__stopType !== "beAttacked") {
					actionName === "before_whirl_kick" && this.updateAnimation("whirl_kick", ft.lookAt, ft.specialAttackLevel + 2);
					actionName === "whirl_kick" && this.updateAnimation("after_whirl_kick", ft.lookAt, 1);
					if (actionName === "after_whirl_kick") {
						tm.stop();
					}
				}
			});
		},
		
		__initTimer:function(){
			var ft=this.__fighter,
				me=this;
	
			this.__timer.addEventListener("timer",function(){
				ft.setPosition({
					x: +ft.x+me.__deltaX
				});
			})
			.addEventListener("complete",function(){
				if(me.__stopType !== "beAttacked"){
					ft.isSpecialAttacking=false;
					ft.isJumping=false;
					ft.isAttacking=false;
				}
				me.__isPlaying=false;
				me.__eventDispatcher.dispatchEvent("complete","whirl_kick");
			});
		}
	})
);

/**
 * @fileoverview 特殊攻击动作的类表
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-01-13
 */





$package("role.specialAttack","SpecialAttackTable",{
		
		/**
		 * 波动拳
		 */
		"wave_boxing":role.specialAttack.WaveBoxing,
		
		/**
		 * 冲天拳
		 */
		"impact_boxing":role.specialAttack.ImpactBoxing,
		
		/**
		 * 旋风腿
		 */
		"whirl_kick":role.specialAttack.WhirlKick
		
	}
);

/**
 * @fileoverview Fighter
 * @author Random | Random.Hao.Yang@gmail.com
 */










$package("role","Fighter",
	
	/**
	 * 斗士类
	 * @param {String} name
	 * @param {String} lookAt
	 * @param {Number} basicY
	 * @param {Number} scale
	 * @param {Object} parent
	 * @events
	 * 		playing
	 * 		stateChanged 状态改变
	 * 		move 移动
	 * 		specialAttackStart 特殊攻击开始
	 * 		specialAttackComplete 特殊攻击完成
	 * 		positionChanged
	 * 		beAttacked
	 * 		beAttackedComplete
	 */
	function(name,lookAt,basicY,scale,parent){
		
		aralork.lib.Lib.defineGetter(this,
			["x","y","z","width","height","offsetX"],
			[this.__getX,this.__getY,this.__getZ,this.__getWidth,this.__getHeight,this.__getOffsetX]);
		
		this.lookAt=lookAt || "right";
		this.hp=100;
		this.name=name;
		this.action=new role.Action(this,scale,parent);
		
		/**
		 * 当前状态
		 */
		this.state="wait";
		
		this.scale=scale || 1;
		this.isJumping=false;
		this.isAttacking=false;
		this.isMagicPlaying=false;
		this.specialAttackLevel=1;
		this.basicY=basicY;
		this.dynamicBasicY=basicY;
		this.parent=parent || document.body;
		this.defenseState="";
		this.adversary=null;
		this.isSpecialAttacking=false;
		this.movementAction=new role.movementAction.MovementAction(this);
		
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__magicAssembler=new role.magic.MagicAssembler(this);
		this.__isLookAtChanged=false;
		this.__hashSpecialAttackInstance={};
		
		this.__initAction();
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		/**
		 * 强制触发事件
		 * @param {String} type
		 */
		fireEvent:function(type){
			var args=Array.prototype.slice.call(arguments,1),
				eventDispatcher=this.__eventDispatcher;
				
			args.unshift(type);
			eventDispatcher.dispatchEvent.apply(eventDispatcher,args);
			return this;
		},
		
		/**
		 * 等待
		 */
		wait:function(){
			var state=this.state;
			this.state="wait";
			this.defenseState="";
			this.isAttacking=false;
			this.isSpecialAttacking=false;
			this.isJumping=false;
			this.movementAction.stopAll();
			this.action.updateAnimation("wait",this.lookAt);
			state!=="wait" && this.__eventDispatcher.dispatchEvent("stateChanged",state,"wait");
			return this;
		},
		
		/**
		 * 行走
		 * @param {String} type 
		 * 					"left"
		 * 					"right"
		 * 					"forward"
		 * 					"back"
		 */
		walk:function(type){
			if((this.state!=="" && this.state!=="wait" && this.state!=="crouch" && this.state!=="defense") || this.isAttacking || this.defenseState!==""){
				return this;
			}
			var state=this.state;
			this.state="walking";
			
			this.movementAction.stopAll().play("walking",type);
			this.__eventDispatcher.dispatchEvent("stateChanged",state,this.state);
			return this;
		},
		
		/**
		 * 跳跃
		 * @param {String} type
		 * 			"up"
		 * 			"left"
		 * 			"right"
		 * 			"forward"
		 * 			"back"
		 */
		jump:function(type){
			if(!(/wait|walking|defense/.test(this.state)) || this.isSpecialAttacking || this.isAttacking || this.state==="beAttacked"){
				return this;
			}
			
			var state=this.state;
			
			type==="forward" && (type=this.lookAt);
			type==="back" && (type=this.lookAt==="right"?"left":"right");
			
			this.state==="walking" && this.movementAction.stop("walking");
			this.state="jump"+type;
			this.isJumping=true;
			this.defenseState="";
			this.movementAction.play("jumping",type);
			this.__eventDispatcher.dispatchEvent("stateChanged",state,this.state);
			return this;
		},
		
		/**
		 * 站立
		 * @param {String} type
		 * 				"up"
		 * 				"crouch"
		 */
		stand:function(type){
			if((this.state!=="wait" && this.state!=="walking" && this.state!=="defense") || this.isAttacking){
				return this;
			}
			var state=this.state;

			this.state==="walking" && this.movementAction.stop("walking");
			this.state= type==="crouch"?type:"wait";
			this.action.updateAnimation("stand_"+type,this.lookAt);
			this.__eventDispatcher.dispatchEvent("stateChanged",state,this.state);
			return this;
		},
		
		/**
		 * 攻击
		 * @param {String} level
		 * 				light
		 * 				middle
		 * 				heavy
		 * 
		 * @param {String} type
		 * 				boxing
		 * 				kick
		 */
		attack:function(level,type){
			if(this.isAttacking
			|| this.state==="beAttacked"
			|| (!/wait|crouch|walking|defense/.test(this.state) && !this.checkState("jump"))){
				return this;
			}
			
			var	str="",
				adv=this.adversary;
				
			this.isAttacking=true;
			this.state==="walking" && this.movementAction.stop("walking");
			
			//近距离攻击
			Math.abs(this.x-adv.x)<=this.width-5*this.scale && (str="near");
			
			//跳跃攻击
			this.state==="jumpup" && (str="jump");
			/^jump(left|right)/.test(this.state) && (str="jumpMoved");
			
			//下蹲攻击
			this.checkState("crouch") && (str="crouch");
			
			str && (str+="_");
			
			this.defenseState="";
			game.SoundManager.play(str+level+"_"+type);
			this.action.updateAnimation(str+level+"_"+type,this.lookAt);
			return this;
		},
		
		/**
		 * 特殊攻击
		 * @param {String} name
		 * @param {Number} level
		 * 				1
		 * 				2
		 * 				3
		 */
		specialAttack:function(name,level){
			if(this.isAttacking || this.isSpecialAttacking || !(/wait|walking|defense|crouch/.test(this.state))){
				return this;
			}
			var me=this;
			
			this.defenseState="";
			this.state==="walking" && this.movementAction.stop("walking");
			if(!this.__hashSpecialAttackInstance[name]){
				this.__hashSpecialAttackInstance[name]=new role.specialAttack.SpecialAttackTable[name](this);
				this.__hashSpecialAttackInstance[name].addEventListener("start",function(name){
					me.__eventDispatcher.dispatchEvent("specialAttackStart",name);
				});
				this.__hashSpecialAttackInstance[name].addEventListener("complete",function(name){
					me.__eventDispatcher.dispatchEvent("specialAttackComplete",name);
				});
			}
			this.specialAttackLevel=level;
			this.state="specialAttacking";
			this.__hashSpecialAttackInstance[name].play();
			
			return this;
		},
		
		defense:function(){
			if(this.isAttacking || this.state==="beAttacked"){
				return;
			}
			
			var str;
			
			this.movementAction.stop("walking");
			str=this.checkState("crouch")?"crouch":"up";
			this.state="defense";
			this.defenseState=str;
			this.action.updateAnimation("stand_"+str+"_defense",this.lookAt);
		},
		
		beAttacked:function(type,power,defensedPower,point,hitSoundName){
			var ds=this.defenseState || "",
				isDefensed=!!ds,
				advActionName=this.adversary.action.currentActionName,
				hashCrouchDefense={
				"up":/top|heavy|impact|fire|electric|up_fall/,
				"crouch":/bottom|fall/
			};
			
			!this.isJumping && this.movementAction.stopAll();
			this.state="beAttacked";
			this.__eventDispatcher.dispatchEvent("beAttacked",type,power,defensedPower||0,point,hitSoundName);
			
			if((hashCrouchDefense[ds] && !hashCrouchDefense[ds].test(type)) || !isDefensed){
				hitSoundName && game.SoundManager.play(hitSoundName);
				if(!this.isJumping){
					this.action.updateAnimation("beAttacked_"+type,this.lookAt);
				}
			}else{
				game.SoundManager.play("defense");
			}
			this.movementAction.play("beAttacked",type,power,isDefensed);
		},
		
		stopSpecialAttack:function(type){
			var k,
				o=this.__hashSpecialAttackInstance;
			for(k in o){
				o[k].stop(type);
			}
		},
		
		/**
		 * 为指定动作添加魔法
		 * @param {String} actionName
		 * @param {IMagic} magicContructor
		 * @param {Object} frameConfig
		 * @param {Object} magicConfig
		 */
		addMagic:function(actionName,magicContructor,frameConfig,magicConfig){
			this.__magicAssembler.addMagic(actionName,magicContructor,frameConfig,magicConfig);
			return this;
		},
		
		setPosition:function(p,isUnDispatch){
			var y= +this.action.currentAnimation.y,
				_p=this.__updateScreen(p);

			//移动并刷新当前帧的碰撞检测区域
			this.action.currentAnimation.setPosition(_p).refresh();
			this.dynamicBasicY += this.action.currentAnimation.y - y;
			
			!isUnDispatch && this.__eventDispatcher.dispatchEvent("positionChanged",p);
			
			return this;
		},
		
		setScale:function(sc){
			this.action.setScale(sc);
			this.__magicAssembler.setScale(sc);
			this.scale=sc;
			return this;
		},
		
		/**
		 * 获取身体的碰撞检测对象队列
		 */
		getBodyOverlayListQueue:function(){
			return this.__getAnimationsOverlayListQueue(this.action.animations,"bodyOverlayList");
		},
		
		/**
		 * 获取进攻部位的碰撞检测对象队列
		 */
		getAttackOverlayListQueue:function(){
			return this.__getAnimationsOverlayListQueue(this.action.animations,"attackOverlayList");
		},
		
		/**
		 * 根据动作名称获取该动作绑定的魔法对象
		 * @param {String} name
		 */
		getMagic:function(actionName){
			return this.__magicAssembler.magicList[actionName];
		},
		
		/**
		 * 获取魔法的碰撞检测对象队列
		 */
		getMagicBodyOverlayListQueue:function(){
			var ret=[],
				ml=this.__magicAssembler.magicList,
				k;
			for(k in ml){
				ret=ret.concat(ml[k].bodyOverlayList.queue);
			}
			
			return ret;
		},
		
		/**
		 * 设置对手
		 * @param {Fighter} adversary
		 */
		setAdversary:function(adversary){
			this.adversary=adversary;
			this.action.setAdversaryActionOverlay(adversary);
			this.__magicAssembler.setAdversary(adversary);
			return this;
		},
		
		/**
		 * 检测状态
		 * @param {String} type
		 * 				jump 是否在跳跃
		 * 				crouch 是否蹲下
		 */
		checkState:function(type){
			if(type==="jump"){
				return /^jump\w{2,4}/.test(this.state);
			}else if(type==="crouch"){
				return this.state==="crouch";
			}
		},
		
		
		/**
		 * 更新屏幕
		 */
		__updateScreen:function(p){
			var padding=10*this.scale,
				k,
				px= +p.x,
				sw=stage.Screen.getWidth(),
				deltaX=px-this.x,
				rm=sw-padding-this.width,
				adv=this.adversary,
				screen=stage.Screen,
				isScroll=false,
				anmOffsetX=this.action.currentAnimation.offsetX*this.scale,
				offsetLX=padding+anmOffsetX,
				offsetRX=rm-anmOffsetX;
				
				function updateMagic(magicList,deltaX){
					if(!magicList){
						return;
					}
					var k;
					for(k in magicList){
						magicList[k].isActived && magicList[k].setPosition({
							x:magicList[k].x-deltaX
						});
					}
				}
			
			if(deltaX<0 && px<offsetLX){
				p.x=offsetLX;
				isScroll=adv && adv.x+adv.width < screen.getWidth()-padding;
			}
			
			if(deltaX>0 && px>offsetRX){
				p.x=offsetRX;
				isScroll=adv && adv.x>padding;
			}

			
			if(isScroll){
				screen.scroll(-deltaX,0);
				if (screen.canScroll) {
					adv.setPosition({
						x:adv.x-deltaX
					});
					
					//调整魔法位置
					updateMagic(this.__magicAssembler.magicList,deltaX);
					adv && updateMagic(adv.__magicAssembler.magicList,deltaX);
				}
			}

			return p;
		},
		
		__initAction:function(){
			var me=this;
			
			this.action.addEventListener("adversaryBodyOverlaying",function(actionOverlay,rect){
				me.adversary && actionOverlay.type=="attack" && me.adversary.beAttacked(
																						actionOverlay.attackType,
																						actionOverlay.power,
																						actionOverlay.defencedPower,
																						{
																							x:rect[0].x+(rect[1].x-rect[0].x)/2,
																							y:rect[0].y+(rect[3].y-rect[0].y)/2
																						},
																						actionOverlay.hitSoundName);
			})
			.addEventListener("playing",function(actionName,frame){
				me.__eventDispatcher.dispatchEvent("playing",actionName,frame);
			});
		},
		
		/**
		 * 获取动画集合的线形碰撞对象队列
		 * @param {Object} anms
		 * @param {String} type
		 * 					attackOverlayList
		 * 					bodyOverlayList
		 */
		__getAnimationsOverlayListQueue:function(anms,type){
			var k,
				queue=[];
				
			for(k in anms){
				queue=queue.concat(anms[k][type].queue);
			}
			
			return queue;
		},
		
		
		/**
		 * 获取X坐标值
		 */
		__getX:function(){
			return +this.action.currentAnimation.x;
		},
		
		/**
		 * 获取Y坐标值
		 */
		__getY:function(){
			return +this.action.currentAnimation.y;
		},
		
		/**
		 * 获取对象深度(z坐标)
		 */
		__getZ:function(){
			return +this.action.currentAnimation.z;
		},
		
		/**
		 * 获取宽度
		 */
		__getWidth:function(){
			return +this.action.currentAnimation.width;
		},
		
		/**
		 * 获取高度
		 */
		__getHeight:function(){
			return +this.action.currentAnimation.height;
		},
		
		/**
		 * 获取相对于背景图层的X坐标
		 */
		__getOffsetX:function(){
			return this.action.currentAnimation.x-stage.Screen.getX();
		}
	})
);

/**
 * @fileoverview 场景的配置文件
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-01-27
 */



$package("config","Scene",
		{
			CHINA:{
				front:{
					IMG:config.Configure.url+"images/background/china/front.gif",
					WIDTH:621,
					HEIGHT:224
				},
				
				behind:{
					IMG:config.Configure.url+"images/background/china/behind.gif",
					WIDTH:535,
					HEIGHT:176
				}
			}
		}
);
/**
 * @fileoverview 魔法功能的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * @date 2010-12-06
 */

$package("role.magic","IMagic",
	{
		/**
		 * 添加事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){},
		
		/**
		 * 移除事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){},
		
		/**
		 * 设置位置
		 * @param {Object} p
	 	 * 				x:Number
	 	 * 				y:Number
	 	 * 				z:Number
		 */
		setPosition:function(p){},
		
		/**
		 * 设置是否水平翻转
		 * @param {Boolean} state
		 */
		setFlipH:function(state){},
		
		/**
		 * 设置比例
		 * @param {Number} sc
		 */
		setScale:function(sc){},
		
		/**
		 * 播放魔法
		 */
		play:function(level){},
		
		/**
		 * 销毁
		 */
		destroy:function(){}
	}
);


/**
 * @fileoverview 各种魔法的配置信息
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-06
 */



$package("config","Magic",
		{
			simpleFire:{
				IMG:config.Configure.url+"images/magic/simpleFire.gif",
				FPS:12,
				WIDTH:80,
				HEIGHT:56,
				COUNT:0,
				POWER:10,
				DEFENCED_POWER:2,
				ATTACK_TYPE:"fire",
				FRAME_TIMES:[],
				ATTACK_OVERLAYS:[{x:10,y:30,w:50,h:50},{x:1,y:0,w:20,h:50},{x:0,y:20,w:40,h:60},{x:10,y:30,w:60,h:10},{x:50,y:30,w:100,h:50},{x:0,y:30,w:150,h:150},{x:10,y:30,w:50,h:50},{x:1,y:0,w:20,h:50},{x:0,y:20,w:40,h:60},{x:10,y:30,w:60,h:10},{x:50,y:30,w:100,h:50},{x:0,y:30,w:150,h:150}]
			},
//			transverseFire:{
//				
//			},
//			transverseFireDestroy:{
//				
//			},
			
			
			transverseWave:{
				IMG:config.Configure.url+"images/magic/transverseWave.gif",
				HIT_SOUND_NAME:"hit_heavy_boxing",
				FPS:35,
				WIDTH:56,
				HEIGHT:32,
				COUNT:0,
				POWER:10,
				DEFENCED_POWER:2,
				ATTACK_TYPE:"top",
				FRAME_TIMES:[1,1,1],
				ATTACK_OVERLAYS:[[{x:15,y:0,w:31,h:31},{x:15,y:0,w:31,h:31}]],
				BODY_OVERLAYS:[[{x:15,y:0,w:31,h:31},{x:15,y:0,w:31,h:31}]],
				DISAPPEAR_ANIMATION:"transverseWaveDisappear"
				
			},
			transverseWaveDisappear:{
				IMG:config.Configure.url+"images/magic/transverseWaveDisappear.gif",
				FPS:12,
				WIDTH:35,
				HEIGHT:28,
				COUNT:1,
				POWER:0,
				DEFENCED_POWER:0,
				ATTACK_TYPE:"top",
				FRAME_TIMES:[0.5,1,1,1,1],
				ATTACK_OVERLAYS:[]
			}
			
			
//			transverseConvolution:{
//				
//			},
//			transverseConvolutionDestroy:{
//				
//			}
			
		}
);

/**
 * @fileoverview 一般的魔法,在战士身边呈现(这个类其实还可以更灵活，比如把各动画的状态都抽象出来，不过MS这个游戏中这样用也够了，先凑合吧。。。囧。。)
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-06
 */










$package("role.magic","SimpleMagic",

	/**
	 * 
	 * @param {Object} parent
	 * @param {Object} magicCfg
	 * @param {Fighter} fighter
	 * @param {String} name
	 * @event
	 * 		start
	 * 		playing
	 * 		complete
	 */
	function(parent,magicCfg,fighter,name){
		
		aralork.lib.Lib.defineGetter(this,
			["state","width","x"],
			[this.__getState,this.__getWidth,this.__getX]);
		
		this.attackOverlayList=null;
		this.bodyOverlayList=null;
		this.isActived=false;
		
		this.__state="stop";
		this.__fighter=fighter;
		this.__animation=null;
		this.__disappearAnimation=null;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__playCount=magicCfg.COUNT || 0;
		this.__parent=parent || document.body;
		this.__isFlipH=false;
		this.__scale=1;

		this.__initAnimation(magicCfg);
		this.__initFrameOverlayList(magicCfg,name);
		
	}.$implements(role.magic.IMagic).define({
		
		/**
		 * 添加事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		/**
		 * 设置位置
		 * @param {Object} p
		 * 					x:Number
		 * 					y:Number
		 * 					z:Number
		 */
		setPosition:function(p){
			this.__animation.setPosition(p);
			return this;
		},
		
		setFlipH:function(state){
			this.__animation.setFlipH(state);
			this.__disappearAnimation && this.__disappearAnimation.setFlipH(state);
			this.__isFlipH=state;
			return this;
		},
		
		setScale:function(sc){
			this.__animation.setScale(sc);
			this.__disappearAnimation && this.__disappearAnimation.setScale(sc);
			this.__scale=sc;
			return this;
		},
		
		play:function(level){
			if(this.__state==="playing"){
				return;
			}
			
			this.attackOverlayList.enabled=true;
			this.bodyOverlayList.enabled=true;
			this.__state="playing";
			this.__eventDispatcher.dispatchEvent("start");
			this.__animation.show().play(this.__playCount);
			
			return this;
		},
		
		destroy:function(){
			if(!this.__animation){
				return;
			}
			
			this.__state="stop";
			this.__animation.stop().destroy();
			this.__animation=null;
			
			if(this.__disappearAnimation){
				this.__disappearAnimation.stop().destroy();
				this.__disappearAnimation=null;
			}
			
		},
		
		disappear:function(){
			var anm=this.__animation;
				
			this.__state="stop";
			
			this.__animation.stop().hidden();
			
			if (this.__disappearAnimation) {
				this.__disappearAnimation.setPosition({
					x: +anm.x,
					y: +anm.y,
					z: +anm.z
				}).show().play(1);
			}else{
				this.__eventDispatcher.dispatchEvent("complete");
			}
			
		},
		
		setPosition:function(p){
			this.__animation.setPosition(p);
		},
		
		__initAnimation:function(magicCfg){
			var me=this,
				disappearAnimationCfg=config.Magic[magicCfg.DISAPPEAR_ANIMATION];
			
			this.__animation=this.__creatAnimation(magicCfg);
			this.__animation.addEventListener("playing",function(frame){
				me.isActived=true;
				me.attackOverlayList.refresh(frame);
				me.bodyOverlayList.refresh(frame);
				me.__eventDispatcher.dispatchEvent("playing");
			})
			.addEventListener("stop",function(){
				me.isActived=false;
				me.disappear();
			});
			
			if (disappearAnimationCfg) {
				this.__disappearAnimation = this.__creatAnimation(disappearAnimationCfg);
				this.__disappearAnimation.addEventListener("stop",function(){
					this.hidden();
					me.__eventDispatcher.dispatchEvent("complete");
				});
			}
		},
		
		__creatAnimation:function(magicCfg){
			var me=this;
			
			return (new aralork.display.Animation(
				this.__parent,
				"div",
				magicCfg.WIDTH,
				magicCfg.HEIGHT,
				aralork.utils.ResourceLoader.getImage(magicCfg.IMG,true),
				magicCfg.FPS,
				magicCfg.FRAME_TIMES
			))
			.hidden();
		},
		
		__initFrameOverlayList:function(magicCfg,name){
			this.attackOverlayList=new role.FrameOverlayList(
				magicCfg.ATTACK_OVERLAYS,
				{
					attackType:magicCfg.ATTACK_TYPE,
					power:magicCfg.POWER,
					defencedPower:magicCfg.DEFENCED_POWER,
					hitSoundName:magicCfg.HIT_SOUND_NAME
				},
				name,
				this.__animation,
				"attack",
				this.__parent
			);
			
			this.bodyOverlayList=new role.FrameOverlayList(
				magicCfg.BODY_OVERLAYS,
				{
					attackType:magicCfg.ATTACK_TYPE,
					power:magicCfg.POWER,
					defencedPower:magicCfg.DEFENCED_POWER
				},
				name,
				this.__animation,
				"body",
				this.__parent
			);
		},

		__getState:function(){
			return this.__state;
		},
		
		__getWidth:function(){
			return +this.__animation.width;
		},
		
		__getX:function(){
			return +this.__animation.x;
		}
	})
);

/**
 * @fileoverview 横向运行的魔法类，继承于SimpleMagic类。。。比如波动拳。。哇咔咔咔咔。。。。
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2010-12-15
 */






$package("role.magic","TransverseMagic",
	function(parent,magicCfg,disappearAnimationCfg,fighter,name){
		this.__tween=new aralork.animation.tween.Tween();
		this.__lastV=0;
		
		this.__initTween();
		
	}.$extends(role.magic.SimpleMagic).$implements(role.magic.IMagic).define({

		play:function(level){
			if(this.__state==="playing"){
				return;
			}
			var anm=this.__animation,
				sc=this.__scale,
				screen=stage.Screen,
				ft=this.__fighter,
				speed=(level || 1) * 1.6 * sc,
				sv=ft.lookAt==="left" ? +ft.x: ft.x+ft.width,
				ev=sv + (ft.lookAt==="left" ?
									 -ft.x-10*sc-this.width : 
									 screen.getInnerWidth()+10*sc - ft.x-ft.width),
									 
				d=Math.abs(ev-sv) / speed / 1000 * this.__tween.fps;

			role.magic.TransverseMagic.$super.play.call(this);
			
			this.__lastV = +anm.x;
			ft.isMagicPlaying=true;
			this.__tween.start(+sv,ev,d);
			
			return this;
		},
		
		disappear:function(){
			role.magic.TransverseMagic.$super.disappear.call(this);
			this.__tween.stop();
		},
		
		__initTween:function(){
			var me=this;
			
			this.__tween.addEventListener("tween",function(v){
				me.__animation.setPosition({
					x: me.__animation.x + (v-me.__lastV)
				});
				me.__lastV=v;
			});
			this.__tween.addEventListener("end",function(v){
				me.bodyOverlayList.disabled();
				me.attackOverlayList.disabled();
				me.__state!=="stop" && me.disappear();
			});
		}
	})
);

/**
 * @fileoverview 拥有魔法技能的斗士列表
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-17
 */




$package("config","MagicFighter",
	{
		RYU1:{
			ACTION_NAME:"wave_boxing",
			CONSTRUCTOR_NAME:"TransverseMagic",
			TYPE:"transverseWave"
		},
		RYU2:{
			ACTION_NAME:"wave_boxing",
			CONSTRUCTOR_NAME:"TransverseMagic",
			TYPE:"transverseWave"
		}
	}
);

/**
 * @fileoverview 斗士声音配置信息
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-14
 */



(function(){
	
	var soundLight=config.Configure.url+"sound/fighter/light_boxing.mp3",
		soundMiddle=config.Configure.url+"sound/fighter/middle_boxing.mp3",
		soundHeavy=config.Configure.url+"sound/fighter/heavy_boxing.mp3";
	
	$package("config.sound","Fighter",
		{
			light_boxing:soundLight,
			middle_boxing:soundMiddle,
			heavy_boxing:soundHeavy,
			
			jump_light_boxing:soundLight,
			jump_middle_boxing:soundMiddle,
			jump_heavy_boxing:soundHeavy,
			
			jumpMoved_light_boxing:soundLight,
			jumpMoved_middle_boxing:soundMiddle,
			jumpMoved_heavy_boxing:soundHeavy,
			
			crouch_light_boxing:soundLight,
			crouch_middle_boxing:soundMiddle,
			crouch_heavy_boxing:soundHeavy,
			
			near_light_boxing:soundLight,
			near_middle_boxing:soundMiddle,
			near_heavy_boxing:soundHeavy,
			
			
			
			light_kick:soundLight,
			middle_kick:soundMiddle,
			heavy_kick:soundHeavy,

			jump_light_kick:soundLight,
			jump_middle_kick:soundMiddle,
			jump_heavy_kick:soundHeavy,
			
			jumpMoved_light_kick:soundLight,
			jumpMoved_middle_kick:soundMiddle,
			jumpMoved_heavy_kick:soundHeavy,
			
			crouch_light_kick:soundLight,
			crouch_middle_kick:soundMiddle,
			crouch_heavy_kick:soundHeavy,
			
			near_light_kick:soundLight,
			near_middle_kick:soundMiddle,
			near_heavy_kick:soundHeavy,
			
			
			
			
			

			/**
			 * 特殊攻击
			 */
			wave_boxing:config.Configure.url+"sound/fighter/wave_boxing.mp3",
			whirl_kick:config.Configure.url+"sound/fighter/whirl_kick.mp3",
			impact_boxing:config.Configure.url+"sound/fighter/impact_boxing.mp3",
			
			
			
			/**
			 * 击打
			 */
			hit_light:config.Configure.url+"sound/fighter/hit_light.mp3",
			
			hit_middle_boxing:config.Configure.url+"sound/fighter/hit_middle_boxing.mp3",
			hit_middle_kick:config.Configure.url+"sound/fighter/hit_middle_kick.mp3",
			
			hit_heavy_boxing:config.Configure.url+"sound/fighter/hit_heavy_boxing.mp3",
			hit_heavy_kick:config.Configure.url+"sound/fighter/hit_heavy_kick.mp3",
			
			
			/**
			 * 跳跃下落的脚步声音
			 */
			footfall:config.Configure.url+"sound/fighter/footfall.mp3",
			
			/**
			 * 防御
			 */
			defense:config.Configure.url+"sound/fighter/defense.mp3",
			
			/**
			 * 跌落
			 */
			fall:config.Configure.url+"sound/fighter/fall.mp3"
		}
	);
})();
/**
 * @fileoverview 场景的声音配置信息
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-14
 */



$package("config.sound","Stage",
		{
			CHINA:{
				background:config.Configure.url+"sound/stage/china.mp3"
			}
		}
);
/**
 * @fileoverview 游戏场景类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-03-16
 */





















$package("game","Stage",

	/**
	 * 场景类
	 * @param {Object} parent
	 * @param {Number} scale
	 * @event
	 * 		resourceLoadComplete
	 * 		resourceLoading
	 */
	function(parent,scale){
		
		this.scale=scale || 1;

		this.__parent=parent || document.body;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__totalCount=0;
		this.__currentCount=0;
		this.__stages={};
		this.__fighters={};
		this.__AIManagers={};
		this.__fighterManagers={};
		this.__isLoading=false;
		this.__currentParam=[];
		
		this.__initLoader();
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		load:function(ftn1,ftn2,stageName,menu){
			if(this.__isLoading){
				return;
			}
			
			var rl=aralork.utils.ResourceLoader,
				sm=game.SoundManager,
				soundCfg=this.__getSoundCfg(stageName);
			
			this.__menu=menu;
			this.__isLoading=true;
			this.__currentParam=[ftn1,ftn2,stageName];
			this.__currentCount=0;
			
			rl.load("img",this.__getImageArr(ftn1,ftn2,stageName));
			sm.load(soundCfg.urls,soundCfg.names);
			
			this.__totalCount=rl.totalCount+sm.totalCount;
		},
		
		
		start:function(ftn1,ftn2,stageName){
			var fts=this.__fighters,
				sc=this.scale,
				parent=this.__parent,
				cfgMF=config.MagicFighter;
			
			function initFighter(ftn,lookAt,x){
				if(!fts[ftn]){
					
					fts[ftn]=new role.Fighter(ftn,lookAt,sc*200,sc,parent);
					fts[ftn].setPosition({x: x , z: 64});
					
					//有魔法技能则添加魔法				
					cfgMF[ftn] && fts[ftn].addMagic(cfgMF[ftn].ACTION_NAME,role.magic[cfgMF[ftn].CONSTRUCTOR_NAME],
										config.fighterAction[ftn][cfgMF[ftn].ACTION_NAME].MAGIC_FRAMES,
										config.Magic[cfgMF[ftn].TYPE]
									);
									
					fts[ftn].setScale(sc)
						.wait();
				}
			}

			this.__updateScreen(stageName);
			this.__initHPBar();

			initFighter(ftn1, "right", sc * 120);
			initFighter(ftn2, "left", sc * 240);

			!this.__fighterManagers[ftn1+"_"+ftn2] && (this.__fighterManagers[ftn1+"_"+ftn2]=new game.FighterManager(fts[ftn1],fts[ftn2],this.__menu)); 
			
			game.SoundManager.play(stageName+"_background",65525);

		},
		
		__initHPBar:function(){
			var barImg=aralork.utils.ResourceLoader.getImage(config.Configure.url+"images/background/bar.gif"),
				barContainer,
				sc=this.scale,
				bar1=new aralork.display.DisplayObject(this.__parent,"div",144,9),
				bar2=new aralork.display.DisplayObject(this.__parent,"div",144,9),
				
			barContainer=new aralork.display.DisplayObject(this.__parent,barImg,322,14);
			barContainer.setPosition({
				x:31 * sc,
				y:20 * sc,
				z:1024
			})
			.setSize({
				w:322 * sc,
				h: 14 * sc
			})
			.show();
			
			bar1.__entity.style.backgroundColor="#FFFF00";
			bar2.__entity.style.backgroundColor="#FFFF00";
			bar1.__entity.id="hpBar1";
			bar2.__entity.id="hpBar2";
			
			bar1.setPosition({
				x:31 * sc,
				y:22 * sc,
				z:1025
			})
			.setSize({
				w:144 * sc,
				h:10 * sc
			})
			.show();
			
			bar2.setPosition({
				x:208 * sc,
				y:22 * sc,
				z:1025
			})
			.setSize({
				w:144 * sc,
				h:10 * sc
			})
			.show();			
			
		},
		
		__updateScreen:function(stageName){
			var Screen=stage.Screen,
				Scene=config.Scene,
				rl=aralork.utils.ResourceLoader,
				sc=this.scale,
				
				behind=rl.getImage(Scene[stageName].behind.IMG),
				front=rl.getImage(Scene[stageName].front.IMG),
				bW=Scene[stageName].behind.WIDTH,
				bH=Scene[stageName].behind.HEIGHT,
				fW=Scene[stageName].front.WIDTH,
				fH=Scene[stageName].front.HEIGHT;
				
			Screen.entity=this.__parent;
			
			Screen.addBackground(new aralork.display.DisplayObject(null,behind,bW,bH));
			Screen.addBackground(new aralork.display.DisplayObject(null,front,fW,fH));
			Screen.setScale(sc);
		},
		
		/**
		 * 获取要加载的图片数组
		 * @param {String} ftn1
		 * @param {String} ftn2
		 * @param {String} stageName
		 */
		__getImageArr:function(ftn1,ftn2,stageName){
			if(!config.fighterAction[ftn1] || !config.fighterAction[ftn1] || !config.Scene[stageName]){
				return;
			}
			
			var ret=[],
				cfgFa1=config.fighterAction[ftn1],
				cfgFa2=config.fighterAction[ftn2],
				cfgScene=config.Scene[stageName],
				cfgMagic=config.Magic,
				cfgHE=config.HitEffect,
				k;
			
			//斗士
			for(k in cfgFa1){
				ret.push(cfgFa1[k].IMG);
			}
			for(k in cfgFa2){
				ret.push(cfgFa2[k].IMG);
			}
			
			//场景
			for(k in cfgScene){
				ret.push(cfgScene[k].IMG);
			}
			
			//魔法
			for(k in cfgMagic){
				ret.push(cfgMagic[k].IMG);
			}
			
			//打击的效果
			for(k in cfgHE){
				ret.push(cfgHE[k].IMG);
			}
			
			//血槽
			ret.push(config.Configure.url+"images/background/bar.gif");
			
			//斗士阴影
			ret.push(config.Configure.url+"images/background/fighterShadow.gif");
			
			return ret;
		},
		
		/**
		 * 获取要加载的声音数据
		 * @param {String} stageName
		 */
		__getSoundCfg:function(stageName){
			if(!config.sound.Stage[stageName]){
				return;
			}
			
			var ret={
					urls:[],
					names:[]
				},
				cfgFighter=config.sound.Fighter,
				cfgStage=config.sound.Stage[stageName],
				k;
				
			for(k in cfgFighter){
				ret.urls.push(cfgFighter[k]);
				ret.names.push(k);
			}
			for(k in cfgStage){
				ret.urls.push(cfgStage[k]);
				ret.names.push(stageName+"_"+k);
			}

			return ret;

		},
		
		__initLoader:function(){
			var rl=aralork.utils.ResourceLoader,
				sm=game.SoundManager,
				me=this;
				
			rl.addEventListener("loading",function(){
				me.__currentCount++;
				me.__updateProgress();
			});
			
			sm.addEventListener("loading",function(){
				me.__currentCount++;
				me.__updateProgress();
			});
		},
		
		__updateProgress:function(){
			if(!this.__totalCount){
				return;
			}
			
			var v=this.__currentCount/this.__totalCount;
			var me=this;
			this.__eventDispatcher.dispatchEvent("resourceLoading",v);
			if (v === 1) {
				this.__isLoading=false;
				setTimeout(function(){
					me.__eventDispatcher.dispatchEvent("resourceLoadComplete");
					me.start.apply(me,me.__currentParam);
				},16);
			}
		}
	})
);

/**
 * @fileoverview 菜单元素
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-04-05
 */





$package("game.menu","MenuItem",

	/**
	 * 菜单元素类
	 * @param {String} w
	 * @param {String} h
	 * @event
	 * 		enter
	 */
	function(w,h){
		
		this.entity=null;
		this.enabled=true;
		
		this.ID=0;
		this.text="";
		
		this.__keyListener=new aralork.utils.KeyListener(document);
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__state="blur";
		this.width=w || 100;
		this.height=h || 25;
		
		this.__createIteam();
		this.__initEvent();
		
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		focus:function(){
			this.entity.style.backgroundColor="#ffff00";
			this.entity.style.fontWeight="bold";
			this.__state="focus";
		},
		
		blur:function(){
			this.entity.style.backgroundColor="#ffffff";
			this.entity.style.fontWeight="";
			this.__state="blur";
		},
		
		setText:function(text){
			this.text=text;
			this.entity.innerHTML=text;
		},
		
		destroy:function(){
			var et=this.entity;
			et.innerHTML="";
			et.parentNode && et.parentNode.removeChild(et);
			this.entity=null; 
		},
		
		__createIteam:function(){
			var et;
			et=this.entity=$C("div");
			et.style.fontSize="12px";
			et.style.width=this.width+"px";
			et.style.height=this.height+"px";
			et.style.padding=$IE6 ? "2px" : "5px 2px 5px 2px";
			et.style.margin="10px 2px 10px 2px";
			et.style.textAlign="center";
			et.style.backgroundColor="#ffffff";
			
			aralork.lib.Style.setOpacity(et,0.8);
			
		},
		
		__initEvent:function(){
			var me=this;
			
			this.__keyListener.add(13,"keydown",function(){
				me.enabled && me.__state==="focus" && me.__eventDispatcher.dispatchEvent("enter");
			});
		}
	})
);

/**
 * @fileoverview 菜单内容
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-04-05
 */




$package("game.menu","MenuItemContent",

	/**
	 * 菜单内容类
	 * @param {Object} node
	 * @event
	 * 		show
	 * 		hidden
	 */
	function(node){
		this.__entity=node;
		this.__state="hidden";
		
		this.__keyListener=new aralork.utils.KeyListener(document);
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		
		this.__initEvent();
		
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		show:function(){
			this.__state="show";
			this.__eventDispatcher.dispatchEvent("show");
			this.__entity && (this.__entity.style.display="");
		},
		
		hidden:function(){
			this.__state="hidden";
			this.__eventDispatcher.dispatchEvent("hidden");
			this.__entity && (this.__entity.style.display="none");
		},
		
		destroy:function(){
			this.__entity && this.__entity.parentNode && this.__entity.parentNode.removeChild(this.__entity); 
		},
		
		__initEvent:function(){
			var me=this;
			
			this.__keyListener.add(27,"keydown",function(){
				me.__state==="show" && me.hidden();
			});
		}
		
	})
);

/**
 * @fileoverview 菜单
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * 					http://random.cnblogs.com
 * @date 2011-04-05
 */
 






$package("game.menu","Menu",
	function(node){

		this.enabled=true;
		
		aralork.lib.Lib.defineGetter(this,
			["width","height","x","y"],
			[this.__getWidth,this.__getHeight,this.__getX,this.__getY]);

		this.__entity=node;		
		this.__list=[];
		this.__itemContent={};
		this.__index=0;
		this.__parent=parent || document.body;
		this.__keyListener=new aralork.utils.KeyListener(document);
		
		this.__initMove();
		
		this.hidden();
		
	}.define({
		
		add:function(text,w,h,itemContent){
			var list=this.__list;
			
			list.push(new game.menu.MenuItem(w,h));
			list.length===1 && list[0].focus();
			list[list.length-1].ID=list.length-1;
			list[list.length-1].setText(text);
			this.__itemContent["ic"+list[list.length-1].ID]=itemContent;
			
			this.__initItem(list[list.length-1]);
			
			return this;
		},
		
		remove:function(idx){
			var ic=this.__itemContent["ic"+this.__list[idx].ID];
			
			this.__list[idx] && this.__list[idx].destroy();
			this.__list.splice(idx,1);
			
			if(ic){
				ic.destroy();
				delete this.__itemContent["ic"+this.__list[idx].ID];
			}
			
			return this;
		},
		
		next:function(){
			var list=this.__list;
			
			if(list[this.__index+1]){
				list[this.__index+1].focus();
				list[this.__index].blur();
				this.__index++;
			}
			
			return this;
		},
		
		previous:function(){
			var list=this.__list;
			
			if(this.__index-1 >= 0){
				list[this.__index-1].focus();
				list[this.__index].blur();
				
				this.__index--;
			}
			
			return this;
		},
		
		show:function(){
			this.__entity.style.display="";
			return this;
		},
		
		hidden:function(){
			this.__entity.style.display="none";
			return this;
		},
		
		setPosition:function(param){
			typeof param.x!=="undefined" && (this.__entity.style.left=param.x+"px");
			typeof param.y!=="undefined" && (this.__entity.style.top=param.y+"px");
			typeof param.z!=="undefined" && (this.__entity.style.zIndex=param.z);
			return this;
		},
		
		setEnabled:function(state){
			var list=this.__list,
				i=this.__list.length;
			
			this.enabled=!!state;
			while(i--){
				list[i] && (list[i].enabled=!!state);
			}
			
		},
		
		getIndex:function(){
			return this.__index;
		},
		
		__initItem:function(item){
			var me=this,
				MenuItemContent=game.menu.MenuItemContent;
			
			this.__entity.appendChild(item.entity);
			
			item.addEventListener("enter",function(){
				
				var ic=me.__itemContent["ic"+this.ID];
				if(ic && ic.constructor===MenuItemContent){
					ic.show();
					me.enabled=false;
					me.hidden();
					
				}else if(aralork.lib.Lib.checkFunction(ic)){
					ic.call(this);
				}
			});
			
			if(me.__itemContent["ic"+item.ID] && me.__itemContent["ic"+item.ID].constructor===MenuItemContent){
				me.__itemContent["ic"+item.ID].addEventListener("hidden",function(){
					me.enabled=true;
					me.show();
				});
			}
		},
		
		__initMove:function(){
			var me=this;
			
			//up
			this.__keyListener.add(38,"keydown",function(){
				me.enabled && me.previous();
			});
			//down
			this.__keyListener.add(40,"keydown",function(){
				me.enabled && me.next();
			});
		},
		
		__getX:function(){
			return parseInt(this.__entity.style.left);
		},
		
		__getY:function(){
			return parseInt(this.__entity.style.top);
		},
		
		/**
		 * 获取宽度
		 */
		__getWidth:function(){
			return this.__getSize(this.__entity,"offsetWidth");
		},
		
		/**
		 * 获取高度
		 */
		__getHeight:function(){
			return this.__getSize(this.__entity,"offsetHeight");
		},
		
		__getSize:function(node,p){
			var et=node,
				v,
				ov=et.style.visibility;
				
			if(et.style.display=="none"){
				et.style.visibility="hidden";
				et.style.display="";
				v=et[p];
				et.style.display="none";
				et.style.visibility=ov;
			}else{
				v=et[p];
			}
			
			return v;
		}
	})
);







 

function __Main__(){

	var scale=$IE6 ? 1.2 : 1.5,
		stage1=new game.Stage($E("screen"),scale),
		mainMenu=new game.menu.Menu($E("mainMenu")),
		pageWidth=document.documentElement.clientWidth || document.body.clientWidth,
		w=80 * scale,
		h=8 * scale,
		startScreen=$E("startScreen"),
		initContianer=$E("initContianer"),
		container=$E("container"),
		tip=$E("tip"),
		message=$E("message"),
		screen=$E("screen"),
		progressContainer=$E("progressContainer"),
		progerssBorder=$E("progerssBorder"),
		progressBar=$E("progressBar"),
		about=$E("about"),
		progressCfg={
			w:220*scale,
			h:10*scale,
			x:130*scale,
			y:170*scale
		},
		enter=function(menu){
			menu.setEnabled(false);
			progressContainer.style.display="";
			menu.hidden();
			setTimeout(function(){
				stage1.load("RYU1","RYU2","CHINA",menu);
			},20);
		};
	
	startScreen.style.width=384 * scale + "px";
	startScreen.style.height=224 * scale + "px";
	startScreen.style.display="";
	
	stage1.addEventListener("resourceLoading",function(v){
		progressBar.style.width= Math.floor(v * progressCfg.w)+"px";
	})
	.addEventListener("resourceLoadComplete",function(){
		message.style.display="none";
		screen.style.display="";
		startScreen.style.display="none";
	});
	
	//菜单项
	mainMenu.add("单人游戏",w,h,function(){
		enter(mainMenu);
	})
	.add("双人对战",w,h,function(){
		enter(mainMenu);
	})
	.add("练习模式",w,h,function(){
		enter(mainMenu);
	})
	.add("关于",w,h,
		new game.menu.MenuItemContent(about)
	)
	.setPosition({
		x:parseInt(startScreen.style.width)/2-mainMenu.width/2,
		y:120 * scale
	})
	.show();

	initContianer.style.display="none";
	container.style.display="";
	container.style.left=(pageWidth/2-384 * scale/2)+"px";
	
	//进度条
	progerssBorder.style.width=progressCfg.w+"px";
	progerssBorder.style.height=progressCfg.h+"px";
	progressContainer.style.left=progressCfg.x+"px";
	progressContainer.style.top=progressCfg.y+"px";
	
	message.style.marginTop=230*scale+"px";
	message.style.marginLeft=0;
	
	setTimeout(function(){
		tip.style.display="";
	},5000);
	
	//关于
	about.style.left=mainMenu.x+mainMenu.width/2-110+"px";
	about.style.top=mainMenu.y-
					($IE6?0:10)
					+"px";

//var kl=new aralork.utils.KeyListener();
//document.onkeydown=function(){
//	alert(aralork.events.Event.getEvent().keyCode);
//};
}
/**
 * @fileoverview Load
 * @author Random | Random.Hao.Yang@gmail.com
 */
(function(){
	var tid,
		isFunction=function(fn){
			return !!fn && !fn.nodeName && fn.constructor != String 
					&& fn.constructor != RegExp && fn.constructor != Array 
					&& (/function/i).test(fn + "");
		};

	function load(){
		if(typeof(__Main__)!="undefined" && isFunction(__Main__)){
			__Main__.call();
		}
	}
	
	if (/msie/.test(navigator.userAgent.toLowerCase())) {
		tid = setTimeout(function(){
			try {
				document.body.doScroll("left");
				clearTimeout(tid);
				load();
				return;
			}
			catch (ex) {}
			arguments.callee.call();
		}, 1000);
	}
	else if (/webkit/i.test(navigator.userAgent.toLowerCase())) {
		tid=setTimeout(function(){
			if (/loaded|complete/i.test(document.readyState)) {
				clearTimeout(tid);
				load();
				return;
			}
			else {
				arguments.callee.call();
			}
		},1000);
	}
	else if(document.addEventListener){
		document.addEventListener("DOMContentLoaded", function(){
			load();
		}, false);
	}
})(); 