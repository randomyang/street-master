/**
 * @fileoverview 控制器类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-25 (Merry Xmas ^o^)
 * @example
 * 		var ctrlr=new role.controller.Controller();
		ctrlr.configure({
			"UP":87,
			"RIGHT":68,
			"DOWN":83,
			"LEFT":65,
			"A":74,
			"B":75,
			"C":76,
			"D":85,
			"E":73,
			"F":79
		});
		
		ctrlr.addEventListener("controlsKeyDown",function(code,keyCode,keyName){
			alert(code+","+keyCode+","+keyName);
		});
		ctrlr.addEventListener("controlsKeyUp",function(code,keyCode,keyName){
			alert(code+","+keyCode+","+keyName);
		});
		ctrlr.addEventListener("functionKeyDown",function(code,keyCode,keyName){
			alert(code+","+keyCode+","+keyName);
		});
		ctrlr.addEventListener("functionKeyUp",function(code,keyCode,keyName){
			alert(code+","+keyCode+","+keyName);
		});
		
 */

$import("aralork.events.EventDispatcher");
$import("aralork.utils.KeyListener");

$package("role.controller","Controller",

	/**
	 * 控制器类
	 * @event
	 * 		controlsKeyDown 方向控制键按下时触发
	 * 		functionKeyDown 功能键按下时触发
	 */
	function(){
		this.__keys={
			"UP":0,
			"RIGHT":0,
			"DOWN":0,
			"LEFT":0,
			"A":0,
			"B":0,
			"C":0,
			"D":0,
			"E":0,
			"F":0
		};
		
		this.__reverseKeys={};
		this.__hashKeyCode={};
		
		this.__keyListener=new aralork.utils.KeyListener();
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		
		this.__controlsCode=0;
		this.__functionCode=0;
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		configure:function(p){
			var keys=this.__keys,
				rvsKeys=this.__reverseKeys,
				k;
			
			for(k in keys){
				if(typeof p[k]==="number" || typeof p[k]==="string"){
					keys[k]=p[k];
					rvsKeys["k_"+p[k]]=k;
				}
			}
			
			this.__initKeyCodes();
			this.__initKeys("controls");
			this.__initKeys("function");
			
			return this;

		},
		
		__initKeyCodes:function(){
			var hkc=this.__hashKeyCode,
				keys=this.__keys;
			
			hkc[keys.UP]=17;    //10001;
			hkc[keys.RIGHT]=18; //10010;
			hkc[keys.DOWN]=20;  //10100;
			hkc[keys.LEFT]=24;  //11000;
			
			hkc[keys.A]=65; 	//1000001;
			hkc[keys.B]=66;		//1000010;
			hkc[keys.C]=68; 	//1000100;
			hkc[keys.D]=72; 	//1001000;
			hkc[keys.E]=80; 	//1010000;
			hkc[keys.F]=96; 	//1100000;
		},
		
		
		__initKeys:function(type){
			var kl=this.__keyListener,
				keys=this.__keys,
				me=this,
				keySet= type==="controls"
						?["UP","RIGHT","DOWN","LEFT"]
						:["A","B","C","D","E","F"],
				i=keySet.length;
				
			while(i--){
				kl.add(keys[keySet[i]],"keydown",function(keyCode){
						me.__updateKeyCode(keyCode,true,type);
					})
					.add(keys[keySet[i]],"keyup",function(keyCode){
						me.__updateKeyCode(keyCode,false,type);
					});
			}
		},
		
		/**
		 * 更新当前的按键状态
		 * @param {Number} keyCode
		 * @param {Boolean} isKeyDown
		 * @param {String} type
		 * 					"controls"
		 * 					"function"					
		 */
		__updateKeyCode:function(keyCode,isKeyDown,type){
			var hkc=this.__hashKeyCode,
				rvsKeys=this.__reverseKeys,
				hash={
					"controls":"__controlsCode",
					"function":"__functionsCode"
				},
				opNumber= type==="controls"?16:64;
			
			if(isKeyDown){
				this[hash[type]] |= hkc[keyCode];
				hkc[keyCode] > opNumber && this.__eventDispatcher.dispatchEvent(type+"KeyDown",this[hash[type]],keyCode,rvsKeys["k_"+keyCode]);
				hkc[keyCode] &= opNumber-1;
			}else{
				this[hash[type]] ^= hkc[keyCode];
				this.__eventDispatcher.dispatchEvent(type+"KeyUp",this[hash[type]],keyCode,rvsKeys["k_"+keyCode]);
				hkc[keyCode] |= opNumber;
			}
		}
		
		
	})
);
