var page_system = {};

page_system.getElementById = id => {
	return document.getElementById('p-system-' + id);
}

const page_system_init = () => {
	page_system.getElementById('syncdate').addEventListener('click', e => {
		let ts = utils.getUNIXTimestamp();
		ranga.api.action('date', ['' + ts]).then(proto => {
			dialog.toast("系统时钟已更新。");
		}).catch(defErrorHandler);
	});

	page_system.getElementById('date').addEventListener('click', e => {
		let ts = parseInt(page_system.getElementById('unixtime').value);
		ranga.api.action('date', ['' + ts]).then(proto => {
			dialog.toast("系统时钟已更新。");
		}).catch(defErrorHandler);
	});

	page_system.getElementById('reboot').addEventListener('click', e => {
		ranga.api.action('restart', ['system']).then(proto => {
			dialog.simple('系统即将重新启动，Web 控制台不会自动刷新。');
		}).catch(defErrorHandler);
	});

	page_system.getElementById('log').addEventListener('click', e => {
		ranga.api.query('log', []).then(proto => {
			dialog.show(null, null, "<pre>" + utils.raw2HTMLString(proto.payload) + "</pre>", [
				{
					name: "保存到文件",
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
					name: "好",
					func: dialog.close
				}
			]);
		}).catch(defErrorHandler);
	});

	page_system.getElementById('chpw').addEventListener('click', e => {
		let passwd = page_system.getElementById('passwd').value,
			passwd2 = page_system.getElementById('passwd2').value;
		if (passwd === '') {
			dialog.simple("不允许使用空白密码");
			return;
		}
		if (passwd !== passwd2) {
			dialog.simple("两次输入的密码不一致，请重新输入");
			return;
		}
		ranga.api.config('misc', ['set-passwd', passwd]).then(proto => {
			dialog.simple("修改密码成功");
		}).catch(defErrorHandler);
	});
}
