/**
 * @fileoverview core 包括错误代码、包的定义、类的定义、浏览器检测
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.sys.ErrorCode");
$import("aralork.sys.package");
$import("aralork.sys.browserDetect");
$import("aralork.sys.interface");
$import("aralork.sys.class");

var $E = function(id){
	return document.getElementById(id);
};
var $C=function(tag){
	return document.createElement(tag);
};