var page_misc = {};

page_misc.$ = id => {
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
		value = page_misc.$(valueElement).value,
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

		page_misc.$('cp').checked = (data['nswa.flags.enable_captive_portal'] === '1');
		page_misc.$('cron').checked = (data['nswa.flags.enable_cron_autostart'] === '1');
		page_misc.$('ed').checked = (data['nswa.flags.enable_early_dial'] === '1');
		page_misc.$('anydial').checked = (data['nswa.flags.permit_anonymous_dial'] === '1');
		page_misc.$('scdial').checked = (data['nswa.flags.enable_forever_nkserver'] === '1');
		page_misc.$('ppp').value = data['nswa.misc.autoppp'];

		return ranga.api.config('svc', ['show']);
	}).then(proto => {
		let data = ranga.parseProto(proto.payload + '\n\n');
			page_misc.$('offload').checked = (data['offload'] === 'enabled');
			page_misc.$('hwoffload').checked = (data['hwoffload'] === 'enabled');
	}).catch(defErrorHandlerPage).finally(() => {
		webcon.unlockScreen();
	});

	page_misc.$('cp').addEventListener('change', page_misc.setFlag);
	page_misc.$('cron').addEventListener('change', page_misc.setFlag);
	page_misc.$('ed').addEventListener('change', page_misc.setFlag);
	page_misc.$('anydial').addEventListener('change', page_misc.setFlag);
	page_misc.$('scdial').addEventListener('change', page_misc.setFlag);

	page_misc.$('set-ppp').addEventListener('click', page_misc.setMisc);

	page_misc.$('offload').addEventListener('change', page_misc.setSvc);
	page_misc.$('hwoffload').addEventListener('change', page_misc.setSvc);
}
