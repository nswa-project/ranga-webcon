let page_setting = {};

page_setting.$ = id => {
	return document.getElementById('p-setting-' + id);
}

const page_setting_init = () => {
	let timesync = page_setting.$('timesync'),
		online = page_setting.$('online'),
		exp_onekey = page_setting.$('exp-onekey'),
		theme = page_setting.$('theme');

	theme.textContent = webconThemeUUID ? webconThemeUUID : '默认主题';
	page_setting.$('themestore').addEventListener('click', e => {
		iframePage('https://glider0.github.io/was2/themes.html', 'Ranga 网上应用店 - 主题')
	});

	page_setting.$('settheme').addEventListener('click', e => {
		let d = dialog.show('icon-add', '设置自定义主题', "安装第三方主题可能会导致 Web 控制台外观被恶意篡改，从而使你受骗。<br><br>选择主题文件：<input type=file accept='.css,.nrwt' /><br>", [{
			name: "应用",
			func: (d => {
				let files = d.getElementsByTagName('input')[0].files;
				let file = files[0];
				if (!utils.isNil(file)) {
					let reader = new FileReader();
					reader.readAsText(file);
					reader.onload = () => {
						utils.idbPut('theme', {
							id: 'custom-css',
							data: reader.result,
							theme_uuid: 'custom',
							theme_version: '',
							theme_compat: '1'
						}).then(() => {
							dialog.close(d);
							webcon.reloadTheme();
						});
					}
				} else {
					dialog.close(d);
				}
			})
		}, {
			name: "取消",
			func: dialog.close
		}]);
	})

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
