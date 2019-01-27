var broswerCheckPassed = false;
try {
	if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
		var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		if (parseInt(raw[2], 10) >= 70) {
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
	alert("你的浏览器过旧，可能与我们的 Web 控制台不兼容，因此如果你不更换浏览器继续使用 Web 控制台，将没有任何担保，有可能出现部分或全部功能将无法工作、遇到错误甚至不限于数据损坏、延误工作的严重问题。我们对此表示遗憾。我们只能建议您使用最新版本的 Google Chrome 或者 Mozilla Firefox 浏览器打开 Web 控制台。如果你正在使用 iOS，则你只能使用 Safari，且需要将 iOS 版本更新到最新。\n\n技术信息: Your User-agent: " + navigator.userAgent);
}