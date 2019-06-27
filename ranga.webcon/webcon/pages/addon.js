var page_addon = {};

page_addon.getElementById = id => {
	return document.getElementById('p-addon-' + id);
}

page_addon.reloadPage = () => {
	selectPage('addon', _('Addon'));
}

page_addon.extInfoShow = pkgname => {
	let extinfo = page_addon.getElementById('extinfo');
	ranga.api.addonInfo(pkgname).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		page_addon.getElementById('extinfo-name').textContent = data['%name'];
		page_addon.getElementById('extinfo-version').textContent = _("Version: {0}").format(data['%ver']);
		page_addon.getElementById('extinfo-author').textContent = _("Author: {0}").format(data['%author']);
		page_addon.getElementById('extinfo-api').textContent = _("API version: {0}").format(data['%api']);
		page_addon.getElementById('extinfo-pkgname').textContent = pkgname;

		if ('%-x-webcon' in data && data['%-x-webcon'] === '1') {
			page_addon.getElementById('chwebcon').disabled = false;
		} else {
			page_addon.getElementById('chwebcon').disabled = true;
		}

		if (extinfo.classList.contains('hide')) {
			extinfo.classList.remove('hide');
		}
	}).catch(defErrorHandler);

}

page_addon.extInfoHide = () => {
	let extinfo = page_addon.getElementById('extinfo');
	if (!extinfo.classList.contains('hide')) {
		extinfo.classList.add('hide');
	}
}

page_addon.openWcapp = (pkgname, name) => {
	iframePage('/cgi-bin/wcapp/' + encodeURIComponent(pkgname) + '/', _("Page provided by '{0}'").format(name));
	return false;
}

page_addon.extensionItem = pkgname => {
	let itemT = page_addon.getElementById('item_t');
	let div = page_addon.getElementById('exts');

	return ranga.api.addonInfo(pkgname).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		let item = itemT.cloneNode(true);
		item.getElementsByClassName('p-addon-item-name')[0].textContent = data['%name'];
		item.getElementsByClassName('p-addon-item-version')[0].textContent = pkgname + " " + _("Version: {0}").format(data['%ver']);
		item.getElementsByClassName('p-addon-item-author')[0].textContent = data['%author'];
		item.getElementsByTagName('button')[0].addEventListener('click', ((f, a) => e => f(a))(page_addon.extInfoShow, pkgname));

		if ('%wcapp' in data && data['%wcapp'] === 'v1') {
			let descdiv = item.getElementsByClassName('p-addon-item-links')[0];
			let a = document.createElement('a');
			a.textContent = data['%wcappv1-name'] || "?";
			a.href = "#!";
			a.style.marginRight = '10px';
			a.addEventListener('click', ((f, a, b) => e => {
				e.preventDefault();
				return f(a, b);
			})(page_addon.openWcapp, pkgname, data['%name']), false);
			descdiv.appendChild(a);
		}

		item.classList.remove('hide');
		div.appendChild(item);
	});
}

page_addon.install = blob => {
	webcon.lockScreen();
	ranga.api.addonInstall(blob).then(proto => {
		dialog.simple("<pre>" + utils.raw2HTMLString(proto.payload) + "</pre>");
		page_addon.reloadPage();
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
	});
}

const page_addon_init = () => {
	webcon.addButton(_('Add'), 'icon-add', b => webcon.dropDownMenu(b, [{
			name: _('Upload extension'),
			func: (() => {
				let d = dialog.show('icon-add', _('Install a new extension'), "{0}<br><br>{1}<input type=file accept='.zip,.npks' /><br>".format(_("Installing third-party extensions can adversely affect the performance and stability of the NSWA Ranga system. Please continue to operate only in very clear circumstances. Uploading extensions through the web console is experimental, and your browser must be new enough to support the File API, which is currently just a web working draft."), _("Select the extension package: ")), [{
					name: _("Upload"),
					func: (d => {
						let files = d.getElementsByTagName('input')[0].files;
						let file = files[0];
						let reader = new FileReader();
						let blob = file.slice(0, file.size);
						reader.readAsArrayBuffer(blob);

						page_addon.install(blob);

						dialog.close(d);
					})
				}, {
					name: _("Cancel"),
					func: dialog.close
				}]);
			})
		}, {
			name: _('Open the Ranga Web App Store'),
			func: (() => {
				iframePage(webcon.supportSiteMain + '/was2/index.html', _('Ranga Web App Store - Extensions'));
			})
		}, {
			name: _('Deploy system components'),
			func: (() => {
				let d = dialog.show('icon-add', _('Deploy system components'), "{0}<br><br><input style='width: 100%'>".format(_("Enter the UUID ID of the system component you want to deploy. Some system components may also have a human friendly name.")), [{
					name: _("Deploy"),
					func: (d => {
						let uuid = d.getElementsByTagName('input')[0].value;
						if (utils.isNil(uuid) || uuid == "") {
							dialog.simple(_("An empty UUID is not supported."));
						} else {
							webcon.lockScreen(_("Downloading components..."));
							webcon.loadScript('swdeploy', 'scripts/swdeploy.js').then(e => {
								return utils.ajaxGet2(webcon.supportSiteMain + '/swdl/component/' + uuid, true).catch(e => {
									dialog.simple(_("The download failed, the component corresponding to the UUID does not exist, or there is a problem with your network connection."));
									return Promise.reject(utils.inhibitorForPromiseErrorHandler);
								});
							}).then(blob => {
								swdeploy.start(blob);
							}).catch(defErrorHandler).finally(() => {
								webcon.unlockScreen();
							});
						}
						dialog.close(d);
					})
				}, {
					name: _("Cancel"),
					func: dialog.close
				}]);
				let ipt = dialog.textWidget(d).getElementsByTagName('input')[0];
				ipt.addEventListener('keyup', e => {
					e.preventDefault();
					if (e.keyCode === 13) {
						d.getElementsByTagName('button')[0].click();
					}
				});
				ipt.focus();
			})
		}
	]));

	webcon.lockScreen();
	ranga.api.componentsList().then(proto => {
		let itemT = page_addon.getElementById('item_t');
		let div = page_addon.getElementById('comps');
		let n = 0;
		proto.payload.split('COMPONENT UUID ').forEach(i => {
			if (i === '')
				return;

			n++;
			let data = ranga.parseProto(i + "\n\n");
			console.log(data);

			let item = itemT.cloneNode(true);
			let descdiv = item.getElementsByClassName('p-addon-item-author')[0];
			item.getElementsByClassName('p-addon-item-name')[0].textContent = data['name[zh_CN]'] || data['name'] || "";
			item.getElementsByClassName('p-addon-item-version')[0].textContent = data['version'] || "";
			descdiv.textContent = data['desc'] || "";
			item.getElementsByTagName('button')[0].classList.add('hide');
			item.classList.remove('hide');

			let linkdiv = item.getElementsByClassName('p-addon-item-links')[0];

			let actionsString = data['actions[zh_CN]'] || data['actions'] || "";
			actionsString.split('|').forEach(j => {
				let arr = j.split('@');
				if (arr.length < 2)
					return;

				let a = document.createElement('a');
				a.textContent = arr[0];
				a.target = '_blank';
				a.href = arr[1];
				a.style.marginRight = '10px';
				linkdiv.appendChild(a);
			});

			div.appendChild(item);
		});

		if (n === 0) {
			div.innerHTML = '<div class=tips style="text-align: center">{0}</div>'.format(_('No components are installed on your system'));
		}

		return ranga.api.addonList();
	}).then(proto => {
		let arr = proto.payload.split('\n');
		var currentPromise = Promise.resolve();
		let breakLoop = false;

		//arr[1] = 'test_no_such_ext';

		console.log('ext info: start');
		for (let i = 0; i < arr.length; i++) {

			if (arr[i] === '')
				continue;

			currentPromise = currentPromise.then(() => {
				console.log(arr[i]);
				return page_addon.extensionItem(arr[i]);
			});
		}
		return currentPromise;
	}).catch(defErrorHandlerPage).finally(() => {
		console.log('ext info: stop');
		webcon.unlockScreen();
	});

	page_addon.getElementById('remext').addEventListener('click', e => {
		let pkgname = page_addon.getElementById('extinfo-pkgname').textContent;
		ranga.api.addonRemove(pkgname).then(proto => {
			page_addon.extInfoHide();
			page_addon.reloadPage();
		}).catch(defErrorHandler);
	});

	page_addon.getElementById('chwebcon').addEventListener('click', e => {
		let pkgname = page_addon.getElementById('extinfo-pkgname').textContent;
		ranga.api.setWebcon(pkgname).then(proto => {
			page_addon.extInfoHide();
			window.location.reload(true);
		}).catch(defErrorHandler);
	});

	page_addon.getElementById('closeextinfo').addEventListener('click', e => {
		page_addon.extInfoHide();
	});
}
