var broswerCheckPassed = false;
try {
	if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
		var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		if (parseInt(raw[2], 10) > 69) {
			broswerCheckPassed = true;

			var fuckList = ['Edge', '360SE', '360EE', 'MetaSr', 'MQQBrowser', 'QQ', 'TIM', 'MicroMessenger', 'WeiBo', 'UCWEB', 'UCBrowser'];
			for (var i = 0; i < fuckList.length; i++) {
				if (navigator.userAgent.indexOf(fuckList[i]) > -1) {
					broswerCheckPassed = false;
					break;
				}
			}
		}
	} else if (navigator.userAgent.indexOf("Firefox") > -1) {
		var raw = navigator.userAgent.match(/Firefox\/([0-9]+)\./);
		if (parseInt(raw[1], 10) >= 62) {
			broswerCheckPassed = true;
		}
	} else if (navigator.userAgent.indexOf("iPhone") > -1 && navigator.userAgent.indexOf("Safari") > -1) {
		// Only Safari on iPhone (iOS 12+) is allowed, on Mac OS X is not allowed!
		var raw = navigator.userAgent.match(/Version\/([0-9]+)\./);
		if (parseInt(raw[1], 10) >= 12) {
			broswerCheckPassed = true;
		}
	}
} catch (error) {
	console.log(error);
}

if (!broswerCheckPassed) {
	
}
