/**
 * @fileoverview 魔法功能的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * @date 2010-12-06
 */

$package("role.magic","IMagic",
	{
		/**
		 * 添加事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){},
		
		/**
		 * 移除事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){},
		
		/**
		 * 设置位置
		 * @param {Object} p
	 	 * 				x:Number
	 	 * 				y:Number
	 	 * 				z:Number
		 */
		setPosition:function(p){},
		
		/**
		 * 设置是否水平翻转
		 * @param {Boolean} state
		 */
		setFlipH:function(state){},
		
		/**
		 * 设置比例
		 * @param {Number} sc
		 */
		setScale:function(sc){},
		
		/**
		 * 播放魔法
		 */
		play:function(level){},
		
		/**
		 * 销毁
		 */
		destroy:function(){}
	}
);

