/**
 * @fileoverview 斗士声音配置信息
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-14
 */

$import("config.Configure");

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