var webcon = {};
var scriptSet = new Set();

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
		text = '请稍候';

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
webcon.dropDownMenuClose = m => {

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

webcon.kwdMap = {
	netkeeper: '基于以太网的点对点协议（Netkeeper）',
	pppoe: '基于以太网的点对点协议',
	dhcp: '动态主机配置协议',
	none: '未配置',
	static: '静态'
}

webcon.trKeyword = keyword => {
	if (keyword in webcon.kwdMap) {
		return webcon.kwdMap["" + keyword];
	}
	return keyword;
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
		webcon.loadScript("online", "https://glider0.github.io/nswa/online.ranga/" + scriptname).then(a => {
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
				webcon.sendNotify('theme-not-compat', 'icon-warning', '当前使用的第三方主题与 Web 控制台不兼容', '请从第三方主题来源检查更新的版本，以获取和最新 Web 控制台兼容的主题。', 'info', true, []);
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
