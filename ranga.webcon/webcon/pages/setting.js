var page_setting = {};

const page_setting_init = () => {
	let timesync = document.getElementById('p-setting-timesync'),
		online = document.getElementById('p-setting-online'),
		exp_onekey = document.getElementById('p-setting-exp-onekey');

	timesync.addEventListener('change', e => {
		localStorage.setItem("disable-netkeeper-timesync", timesync.checked ? "false" : "true");
	});

	online.addEventListener('change', e => {
		localStorage.setItem("disable-nswa-online", online.checked ? "false" : "true");
	});

	exp_onekey.addEventListener('change', e => {
		localStorage.setItem("exp-onekey", exp_onekey.checked ? "true" : "false");
	});

	if (utils.getLocalStorageItem('disable-netkeeper-timesync') === 'true') {
		timesync.checked = false;
	}

	if (utils.getLocalStorageItem('disable-nswa-online') === 'true') {
		online.checked = false;
	}

	if (utils.getLocalStorageItem('exp-onekey') === 'true') {
		exp_onekey.checked = true;
	}
}
