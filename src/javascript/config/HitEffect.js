/**
 * @fileoverview 击中效果
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-03-09
 */

$import("config.Configure");

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