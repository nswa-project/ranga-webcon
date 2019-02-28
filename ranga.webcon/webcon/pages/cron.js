var page_cron = {};

page_cron.getElementById = id => {
	return document.getElementById('p-cron-' + id);
}

const page_cron_init = () => {
	webcon.lockScreen();
	ranga.api.config('cron', ['cat']).then(proto => {
		let itemT = page_cron.getElementById('item_t');
		let div = page_cron.getElementById('list');
		console.log(proto);
		let i = 1;
		proto.payload.split('\n').forEach(i => {
			let item = itemT.cloneNode(true);
			item.getElementsByTagName('span')[0].textContent = i;
			item.getElementsByTagName('button')[0].addEventListener('click', ((f, a) => e => f(a))(page_cron.rem, i), false);
			item.classList.remove('hide');
			div.appendChild(item);
			i++;
		})
	}).catch(defErrorHandlerPage).finally(() => {
		webcon.unlockScreen();
	});

	webcon.addButton('添加', 'icon-add', b => {

	});

	page_cron.getElementById('restart').addEventListener('click', e => {
		webcon.lockScreen();
		ranga.api.action('restart', ['cron']).then(proto => {}).catch(defErrorHandler).finally(() => {
			webcon.unlockScreen();
		});
	});
}
