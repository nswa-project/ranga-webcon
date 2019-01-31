var page_mwan = {};

page_mwan.getElementById = id => {
	return document.getElementById('p-mwan-' + id);
}

page_mwan.reloadPage = () => {
	selectPage('mwan', '多宿主');
}

page_mwan.interfaceList = () => {
	let select = page_mwan.getElementById('ifs');
	ranga.api.config('interface', ['ls']).then(proto => {
		proto.payload.split('\n').forEach(i => {
			let option = document.createElement("option");
			option.value = i;
			option.textContent = i;
			select.add(option);
		});
	}).catch(defErrorHandlerPage);
}

page_mwan.RVLANInit = () => {
	ranga.api.config('misc', ['get', 'misc.rvlan']).then(proto => {
		page_mwan.getElementById('nrvlan').value = proto.payload;
	}).catch(defErrorHandlerPage);
}

page_mwan.interfaceEdit = (available, ifname) => {
	let editPage = page_mwan.getElementById('cfg');
	if (!editPage.classList.contains('hide')) {
		editPage.classList.add('hide');
	}

	if (!available) {
		return;
	}

	ranga.api.config('mwan', ['show', ifname]).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		page_mwan.getElementById('reliability').value = data.reliability;
		page_mwan.getElementById('timeout').value = data.timeout;
		page_mwan.getElementById('interval').value = data.interval;
		page_mwan.getElementById('up').value = data.up;
		page_mwan.getElementById('down').value = data.down;
		page_mwan.getElementById('metric').value = data.metric;
		page_mwan.getElementById('weight').value = data.weight;

		let list = '';
		data.trackIPlist.split(' ').forEach(i => {
			list += i.replace(/^'(.+)'$/, '$1') + '\n';
		});
		page_mwan.getElementById('trackIPlist').value = list;

		if (editPage.classList.contains('hide')) {
			editPage.classList.remove('hide');
		}
	}).catch(defErrorHandler);
}

const page_mwan_init = () => {
	webcon.addButton('负载均衡状态', 'icon-info', b => {
		ranga.api.query('network', ['mwan']).then(proto => {
			let d = dialog.show('icon-info', '负载均衡状态', "<pre></pre>", [{
				name: "关闭",
				func: dialog.close
			}]);
			let pre = dialog.textWidget(d).getElementsByTagName('pre')[0];
			pre.textContent = proto.payload;
		}).catch(defErrorHandler);
	});

	ranga.api.config('mwan', ['is-enabled']).then(proto => {
		if (!proto.payload.startsWith('enabled')) {
			page_mwan.getElementById('status-disabled').classList.remove('hide');
		} else {
			page_mwan.interfaceList();
			page_mwan.RVLANInit();
			page_mwan.getElementById('status-enabled').classList.remove('hide');
		}
	}).catch(defErrorHandlerPage);

	page_mwan.getElementById('enable').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.config('mwan', ['enable']).then(proto => {
			page_mwan.reloadPage();
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.getElementById('disable').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.config('mwan', ['disable']).then(proto => {
			page_mwan.reloadPage();
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.getElementById('restart').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.action('restart', ['mwan']).then(proto => {}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.getElementById('set-rvlan').addEventListener('click', e => {
		let nrvlan = page_mwan.getElementById('nrvlan').value;
		if (nrvlan === '')
			nrvlan = '0';

		webcon.lockScreen();
		ranga.api.config('misc', ['set-misc', 'rvlan', nrvlan]).then(proto => {}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.getElementById('ifs').addEventListener('change', e => {
		let editPage = page_mwan.getElementById('cfg');
		if (!editPage.classList.contains('hide')) {
			editPage.classList.add('hide');
		}

		let select = page_mwan.getElementById('ifs'),
			addif = page_mwan.getElementById('addif');
		ifname = select.value;
		addif.checked = false;
		webcon.lockScreen();
		ranga.api.config('mwan', ['is-exist', ifname]).then(proto => {
			if (proto.payload.startsWith('yes')) {
				addif.checked = true;
				page_mwan.interfaceEdit(addif.checked, ifname);
			}
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.getElementById('addif').addEventListener('change', e => {
		let addif = page_mwan.getElementById('addif'),
			ifname = page_mwan.getElementById('ifs').value;
		action = 'remove';

		if (ifname === '')
			return;

		if (addif.checked === true) {
			action = 'add';
		}

		ranga.api.config('mwan', [action, ifname]).then(proto => {
			page_mwan.interfaceEdit(addif.checked, ifname);
		}).catch(defErrorHandler);
	});

	page_mwan.getElementById('setif').addEventListener('click', e => {
		webcon.lockScreen();
		let ifname = page_mwan.getElementById('ifs').value;
		let reliability = page_mwan.getElementById('reliability').value,
			timeout = page_mwan.getElementById('timeout').value,
			interval = page_mwan.getElementById('interval').value,
			up = page_mwan.getElementById('up').value,
			down = page_mwan.getElementById('down').value,
			metric = page_mwan.getElementById('metric').value,
			weight = page_mwan.getElementById('weight').value;

		let ipList = [];
		page_mwan.getElementById('trackIPlist').value.split('\n').forEach(i => {
			ipList.push(i.replace(/\r/g, ''));
		});

		console.log(ipList);

		ranga.api.config('mwan', ['set', ifname, 'trackIPlist'].concat(ipList)).then(proto => {
			return ranga.api.config('mwan', ['set', ifname, 'reliability', reliability]);
		}).then(proto => {
			return ranga.api.config('mwan', ['set', ifname, 'timeout', timeout]);
		}).then(proto => {
			return ranga.api.config('mwan', ['set', ifname, 'interval', interval]);
		}).then(proto => {
			return ranga.api.config('mwan', ['set', ifname, 'up', up]);
		}).then(proto => {
			return ranga.api.config('mwan', ['set', ifname, 'down', down]);
		}).then(proto => {
			return ranga.api.config('mwan', ['set', ifname, 'metric', metric]);
		}).then(proto => {
			return ranga.api.config('mwan', ['set', ifname, 'weight', weight]);
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});
}
