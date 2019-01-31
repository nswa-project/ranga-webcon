var page_update = {};

const page_update_init = () => {
	document.getElementById('p-update-upload').addEventListener('click', e => {
		let files = document.getElementById('p-update-file').files;
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
			swdeploy.start(blob);
		})
	});
}
