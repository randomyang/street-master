$package("aralork.net.ajax","AjaxCreator",
	{
		create:function(){
			var __xhr;
			try{
				if (typeof(XMLHttpRequest)!="undefined") {
					__xhr = new XMLHttpRequest();                                               
				}else if (typeof(ActiveXObject)!="undefined") {
					try {
						__xhr = new ActiveXObject("Msxml2.XMLHTTP");
					}catch(ex){
						try {
							__xhr = new ActiveXObject("Microsoft.XMLHTTP");
						}catch(ex){}
					}
				}
  			}catch(e){}
			
			return __xhr;
		}
	}
);