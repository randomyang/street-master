/**
 * @fileoverview 声音管理器
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-14
 */
$import("aralork.events.EventDispatcher");

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

