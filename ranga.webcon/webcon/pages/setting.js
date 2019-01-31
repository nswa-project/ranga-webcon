var page_setting = {};

const page_setting_init = () => {
	let timesync = document.getElementById('p-setting-timesync'),
		online = document.getElementById('p-setting-online');
	
	timesync.addEventListener('change', e => {
		localStorage.setItem("disable-netkeeper-timesync", timesync.checked ? "false" : "true");
	});
	
	online.addEventListener('change', e => {
		localStorage.setItem("disable-nswa-online", online.checked ? "false" : "true");
	});
	
	if (utils.getLocalStorageItem('disable-netkeeper-timesync') === 'true') {
		timesync.checked = false;
	}
	
	if (utils.getLocalStorageItem('disable-nswa-online') === 'true') {
		online.checked = false;
	}
}
