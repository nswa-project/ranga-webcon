var page_network = {};

page_network.conn = (name, type) => {
	webcon.lockScreen();
	let action = 'up';
	if (type === 'netkeeper' || type === 'pppoe') {
		action = 'dialup';
	}
	let ts = utils.getUNIXTimestamp();
	ranga.api.action('date', ['' + ts]).then(proto => {
		return ranga.api.action('network', [action, name]);
	}).then(proto => {
		page_network.reload();
		webcon.unlockScreen();
	}).catch(proto => {
		page_network.reload();
		webcon.unlockScreen();
		defErrorHandler(proto)
	});
}

page_network.close = (name, type) => {
	webcon.lockScreen();
	ranga.api.action('network', ['down', name]).then(proto => {
		page_network.reload();
		webcon.unlockScreen();
	}).catch(proto => {
		page_network.reload();
		webcon.unlockScreen();
		defErrorHandler(proto)
	});
}

page_network.server = (name, type) => {

}

page_network.reload = () => {
	let div = document.getElementById('page_network_main');
	div.textContent = '';
	let itemT = document.getElementById('p-network-item_t');

	ranga.api.query('network', []).then(proto => {
		proto.payload.split('\n').forEach(i => {
			console.log(i);
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
					btn.addEventListener('click', ((f, a, b) => e => f(a, b))(page_network.server, d[0], d[1]), false);
				}
			}
			item.getElementsByClassName('p-network-item-data')[0].textContent = d[3];
			item.classList.remove('hide');
			div.appendChild(item);
		});
	}).catch(defErrorHandler);
}

const page_network_init = () => {
	webcon.addButton('刷新', 'icon-reload', b => {
		page_network.reload();
	});

	page_network.reload();
}
