/**
 * @fileoverview 动作碰撞检测类
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.display.Overlay");

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
