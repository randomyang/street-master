$package("aralork.animation.tween","Transition",
	{
		simple:function(t,b,c,d){
			return c*t/d+b;
		},
		backEaseIn: function(t, b, c, d){
			var s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		backEaseOut: function(t, b, c, d){
			var s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		backEaseInOut: function(t, b, c, d){
			var s = 1.70158;
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		bounceEaseOut: function(t, b, c, d){
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			}
			else 
				if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
				}
				else 
					if (t < (2.5 / 2.75)) {
						return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
					}
					else {
						return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
					}
		},
		bounceEaseIn: function(t, b, c, d){
			return c - Transition.bounceEaseOut(d - t, 0, c, d) + b;
		},
		bounceEaseInOut: function(t, b, c, d){
			if (t < d / 2) {
				return Transition.bounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
			}
			else {
				return Transition.bounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
			}
			
		},
		regularEaseIn: function(t, b, c, d){
			return c * (t /= d) * t + b;
		},
		regularEaseOut: function(t, b, c, d){
			return -c * (t /= d) * (t - 2) + b;
		},
		regularEaseInOut: function(t, b, c, d){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		strongEaseIn: function(t, b, c, d){
			return c * (t /= d) * t * t * t * t + b;
		},
		strongEaseOut: function(t, b, c, d){
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		strongEaseInOut: function(t, b, c, d){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t * t + b;
			}
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		elasticEaseIn: function(t, b, c, d){
			var a,p;
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
		
			p = d * 0.3;
			
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		elasticEaseOut: function(t, b, c, d){
			var a,p;
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
			
		},
		elasticEaseInOut: function(t, b, c, d){
			var a,p;
			if (t == 0) {
				return b;
			}
			if ((t /= d / 2) == 2) {
				return b + c;
			}
			if (!p) {
				var p = d * (0.3 * 1.5);
			}
			if (!a || a < Math.abs(c)) {
				var a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			if (t < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			}
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
		}
	}
);