/**
 * @fileoverview 动作动画类
 * @author Random | Random.Hao.Yang@gmail.com
 */
$import("aralork.display.Animation");

$import("role.FrameOverlayList");

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
