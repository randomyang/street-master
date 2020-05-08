/**
 * @fileoverview 横向运行的魔法类，继承于SimpleMagic类。。。比如波动拳。。哇咔咔咔咔。。。。
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-15
 */

$import("aralork.animation.tween.Tween");

$import("role.magic.IMagic");
$import("role.magic.SimpleMagic");

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
