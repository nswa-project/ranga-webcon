let page_setting = {};

page_setting.$ = id => {
	return document.getElementById('p-setting-' + id);
}

const page_setting_init = () => {
	let timesync = page_setting.$('timesync'),
		online = page_setting.$('online'),
		theme = page_setting.$('theme'),
		localeinput = page_setting.$('locale');

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
