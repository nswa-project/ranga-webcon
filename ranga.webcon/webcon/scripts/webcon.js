var webcon = {};
var scriptSet = new Set();

webcon.supportSiteMain = "https://glider0.github.io";

webcon.setToken = value => {
	document.cookie = "USER_TOKEN=" + value + "; path=/cgi-bin";
}

webcon.loadScript = (name, url) => {
	const promise = new Promise((resolve, reject) => {
		console.log("webcon.loadScript: name: " + name);
		if (name === null || scriptSet.has(name) === false) {
			let script = document.createElement("script");
			script.type = 'text/javascript';
			script.src = url;
			script.onload = () => {
				console.log("webcon.loadScript: script " + name + " loaded (" + url + ")");
				resolve(true);
			};
			script.onerror = () => {
				scriptSet.delete(name);
				console.log("webcon.loadScript: script " + name + " failed to load (" + url + ")");
				reject();
			};
			document.body.appendChild(script);
			scriptSet.add(name);

		} else {
			console.log("webcon.loadScript: script " + name + " has loaded");
			resolve(false);
		}
	});

	return promise;
}

webcon.addButton = (title, icon, func) => {
	let btn = document.createElement('button');
	btn.classList.add('btnFlat');
	let tmp = document.createElement('i');
	tmp.classList.add('icon');
	tmp.classList.add(icon);
	btn.appendChild(tmp);
	tmp = document.createElement('span');
	tmp.textContent = title;
	btn.appendChild(tmp);
	btn.addEventListener('click', ((f, a) => e => f(a))(func, btn), false);
	document.getElementById('webcon_buttons').appendChild(btn);
}

webcon.removeAllButtons = () => {
	document.getElementById('webcon_buttons').textContent = '';
}

webcon.contentSetTitle = title => {
	document.getElementById('webcon_title').innerHTML = title;
}

webcon.contentLoadData = (data, html) => {
	if (html) {
		document.getElementById('webcon_content').innerHTML = data;
	} else {
		document.getElementById('webcon_content').textContent = data;
	}
}

webcon.contentLoadUri = (uri, html) => {
	return utils.ajaxGet(uri).then(r => {
		webcon.contentLoadData(r, html);
	});
}

webcon.lockScreenDialogStack = [];

webcon.lockScreen = text => {
	if (utils.isNil(text))
		text = _('Please wait');

	text = '<div class="circular" style="margin: 2px;"><svg><circle class="path" cx="24" cy="24" r="20" fill="none" stroke-width="3" stroke-miterlimit="10" /></svg></div><span style="margin-left: 10px">' + text + '</span>';

	let tmp = dialog.adv(null, null, text, [], {
		noMinHeight: 1
	});

	let widget = dialog.textWidget(tmp);
	widget.classList.add('flexRowCenter');

	webcon.lockScreenDialogStack.push(tmp);

	return tmp;
}

webcon.unlockScreen = () => {
	let tmp = webcon.lockScreenDialogStack.pop();
	if (!utils.isNil(tmp)) {
		dialog.close(tmp);
	}
}

webcon.updateScreenLockTextWidget = (dlg, text) => {
	if (!utils.isNil(dlg)) {
		dialog.textWidget(dlg).getElementsByTagName('span')[0].innerHTML = text;
	}
}

webcon.dropDownMenu = (e, list) => {
	let menu_wrapper = document.createElement('div'),
		menu = document.createElement('div');
	menu_wrapper.classList.add('menu_wrapper');
	menu.classList.add('menu');

	list.forEach(i => {
		let btn = document.createElement('button');
		btn.textContent = i.name;
		btn.addEventListener('click', ((f, a) => e => {
			e.stopPropagation();
			e.preventDefault();
			f(a);
			menu_wrapper.parentElement.removeChild(menu_wrapper);
		})(i.func, null), false);
		menu.appendChild(btn);
	});

	menu_wrapper.appendChild(menu);

	let back = document.createElement('div');
	back.classList.add('menu_back');
	back.addEventListener('click', e => {
		e.stopPropagation();
		e.preventDefault();
		menu_wrapper.parentElement.removeChild(menu_wrapper);
	});
	menu_wrapper.appendChild(back);

	//e.parentNode.insertBefore(menu_wrapper, e.nextSibling);
	e.style.position = 'relative';
	e.appendChild(menu_wrapper);

	return menu_wrapper;
}

webcon.sendNotify = (id, icon, title, text, theme, allowClose, btns) => {
	id = "notify-" + id;
	let tmp = document.getElementById(id);
	if (!utils.isNil(tmp))
		return tmp;

	let div = document.getElementById('webcon_notify');
	let itemT = document.getElementById('notify_t');

	let item = itemT.cloneNode(true);
	let btnArea = item.getElementsByClassName('notify_btns')[0];
	item.id = id;

	if (utils.isNil(title)) {
		item.getElementsByClassName('notify_title')[0].classList.add('hide');
	} else {
		item.getElementsByClassName('notify_title_text')[0].textContent = title;
		item.getElementsByClassName('icon')[0].classList.add(icon);
	}

	item.getElementsByClassName('notify_text')[0].innerHTML = text;

	for (var i = 0; i < btns.length; i++) {
		var button = document.createElement("button");
		button.classList.add('btnFlat');
		button.addEventListener('click', ((f, a) => e => f(a))(btns[i].func, item), false);
		button.textContent = btns[i].name;
		btnArea.appendChild(button);
	}

	if (allowClose) {
		var button = document.createElement("button");
		button.classList.add('btnFlat');
		button.addEventListener('click', ((f, a) => e => f(a))(webcon.closeNotify, item), false);
		button.textContent = "关闭";
		btnArea.appendChild(button);
	}

	item.classList.add('notify_theme_' + theme);
	item.classList.remove('hide');
	div.appendChild(item);

	item.scrollIntoView();

	return item;
}

webcon.closeNotify = notify => {
	notify.remove();
}

webcon.onlineInited = false;
webcon.setupOnlineScript = () => {
	if (webcon.onlineInited) return;
	webcon.onlineInited = true;

	let scriptname = 'main.js';
	if (utils.getLocalStorageItem('disable-nswa-online') !== 'true') {
		if (utils.getLocalStorageItem('nswa-online-debug-channel') === 'true') {
			scriptname = 'main-debug.js';
		}
		webcon.loadScript("online", webcon.supportSiteMain + "/nswa/online.ranga/" + scriptname).then(a => {
			eval("nswaOnlineInit(1)");
		}).catch(e => {
			webcon.loadScript("online_mirror", "https://fytlc.coding.me/ranga-mirror/nswa/online.ranga/" + scriptname).then(a => {
				eval("nswaOnlineInit(1)");
			}).catch(e => {
				console.log("Can not load NSWA Online");
			});
		});
	}
}

webcon.reloadTheme = () => {
	let tmp = document.getElementById('_USER_THEME');
	if (!utils.isNil(tmp)) {
		tmp.parentElement.removeChild(tmp);
	}
	utils.idbGet('theme', 'custom-css').then(result => {
		if (!utils.isNil(result)) {
			if (result.theme_compat !== '1') {
				webcon.sendNotify('theme-not-compat', 'icon-warning', _('The third-party theme currently in use is not compatible with Web Console'), _('Please check the updated version from the third-party source for the theme that is compatible with the latest Web Console.'), 'info', true, []);
			} else {
				webconThemeUUID = (utils.isNil(result.theme_uuid) ? "UNKNOWN" : result.theme_uuid);
				let s = document.createElement("style");
				s.id = '_USER_THEME';
				s.innerHTML = result.data;
				document.getElementsByTagName("head")[0].appendChild(s);
			}
		}
	});

}

webcon.listenForExternalRequest = () => {
	window.addEventListener('message', e => {
		let data = e.data,
			origin = e.origin;
		console.log(data);
		switch (data.type) {
			case 'set-theme':
				if (!('theme_css' in data) || !('theme_uuid' in data) || !('theme_version' in data) || !('theme_compat' in data)) {
					return;
				}

				dialog.show('icon-warning', _('External application request'), _('The site at <b>{0}</b> is trying to set a custom theme to your NSWA Ranga Web Console. Installing a third-party theme can lead to malicious tampering with the appearance of the Web Console, which can be deceived.').format(utils.raw2HTMLString(utils.URIDomain(origin))) + (origin.startsWith('https:') ? '' : _('<br><br>Your connection to this site is not a private connection. This means that your data is transmitted over the Internet without encryption, which can cause the theme to be maliciously replaced.')), [{
					name: _('Continue'),
					func: (d => {
						if (data.theme_uuid === 'default') {
							utils.idbRemove('theme', 'custom-css').then(() => {
								dialog.close(d);
								webcon.reloadTheme();
							});
						} else {
							utils.idbPut('theme', {
								id: 'custom-css',
								data: data.theme_css,
								theme_uuid: data.theme_uuid,
								theme_version: data.theme_version,
								theme_compat: data.theme_compat
							}).then(() => {
								dialog.close(d);
								webcon.reloadTheme();
							});
						}
					})
				}, {
					name: _('Refuse'),
					func: dialog.close
				}]);
				break;
			case 'inst-ext':
				if (!('ext_blob' in data)) {
					return;
				}
				dialog.show('icon-warning', _('External application request'), _('The site at <b>{0}</b> is trying to install an extension to your NSWA Ranga. Installing third-party extensions can adversely affect the performance and stability of the NSWA Ranga system. Please continue to operate only in very clear circumstances.').format(utils.raw2HTMLString(utils.URIDomain(origin))) + (origin.startsWith('https:') ? '' : _('<br><br>Your connection to this site is not a private connection. This means that your data is transmitted over the Internet without encryption, which can cause the extension to be maliciously replaced.')), [{
					name: _('Continue'),
					func: (d => {
						let passwd = prompt(_('To install the extension, you must be authenticated\n\nEnter the superuser password to continue'), 'ranga');
						ranga.api.auth(passwd).then(proto => {
							webcon.setToken(proto.payload);
							webcon.lockScreen(_('Installing extension'));
							return ranga.api.addonInstall(data.ext_blob);
						}).then(proto => {
							dialog.simple("<pre>" + utils.raw2HTMLString(proto.payload) + "</pre>");
						}).catch(defErrorHandler).finally(() => {
							dialog.close(d);
							webcon.unlockScreen();
						});
					})
				}, {
					name: _('Refuse'),
					func: dialog.close
				}]);
				break;
		}
	});
}
