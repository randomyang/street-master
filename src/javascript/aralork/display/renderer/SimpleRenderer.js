/**
 * @fileoverview SimpleRenderer类，简单的显示隐藏效果
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.display.IRenderer");

$package("aralork.display.renderer","SimpleRenderer",
	function(){
		
	}.$implements(aralork.display.IRenderer).define({
		
		/**
		 * 显示对象
		 */
		show:function(node){
			if(!node){
				return;
			}
			
			node.style.display="";
		},
		
		/**
		 * 隐藏对象
		 */
		hidden:function(node){
			if(!node){
				return;
			}
			
			node.style.display="none";
		}
	})
);
