var page_addon = {};

page_addon.extensionInfo = pkgname => {
	return ranga.api.addonInfo(pkgname).then(proto => {
		console.log(proto.payload);
	});
}

const page_addon_init = () => {
	webcon.addButton('安装新扩展程序', 'icon-add', b => {
		let d = dialog.show('icon-add', '安装新扩展程序', "", [{
			name: "上传",
			func: (d => {
				dialog.close(d);
			})
		}, {
			name: "取消",
			func: dialog.close
		}]);
	});

	webcon.lockScreen();
	ranga.api.componentsList().then(proto => {
		return ranga.api.addonList();
	}).then(proto => {
		let arr = proto.payload.split('\n');
		var currentPromise = Promise.resolve();
		let breakLoop = false;

		arr[1] = 'test_no_such_ext';

		console.log('ext info: start');
		for (let i = 0; i < arr.length; i++) {

			if (arr[i] === '')
				continue;

			currentPromise = currentPromise.then(() => {
				console.log(arr[i]);
				return page_addon.extensionInfo(arr[i]);
			});
		}
		return currentPromise;
	}).catch(defErrorHandler).finally(() => {
		console.log('ext info: stop');
		webcon.unlockScreen();
	});
}
