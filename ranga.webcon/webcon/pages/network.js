var page_network = {};

page_network.synctime = type => {
	if (utils.getLocalStorageItem('disable-netkeeper-timesync') === 'true' || type !== 'netkeeper') {
		return Promise.resolve();
	}

	let ts = utils.getUNIXTimestamp();
	return ranga.api.action('date', ['' + ts]);
}

page_network.conn = (name, type) => {
	webcon.lockScreen('正在连接，请稍候...');
	let action = 'up';
	if (type === 'netkeeper' || type === 'pppoe') {
		action = 'dialup';
	}

	page_network.synctime().then(proto => {
		return ranga.api.action('network', [action, name]);
	}).then(proto => {}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
		page_network.reload();
	});
}

page_network.close = (name, type) => {
	webcon.lockScreen();
	ranga.api.action('network', ['down', name]).then(proto => {}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
		page_network.reload();
	});
}

page_network.serverPoll = () => {
	utils.delay(1000).then(v => {
		return ranga.api.action('network', ['server-status']);
	}).then(proto => {
		let status = parseInt(proto.payload);
		let needPoll = true;
		console.log("page_network.serverPoll: status: " + status);

		switch (status) {
			case 1:
				webcon.updateScreenLockTextWidget('拦截服务器启动中');
				break;
			case 2:
				webcon.updateScreenLockTextWidget('拦截服务器已经准备就绪');
				break;
			case 3:
				webcon.updateScreenLockTextWidget('拦截服务器已捕获认证信息');
				break;
			case 4:
				webcon.unlockScreen();
				needPoll = false;
				page_network.reload();
				break;
			case 5:
				webcon.unlockScreen();
				needPoll = false;
				dialog.simple('拦截服务器已超时');
				break;
		}

		if (needPoll)
			return utils.delay(1000).then(v => page_network.serverPoll());
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
	});
}

page_network.server = (name, type) => {
	webcon.lockScreen();
	ranga.api.action('network', ['start-server', name]).then(proto => {
		page_network.serverPoll();
	}).catch(e => {
		defErrorHandler(e);
		webcon.unlockScreen();
	});
}

page_network.reload = () => {
	let div = document.getElementById('page_network_main');
	div.textContent = '';
	let itemT = document.getElementById('p-network-item_t');

	ranga.api.query('network', []).then(proto => {
		proto.payload.split('\n').forEach(i => {
			console.log(i);
			let d = i.split(':');
			if (d.length < 4) return;

			let item = itemT.cloneNode(true);
			item.getElementsByClassName('p-network-item-ifname')[0].textContent = d[0];
			item.getElementsByClassName('p-network-item-type')[0].textContent = webcon.trKeyword(d[1]);
			if (parseInt(d[2]) === 1) {
				let btn = item.getElementsByClassName('p-network-item-btn-close')[0];
				btn.classList.remove('hide');
				btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.close, d[0], d[1]), false);
			} else {
				let btn = item.getElementsByClassName('p-network-item-btn-conn')[0];
				btn.classList.remove('hide');
				btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.conn, d[0], d[1]), false);
				if (d[1] === 'netkeeper') {
					btn = item.getElementsByClassName('p-network-item-btn-server')[0];
					btn.classList.remove('hide');
					btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.server, d[0], d[1]), false);
				}
			}
			item.getElementsByClassName('p-network-item-data')[0].textContent = d[3];
			item.classList.remove('hide');
			div.appendChild(item);
		});
	}).catch(defErrorHandler);
}

const page_network_init = () => {
	webcon.addButton('刷新', 'icon-reload', b => {
		page_network.reload();
	});

	page_network.reload();
}
