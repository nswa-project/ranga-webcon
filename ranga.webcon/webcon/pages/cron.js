var page_cron = {};

page_cron.$ = id => {
	return document.getElementById('p-cron-' + id);
}

page_cron.reload = () => {
	webcon.lockScreen();
	let itemT = page_cron.$('item_t');
	let div = page_cron.$('list');
	div.textContent = '';
	ranga.api.config('cron', ['cat']).then(proto => {
		console.log(proto);
		let n = 1;
		proto.payload.split('\n').forEach(i => {
			if (i === '' && n === 1) return;
			let item = itemT.cloneNode(true);
			item.getElementsByTagName('span')[0].textContent = i;
			item.getElementsByTagName('button')[0].addEventListener('click', ((f, a) => e => f(a))(page_cron.rem, n), false);
			item.classList.remove('hide');
			div.appendChild(item);
			n++;
		})
	}).catch(defErrorHandlerPage).finally(() => {
		webcon.unlockScreen();
	});
}

page_cron.rem = n => {
	webcon.lockScreen();
	ranga.api.config('cron', ['rem', '' + n]).then(proto => {}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
		page_cron.reload();
	});
}

page_cron.actionsList = [
	["ranga.ext.base", "reboot", ""],
	["ranga.ext.base", "wireless", "restart"],
	["ranga.ext.base", "wireless", "rfkill.down"],
	["ranga.ext.base", "wireless", "rfkill.up"]
];

const page_cron_init = () => {
	webcon.addButton(_('Add'), 'icon-add', b => {
		let add = page_cron.$('add');
		if (add.classList.contains('hide')) {
			add.classList.remove('hide');
		}
	});

	page_cron.$('add-hide').addEventListener('click', e => {
		let add = page_cron.$('add');
		if (!add.classList.contains('hide')) {
			add.classList.add('hide');
		}
	});

	page_cron.$('add-actions').addEventListener('change', e => {
		let pkgname = page_cron.$('add-pkgname'),
			cron = page_cron.$('add-cron'),
			args = page_cron.$('add-args');

		let value = parseInt(page_cron.$('add-actions').value);
		if (value === -1) {
			pkgname.disabled = false;
			cron.disabled = false;
			args.disabled = false;
		} else {
			pkgname.disabled = true;
			cron.disabled = true;
			args.disabled = true;

			pkgname.value = page_cron.actionsList[value][0];
			cron.value = page_cron.actionsList[value][1];
			args.value = page_cron.actionsList[value][2];
		}
	});

	page_cron.$('add-add').addEventListener('click', e => {
		let pkgname = page_cron.$('add-pkgname').value,
			cron = page_cron.$('add-cron').value,
			args = page_cron.$('add-args').value,
			m = page_cron.$('add-m').value,
			h = page_cron.$('add-h').value,
			d = page_cron.$('add-d').value,
			month = page_cron.$('add-month').value,
			w = page_cron.$('add-w').value;

		webcon.lockScreen();
		ranga.api.config('cron', ['add', pkgname, cron, args, m, h, d, month, w]).then(proto => {
			page_cron.$('add').classList.add('hide');
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
			page_cron.reload();
		});
	});

	page_cron.$('restart').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.action('restart', ['cron']).then(proto => {}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});

	page_cron.$('clear').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.config('cron', ['clear']).then(proto => {}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
			page_cron.reload();
		});
	});

	page_cron.reload();
}
