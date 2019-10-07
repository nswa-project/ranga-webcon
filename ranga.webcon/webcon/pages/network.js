var page_network = {};

page_network.$ = id => {
	return document.getElementById('p-network-' + id);
}

page_network.synctime = type => {
	if (utils.getLocalStorageItem('disable-netkeeper-timesync') === 'true' || type !== 'netkeeper') {
		return Promise.resolve();
	}

	let ts = utils.getUNIXTimestamp();
	return ranga.api.action('date', ['' + ts]);
}

page_network.conn = (name, type) => {
	webcon.lockScreen(_('Connecting, please wait...'));
	let action = 'up';
	if (type === 'netkeeper' || type === 'pppoe') {
		action = 'dialup';
	}

	page_network.synctime(type).then(proto => {
		return ranga.api.action('network', [action, name]);
	}).then(proto => {
		dialog.toast(_("Interface '{0}' connected.").format(name));
	}).catch(proto => {
		defErrorHandler(proto);
		if (type === 'netkeeper' && !(utils.isNil(proto))) {
			if (proto.code === '7') {
				webcon.loadScript('doctor', 'scripts/doctor.js?v=__RELVERSION__').then(() => {
					doctor.notify();
				});
			}
		}
	}).finally(() => {
		webcon.unlockScreen();
		page_network.reload();
	});
}

page_network.close = (name, type) => {
	webcon.lockScreen();
	ranga.api.action('network', ['down', name]).then(proto => {
		dialog.toast(_("Disconnected connection of interface '{0}'").format(name));
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
		page_network.reload();
	});
}

page_network.serverPoll = (dlg, ifname) => {
	return utils.delay(1000).then(v => {
		return ranga.api.action('network', ['server-status']);
	}).then(proto => {
		let status = parseInt(proto.payload);
		let needPoll = true;
		console.log("page_network.serverPoll: status: " + status);

		switch (status) {
			case 1:
				webcon.updateScreenLockTextWidget(dlg, _('Catching server startup ({0})').format(ifname));
				break;
			case 2:
				webcon.updateScreenLockTextWidget(dlg, _('Catching server is already ready ({0})').format(ifname));
				break;
			case 3:
				webcon.updateScreenLockTextWidget(dlg, _('Catching server has Captured authentication information ({0})').format(ifname));
				break;
			case 4:
				webcon.unlockScreen();
				needPoll = false;
				page_network.reload();
				dialog.toast(_("The catching process for interface '{0}' has completed.").format(ifname));
				break;
			case 5:
				webcon.unlockScreen();
				needPoll = false;
				dialog.simple(_('Catching server timed out ({0})').format(ifname));
				console.log('onekey: stop');
				stopStartServer = true;
				break;
		}

		if (needPoll)
			return page_network.serverPoll(dlg, ifname);
	}).catch(e => {
		defErrorHandler(e);
		console.log('onekey: stop');
		stopStartServer = true;
	});
}

page_network.seth = (name, type) => {
	webcon.lockScreen();
	utils.idbGet('sethblob2', name).then(r => {
		if (!utils.isNil(r) && ('blob' in r)) {
			return Promise.resolve(r.blob)
		} else {
			return Promise.reject();
		}
	}).catch(e => {
		utils.promiseDebug(e);
		dialog.simple(_('This interface does not have Seth data configured, or missing metadata. This may be because your browser has deleted the relevant data.'));
		return Promise.reject(utils.inhibitorForPromiseErrorHandler);
	}).then(arrayBuffer => {
		let pin = utils.sethGetNKPin(utils.getUNIXTimestamp(), arrayBuffer);
		if (utils.isNil(pin)) {
			dialog.simple(_('Unable to get current NK PIN and Hash from Seth data. Please make sure the data has not expired and the current time is correct.'));
			return Promise.reject(utils.inhibitorForPromiseErrorHandler);
		} else {
			console.log("sethng: NK PIN and Hash: " + pin);
			return ranga.api.action('network', ['nkdial', name, pin]);
		}
	}).then(proto => {
		dialog.toast(_("Interface '{0}' connected.").format(name));
	}).catch(e => {
		if (e === utils.inhibitorForPromiseErrorHandler)
			return Promise.reject(e);
		defErrorHandler(e);
		if (type === 'netkeeper' && !(utils.isNil(e))) {
			if (e.code === '7') {
				webcon.loadScript('doctor', 'scripts/doctor.js?v=__RELVERSION__').then(() => {
					doctor.notify();
				});
			}
		}
	}).finally(() => {
		webcon.unlockScreen();
		page_network.reload();
	});
}

page_network.server = (name, type) => {
	let dlg = webcon.lockScreen();
	ranga.api.action('network', ['start-server', name]).then(proto => {
		page_network.serverPoll(dlg, name);
	}).catch(e => {
		defErrorHandler(e);
		webcon.unlockScreen();
	});
}

page_network.kwdMap = {
	netkeeper: _('PPPoE（Netkeeper）'),
	pppoe: _('PPPoE'),
	dhcp: _('DHCP'),
	none: _('Unmanaged'),
	static: _('Static')
}

page_network.kwd = keyword => {
	if (keyword in page_network.kwdMap) {
		return page_network.kwdMap["" + keyword];
	}
	return keyword;
}

page_network.reload = () => {
	let div = document.getElementById('page_network_main');
	div.textContent = '';
	let itemT = document.getElementById('p-network-item_t');

	let f_scdial_enable = false;

	let csseth = (utils.getLocalStorageItem('deprecated-csseth') === 'true');

	return ranga.api.query('network', []).then(proto => {
		proto.payload.split('\n').forEach(i => {
			console.log(i);
			if (i.startsWith('!')) {
				switch (i) {
					case "!scdial-is-enabled":
						f_scdial_enable = true;
						break;
				}
				return;
			}

			let d = i.split(':');
			if (d.length < 4) return;

			let item = itemT.cloneNode(true);
			item.getElementsByClassName('p-network-item-ifname')[0].textContent = d[0];
			item.getElementsByClassName('p-network-item-type')[0].textContent = page_network.kwd(d[1]);

			if (parseInt(d[2]) === 1) {
				let btn = item.getElementsByClassName('p-network-item-btn-close')[0];
				btn.classList.remove('hide');
				btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.close, d[0], d[1]), false);
			} else {
				let btn = item.getElementsByClassName('p-network-item-btn-conn')[0];
				btn.classList.remove('hide');
				btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.conn, d[0], d[1]), false);
				if (d[1] === 'netkeeper') {
					if (csseth) {
						btn = item.getElementsByClassName('p-network-item-btn-seth')[0];
						btn.classList.remove('hide');
						btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.seth, d[0], d[1]), false);
					}
					btn = item.getElementsByClassName('p-network-item-btn-server')[0];
					btn.classList.remove('hide');
					if (f_scdial_enable) {
						btn.disabled = true;
					} else {
						btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.server, d[0], d[1]), false);
					}
				}
			}

			let stat = d[3].split(',');
			if (stat.length >= 2) {
				item.getElementsByClassName('p-network-item-data')[0].innerHTML = _("TX bytes: ") + utils.formatBytes(stat[1]) + "&nbsp;&nbsp;&nbsp;" + _("RX bytes: ") + utils.formatBytes(stat[0]);
			}

			item.classList.remove('hide');
			div.appendChild(item);

			if (d[0] === 'netkeeper' && parseInt(d[2]) === 1) {
				webcon.setupOnlineScript();
			}
		});

		if (f_scdial_enable) {
			page_network.$('scdial').classList.remove('hide');
		}
	}).catch(defErrorHandler);
}

var stopStartServer = false;

const page_network_init = () => {
	webcon.addButton(_('Reload'), 'icon-reload', b => {
		b.disabled = true;
		page_network.reload().finally(() => (b.disabled = false));
	});

	let extra_tools_arr = [
		{
			name: _('Start catching for all NK interfaces'),
			func: (n => {
				webcon.lockScreen(_('Getting interface information...'))
				ranga.api.query('network', []).then(proto => {
					let arr = proto.payload.split('\n');

					var currentPromise = Promise.resolve();
					stopStartServer = false;

					webcon.unlockScreen();
					for (let i = 0; i < arr.length; i++) {
						if (arr[i] === '') continue;
						let d = arr[i].split(':');
						if (d.length < 4) continue;
						if (parseInt(d[2]) === 1 || d[1] !== 'netkeeper') continue;
						let ifname = d[0];
						currentPromise = currentPromise.then(() => {
							if (stopStartServer) return Promise.resolve();
							let dlg = webcon.lockScreen();
							console.log('onekey: start: ' + ifname);
							webcon.updateScreenLockTextWidget(dlg, 'prepare：' + ifname);
							return ranga.api.action('network', ['start-server', ifname]).then(proto => {
								console.log('onekey: polling: ' + ifname);
								return page_network.serverPoll(dlg, ifname);
							});
						});
					}
					return currentPromise;
				}).catch(defErrorHandler).finally(() => {
					console.log('onekey: finally');
					webcon.unlockScreen();
				});
			})
		}, {
			name: _('Dialing doctor'),
			func: (n => {
				dialog.show(null, null, _("Please note: <b>Directly running the dialing doctor may report a completely erroneous diagnosis</b>. When the connection (except the catching method) failed, the dialing doctor will automatically pop up a notification to start, and the result is higher. However, you can still force the dialing doctor to diagnose the catching method or the last automatic dialing problem at any time, but the result may be inaccurate or even completely wrong."), [
					{
						name: _('I know'),
						func: (d => {
							webcon.loadScript('doctor', 'scripts/doctor.js?v=__RELVERSION__').then(() => {
								doctor.analysis();
							});
							dialog.close(d);
						})
					}
				])
			})
		}
	];

	webcon.addButton(_('Extra tools'), 'icon-tool', b => webcon.dropDownMenu(b, extra_tools_arr));

	page_network.reload();
}
