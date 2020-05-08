/**
 * @fileoverview 斗士的特殊攻击配置
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-30
 */

$package("config","SpecialAttacked",{
	
	"RYU":{

		/**
		 * 波动拳
		 */
		"wave_boxing":{
			keySequence:[["DOWN","RIGHT","A"],["DOWN","RIGHT","B"],["DOWN","RIGHT","C"]],
			keyValue:"10010" //10010代表RIGHT键或不按键(通过与当前键的代码按位"与"来判断)
		},
		
		/**
		 * 冲天拳
		 */
		"impact_boxing":{
			keySequence:[["RIGHT","DOWN","RIGHT","A"],["RIGHT","DOWN","RIGHT","B"],["RIGHT","DOWN","RIGHT","C"]],
			keyValue:"10110" //10110代表向前键，或前下键，或不按键(通过与当前键的代码按位"与"来判断)，当前按键与keyValue 与 操作后，结果等于当前按键
		},
		
		/**
		 * 旋风腿
		 */
		"whirl_kick":{
			keySequence:[["DOWN","LEFT","D"],["DOWN","LEFT","E"],["DOWN","LEFT","F"]],
			keyValue:"11000" ////11000代表LEFT键或不按键
		}
	}
});
