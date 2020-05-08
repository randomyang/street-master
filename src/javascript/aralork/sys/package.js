/**
 * @fileoverview package
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		$package("aralork.common.test","Class1",function(){
 * 			this.x=10;
 * 		});
 */

$package=function(ns,clzName,clz){
	function defineNamespace(root,ns){
		ns=ns || "";
		ns=ns.replace(/\s/g,"");
		
		if (ns.length == 0) {
			return root;
		}else {
			var nsc = ns.substr(0, 1);
			if (nsc != nsc.toLowerCase()) {
				throw new Error("Error \""+ns+"\":"+$__ErrorCode__["E10002"]);
			}
			
			if (ns.indexOf(".") == -1) {
				typeof(root[ns]) != "object" && (root[ns] = {});
				return root[ns];
			}
			else {
				var _ns = ns.split(".")[0];
				typeof(root[_ns]) != "object" && (root[_ns] = {});
				return defineNamespace(root[_ns], ns.replace(/[^\.]*\./, ""));
			}
		}
	}
	
	var c=clzName.substr(0,1);
	
	if(c!=c.toUpperCase()){
		throw new Error("Error \""+clzName+"\":"+$__ErrorCode__["E10001"]);
	}
	
	defineNamespace(window,ns)[clzName]=clz;
};