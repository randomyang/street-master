/**
 * @fileoverview 特殊攻击动作的类表
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-01-13
 */

$import("role.specialAttack.WaveBoxing");
$import("role.specialAttack.ImpactBoxing");
$import("role.specialAttack.WhirlKick");

$package("role.specialAttack","SpecialAttackTable",{
		
		/**
		 * 波动拳
		 */
		"wave_boxing":role.specialAttack.WaveBoxing,
		
		/**
		 * 冲天拳
		 */
		"impact_boxing":role.specialAttack.ImpactBoxing,
		
		/**
		 * 旋风腿
		 */
		"whirl_kick":role.specialAttack.WhirlKick
		
	}
);
