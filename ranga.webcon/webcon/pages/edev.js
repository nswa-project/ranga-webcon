var page_edev = {};

page_edev.$ = id => {
	return document.getElementById('p-edev-' + id);
}

page_edev.reloadMountStatus = () => {
	page_edev.$('df').classList.add('hide');

	webcon.lockScreen();
	ranga.api.action('block', ['mainfs-stat']).then(proto => {
		console.log(proto.payload);
		if (proto.payload.startsWith('MOUNTED')) {
			page_edev.$('mainfs').textContent = _('The main file system is mounted');

			let tmp = proto.payload.split('\n')[1];
			if (!utils.isNil(tmp)) {
				let arr = tmp.split(',');
				if (arr.length >= 2) {
					let used = parseInt(arr[0]);
					let free = parseInt(arr[1]);
					let use = "" + ((used / (used + free)) * 100) + "%";
					page_edev.$('df').classList.remove('hide');
					page_edev.$('df-text').textContent = _('Used: {0}, remaining: {1}').format(utils.formatBytes(used * 1024), utils.formatBytes(free * 1024));
					page_edev.$('df-pb').style.width = use;
				}
			}
		} else {
			page_edev.$('mainfs').textContent = _('Unmounted main file system');
		}
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
	});
}

page_edev.umountPoll = () => {
	return utils.delay(1000).then(v => {
		return ranga.api.action('block', ['mainfs-stat']);
	}).then(proto => {
		if (!utils.isNil(page_edev.$('mainfs'))) {
			let needPoll = true;

			if (proto.payload.startsWith('NOT-MOUNTED')) {
				needPoll = false;
				page_edev.reloadMountStatus();
			}

			if (needPoll)
				return page_edev.umountPoll();
		}
	}).catch(e => {
		defErrorHandler(e);
	});
}

const page_edev_init = () => {
	let div = page_edev.$('usb');
	div.textContent = '';
	let itemT = page_edev.$('item_t');

	webcon.lockScreen();
	ranga.api.action('usb', ['ls']).then(proto => {
		let arr = proto.payload.split('\n\n'),
			sum = 0;
		arr.forEach(i => {
			if (i === "")
				return;

			sum++;

			let vid = (i.match(/Vendor=([^ ]+) /) || ["", ""])[1],
				pid = (i.match(/ProdID=([^ ]+) /) || ["", ""])[1],
				bus = (i.match(/Bus=([^ ]+) /) || ["", ""])[1],
				dev = (i.match(/Dev#=([^ ]+) /) || ["", ""])[1],
				manu = (i.match(/Manufacturer=(.+)/) || ["", ""])[1],
				prod = (i.match(/Product=(.+)/) || ["", ""])[1];
			console.log(vid + " " + pid + " " + manu + " " + prod);

			let item = itemT.cloneNode(true);
			item.getElementsByClassName('p-edev-item-prod')[0].textContent = prod;
			item.getElementsByClassName('p-edev-item-info')[0].innerHTML = _("Manufacturer: {0}<br>Device ID: {1}:{2} Bus: {3} Device Location: {4}").format(utils.raw2HTMLString(manu), vid, pid, bus, dev);

			item.classList.remove('hide');
			div.appendChild(item);
		});

		if (sum === 0) {
			div.textContent = _('No "Universal Serial Bus" devices found on your device');
		}

		page_edev.reloadMountStatus();
	}).catch(proto => {
		if (!utils.isNil(proto)) {
			if ('disp-target-notfound' in proto) {
				div.textContent = _('Sorry, your device does not have Universal Serial Bus support enabled.');
			} else {
				defErrorHandlerPage(proto);
			}
		} else {
			defErrorHandlerPage(proto);
		}
	}).finally(() => {
		webcon.unlockScreen();
	});

	page_edev.$('umount').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.action('block', ['umount-mainfs']).then(proto => {
			dialog.toast(_('Please wait patiently for the device to complete the uninstall...'));
			page_edev.umountPoll();
		}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});
}
