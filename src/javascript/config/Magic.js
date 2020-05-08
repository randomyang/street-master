/**
 * @fileoverview 各种魔法的配置信息
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-06
 */

$import("config.Configure");

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
