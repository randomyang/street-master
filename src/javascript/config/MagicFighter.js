/**
 * @fileoverview 拥有魔法技能的斗士列表
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-17
 */

$import("role.magic.TransverseMagic");
$import("role.magic.SimpleMagic");

$package("config","MagicFighter",
	{
		RYU1:{
			ACTION_NAME:"wave_boxing",
			CONSTRUCTOR_NAME:"TransverseMagic",
			TYPE:"transverseWave"
		},
		RYU2:{
			ACTION_NAME:"wave_boxing",
			CONSTRUCTOR_NAME:"TransverseMagic",
			TYPE:"transverseWave"
		}
	}
);
