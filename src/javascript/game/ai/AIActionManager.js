/**
 * @fileoverview AI动作列表管理类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-22
 */

$import("aralork.events.EventDispatcher");

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
