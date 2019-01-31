var page_wifi = {};

page_wifi.id = 0;

page_wifi.getElementById = id => {
	return document.getElementById('p-wifi-' + id);
}

page_wifi.edit = () => {
	let editPage = document.getElementById('page_wifi_edit');
	if (!editPage.classList.contains('hide')) {
		editPage.classList.add('hide');
	}

	if (page_wifi.id >= 0) {
		webcon.lockScreen();
		let channel = page_wifi.getElementById('channel'),
			htmode = page_wifi.getElementById('htmode');

		channel.innerHTML = '<option value="auto">自动</option>';
		htmode.innerHTML = '';

		let id = "" + page_wifi.id;

		ranga.api.query('wifi', ['info', id]).then(proto => {
			page_wifi.getElementById('status').textContent = proto.payload;
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

			page_wifi.getElementById('chiper').value = data.chiper;
			page_wifi.getElementById('pskssid').value = data["psk.ssid"];
			page_wifi.getElementById('pskkey').value = data["psk.key"];
			page_wifi.getElementById('country').value = data.country;

			channel.value = data.channel;
			htmode.value = data.htmode;

			let tmp = false;
			if (data.noscan === '1') tmp = true;
			page_wifi.getElementById('noscan').value = tmp;

			editPage.classList.remove('hide');
		}).catch(defErrorHandlerPage).finally(() => {
			webcon.unlockScreen();
		});
	}
}

const page_wifi_init = () => {
	let select = page_wifi.getElementById('dev');

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

	page_wifi.getElementById('set-chiper').addEventListener('click', e => {
		let chiper = page_wifi.getElementById('chiper').value;
		ranga.api.config('wifi', ['set', '' + page_wifi.id, 'chiper', chiper]).then(proto => {}).catch(defErrorHandler);
	});

	page_wifi.getElementById('set-psk').addEventListener('click', e => {
		let ssid = page_wifi.getElementById('pskssid').value,
			key = page_wifi.getElementById('pskkey').value;
		ranga.api.config('wifi', ['set', '' + page_wifi.id, 'psk.ssid', ssid]).then(proto => {
			return ranga.api.config('wifi', ['set', '' + page_wifi.id, 'psk.key', key]);
		}).then(proto => {}).catch(defErrorHandler);

	});

	page_wifi.getElementById('set-radio').addEventListener('click', e => {
		let country = page_wifi.getElementById('country').value,
			channel = page_wifi.getElementById('channel').value,
			htmode = page_wifi.getElementById('htmode').value;
		let noscan = (page_wifi.getElementById('noscan').checked ? '1' : '0');
		ranga.api.config('wifi', ['set', '' + page_wifi.id, 'country', country]).then(proto => {
			return ranga.api.config('wifi', ['set', '' + page_wifi.id, 'channel', channel]);
		}).then(proto => {
			return ranga.api.config('wifi', ['set', '' + page_wifi.id, 'htmode', htmode]);
		}).then(proto => {
			return ranga.api.config('wifi', ['set', '' + page_wifi.id, 'noscan', noscan]);
		}).then(proto => {}).catch(defErrorHandler);
	});

	page_wifi.getElementById('restart').addEventListener('click', e => {
		ranga.api.action('restart', ['wireless']).then(proto => {
			dialog.simple('请耐心等待无线重启完毕，这应该不需要太长时间，Web 控制台不会自动刷新。');
		}).catch(defErrorHandler);
	});
}
