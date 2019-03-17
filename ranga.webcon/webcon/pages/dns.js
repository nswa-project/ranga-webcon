var page_dns = {};

page_dns.getElementById = id => {
	return document.getElementById('p-dns-' + id);
}

page_dns.reloadPage = () => {
	selectPage('dns', '域名系统和自动配置');
}

page_dns.remV4Bind = item => {
	let span = item.getElementsByTagName('span')[0];
	let arr = span.textContent.split(',');
	if (arr.length < 2)
		return;

	ranga.api.config('dhcp', ['rem-ipv4-bind', arr[1]]).then(proto => {
		item.parentElement.removeChild(item);
	}).catch(defErrorHandler);
}

page_dns.remDNSServer = item => {
	let span = item.getElementsByTagName('span')[0];
	ranga.api.config('dns', ['rem-server', span.textContent]).then(proto => {
		item.parentElement.removeChild(item);
	}).catch(defErrorHandler);
}

const page_dns_init = () => {
	webcon.lockScreen();
	let itemT = page_dns.getElementById('item_t');
	let div = page_dns.getElementById('binds');
	let div_servers = page_dns.getElementById('servers');

	ranga.api.config('dhcp', ['cat-ipv4-bind']).then(proto => {
		proto.payload.split('\n').forEach(i => {
			if (i === '')
				return;

			console.log(i);

			let item = itemT.cloneNode(true);
			item.getElementsByTagName('span')[0].textContent = i;
			item.getElementsByTagName('button')[0].addEventListener('click', ((f, a) => e => f(a))(page_dns.remV4Bind, item), false);
			item.classList.remove('hide');
			div.appendChild(item);
		});

		return ranga.api.config('dhcp', ['show']);
	}).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);
		page_dns.getElementById('leasetime').value = data.leasetime;
		page_dns.getElementById('start').value = data.start;
		page_dns.getElementById('limit').value = data.limit;

		return ranga.api.config('dns', ['list-server']);
	}).then(proto => {
		console.log();
		proto.payload.split(' ').forEach(i => {
			let server = i.replace(/^'(.+)'$/, '$1');
			if (server === '')
				return;

			let item = itemT.cloneNode(true);
			item.getElementsByTagName('span')[0].textContent = server;
			item.getElementsByTagName('button')[0].addEventListener('click', ((f, a) => e => f(a))(page_dns.remDNSServer, item), false);
			item.classList.remove('hide');
			div_servers.appendChild(item);
		});
		return ranga.api.config('dns', ['show']);
	}).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		let tmp = true;
		if (data.peerdns === '0') tmp = false;
		page_dns.getElementById('peerdns').checked = tmp;

		tmp = false;
		if (data.rebind_protection === '1') tmp = true;
		page_dns.getElementById('rebind_protection').checked = tmp;

		page_dns.getElementById('port').value = data.port;
		page_dns.getElementById('queryport').value = data.queryport;
	}).catch(defErrorHandlerPage).finally(() => {
		webcon.unlockScreen();
	});

	page_dns.getElementById('addbind').addEventListener('click', e => {
		let d = dialog.show('icon-add', '添加绑定', "输入网际网协议版本4地址<br><input style='width: 100%' type=text><br><br>输入媒体访问地址<br><input style='width: 100%' type=text>", [{
			name: "添加",
			func: (d => {
				let inputs = d.getElementsByTagName('input');
				let ipv4addr = inputs[0].value,
					macaddr = inputs[1].value;
				ranga.api.config('dhcp', ['add-ipv4-bind', ipv4addr, macaddr]).then(proto => {
					page_dns.reloadPage();
				}).catch(defErrorHandler);
				dialog.close(d);
			})
		}, {
			name: "取消",
			func: dialog.close
		}]);
		let ipt = dialog.textWidget(d).getElementsByTagName('input')[0];
		ipt.focus();
	});

	page_dns.getElementById('clearbind').addEventListener('click', e => {
		let d = dialog.show('icon-warning', '清除全部绑定', "确定要清除全部绑定吗？", [{
			name: "清除",
			func: (d => {
				ranga.api.config('dhcp', ['clear-ipv4-bind']).then(proto => {
					page_dns.reloadPage();
				}).catch(defErrorHandler);
				dialog.close(d);
			})
		}, {
			name: "取消",
			func: dialog.close
		}]);
	});

	page_dns.getElementById('addserver').addEventListener('click', e => {
		let d = dialog.show('icon-add', '添加上游域名系统服务器', "输入上游域名系统服务器网际网协议版本4地址<br><br><input style='width: 100%' type=text>", [{
			name: "添加",
			func: (d => {
				let addr = d.getElementsByTagName('input')[0].value;
				ranga.api.config('dns', ['add-server', addr]).then(proto => {
					page_dns.reloadPage();
				}).catch(defErrorHandler);
				dialog.close(d);
			})
		}, {
			name: "取消",
			func: dialog.close
		}]);
		let ipt = dialog.textWidget(d).getElementsByTagName('input')[0];
		ipt.focus();
	});

	page_dns.getElementById('restart').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.action('restart', ['dnsdhcp']).then(proto => {}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_dns.getElementById('setdhcp').addEventListener('click', e => {
		let leasetime = page_dns.getElementById('leasetime').value,
			start = page_dns.getElementById('start').value,
			limit = page_dns.getElementById('limit').value;

		ranga.api.config('dhcp', ['set', 'leasetime', leasetime]).then(proto => {
			return ranga.api.config('dhcp', ['set', 'start', start]);
		}).then(proto => {
			return ranga.api.config('dhcp', ['set', 'limit', limit]);
		}).then(proto => {
			dialog.toast("动态主机配置协议配置已经更改。但需要重启动态主机配置服务以生效。");
		}).catch(defErrorHandler);
	});

	page_dns.getElementById('setdns').addEventListener('click', e => {
		let peerdns = (page_dns.getElementById('peerdns').checked ? '1' : '0'),
			rebind_protection = (page_dns.getElementById('rebind_protection').checked ? '1' : '0'),
			port = page_dns.getElementById('port').value,
			queryport = page_dns.getElementById('queryport').value;

		ranga.api.config('dns', ['set', 'peerdns', peerdns]).then(proto => {
			return ranga.api.config('dns', ['set', 'rebind_protection', rebind_protection]);
		}).then(proto => {
			return ranga.api.config('dns', ['set', 'port', port]);
		}).then(proto => {
			return ranga.api.config('dns', ['set', 'queryport', queryport]);
		}).then(proto => {
			dialog.toast("域名系统配置已经更改。但需要重启域名系统服务以生效。");
		}).catch(defErrorHandler);
	});
}
