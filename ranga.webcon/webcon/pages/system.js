var page_system = {};

page_system.$ = id => {
	return document.getElementById('p-system-' + id);
}

page_system.optSvcMap = {
	aria2: [true, _('Aria2 Download Manager'), _('Once started, the Aria2 Download Manager can be accessed via PRC (Remote Procedure Call) for downloading files and more.')],
	samba: [true, _('Samba file sharing service'), _('After booting, file sharing can be done via the SMB protocol to access the attached additional primary file system.')]
}

page_system.optSvcSetMisc = (misc, value) => {
	ranga.api.config('misc', ['set-misc', misc, value]).then(proto => {
		dialog.toast(_('The modification has been submitted, but it may be necessary to restart this service to take effect.'));
	}).catch(defErrorHandler)
}

page_system.optSvcExtraAction = (name, arg1, arg2) => {
	ranga.api.action('opt', ['action', name, arg1, arg2]).then(proto => {
		dialog.toast(_('The modification has been submitted, but it may be necessary to restart this service to take effect.'));
	}).catch(defErrorHandler);
}

page_system.optSvcAction = (action, name) => {
	switch (action) {
		case 'config':
			let dlg = dialog.show(null, null, '', [{
				name: _('Close'),
				func: dialog.close
			}]);
			utils.ajaxGet('opt/' + name + '.html').then(r => {
				dialog.textWidget(dlg).innerHTML = r;
				i18n.runHooks();
			});
			break;
		case 'start':
		case 'stop':
		case 'restart':
			webcon.lockScreen();
			ranga.api.action('opt', [action, name]).then(proto => {
				dialog.toast(_('The service has received the request. The operation should be completed very quickly.'));
			}).catch(defErrorHandler).finally(() => {
				webcon.unlockScreen();
			})
			break;
	}
}

page_system.optSvcAuto = (name, checkbox) => {
	let action = 'disable';
	if (checkbox.checked)
		action = 'enable';

	webcon.lockScreen();
	ranga.api.action('opt', [action, name]).then(proto => {
		dialog.toast(_('The autostart configuration has been updated.'));
	}).catch(e => {
		defErrorHandler(e);
		checkbox.checked = !checkbox.checked;
	}).finally(() => {
		webcon.unlockScreen();
	})
}

page_system.mesAction = e => {
	let element = e.target,
		action = (element.checked ? 'enable' : 'disable'),
		key = element.dataset.x;
	webcon.lockScreen();
	ranga.api.action('mes', [action, key]).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
	})
}

const page_system_init = () => {
	page_system.$('syncdate').addEventListener('click', e => {
		let ts = utils.getUNIXTimestamp();
		ranga.api.action('date', ['' + ts]).then(proto => {
			dialog.toast(_("The system clock has been updated."));
		}).catch(defErrorHandler);
	});

	page_system.$('date').addEventListener('click', e => {
		let ts = parseInt(page_system.$('unixtime').value);
		ranga.api.action('date', ['' + ts]).then(proto => {
			dialog.toast(_("The system clock has been updated."));
		}).catch(defErrorHandler);
	});

	page_system.$('reboot').addEventListener('click', e => {
		ranga.api.action('restart', ['system']).then(proto => {
			dialog.simple(_('The system is about to restart and the web console does not automatically refresh.'));
		}).catch(defErrorHandler);
	});

	page_system.$('log').addEventListener('click', e => {
		ranga.api.query('log', []).then(proto => {
			dialog.adv(null, null, "<pre>" + utils.raw2HTMLString(proto.payload) + "</pre>", [
				{
					name: _("Save to file"),
					func: (d => {
						let blob = new Blob([proto.payload], {
							type: "text/plain;charset=utf-8"
						});
						let a = document.createElement("a"),
							url = URL.createObjectURL(blob);
						a.href = url;
						a.download = "ranga.log";
						document.body.appendChild(a);
						a.click();
						setTimeout(() => {
							document.body.removeChild(a);
							window.URL.revokeObjectURL(url);
						}, 0);
					})
				},
				{
					name: _("OK"),
					func: dialog.close
				}
			], {
				noMaxWidth: 1
			});
		}).catch(defErrorHandler);
	});

	page_system.$('chpw').addEventListener('click', e => {
		let passwd = page_system.$('passwd').value,
			passwd2 = page_system.$('passwd2').value;
		if (passwd === '') {
			dialog.simple(_("Empty password is not allowed"));
			return;
		}
		if (passwd !== passwd2) {
			dialog.simple(_("The passwords entered twice do not match. Please try again."));
			return;
		}
		ranga.api.config('misc', ['set-passwd', passwd]).then(proto => {
			dialog.simple(_("password has been updated"));
		}).catch(defErrorHandler);
	});

	page_system.$('mes-ipv6ra').addEventListener('change', page_system.mesAction);

	let optEnabled = new Set();
	ranga.api.action('mes', ['is-enabled', 'ipv6_dhcp_ra_server']).then(proto => {
		page_system.$('mes-ipv6ra').checked = true;
		return ranga.api.action('opt', ['ls-enabled']);
	}).then(proto => {
		proto.payload.split('\n').forEach(i => {
			if (i !== '')
				optEnabled.add(i);
		});
		console.log(optEnabled);
		return ranga.api.action('opt', ['ls']);
	}).then(proto => {
		let div = page_system.$('opts');
		div.textContent = '';
		let itemT = page_system.$('item_t');
		let hasItem = false;

		webcon.lockScreen();
		proto.payload.split('\n').forEach(i => {
			if (i === '')
				return;

			hasItem = true;

			let name = i,
				desc = '',
				config = false;

			if (i in page_system.optSvcMap) {
				name = page_system.optSvcMap[i][1];
				desc = page_system.optSvcMap[i][2];
				config = page_system.optSvcMap[i][0];
			}

			let item = itemT.cloneNode(true);
			item.getElementsByClassName('p-system-item-name')[0].textContent = name;
			item.getElementsByClassName('p-system-item-info')[0].innerHTML = desc;
			if (config) {
				let tmp = item.getElementsByClassName('p-system-item-btn-config')[0];
				tmp.classList.remove('hide');
				tmp.addEventListener('click', ((f, a, b) => e => f(a, b))(page_system.optSvcAction, 'config', i));
			}
			item.getElementsByClassName('p-system-item-btn-start')[0].addEventListener('click', ((f, a, b) => e => f(a, b))(page_system.optSvcAction, 'start', i));
			item.getElementsByClassName('p-system-item-btn-stop')[0].addEventListener('click', ((f, a, b) => e => f(a, b))(page_system.optSvcAction, 'stop', i));
			item.getElementsByClassName('p-system-item-btn-restart')[0].addEventListener('click', ((f, a, b) => e => f(a, b))(page_system.optSvcAction, 'restart', i));
			let tmp = item.getElementsByClassName('p-system-item-auto')[0];
			if (optEnabled.has(i))
				tmp.checked = true;
			let genid = "p-system-item-auto-cb-" + i;
			tmp.id = genid;
			item.getElementsByClassName('p-system-item-auto-label')[0].htmlFor = genid;
			tmp.addEventListener('change', ((f, a) => e => f(a, e.target))(page_system.optSvcAuto, i));

			item.classList.remove('hide');
			div.appendChild(item);
		})

		if (!hasItem) {
			div.textContent = _('No additional (optional) services installed');
		}
	}).catch(defErrorHandlerPage).finally(() => {
		webcon.unlockScreen();
	});
}
