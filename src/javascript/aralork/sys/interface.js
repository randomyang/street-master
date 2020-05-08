/**
 * @fileoverview 接口实现的定义
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		
		var IExampleInterface={
			show:function(){},
			hidden:function(){}
		};
		
		var Class1=function(){
		
		}.$implements(IExampleInterface).define({
			show:function(){
				alert("show");
			},
			hidden:function(){
				alert("hidden");
			}
		});
		
 		var Class1=function(){

		}.$extends(SuperClass).$implements(IExampleInterface).define({
			show:function(){
				alert("show");
			},
			hidden:function(){
				alert("hidden");
			}
		});
 */

Function.prototype.$implements = function() {
	var arg = Array.prototype.slice.call(arguments, 0),
		fn,
		i=arg.length,
		k;
		
	while(i--){
		if(typeof arg[i]!=="object"){
			throw new Error("interface implements error:"+$__ErrorCode__["E10005"]);
		}
		
		for(k in arg[i]){
			typeof this.prototype[k]==="undefined" && (this.prototype[k]="NI");
		}
	}
	
	this.__interface__=true;
	
	this.$extends = function(){
		throw new Error("interface implements error:"+$__ErrorCode__["E10006"]);
	};
	
	return this;
};