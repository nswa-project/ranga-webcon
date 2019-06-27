var page_wifi = {};

page_wifi.id = 0;

page_wifi.$ = id => {
	return document.getElementById('p-wifi-' + id);
}

page_wifi.edit = () => {
	let editPage = document.getElementById('page_wifi_edit');
	if (!editPage.classList.contains('hide')) {
		editPage.classList.add('hide');
	}

	if (page_wifi.id >= 0) {
		webcon.lockScreen();
		let channel = page_wifi.$('channel'),
			htmode = page_wifi.$('htmode');

		channel.innerHTML = '<option value="auto">{0}</option>'.format(_('Auto'));
		htmode.innerHTML = '';

		let id = "" + page_wifi.id;

		ranga.api.query('wifi', ['info', id]).then(proto => {
			page_wifi.$('status').textContent = proto.payload;
			return ranga.api.query('wifi', ['cap', 'channel', id]);
		}).then(proto => {
			proto.payload.split('\n').forEach(i => {
				let arr = i.split(' ');
				if (arr < 2)
					return;

				let option = document.createElement("option");
				option.value = arr[1];
				option.textContent = i;
				channel.add(option);
			})
			return ranga.api.query('wifi', ['cap', 'htmode', id]);
		}).then(proto => {
			proto.payload.split('\n').forEach(i => {
				if (i !== '') {
					let option = document.createElement("option");
					option.value = i;
					option.textContent = i;
					htmode.add(option);
				}
			});
			return ranga.api.config('wifi', ['show', id]);
		}).then(proto => {
			let data = ranga.parseProto(proto.payload + "\n\n");
			console.log(data);

			page_wifi.$('chiper').value = data.chiper;
			page_wifi.$('pskssid').value = data["psk.ssid"];
			page_wifi.$('pskkey').value = data["psk.key"];
			page_wifi.$('country').value = data.country;

			channel.value = data.channel;
			htmode.value = data.htmode;

			let tmp = false;
			if (data.noscan === '1') tmp = true;
			page_wifi.$('noscan').checked = tmp;

			editPage.classList.remove('hide');
		}).catch(defErrorHandlerPage).finally(() => {
			webcon.unlockScreen();
		});
	}
}

page_wifi.restartWireless = () => {
	webcon.lockScreen();
	ranga.api.action('restart', ['wireless']).then(proto => {
		dialog.simple(_('Please be patient and wait for the wireless reboot to complete, this should not take too long, but the web console will not automatically refresh.'));
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
	});
}

const page_wifi_init = () => {
	webcon.addButton(_('Quick Setup'), 'icon-wifi', b => {
		page_wifi.$('easy').classList.remove('hide');
	});

	page_wifi.$('easy-apply').addEventListener('click', e => {
		let ssid = page_wifi.$('easy-ssid').value;
		let key = page_wifi.$('easy-key').value;
		let suffix = (page_wifi.$('easy-suffix').checked ? '1' : '0');

		webcon.lockScreen();
		ranga.api.config('wifi', ['auto', ssid, key, suffix]).then(proto => {
			page_wifi.restartWireless();
			page_wifi.$('easy').classList.add('hide');
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	let select = page_wifi.$('dev');

	select.addEventListener('change', e => {
		page_wifi.id = parseInt(select.value);
		page_wifi.edit();
	});

	ranga.api.query('wifi', ['ls']).then(proto => {
		proto.payload.split('\n').forEach(i => {
			let arr = i.split(':');
			if (arr < 2)
				return;
			let option = document.createElement("option");
			option.value = arr[1];
			option.textContent = i;
			select.add(option);
		})
	}).catch(defErrorHandlerPage);

	page_wifi.$('set-chiper').addEventListener('click', e => {
		let chiper = page_wifi.$('chiper').value;
		ranga.api.config('wifi', ['set', '' + page_wifi.id, 'chiper', chiper]).then(proto => {
			dialog.toast(_("The wireless security for wireless device ‘{0}' has been modified. However, you need to restart the wireless service to take effect.").format(page_wifi.id));
		}).catch(defErrorHandler);
	});

	page_wifi.$('set-psk').addEventListener('click', e => {
		let ssid = page_wifi.$('pskssid').value,
			key = page_wifi.$('pskkey').value;
		ranga.api.config('wifi', ['set', '' + page_wifi.id, 'psk.ssid', ssid]).then(proto => {
			return ranga.api.config('wifi', ['set', '' + page_wifi.id, 'psk.key', key]);
		}).then(proto => {
			dialog.toast(_("The pre-shared key for wireless device ‘{0}' has been modified. However, you need to restart the wireless service to take effect.").format(page_wifi.id));
		}).catch(defErrorHandler);

	});

	page_wifi.$('set-radio').addEventListener('click', e => {
		let country = page_wifi.$('country').value,
			channel = page_wifi.$('channel').value,
			htmode = page_wifi.$('htmode').value;
		let noscan = (page_wifi.$('noscan').checked ? '1' : '0');
		ranga.api.config('wifi', ['set', '' + page_wifi.id, 'country', country]).then(proto => {
			return ranga.api.config('wifi', ['set', '' + page_wifi.id, 'channel', channel]);
		}).then(proto => {
			return ranga.api.config('wifi', ['set', '' + page_wifi.id, 'htmode', htmode]);
		}).then(proto => {
			return ranga.api.config('wifi', ['set', '' + page_wifi.id, 'noscan', noscan]);
		}).then(proto => {
			dialog.toast(_("The radio configuration of the wireless device '{0}' has been modified. However, you need to restart the wireless service to take effect.").format(page_wifi.id));
		}).catch(defErrorHandler);
	});

	page_wifi.$('restart').addEventListener('click', e => {
		page_wifi.restartWireless();
	});
}
