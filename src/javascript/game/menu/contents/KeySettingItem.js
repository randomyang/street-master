/**
 * @fileoverview 键位设置的元素
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-04-06
 */

$import("aralork.lib.Lib");

$package("game.menu.contents","KeySettingItem",
	function(parent,text){
		this.ID=aralork.lib.Lib.getUniqueID();
		
		this.__entity=null;
		this.__element=null;
		this.__parent=parent || document.body;
		
		this.__initEntity(text);
	}.define({
		
		focus:function(){
			
		},
		
		blur:function(){
			
		},
		
		__initEntity:function(text){
			var et;
			
			et=this.__entity=$C("div");
			et.style.pading="10px";
			et.innerHTML='<span style="text-align:center;width:100px;">'+text+'</span><span id="ksi_'+this.ID+'"></span>';
			this.__parent.appendChild(et);
		}
	})
);
