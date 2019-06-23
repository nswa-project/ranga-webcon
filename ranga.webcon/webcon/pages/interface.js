var page_interface = {};

page_interface.ifname = '';

page_interface.$ = id => {
	return document.getElementById('p-interface-' + id);
}

page_interface.updateSethInfomationWidget = (ifname) => {
	let widget = page_interface.$('seth-info');
	return utils.idbGet('seth', ifname).then(r => {
		console.log(r);
		if (!utils.isNil(r) && ('ts' in r) && ('ts_end' in r)) {
			widget.textContent = _('Seth data has been configured for this interface. This data claims that it can be valid from "{0}" to "{1}".').format(utils.UNIXToDateString(r.ts), utils.UNIXToDateString(r.ts_end));
		} else {
			widget.textContent = _('This interface does not have Seth data configured, or missing metadata. This may be because your browser has deleted the relevant data.');
		}
	}).catch(e => {
		utils.promiseDebug(e);
		widget.textContent = _('This interface does not have Seth data configured, or missing metadata. This may be because your browser has deleted the relevant data.');
	});
}

page_interface.setSethData = (ifname, blob) => {
	let ts;
	utils.sethGetTimeStamp(blob).then(t => {
		ts = t;
		return utils.idbPut('sethblob', {
			id: ifname,
			blob: blob
		});
	}).then(() => {
		return utils.idbPut('seth', {
			id: ifname,
			ts: ts,
			ts_end: ts + parseInt((blob.size - 8) / 7) * 5
		});
	}).catch(e => {
		utils.promiseDebug(e);
		dialog.simple(_('Unable to set Seth data, please make sure your browser supports IndexedDB'));
	}).finally(() => {
		page_interface.updateSethInfomationWidget(ifname);
	});
}

page_interface.edit = (ifname) => {
	let editPage = document.getElementById('page_interface_edit');
	if (!editPage.classList.contains('hide')) {
		editPage.classList.add('hide');
	}

	page_interface.ifname = ifname;

	ranga.api.config('interface', ['show', ifname]).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		page_interface.$('proto').value = data.type;
		let tmp = false;
		page_interface.$('nk').value = data.nkplugin;
		page_interface.$('usrnam').value = data.usrnam;
		page_interface.$('passwd').value = data.passwd;
		page_interface.$('ipaddr').value = data.ipaddr;
		page_interface.$('netmask').value = data.netmask;
		page_interface.$('gateway').value = data.gateway;
		tmp = true;
		if (data.defaultroute === '0') tmp = false;
		page_interface.$('defroute').checked = tmp;
		page_interface.$('rvlan').value = data.rvlan;
		page_interface.$('macaddr').value = data.macaddr;

		return page_interface.updateSethInfomationWidget(ifname);
	}).then(() => {
		editPage.classList.remove('hide');
	}).catch(defErrorHandlerPage);
}

page_interface.reload = () => {
	let editPage = document.getElementById('page_interface_edit');
	if (!editPage.classList.contains('hide')) {
		editPage.classList.add('hide');
	}
	let div = document.getElementById('p-interface-iflist');
	div.innerHTML = _('Select the interface you want to configure, or click the upper right button to add a new interface.');
	let itemT = document.getElementById('p-interface-item_t');

	ranga.api.config('interface', ['ls']).then(proto => {
		proto.payload.split('\n').forEach(i => {
			console.log(i);

			let item = itemT.cloneNode(true);
			item.getElementsByClassName('p-interface-item-ifname')[0].textContent = i;
			item.addEventListener('click', ((f, a) => e => f(a))(page_interface.edit, i), false);
			item.classList.remove('hide');
			div.appendChild(item);
		});
	}).catch(defErrorHandlerPage);
}

const page_interface_init = () => {
	webcon.addButton(_('Add'), 'icon-add', b => {
		let d = dialog.show('icon-add', _('Add new interface'), _("Please enter the name of the new interface, which must start with 'md'.") + "<br><br><input style='width: 100%'>", [{
			name: _("Add"),
			func: (d => {
				let ifname = d.getElementsByTagName('input')[0].value;
				ranga.api.config('interface', ['add', ifname]).then(proto => {
					page_interface.reload();
				}).catch(defErrorHandler).finally(() => {
					dialog.close(d);
				})
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
	});

	page_interface.$('set-proto').addEventListener('click', e => {
		let v = page_interface.$('proto').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'type', v]).then(proto => {
			v = page_interface.$('nk').value;
			return ranga.api.config('interface', ['set', page_interface.ifname, 'nkplugin', v]);
		}).then(proto => {
			dialog.toast(_("The protocol type configuration for interface '{0}' has been modified.").format(page_interface.ifname));
		}).catch(defErrorHandler);
	});

	page_interface.$('seth-file').addEventListener('click', e => {
		let file = page_interface.$('seth-input-file');
		file.onchange = e => {
			let file = e.target.files[0];
			let reader = new FileReader();
			let blob = file.slice(0, file.size);
			reader.readAsArrayBuffer(blob);
			page_interface.setSethData(page_interface.ifname, blob);
			dialog.toast(_('Seth data has been updated'));
		}
		file.click();
	});

	page_interface.$('seth-server').addEventListener('click', e => {
		let d = dialog.show('icon-airplane', _('Load From Seth Server'), _("Enter the secret code (Secret).") + "<br><br><input style='width: 100%'>", [{
			name: _("Load"),
			func: (d => {
				let secret = d.getElementsByTagName('input')[0].value;
				if (utils.isNil(secret) || secret == "") {
					dialog.simple(_("Empty code is not supported."));
				} else {
					webcon.lockScreen(_("Downloading Seth data..."));
					utils.ajaxGet2('https://seth-dl.tienetech.tk/data/' + secret, true).catch(e => {
						dialog.simple(_("Download failed, your secret code (Secret) is incorrect, or you have a problem with your Internet connection."));
						return Promise.reject(utils.inhibitorForPromiseErrorHandler);
					}).then(blob => {
						page_interface.setSethData(page_interface.ifname, blob);
						dialog.toast(_('Seth data has been updated'));
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
	});

	page_interface.$('set-auth').addEventListener('click', e => {
		let v = page_interface.$('usrnam').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'usrnam', v]).then(proto => {
			v = page_interface.$('passwd').value;
			return ranga.api.config('interface', ['set', page_interface.ifname, 'passwd', v]);
		}).then(proto => {
			dialog.toast(_("The authentication configuration for interface '{0}' has been modified.").format(page_interface.ifname));
		}).catch(defErrorHandler);
	});

	page_interface.$('set-addr').addEventListener('click', e => {
		let v = page_interface.$('ipaddr').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'ipaddr', v]).then(proto => {
			v = page_interface.$('netmask').value;
			return ranga.api.config('interface', ['set', page_interface.ifname, 'netmask', v]);
		}).then(proto => {
			v = page_interface.$('gateway').value;
			return ranga.api.config('interface', ['set', page_interface.ifname, 'gateway', v]);
		}).then(proto => {
			v = (page_interface.$('defroute').checked ? '1' : '0');
			return ranga.api.config('interface', ['set', page_interface.ifname, 'defaultroute', v]);
		}).then(proto => { 
			dialog.toast(_("The static address configuration for interface '{0}' has been modified.").format(page_interface.ifname));
		}).catch(defErrorHandler);
	});

	page_interface.$('set-mac').addEventListener('click', e => {
		let v = page_interface.$('macaddr').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'macaddr', v]).then(proto => {
			dialog.toast(_("The physical address configuration for interface ‘{0}' has been modified.").format(page_interface.ifname));
		}).catch(defErrorHandler);
	});

	page_interface.$('set-rvlan').addEventListener('click', e => {
		let v = page_interface.$('rvlan').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'rvlan', v]).then(proto => {
			dialog.toast(_("The Reverse VLAN configuration for interface '{0}' has been modified.").format(page_interface.ifname));
		}).catch(defErrorHandler);
	});

	page_interface.$('delete').addEventListener('click', e => {
		ranga.api.config('interface', ['remove', page_interface.ifname]).then(proto => {
			page_interface.reload();
			dialog.toast(_("The interface '{0}' has been deleted.").format(page_interface.ifname));
		}).catch(defErrorHandler);
	});

	page_interface.$('restart').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.action('restart', ['network']).then(proto => {
			page_interface.reload();
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});
	page_interface.reload();
}
