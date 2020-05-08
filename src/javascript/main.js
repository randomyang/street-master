$import("aralork.sys.core");
$import("aralork.utils.KeyListener");
$import("game.Stage");
$import("game.menu.Menu");
$import("game.menu.MenuItemContent");

 

function __Main__(){

	var scale=$IE6 ? 1.2 : 1.5,
		stage1=new game.Stage($E("screen"),scale),
		mainMenu=new game.menu.Menu($E("mainMenu")),
		pageWidth=document.documentElement.clientWidth || document.body.clientWidth,
		w=80 * scale,
		h=8 * scale,
		startScreen=$E("startScreen"),
		initContianer=$E("initContianer"),
		container=$E("container"),
		tip=$E("tip"),
		message=$E("message"),
		screen=$E("screen"),
		progressContainer=$E("progressContainer"),
		progerssBorder=$E("progerssBorder"),
		progressBar=$E("progressBar"),
		about=$E("about"),
		progressCfg={
			w:220*scale,
			h:10*scale,
			x:130*scale,
			y:170*scale
		},
		enter=function(menu){
			menu.setEnabled(false);
			progressContainer.style.display="";
			menu.hidden();
			setTimeout(function(){
				stage1.load("RYU1","RYU2","CHINA",menu);
			},20);
		};
	
	startScreen.style.width=384 * scale + "px";
	startScreen.style.height=224 * scale + "px";
	startScreen.style.display="";
	
	stage1.addEventListener("resourceLoading",function(v){
		progressBar.style.width= Math.floor(v * progressCfg.w)+"px";
	})
	.addEventListener("resourceLoadComplete",function(){
		message.style.display="none";
		screen.style.display="";
		startScreen.style.display="none";
	});
	
	//菜单项
	mainMenu.add("单人游戏",w,h,function(){
		enter(mainMenu);
	})
	.add("双人对战",w,h,function(){
		enter(mainMenu);
	})
	.add("练习模式",w,h,function(){
		enter(mainMenu);
	})
	.add("关于",w,h,
		new game.menu.MenuItemContent(about)
	)
	.setPosition({
		x:parseInt(startScreen.style.width)/2-mainMenu.width/2,
		y:120 * scale
	})
	.show();

	initContianer.style.display="none";
	container.style.display="";
	container.style.left=(pageWidth/2-384 * scale/2)+"px";
	
	//进度条
	progerssBorder.style.width=progressCfg.w+"px";
	progerssBorder.style.height=progressCfg.h+"px";
	progressContainer.style.left=progressCfg.x+"px";
	progressContainer.style.top=progressCfg.y+"px";
	
	message.style.marginTop=230*scale+"px";
	message.style.marginLeft=0;
	
	setTimeout(function(){
		tip.style.display="";
	},5000);
	
	//关于
	about.style.left=mainMenu.x+mainMenu.width/2-110+"px";
	about.style.top=mainMenu.y-
					($IE6?0:10)
					+"px";

//var kl=new aralork.utils.KeyListener();
//document.onkeydown=function(){
//	alert(aralork.events.Event.getEvent().keyCode);
//};
}