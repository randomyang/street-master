/**
 * @fileoverview IRenderer接口，所有呈现对象的显示和隐藏方法的接口
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.display","IRenderer",{
	
		/**
		 * 显示对象的方法
		 * @param {Object} node
		 */
		show:function(node){},
		
		/**
		 * 隐藏对象的方法
		 * @param {Object} node
		 */
		hidden:function(node){}
	}
);
