var page_addon = {};

page_addon.getElementById = id => {
	return document.getElementById('p-addon-' + id);
}

page_addon.reloadPage = () => {
	selectPage('addon', '附加组件');
}

page_addon.extInfoShow = pkgname => {
	let extinfo = page_addon.getElementById('extinfo');
	ranga.api.addonInfo(pkgname).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		page_addon.getElementById('extinfo-name').textContent = data['%name'];
		page_addon.getElementById('extinfo-version').textContent = "版本: " + data['%ver'];
		page_addon.getElementById('extinfo-author').textContent = "作者: " + data['%author'];
		page_addon.getElementById('extinfo-api').textContent = "API 版本: " + data['%api'];
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

page_addon.extensionItem = pkgname => {
	let itemT = page_addon.getElementById('item_t');
	let div = page_addon.getElementById('exts');

	return ranga.api.addonInfo(pkgname).then(proto => {
		let data = ranga.parseProto(proto.payload + "\n\n");
		console.log(data);

		let item = itemT.cloneNode(true);
		item.getElementsByClassName('p-addon-item-name')[0].textContent = data['%name'];
		item.getElementsByClassName('p-addon-item-version')[0].textContent = pkgname + " 版本: " + data['%ver'];
		item.getElementsByClassName('p-addon-item-author')[0].textContent = data['%author'];
		item.getElementsByTagName('button')[0].addEventListener('click', ((f, a) => e => f(a))(page_addon.extInfoShow, pkgname));
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
	webcon.addButton('安装新扩展程序', 'icon-add', b => {
		let d = dialog.show('icon-add', '安装新扩展程序', "安装第三方扩展程序可能对 NSWA Ranga 系统性能和稳定性产生不良影响。请仅在十分清楚的情况下继续操作。通过 Web 控制台上传扩展程序是具有实验性的，且你的浏览器必须足够新以支持目前仅仅是 Web 工作草案的 File API。<br><br>选择扩展程序包：<input type=file accept='.zip,.npks' /><br>", [{
			name: "上传",
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
			name: "取消",
			func: dialog.close
		}]);
	});

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
			item.getElementsByClassName('p-addon-item-name')[0].textContent = data['name[zh_CN]'] || data['name'];
			item.getElementsByClassName('p-addon-item-version')[0].textContent = data['version'];
			descdiv.textContent = data['desc'];
			item.getElementsByTagName('button')[0].classList.add('hide');
			item.classList.remove('hide');

			descdiv.innerHTML += '<br>';

			let actionsString = data['actions[zh_CN]'] || data['actions'];
			actionsString.split('|').forEach(j => {
				let arr = j.split('@');
				if (arr.length < 2)
					return;

				let a = document.createElement('a');
				a.textContent = arr[0];
				a.target = '_blank';
				a.href = arr[1];
				a.style.marginRight = '10px';
				descdiv.appendChild(a);
			});

			div.appendChild(item);
		});

		if (n === 0) {
			div.innerHTML = '<div class=tips style="text-align: center">你的系统未安装任何组件</div>';
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
			window.location.href = '/';
		}).catch(defErrorHandler);
	});

	page_addon.getElementById('closeextinfo').addEventListener('click', e => {
		page_addon.extInfoHide();
	});
}