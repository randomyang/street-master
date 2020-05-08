/**
 * @fileoverview 工具页入口。。。。tools包里的这几个文件的代码是很恶心的。。。。为了加快速度随意写的。。请勿模仿。。。
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-22
 */

$import("aralork.sys.core");
$import("aralork.events.EventManager");
$import("aralork.events.Event");
$import("aralork.utils.KeyListener");


$import("tools.OverlayArea");
$import("tools.OverlayAreaEditorView");
$import("tools.OverlayAreaManager");

function __Main__(){
	var iptBrowser=$E("iptBrowser"),
		imgPreview=$E("imgPreview"),
		txtFrameCount=$E("txtFrameCount"),
		btnUpdate=$E("btnUpdate"),
		divFrameContainer=$E("divFrameContainer"),
		imgFrame=$E("imgFrame"),
		btnNext=$E("btnNext"),
		btnPre=$E("btnPre"),
		btnZoomIn=$E("btnZoomIn"),
		btnZoomOut=$E("btnZoomOut"),
		btnAttackFormat=$E("btnAttackFormat"),
		btnBodyFormat=$E("btnBodyFormat"),
		txtAttackOverlay=$E("txtAttackOverlay"),
		txtBodyOverlay=$E("txtBodyOverlay"),
		btnClear=$E("btnClear"),
		oaev=new tools.OverlayAreaEditorView(divFrameContainer,imgFrame);
		oam=new tools.OverlayAreaManager();
		kl=new aralork.utils.KeyListener();
	
	aralork.events.EventManager.addEventListener(iptBrowser,"change",function(){
		imgPreview.src=iptBrowser.files[0].getAsDataURL();
	});
	
	btnUpdate.onclick=function(){
		oaev.render(imgPreview.src,imgPreview.width,imgPreview.height,parseInt(txtFrameCount.value))
			.setScale(4);
	};
	btnNext.onclick=function(){
		oaev.next();
		oam.render("attack",oaev.frame);
		oam.render("body",oaev.frame);
	};
	btnPre.onclick=function(){
		oaev.previous();
		oam.render("attack",oaev.frame);
		oam.render("body",oaev.frame);
	};
	btnZoomIn.onclick=function(){
		oaev.setScale(Math.min(oaev.scale+1,10));
	};
	btnZoomOut.onclick=function(){
		oaev.setScale(Math.max(oaev.scale-1,1));
	};
	
	
	kl.add(87,"keydown",function(){
		oam.add(new tools.OverlayArea(divFrameContainer,"div",100,100,"red"),"attack",oaev.frame);
	});
	kl.add(82,"keydown",function(){
		oam.add(new tools.OverlayArea(divFrameContainer,"div",100,100,"green"),"body",oaev.frame);
	});
	btnAttackFormat.onclick=function(){
		txtAttackOverlay.value=oam.format("attack",oaev.frameCount,oaev.scale);
	};
	btnBodyFormat.onclick=function(){
		txtBodyOverlay.value=oam.format("body",oaev.frameCount,oaev.scale);
	};
	
	kl.add(83,"keydown",function(){
		oam.active && oam.active.setSize({
			w:oam.active.width-5
		});
	});
	kl.add(70,"keydown",function(){
		oam.active && oam.active.setSize({
			w:oam.active.width+5
		});
	});
	kl.add(69,"keydown",function(){
		oam.active && oam.active.setSize({
			h:oam.active.height-5
		});
	});
	kl.add(68,"keydown",function(){
		oam.active && oam.active.setSize({
			h:oam.active.height+5
		});
	});
	
	btnClear.onclick=function(){
		oam.clear("attack");
		oam.clear("body");
	};
	
}
