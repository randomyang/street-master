/**
 * @fileoverview 特殊功击动作的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-01-13
 */

$package("role.specialAttack","ISpecialAttack",{
		
		/**
		 * 播放特殊攻击动作
		 * @param {Number} level 攻击级别
		 */
		play:function(level){},
		
		/**
		 * 停止特殊攻击动作
		 */
		stop:function(type){},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){}
	}
);
