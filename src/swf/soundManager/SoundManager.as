package {
	import adobe.utils.CustomActions;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.media.Sound;
	import flash.media.SoundLoaderContext;
	import flash.net.URLRequest;
	import flash.events.EventDispatcher;
	
	public class SoundManager {
		private var __soundList:Object = { };
		private var __request:URLRequest = new URLRequest();
		private var __eventDispatcher:EventDispatcher = new EventDispatcher();
		
		public static const EVENT_COMPLETE:String = "loadComplete";
		
		public function SoundManager() {
			
		}
		
		public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void {
			__eventDispatcher.addEventListener(type, listener, useCapture, priority, useWeakReference);
		}
		
		public function load(url:String,name:String):void {
			if (__soundList[name]) {
				return;
			}

			__request.url = url;
			__soundList[name] = new Sound();
			__soundList[name].addEventListener(Event.COMPLETE, __loadComplete);
			__soundList[name].load(__request, new SoundLoaderContext(0));
		}
		
		public function play(name:String,count:uint=1):void {
			var sd = __soundList[name];
			sd && sd.bytesTotal===sd.bytesLoaded && sd.play(0,count);
		}
		
		private function __loadComplete(evt:Event):void {
			__eventDispatcher.dispatchEvent(new Event(EVENT_COMPLETE));
		}
	}
}