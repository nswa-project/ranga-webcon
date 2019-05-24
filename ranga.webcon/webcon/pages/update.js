var page_update = {};

page_update.$ = id => {
	return document.getElementById('p-update-' + id);
}

const page_update_init = () => {
	page_update.$('upload').addEventListener('click', e => {
		let files = page_update.$('file').files;
		if (!files.length) {
			dialog.simple('请选择一个文件');
			return;
		}

		let file = files[0];
		let start = 0;
		let stop = file.size - 1;

		let reader = new FileReader();
		let blob = file.slice(start, stop + 1);
		reader.readAsArrayBuffer(blob);

		webcon.loadScript('swdeploy', 'scripts/swdeploy.js?v=__RELVERSION__').then(e => {
			swdeploy.reboot = page_update.$('reboot').checked;
			if (page_update.$('fpearseconfig').checked) {
				ranga.api.swdeploy.action('fp_earse_configure');
			}
			swdeploy.start(blob);
			swdeploy.reboot = false;
		})
	});
}
