/**
 * @fileoverview 浏览器和操作系统检测
 * @author Random | Random.Hao.Yang@gmail.com
 */
var	$IE,
	$IE5,
	$IE55,
	$IE6,
	$IE7,
	$IE8,
	$OPERA,
	$MOZ,
	$SAFARI,
	$FF2,
	$FF,
	$CHROME,
	$WEBKIT,
	$TT,
	$360,
	$Maxthon=false,
	$XP,
	$Vista;
	
(function(){
	var _ua = navigator.userAgent.toLowerCase();
	$IE = /msie/.test(_ua);
	$IE5 = /msie 5 /.test(_ua);
	$IE55 = /msie 5.5/.test(_ua);
	$IE6 = /msie 6/.test(_ua);
	$IE7 = /msie 7/.test(_ua);
	$IE8 = /msie 8/.test(_ua);
	$OPERA = /opera/.test(_ua);
	$MOZ = /gecko/.test(_ua);
	$SAFARI = /safari/.test(_ua);
	$XP=/windows nt 5.1/.test(_ua);
	$Vista=/windows nt 6.0/.test(_ua);
	$FF2=/firefox\/2/i.test(_ua);
	$FF = /firefox/i.test(_ua);
	$CHROME = /chrome/i.test(_ua);
	$TT=/tencenttraveler/.test(_ua);
	$360=/360se/.test(_ua);
	$WEBKIT=/webkit/i.test(_ua);
	try{
		var t=window.external;
		$Maxthon=!!t.max_version;
	}catch(e){}
})();
