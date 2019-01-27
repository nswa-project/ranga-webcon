var utils = {};

utils.formatBytes = (bytes, decimals) => {
	if (bytes == 0) return '0 Bytes';
	let k = 1024;
	let dm = decimals <= 0 ? 0 : decimals || 2;
	//let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let sizes = ['字节', '千字节', '兆字节', '吉字节', '太字节', '拍字节', '艾字节', '泽字节', '尧字节'];
	let i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

utils.ajaxGet = uri => {
	const promise = new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(xhr.responseText);
				} else {
					reject(xhr.status);
				}
			}
		}

		xhr.open("GET", uri, true);
		xhr.send();
	});

	return promise;
}
