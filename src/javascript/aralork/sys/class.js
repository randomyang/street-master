/**
 * @fileoverview class define
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		var SuperClass=function(name){
			this.name=name;
			this.list=["a","b"];
		}.define({
			show:function(){
				alert(this.name);
			}
		});
		
		var SubClass=function(name,age){
			this.age=age;
		}.$extends(SuperClass).define({
			display:function(){
				alert(this.age);
			}
		});
		
		var Sub=function(name,age){
			
		}.$extends(SubClass).define({
			show:function(){
				Sub.$super.show.call(this);
				alert("haahh");
			}
		});
 */

(function(){
	function object(o){
		function F(){}
		F.prototype=o;
		return new F();
	}
	
	Function.prototype.define=function(def){
		var k;
	    for(k in def){
	        this.prototype[k]=def[k];
	    }
		
		if(this.__interface__){
			for(k in this.prototype){
				if(this.prototype[k]==="NI"){
					throw new Error("class define error ["+k+"]:"+$__ErrorCode__["E10007"]);
				}
			}
		}
		
		this.prototype.constructor=this;
		this.$extends = this.define = this.$implements = function(){
			throw new Error("class define error:"+$__ErrorCode__["E10008"]);
		};
	    return this;
	};
	
	Function.prototype.$extends=function(){
		var me=this,
			i=arguments.length,
			k,
			sup,
			fn;
			
		if(i===0){
			throw new Error("$extend error:"+$__ErrorCode__["E10004"]);
		}
		
		sup=arguments[0];
		fn=function(){
            sup.apply(this,arguments);
			me.apply(this,arguments);
        };
        fn.prototype=object(sup.prototype);
        fn.prototype.constructor=fn;
		fn.$super=sup.prototype;
		
		return fn;
	};
})();

