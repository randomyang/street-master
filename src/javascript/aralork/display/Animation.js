/**
 * @fileoverview Animation类，继承于DisplayObject类，实现了帧动画的效果
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.utils.Timer");
$import("aralork.lib.Style");
$import("aralork.display.DisplayObject");
$import("aralork.events.EventDispatcher");

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
