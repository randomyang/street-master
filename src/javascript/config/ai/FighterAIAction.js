/**
 * @fileoverview 斗士的AI动作组合，每个斗士有十种类型
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-23
 */

$package("config.ai","FighterAIAction",
	{
		RYU:{
			
			//短冲天拳
			TYPE_1:{
				act:"specialAttack",
					p:["impact_boxing",1],
					t:100
			},

			//慢速波动拳
			TYPE_2:{
				act:"specialAttack",
				p:["wave_boxing","1"],
				t:100
			},
			
			//旋风腿
			TYPE_3:{
					act:"specialAttack",
					p:["whirl_kick",3],
					t:50
			},
			
			//长冲天拳
			TYPE_4:{
					act:"specialAttack",
					p:["impact_boxing",3],
					t:100
			},
			
			//快速波动拳
			TYPE_5:{
				act:"specialAttack",
				p:["wave_boxing","3"],
				t:100
			}
			
//			//旋风腿+冲天拳
//			TYPE_6:[{
//					act:"specialAttack",
//					p:["whirl_kick",3],
//					t:50
//				},
//				{
//					act:"specialAttack",
//					p:["impact_boxing",3],
//					t:100
//			}]
		}
	}
);
