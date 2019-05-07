var page_network = {};

page_network.getElementById = id => {
	return document.getElementById('p-network-' + id);
}

page_network.synctime = type => {
	if (utils.getLocalStorageItem('disable-netkeeper-timesync') === 'true' || type !== 'netkeeper') {
		return Promise.resolve();
	}

	let ts = utils.getUNIXTimestamp();
	return ranga.api.action('date', ['' + ts]);
}

page_network.conn = (name, type) => {
	webcon.lockScreen('正在连接，请稍候...');
	let action = 'up';
	if (type === 'netkeeper' || type === 'pppoe') {
		action = 'dialup';
	}

	page_network.synctime(type).then(proto => {
		return ranga.api.action('network', [action, name]);
	}).then(proto => {
		dialog.toast("接口 ‘" + name + "' 已连接。");
	}).catch(proto => {
		defErrorHandler(proto);
		if (type === 'netkeeper' && !(utils.isNil(proto))) {
			if (proto.code === '7') {
				webcon.loadScript('doctor', 'scripts/doctor.js?v=__RELVERSION__').then(() => {
					doctor.notify();
				});
			}
		}
	}).finally(() => {
		webcon.unlockScreen();
		page_network.reload();
	});
}

page_network.close = (name, type) => {
	webcon.lockScreen();
	ranga.api.action('network', ['down', name]).then(proto => {
		dialog.toast("已断开接口 ‘" + name + "' 的连接。");
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
		page_network.reload();
	});
}

page_network.serverPoll = (dlg, ifname) => {
	return utils.delay(1000).then(v => {
		return ranga.api.action('network', ['server-status']);
	}).then(proto => {
		let status = parseInt(proto.payload);
		let needPoll = true;
		console.log("page_network.serverPoll: status: " + status);

		switch (status) {
			case 1:
				webcon.updateScreenLockTextWidget(dlg, '拦截服务器启动中 (' + ifname + ')');
				break;
			case 2:
				webcon.updateScreenLockTextWidget(dlg, '拦截服务器已经准备就绪 (' + ifname + ')');
				break;
			case 3:
				webcon.updateScreenLockTextWidget(dlg, '拦截服务器已捕获认证信息 (' + ifname + ')');
				break;
			case 4:
				webcon.unlockScreen();
				needPoll = false;
				page_network.reload();
				dialog.toast("接口 ‘" + ifname + "' 的拦截过程已经结束。");
				break;
			case 5:
				webcon.unlockScreen();
				needPoll = false;
				dialog.simple('拦截服务器已超时 (' + ifname + ')');

				console.log('onekey: stop');
				stopStartServer = true;
				break;
		}

		if (needPoll)
			return page_network.serverPoll(dlg, ifname);
	}).catch(e => {
		defErrorHandler(e);
		console.log('onekey: stop');
		stopStartServer = true;
	});
}

page_network.server = (name, type) => {
	let dlg = webcon.lockScreen();
	ranga.api.action('network', ['start-server', name]).then(proto => {
		page_network.serverPoll(dlg, name);
	}).catch(e => {
		defErrorHandler(e);
		webcon.unlockScreen();
	});
}

page_network.reload = () => {
	let div = document.getElementById('page_network_main');
	div.textContent = '';
	let itemT = document.getElementById('p-network-item_t');

	let f_scdial_enable = false;

	return ranga.api.query('network', []).then(proto => {
		proto.payload.split('\n').forEach(i => {
			console.log(i);
			if (i.startsWith('!')) {
				switch (i) {
					case "!scdial-is-enabled":
						f_scdial_enable = true;
						break;
				}
				return;
			}

			let d = i.split(':');
			if (d.length < 4) return;

			let item = itemT.cloneNode(true);
			item.getElementsByClassName('p-network-item-ifname')[0].textContent = d[0];
			item.getElementsByClassName('p-network-item-type')[0].textContent = webcon.trKeyword(d[1]);

			if (parseInt(d[2]) === 1) {
				let btn = item.getElementsByClassName('p-network-item-btn-close')[0];
				btn.classList.remove('hide');
				btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.close, d[0], d[1]), false);
			} else {
				let btn = item.getElementsByClassName('p-network-item-btn-conn')[0];
				btn.classList.remove('hide');
				btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.conn, d[0], d[1]), false);
				if (d[1] === 'netkeeper') {
					btn = item.getElementsByClassName('p-network-item-btn-server')[0];
					btn.classList.remove('hide');
					if (f_scdial_enable) {
						btn.disabled = true;
					} else {
						btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.server, d[0], d[1]), false);
					}
				}
			}

			let stat = d[3].split(',');
			if (stat.length >= 2) {
				item.getElementsByClassName('p-network-item-data')[0].innerHTML = "已发送: " + utils.formatBytes(stat[1]) + "&nbsp;&nbsp;&nbsp;已接收: " + utils.formatBytes(stat[0]);
			}

			item.classList.remove('hide');
			div.appendChild(item);

			if (d[0] === 'netkeeper' && parseInt(d[2]) === 1) {
				webcon.setupOnlineScript();
			}
		});

		if (f_scdial_enable) {
			page_network.getElementById('scdial').classList.remove('hide');
		}
	}).catch(defErrorHandler);
}

var stopStartServer = false;

const page_network_init = () => {
	webcon.addButton('刷新', 'icon-reload', b => {
		b.disabled = true;
		page_network.reload().finally(() => (b.disabled = false));
	});

	let extra_tools_arr = [
		{
			name: 'Seth 安全断开',
			func: (n => {
				dialog.show("icon-info", "Seth 安全断开", "使用 Seth 安全断开的账户，只要当前同步的 Seth 数据在当下有效，并且断开后账户不在其他地方连接，则下次可以免同步 Seth 数据进行拨号！Seth 安全断开适合于准备进行重启或关机前执行，因为 Seth 数据存储在设备的内存中，断电后将会丢失（由于 NSWA Ranga 主要采用擦除寿命很有限的闪存，而数据很大且频繁被更新，如果存储在闪存将会影响设备寿命）。Seth 安全断开不会断开未启用 <b>Seth_v1</b> Netkeeper 扩展的接口", [
					{
						name: '我知道了',
						func: (d => {
							webcon.lockScreen();
							ranga.api.action('seth', ['safe-hangup']).then(proto => {
								return utils.delay(800);
							}).then(() => {
								page_network.reload();
								dialog.toast('Seth 安全断开完成');
							}).catch(defErrorHandler).finally(() => {
								webcon.unlockScreen();
							})
							dialog.close(d);
						})
					}
				])
			})
			}, {
			name: '拨号医生',
			func: (n => {
				dialog.show(null, null, "请注意：<b>直接运行拨号医生可能报告完全错误的诊断结果</b>，在连接（拦截法除外）失败时，拨号医生会自动弹出通知以启动，这时的结果正确率较高。但你仍然可以随时强制启动拨号医生，以诊断拦截法或上次自动拨号的连接问题，但结果可能不准确甚至完全错误。", [
					{
						name: '我知道了',
						func: (d => {
							webcon.loadScript('doctor', 'scripts/doctor.js?v=__RELVERSION__').then(() => {
								doctor.analysis();
							});
							dialog.close(d);
						})
					}
				])
			})
		}
	];

	if (utils.getLocalStorageItem('exp-onekey') === 'true') {
		extra_tools_arr.push({
			name: '为所有 NK 接口启动拦截',
			func: (n => {
				webcon.lockScreen('正在获取接口信息...')
				ranga.api.query('network', []).then(proto => {
					let arr = proto.payload.split('\n');

					var currentPromise = Promise.resolve();
					stopStartServer = false;

					webcon.unlockScreen();
					for (let i = 0; i < arr.length; i++) {
						if (arr[i] === '') continue;
						let d = arr[i].split(':');
						if (d.length < 4) continue;
						if (parseInt(d[2]) === 1 || d[1] !== 'netkeeper') continue;
						let ifname = d[0];
						currentPromise = currentPromise.then(() => {
							if (stopStartServer) return Promise.resolve();
							let dlg = webcon.lockScreen();
							console.log('onekey: start: ' + ifname);
							webcon.updateScreenLockTextWidget(dlg, '准备：' + ifname);
							return ranga.api.action('network', ['start-server', ifname]).then(proto => {
								console.log('onekey: polling: ' + ifname);
								return page_network.serverPoll(dlg, ifname);
							});
						});
					}
					return currentPromise;
				}).catch(defErrorHandler).finally(() => {
					console.log('onekey: finally');
					webcon.unlockScreen();
				});
			})
		});
	}
	webcon.addButton('额外工具', 'icon-tool', b => webcon.dropDownMenu(b, extra_tools_arr));

	page_network.reload();
}
