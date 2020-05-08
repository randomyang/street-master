$import("aralork.net.ajax.AjaxCreator");

$package("aralork.net.ajax","Ajax",
	function(){
		var me=this;
		me.$={
			__xrh:null,
			
			__opts:{
				url:"",
				method:"get",
				param:{}
			},
			
			__formatOpts:function(opts){
				opts.url && (this.__opts.url=opts.url);
				opts.method && (this.__opts.method=opts.method);
				opts.param && (this.__opts.param=opts.param);
			},
			
			__initXRH:function(){
				this.__xrh=(new net.ajax.AjaxCreator()).create();
				this.__xrh.onreadystatechange=function(){
					switch(me.$.__xrh.readyState){
						case 4:
							if(me.$.__xrh.status == 200) {
								me.onComplete && me.onComplete(me.$.__xrh.responseText);
							}
							break;
					}
				};
			},
			
			__formatParam:function(p){
				var k,
					s=[];
				for(k in p){
					s.push([k,"=",p[k]].join(""));
				}
				return s.join("&");
			}
		};
		
		me.$.__initXRH();
		
	}.define({
		request:function(opts){
			var xrh=this.$.__xrh,
				op,
				opp,
				mth;
				
			this.$.__formatOpts(opts);
			op=this.$.__opts;
			opp=this.$.__formatParam(op.param);
			mth=op.method.toUpperCase();
			mth=="GET" && (op.url.indexOf("?")!=-1?op.url+=opp:op.url+="?"+opp);
			
			xrh.open(this.$.__opts.method.toUpperCase(),op.url+"&t="+(new Date()).getTime(),true);
			mth=="GET"?xrh.send(opp):xrh.send(null);
		},
		
		onComplete:function(){},
		onError:function(){}
	})
);
