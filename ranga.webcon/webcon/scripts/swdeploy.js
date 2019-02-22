var swdeploy = {};

swdeploy.poll = (pre, t) => {
	ranga.api.swdeploy.log().then(proto => {
		pre.textContent = proto.payload;
		return ranga.api.swdeploy.status()
	}).then(proto => {
		let code = parseInt(proto['swdeploy-status']);
		console.log("swdeploy.poll: status: " + code);

		switch (code) {
			case 1:
				return utils.delay(800).then(v => swdeploy.poll(pre, t));
				break;
			case 0:
				t.innerHTML += "<b>安装完毕，请手动刷新 Web 控制台</b>"
				break;
		}
	}).catch(proto => {
		defErrorHandler(proto);
	});
}

swdeploy.start = blob => {
	let d = dialog.show('icon-update', '安装 OTA 更新', '<pre></pre>', []);
	let t = dialog.textWidget(d);
	let pre = t.getElementsByTagName('pre')[0];

	ranga.api.swdeploy.upload(blob).then(proto => {
		pre.textContent = proto.payload;
		swdeploy.poll(pre, t);
	}).catch(e => {
		defErrorHandler(e);
		dialog.close(d);
	});
}
