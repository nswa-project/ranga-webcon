let page_setting = {};

page_setting.$ = id => {
	return document.getElementById('p-setting-' + id);
}

page_setting.setBooleanLocalStorageItem = (key, valueCheckbox, swap) => {
	let checked = swap ? 'false' : 'true';
	let unchecked = swap ? 'true' : 'false';
	localStorage.setItem(key, valueCheckbox.checked ? checked : unchecked);
}

const page_setting_init = () => {
	let timesync = page_setting.$('timesync'),
		online = page_setting.$('online'),
		theme = page_setting.$('theme'),
		localeinput = page_setting.$('locale'),
		deprecated_csseth = page_setting.$('deprecated-csseth'),
		exp_keep_token = page_setting.$('exp-keep-token'),
		exp_network_showinet = page_setting.$('exp-network-showinet');

	let locale = utils.getLocalStorageItem('locale');
	if (!utils.isNil(locale)) {
		localeinput.value = locale;
	}

	localeinput.addEventListener('change', e => {
		localStorage.setItem('locale', localeinput.value);
		location.reload(true);
	});

	theme.textContent = webconThemeUUID ? webconThemeUUID : _('Default theme');
	page_setting.$('themestore').addEventListener('click', e => {
		iframePage(webcon.supportSiteMain + '/was2/themes.html', _('Ranga Web App Store - Themes'))
	});

	page_setting.$('settheme').addEventListener('click', e => {
		let d = dialog.show('icon-add', _('Set custom theme'), "{0}<br><br>{1}<input type=file accept='.css,.nrwt' /><br>".format(_("Installing a third-party theme can lead to malicious tampering with the appearance of the Web Console, which can be deceived."), _("Select a theme file: ")), [{
			name: _("Apply"),
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
			name: _("Cancel"),
			func: dialog.close
		}]);
	})

	timesync.addEventListener('change', e => {
		localStorage.setItem("disable-netkeeper-timesync", timesync.checked ? "false" : "true");
	});

	online.addEventListener('change', e => {
		localStorage.setItem("disable-nswa-online", online.checked ? "false" : "true");
	});

	exp_keep_token.addEventListener('change', e => page_setting.setBooleanLocalStorageItem("exp-keep-token", e.target, false));
	deprecated_csseth.addEventListener('change', e => page_setting.setBooleanLocalStorageItem("deprecated-csseth", e.target, false));
	exp_network_showinet.addEventListener('change', e => page_setting.setBooleanLocalStorageItem("exp-network-showinet", e.target, false));

	if (utils.getLocalStorageItem('disable-netkeeper-timesync') === 'true') {
		timesync.checked = false;
	}

	if (utils.getLocalStorageItem('disable-nswa-online') === 'true') {
		online.checked = false;
	}

	if (utils.getLocalStorageItem('deprecated-csseth') === 'true') {
		deprecated_csseth.checked = true;
	}

	if (utils.getLocalStorageItem('exp-keep-token') === 'true') {
		exp_keep_token.checked = true;
	}

	if (utils.getLocalStorageItem('exp-network-showinet') === 'true') {
		exp_network_showinet.checked = true;
	}
}
