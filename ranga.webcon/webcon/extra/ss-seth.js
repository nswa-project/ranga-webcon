let extra_ss_seth = {};

extra_ss_seth.$ = id => {
	return document.getElementById('ex-ss-seth-' + id);
}

extra_ss_seth.remUser = item => {
	let span = item.getElementsByTagName('span')[0];

	ranga.api.config('ss-seth', ['rm', span.textContent]).then(proto => {
		item.parentElement.removeChild(item);
	}).catch(defErrorHandler);
}

extra_ss_seth.reload = () => {
	let itemT = extra_ss_seth.$('item_t');
	let div = extra_ss_seth.$('users');

	div.textContent = '';

	webcon.lockScreen();
	ranga.api.config('ss-seth', ['ls']).then(proto => {
		proto.payload.split('\n').forEach(i => {
			if (i === '')
				return;

			console.log(i);

			let item = itemT.cloneNode(true);
			item.getElementsByTagName('span')[0].textContent = i;
			item.getElementsByTagName('button')[0].addEventListener('click', ((f, a) => e => f(a))(extra_ss_seth.remUser, item), false);
			item.classList.remove('hide');
			div.appendChild(item);
		});
	}).catch(defErrorHandlerPage).finally(() => {
		webcon.unlockScreen();
	});
}

var extra_ss_seth_init = () => {
	extra_ss_seth.reload();

	extra_ss_seth.$('upload').addEventListener('click', e => {
		let files = extra_ss_seth.$('file').files;
		if (!files.length) {
			dialog.simple(_('Please select a file'));
			return;
		}

		let file = files[0];

		new Response(file).arrayBuffer().then(arrayBuffer => {
			let username = utils.sethGetUsername(new Uint8Array(arrayBuffer));
			if (utils.isNil(username)) {
				dialog.simple(_('Seth data file invalid'));
			} else {
				webcon.lockScreen();
				ranga.api.disp_upload('config', 'ss-seth', username, arrayBuffer).catch(defErrorHandlerPage).finally(() => {
					webcon.unlockScreen();
					extra_ss_seth.reload();
				});
			}
		}).catch(e => {
			utils.promiseDebug(e);
			dialog.toast(_('An error occured'));
		});
	});
}
