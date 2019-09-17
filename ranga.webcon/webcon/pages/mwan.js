var page_mwan = {};

page_mwan.$ = id => {
	return document.getElementById('p-mwan-' + id);
}

page_mwan.reloadPage = () => {
	selectPage('mwan', _('Multihoming'));
}

page_mwan.interfaceList = () => {
	let select = page_mwan.$('ifs');
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
		page_mwan.$('nrvlan').value = proto.payload;
	}).catch(defErrorHandlerPage);
}

page_mwan.interfaceEdit = (available, ifname) => {
	let editPage = page_mwan.$('cfg');
	if (!editPage.classList.contains('hide')) {
		editPage.classList.add('hide');
	}

	if (!available) {
		return;
	}

	ranga.api.config('mwan', ['show', ifname]).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		page_mwan.$('reliability').value = data.reliability;
		page_mwan.$('timeout').value = data.timeout;
		page_mwan.$('interval').value = data.interval;
		page_mwan.$('up').value = data.up;
		page_mwan.$('down').value = data.down;
		page_mwan.$('metric').value = data.metric;
		page_mwan.$('weight').value = data.weight;

		let list = '';
		data.trackIPlist.split(' ').forEach(i => {
			list += i.replace(/^'(.+)'$/, '$1') + '\n';
		});
		page_mwan.$('trackIPlist').value = list;

		if (editPage.classList.contains('hide')) {
			editPage.classList.remove('hide');
		}
	}).catch(defErrorHandler);
}

const page_mwan_init = () => {
	webcon.addButton(_('Load balancing state'), 'icon-info', b => {
		ranga.api.query('network', ['mwan']).then(proto => {
			let d = dialog.show('icon-info', _('Load balancing state'), "<pre></pre>", [{
				name: _("Close"),
				func: dialog.close
			}]);
			let pre = dialog.textWidget(d).getElementsByTagName('pre')[0];
			pre.textContent = proto.payload;
		}).catch(defErrorHandler);
	});

	ranga.api.config('mwan', ['is-enabled']).then(proto => {
		if (!proto.payload.startsWith('enabled')) {
			page_mwan.$('status-disabled').classList.remove('hide');
		} else {
			page_mwan.interfaceList();
			page_mwan.RVLANInit();
			page_mwan.$('status-enabled').classList.remove('hide');
		}
	}).catch(defErrorHandlerPage);

	page_mwan.$('enable').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.config('mwan', ['enable']).then(proto => {
			page_mwan.reloadPage();
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.$('disable').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.config('mwan', ['disable']).then(proto => {
			page_mwan.reloadPage();
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.$('restart').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.action('restart', ['mwan']).then(proto => {}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.$('set-rvlan').addEventListener('click', e => {
		let nrvlan = page_mwan.$('nrvlan').value;
		if (nrvlan === '')
			nrvlan = '0';

		webcon.lockScreen();
		ranga.api.config('misc', ['set-misc', 'rvlan', nrvlan]).then(proto => {
			return ranga.api.action('restart', ['rvlan-setup']);
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_mwan.$('ifs').addEventListener('change', e => {
		let editPage = page_mwan.$('cfg');
		if (!editPage.classList.contains('hide')) {
			editPage.classList.add('hide');
		}

		let select = page_mwan.$('ifs'),
			addif = page_mwan.$('addif');
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

	page_mwan.$('addif').addEventListener('change', e => {
		let addif = page_mwan.$('addif'),
			ifname = page_mwan.$('ifs').value,
			action = 'remove';

		if (ifname === '')
			return;

		if (addif.checked === true) {
			action = 'add';
		}

		ranga.api.config('mwan', [action, ifname]).then(proto => {
			page_mwan.interfaceEdit(addif.checked, ifname);
			dialog.toast(_("The '{1}' operation has been completed for interface ‘{0}'. However, you need to restart the multi-homed service to take effect.").format(ifname, action));
		}).catch(defErrorHandler);
	});

	page_mwan.$('setif').addEventListener('click', e => {
		webcon.lockScreen();
		let ifname = page_mwan.$('ifs').value;
		let reliability = page_mwan.$('reliability').value,
			timeout = page_mwan.$('timeout').value,
			interval = page_mwan.$('interval').value,
			up = page_mwan.$('up').value,
			down = page_mwan.$('down').value,
			metric = page_mwan.$('metric').value,
			weight = page_mwan.$('weight').value;

		let ipList = [];
		page_mwan.$('trackIPlist').value.split('\n').forEach(i => {
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
		}).then(proto => {
			dialog.toast(_("The multi-homed configuration for interface '{0}' has changed. However, you need to restart the multi-homed service to take effect.").format(ifname));
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});
}

page_mwan.showRuleWidget = link => {
	page_mwan.$('rule').classList.remove('hide');
	link.textContent = _("Refrush custom rules");

	let crules = page_mwan.$('crules');

	webcon.lockScreen();
	ranga.api.config('mwan', ['lsrule']).then(proto => {
		crules.textContent = proto.payload
		//proto.payload.split('\n\n').forEach(i => {
		//});
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
	});
}
