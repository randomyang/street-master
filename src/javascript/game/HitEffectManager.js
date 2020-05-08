/**
 * @fileoverview 击打时的效果
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-03-09
 */
$import("aralork.display.Animation");
$import("aralork.utils.ResourceLoader");

$import("config.HitEffect");

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
