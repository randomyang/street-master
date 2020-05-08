package {
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import flash.net.URLLoader;
	
	import SoundManager;
	
	public class Main extends Sprite {
		
		private var __param = root.loaderInfo.parameters;
		private var __sm:SoundManager=new SoundManager();;
		private var __callBackFunctions:Object = {
			onComplete:""
		};
		
		public function Main() {
			__initParam();
			__initMethods();
			__sm.addEventListener(SoundManager.EVENT_COMPLETE, function() {
				ExternalInterface.call(__callBackFunctions.onComplete);
			});
		}
		
		private function __initParam():void {
			__callBackFunctions.onComplete = __param["onComplete"] || "onComplete";
		}
		
		private function __initMethods():void {
			ExternalInterface.addCallback("load", __sm.load);
			ExternalInterface.addCallback("playSound", __sm.play);
		}
	}
}