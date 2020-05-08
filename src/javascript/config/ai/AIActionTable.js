/**
 * @fileoverview 所有斗士的AI复杂动作的集合，简单动作会在程序中直接写，这里只包括复杂的组合动作的集合
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-22
 * @example
 * 		{
 * 			act:fighter的方法名称(attack、jump、walk、wait、specialAttack、stand、defense),
 * 			p:方法的参数，多个参数用数组形式,
 * 			t:延迟执行动作的毫秒数 (ms)
 * 		}
 * 	
 * 		[
 * 					//队列里的第一个动作
					{
						act:"attack",
						p:["light","boxing"],
						t:3000
					},
					
					//队列里的第二个动作
					[
						{
							act:"jump",
							p:"forward",
							t:100
						},
						{
							act:"attack",
							p:["heavy","kick"],
							t:600
						}						
					],
					
					//队列里的第三个动作
					[
						{act:"stand",
						p:"crouch",
						t:100},
						{
							act: "attack",
							p: ["heavy","kick"],
							t: 101
						}
					],
					
					//队列里的第四个动作
					{
						act:"specialAttack",
						p:["impact_boxing",3],
						t:1000
					}
				]
 */

(function(){
	
	var crouch_kick=[{
							act:"stand",
							p:"crouch",
							t:100
						},
						{
							act: "attack",
							p: ["heavy","kick"],
							t: 101
						}
		],
		
		jumpForwardKick=[{
							act:"jump",
							p:"forward",
							t:100
						},
						{
							act:"attack",
							p:["heavy","kick"],
							t:600
						}
		];
		
		
		
		
	$package("config.ai","AIActionTable",{
		
		//下蹲踢腿
		CMB_CROUCH_KICK:crouch_kick,
		
		//向前起跳踢腿
		CMB_JUMP_FORWARD_KICK:jumpForwardKick,
		
		//向后起跳
		CMB_JUMP_BACK:{
			act:"jump",
			p:"back",
			t:50
		},
		
		//向前起跳踢腿，落地后下蹲踢腿
		CMB_JUMP_FORWARD_KICK_CROUCH_KICK:[
					jumpForwardKick,
					crouch_kick
		],
		
		//向前起跳出拳
		CMB_JUMP_FORWARD_BOXING:[
						{
							act:"jump",
							p:"forward",
							t:100
						},
						{
							act:"attack",
							p:["heavy","boxing"],
							t:800
						}
		],
		
		//下蹲出重拳
		CMB_CROUCH_HEAVY_BOXING:[
						{
							act:"stand",
							p:"crouch",
							t:100
						},
						{
							act:"attack",
							p:["heavy","boxing"],
							t:500
						}
		],
		
		
		//出拳
		CMB_HEAVY_BOXING:[
			{
				act: "attack",
				p: ["heavy","boxing"],
				t: 300
			}
		],
		
		//踢腿
		CMB_HEAVY_KICK:[
			{
				act: "attack",
				p: ["heavy","kick"],
				t: 300
			}
		],
		
		//向后起跳踢腿
		CMB_JUMP_BACK_KICK:[
						{
							act:"jump",
							p:"back",
							t:100
						},
						{
							act:"attack",
							p:["heavy","kick"],
							t:600
						}
		],
		
		//防守
		CMB_DEFENSE:{
			act:"defense",
			p:"",
			t:100
		},
		
		//下蹲防守
		CMB_CROUCH_DEFENSE:[
			{
				act:"stand",
				p:"crouch",
				t:100
			},
			{
				act: "defense",
				p: "",
				t: 100
			}
		]

	});
})();
