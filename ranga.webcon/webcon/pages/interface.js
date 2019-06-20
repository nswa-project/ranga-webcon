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
			widget.textContent = '此数据声称它可以在 "' + utils.UNIXToDateString(r.ts) + '" 到 "' + utils.UNIXToDateString(r.ts_end) + '" 内有效。';
		} else {
			widget.textContent = '此接口未配置 Seth 数据，或缺失元数据，这可能是你的浏览器删除了相关数据。';
		}
	}).catch(e => {
		utils.promiseDebug(e);
		widget.textContent = '此接口未配置 Seth 数据，或缺失元数据，这可能是你的浏览器删除了相关数据。';
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
		dialog.simple('无法设置 Seth 数据，请确保你的浏览器支持 IndexedDB');
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
	div.innerHTML = '选择你要配置的接口，或者点击右上方按钮添加新的接口';
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
	webcon.addButton('添加', 'icon-add', b => {
		let d = dialog.show('icon-add', '添加新接口', "请输入新接口的名字，必须以 'md' 开头<br><br><input style='width: 100%'>", [{
			name: "添加",
			func: (d => {
				let ifname = d.getElementsByTagName('input')[0].value;
				ranga.api.config('interface', ['add', ifname]).then(proto => {
					page_interface.reload();
				}).catch(defErrorHandler).finally(() => {
					dialog.close(d);
				})
			})
		}, {
			name: "取消",
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
			dialog.toast("接口 ‘" + page_interface.ifname + "' 的协议类型配置已经被修改。");
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
			dialog.toast('Seth 数据已经更新');
		}
		file.click();
	});

	page_interface.$('seth-server').addEventListener('click', e => {
		let d = dialog.show('icon-airplane', '从 Seth 服务器设置', "输入秘密代码（Secret）。<br><br><input style='width: 100%'>", [{
			name: "部署",
			func: (d => {
				let secret = d.getElementsByTagName('input')[0].value;
				if (utils.isNil(secret) || secret == "") {
					dialog.simple("空的代码不被支持。");
				} else {
					webcon.lockScreen("正在下载 Seth 数据...");
					utils.ajaxGet2('https://seth-dl.tienetech.tk/data/' + secret, true).catch(e => {
						dialog.simple("下载失败，你的秘密代码（Secret）不正确，或者你的网络连接有问题。");
						return Promise.reject(utils.inhibitorForPromiseErrorHandler);
					}).then(blob => {
						page_interface.setSethData(page_interface.ifname, blob);
						dialog.toast('Seth 数据已经更新');
					}).catch(defErrorHandler).finally(() => {
						webcon.unlockScreen();
					});
				}
				dialog.close(d);
			})
		}, {
			name: "取消",
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
			dialog.toast("接口 ‘" + page_interface.ifname + "' 的认证信息配置已经被修改。");
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
			dialog.toast("接口 ‘" + page_interface.ifname + "' 的静态地址配置已经被修改。");
		}).catch(defErrorHandler);
	});

	page_interface.$('set-mac').addEventListener('click', e => {
		let v = page_interface.$('macaddr').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'macaddr', v]).then(proto => {
			dialog.toast("接口 ‘" + page_interface.ifname + "' 的网卡物理地址配置已经被修改。");
		}).catch(defErrorHandler);
	});

	page_interface.$('set-rvlan').addEventListener('click', e => {
		let v = page_interface.$('rvlan').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'rvlan', v]).then(proto => {
			dialog.toast("接口 ‘" + page_interface.ifname + "' 的 Reverse VLAN 配置已经被修改。");
		}).catch(defErrorHandler);
	});

	page_interface.$('delete').addEventListener('click', e => {
		ranga.api.config('interface', ['remove', page_interface.ifname]).then(proto => {
			page_interface.reload();
			dialog.toast("接口 ‘" + page_interface.ifname + "' 已经被删除。");
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
