/**
 * @fileoverview Lib静态类，公用方法的集合
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.lib","Lib",
	{
		/**
		 * 给对象定义getter的方法，只适合返回Number和String类型的数据
		 * @param {Object} obj 要定义getter的对象
		 * @param {Object} p 定义的属性
		 * @param {Object} fn 操作的function
		 */
		defineGetter : function(obj, p, fn){
			var me=this;
			if (p instanceof Array && fn instanceof Array) {
				var i = Math.min(p.length, fn.length);
				while (i--) {
					if (typeof p[i] === "string" && me.checkFunction(fn[i])) {
						obj[p[i]] = {
							valueOf: (function(j){
								return function(){
									var ret = fn[j].call(obj);
									return typeof ret === "number" || typeof ret ==="string" ? ret : null;
								};
							})(i),
							toString: this.valueOf
						};
					}
				}
			}else if (typeof p === "string" && me.checkFunction(fn)) {
				obj[p] = {
					valueOf: function(){
						var ret = fn.call(obj);
						return typeof ret === "number" || typeof ret ==="string" ? ret : null;
					},
					toString: this.valueOf
				};
			}
		},
		
		/**
		 * 检测对象是否为Function类型(最简陋的方式。。。- -！)
		 * @param {Object} fn
		 */
		checkFunction:function(fn){
			return fn && typeof fn !=="string" && String.prototype.slice.call(fn, 0, 8) == "function";
		},
		
		/**
		 * 交换字符串，把主串str里的subStr1和subStr2作交换
		 * @param {String} str 主串
		 * @param {String} subStr1 需要交换的第一个子串
		 * @param {String} subStr2 需要交换的第二个子串
		 */
		swapString:function(str,subStr1,subStr2){
			var p=new RegExp("("+subStr1+"|"+subStr2+")","g");
					
			return str.replace(p,function(m){
				if(m===subStr1){
					return subStr2;
				}else if(m===subStr2){
					return subStr1;
				}
			});
		},
		
		/**
		 * 获取唯一ID
		 */
		getUniqueID:function(){
			return parseInt(Math.random()*10000).toString()+(new Date()).getTime().toString();
		}
	}
);
