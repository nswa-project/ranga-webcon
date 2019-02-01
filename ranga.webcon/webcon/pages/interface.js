var page_interface = {};

page_interface.ifname = '';

page_interface.getElementById = id => {
	return document.getElementById('p-interface-' + id);
}

page_interface.edit = (ifname) => {
	let editPage = document.getElementById('page_interface_edit');
	if (!editPage.classList.contains('hide')) {
		editPage.classList.add('hide');
	}
	ranga.api.config('interface', ['show', ifname]).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		page_interface.getElementById('proto').value = data.type;
		let tmp = false;
		if (data.nkplugin === 'on') tmp = true;
		page_interface.getElementById('nk').checked = tmp;
		page_interface.getElementById('usrnam').value = data.usrnam;
		page_interface.getElementById('passwd').value = data.passwd;
		page_interface.getElementById('ipaddr').value = data.ipaddr;
		page_interface.getElementById('netmask').value = data.netmask;
		page_interface.getElementById('gateway').value = data.gateway;
		tmp = true;
		if (data.defaultroute === '0') tmp = false;
		page_interface.getElementById('defroute').checked = tmp;
		page_interface.getElementById('rvlan').value = data.rvlan;
		page_interface.getElementById('macaddr').value = data.macaddr;

		page_interface.ifname = ifname;
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

	page_interface.getElementById('set-proto').addEventListener('click', e => {
		let v = page_interface.getElementById('proto').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'type', v]).then(proto => {
			v = (page_interface.getElementById('nk').checked ? 'on' : 'off');
			return ranga.api.config('interface', ['set', page_interface.ifname, 'nkplugin', v]);
		}).catch(defErrorHandler);
	});

	page_interface.getElementById('set-auth').addEventListener('click', e => {
		let v = page_interface.getElementById('usrnam').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'usrnam', v]).then(proto => {
			v = page_interface.getElementById('passwd').value;
			return ranga.api.config('interface', ['set', page_interface.ifname, 'passwd', v]);
		}).catch(defErrorHandler);
	});

	page_interface.getElementById('set-addr').addEventListener('click', e => {
		let v = page_interface.getElementById('ipaddr').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'ipaddr', v]).then(proto => {
			v = page_interface.getElementById('netmask').value;
			return ranga.api.config('interface', ['set', page_interface.ifname, 'netmask', v]);
		}).then(proto => {
			v = page_interface.getElementById('gateway').value;
			return ranga.api.config('interface', ['set', page_interface.ifname, 'gateway', v]);
		}).then(proto => {
			v = (page_interface.getElementById('defroute').checked ? '1' : '0');
			return ranga.api.config('interface', ['set', page_interface.ifname, 'defaultroute', v]);
		}).catch(defErrorHandler);
	});

	page_interface.getElementById('set-mac').addEventListener('click', e => {
		let v = page_interface.getElementById('macaddr').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'macaddr', v]).then(proto => {}).catch(defErrorHandler);
	});

	page_interface.getElementById('set-rvlan').addEventListener('click', e => {
		let v = page_interface.getElementById('rvlan').value;
		ranga.api.config('interface', ['set', page_interface.ifname, 'rvlan', v]).then(proto => {}).catch(defErrorHandler);
	});

	page_interface.getElementById('delete').addEventListener('click', e => {
		ranga.api.config('interface', ['remove', page_interface.ifname]).then(proto => {
			page_interface.reload();
		}).catch(defErrorHandler);
	});

	page_interface.getElementById('restart').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.action('restart', ['network']).then(proto => {
			page_interface.reload();
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});
	page_interface.reload();
}
