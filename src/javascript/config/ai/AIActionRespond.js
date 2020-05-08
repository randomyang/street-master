/**
 * @fileoverview 动作响应配置，根据对手的动作响应相应的动作
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-23
 */

$package("config.ai","AIActionRespond",
	{
			/**
			 * 原地等待
			 */
			wait:["TYPE_1","TYPE_2","TYPE_3","TYPE_4","TYPE_5","CMB_JUMP_FORWARD_KICK_CROUCH_KICK","CMB_HEAVY_BOXING","CMB_JUMP_FORWARD_KICK","CMB_CROUCH_KICK","CMB_JUMP_BACK"],
			
			/**
			 * 下蹲
			 */
			stand_crouch:["CMB_CROUCH_KICK","TYPE_2","CMB_HEAVY_BOXING"],
			
			/**
			 * 站起
			 */
			stand_up:["TYPE_3"],
			
			/**
			 * 站立防守
			 */
			stand_up_defense:["CMB_CROUCH_KICK","TYPE_2","TYPE_4","TYPE_5"],
			
			/**
			 * 下蹲防守
			 */
			stand_crouch_defense:["CMB_HEAVY_BOXING","CMB_JUMP_FORWARD_KICK","TYPE_2","TYPE_5"],
			
			/**
			 * 后退
			 */
			walk_back:["CMB_JUMP_FORWARD_BOXING","CMB_HEAVY_KICK","TYPE_2","TYPE_3"],
			
			/**
			 * 前进
			 */
			walk_forward:["CMB_JUMP_BACK_KICK","CMB_CROUCH_KICK","TYPE_3","TYPE_4"],
			
			
			/**
			 * 出拳
			 */
			light_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			middle_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			heavy_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			
			
			/**
			 * 踢腿
			 */
			light_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			middle_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			heavy_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_5"],
			
			
			/**
			 * 跳跃
			 */
			jump_up:["TYPE_1","CMB_JUMP_FORWARD_KICK"],
			jump_down:["CMB_CROUCH_KICK"],
			jump_forward:["CMB_JUMP_BACK_KICK","TYPE_4"],
			jump_back:["TYPE_5","CMB_JUMP_FORWARD_BOXING","CMB_JUMP_FORWARD_KICK"],

			/**
			 * 近距离出拳
			 */
			near_light_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			near_middle_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			near_heavy_boxing:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			
			
			/**
			 * 近距离踢腿
			 */
			near_light_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			near_middle_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			near_heavy_kick:["CMB_DEFENSE","CMB_CROUCH_KICK","TYPE_1"],
			
			
			/**
			 * 下蹲出拳
			 */
			crouch_light_boxing:["CMB_CROUCH_DEFENSE","CMB_CROUCH_KICK","CMB_JUMP_BACK","TYPE_5"],
			crouch_middle_boxing:["CMB_CROUCH_DEFENSE","CMB_CROUCH_KICK","CMB_JUMP_BACK","TYPE_5"],
			crouch_heavy_boxing: ["CMB_CROUCH_DEFENSE","CMB_CROUCH_KICK","CMB_JUMP_BACK","TYPE_5"],
			
			
			/**
			 * 下蹲踢腿
			 */
			crouch_light_kick:["CMB_JUMP_BACK","CMB_CROUCH_KICK","TYPE_5"],
			crouch_middle_kick:["CMB_JUMP_BACK","CMB_CROUCH_KICK","TYPE_5"],
			crouch_heavy_kick:["CMB_JUMP_BACK","CMB_CROUCH_KICK","TYPE_5"],
			
			
			/**
			 * 跳跃出拳
			 */
			jump_light_boxing:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			jump_middle_boxing:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			jump_heavy_boxing:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			
			
			/**
			 * 跳跃踢腿
			 */
			jump_light_kick:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			jump_middle_kick:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],
			jump_heavy_kick:[{act:"attack",p:["heavy","kick"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING"],


			/**
			 * 往前或往后跳跃出拳
			 */
			jumpMoved_light_boxing:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			
			jumpMoved_middle_boxing:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			
			jumpMoved_heavy_boxing:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			
			
			/**
			 * 往前或往后跳跃踢腿
			 */
			jumpMoved_light_kick:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			jumpMoved_middle_kick:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			jumpMoved_heavy_kick:[{act:"attack",p:["heavy","kick"],t:400},{act:"attack",p:["heavy","boxing"],t:400},"TYPE_4","CMB_JUMP_FORWARD_BOXING","TYPE_1","CMB_JUMP_BACK_KICK"],
			
			
			/**
			 * 被攻击
			 */
			beAttacked_top:["CMB_CROUCH_KICK","TYPE_3","TYPE_1","TYPE_4"],
			beAttacked_bottom:["CMB_CROUCH_KICK","TYPE_3","TYPE_1","TYPE_4"],
			beAttacked_heavy:["CMB_CROUCH_KICK","TYPE_3","TYPE_1","TYPE_4"],
			beAttacked_impact:["CMB_CROUCH_KICK","TYPE_3","TYPE_1","TYPE_4"],
//			beAttacked_fire:[],
//			beAttacked_electric:[],
//			
//			beAttacked_fall:[],
//			
//			
//			beAttacked_before_fall_down:[],
//
//
//			beAttacked_fall_down:[],
//			
//			
//			/**
//			 * 翻身站起
//			 */
//			somesault_up:[],
			
			
			
			/*以下开始为特殊招式，不同的人物的招式名称不一样*/
			
			/**
			 * 波动拳
			 */
			wave_boxing:["CMB_DEFENSE","CMB_JUMP_FORWARD_KICK_CROUCH_KICK","TYPE_5","CMB_JUMP_FORWARD_KICK"],
			
			/**
			 * 旋风腿
			 */
			before_whirl_kick:[],
			whirl_kick:["CMB_CROUCH_HEAVY_BOXING","TYPE_5","CMB_JUMP_FORWARD_BOXING"],
			after_whirl_kick:[],
			
			
			/**
			 * 冲天拳
			 */
			impact_boxing:["TYPE_4","TYPE_1"],
			after_impact_boxing:["TYPE_4","TYPE_1","CMB_JUMP_FORWARD_KICK"]
	}
);