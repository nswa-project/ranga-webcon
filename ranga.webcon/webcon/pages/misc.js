var page_misc = {};

page_misc.getElementById = id => {
	return document.getElementById('p-misc-' + id);
}

page_misc.setFlag = e => {
	let element = e.target,
		value = (element.checked ? '1' : '0'),
		key = element.dataset.x,
		toastString = element.dataset.toast;
	ranga.api.config('misc', ['set-flag', key, value]).then(proto => {
		dialog.toast(toastString);
	}).catch(defErrorHandler)
}

page_misc.setMisc = e => {
	let element = e.target,
		key = element.dataset.x,
		valueElement = element.dataset.v,
		value = page_misc.getElementById(valueElement).value,
		toastString = element.dataset.toast;
	ranga.api.config('misc', ['set-misc', key, value]).then(proto => {
		dialog.toast(toastString);
	}).catch(defErrorHandler)
}

page_misc.setSvc = e => {
	let element = e.target,
		value = (element.checked ? 'enable' : 'disable'),
		key = element.dataset.x,
		toastString = element.dataset.toast;
	ranga.api.config('svc', [key, value]).then(proto => {
		dialog.toast(toastString);
	}).catch(defErrorHandler)
}

const page_misc_init = () => {
	webcon.lockScreen();
	ranga.api.config('misc', ['ls']).then(proto => {
		let data = {};
		proto.payload.split('\n').forEach(i => {
			let idx = i.indexOf('=');
			if (idx > 0) {
				let name = i.substring(0, idx);
				let value = i.substring(idx + 1).replace(/'/g, '');
				data["" + name + ""] = value;
			}
		});
		console.log(data);

		page_misc.getElementById('cp').checked = (data['nswa.flags.enable_captive_portal'] === '1');
		page_misc.getElementById('cron').checked = (data['nswa.flags.enable_cron_autostart'] === '1');
		page_misc.getElementById('ed').checked = (data['nswa.flags.enable_early_dial'] === '1');
		page_misc.getElementById('anydial').checked = (data['nswa.flags.permit_anonymous_dial'] === '1');
		page_misc.getElementById('scdial').checked = (data['nswa.flags.enable_forever_nkserver'] === '1');
		page_misc.getElementById('ppp').value = data['nswa.misc.autoppp'];

		return ranga.api.config('svc', ['offload', 'is-enabled']);
	}).then(proto => {
		if (proto.payload.startsWith('enabled'))
			page_misc.getElementById('offload').checked = true;
	}).catch(defErrorHandlerPage).finally(() => {
		webcon.unlockScreen();
	});

	page_misc.getElementById('cp').addEventListener('change', page_misc.setFlag);
	page_misc.getElementById('cron').addEventListener('change', page_misc.setFlag);
	page_misc.getElementById('ed').addEventListener('change', page_misc.setFlag);
	page_misc.getElementById('anydial').addEventListener('change', page_misc.setFlag);
	page_misc.getElementById('scdial').addEventListener('change', page_misc.setFlag);

	page_misc.getElementById('set-ppp').addEventListener('click', page_misc.setMisc);

	page_misc.getElementById('offload').addEventListener('change', page_misc.setSvc);
}
