var utils = {};

utils.getUNIXTimestamp = () => {
	return parseInt(new Date().getTime() / 1000);
}

utils.formatBytes = (bytes, decimals) => {
	if (bytes == 0) return '0 Bytes';
	let k = 1024;
	let dm = decimals <= 0 ? 0 : decimals || 2;
	//let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let sizes = ['字节', '千字节', '兆字节', '吉字节', '太字节', '拍字节', '艾字节', '泽字节', '尧字节'];
	let i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

utils.ajaxGet2 = (uri, blob) => {
	const promise = new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();

		if (blob)
			xhr.responseType = 'arraybuffer';

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(blob ? xhr.response : xhr.responseText);
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

utils.ajaxGet = uri => {
	return utils.ajaxGet2(uri, false);
}

utils.pageAddSection = (div, title) => {
	let t = document.createElement('h1');
	t.textContent = title;
	div.appendChild(t);
}

utils.raw2HTMLString = raw => {
	return raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

utils.getLocalStorageItem = key => {
	try {
		var v = localStorage.getItem(key);
		return v;
	} catch (e) {
		return '';
	}
}

utils.isNil = value => {
	return (typeof value === 'undefined' || value === null);
}

utils.isProto = object => {
	try {
		return ('_ranga_proto_data' in object);
	} catch (e) {
		return false;
	}
}

utils.promiseDebug = e => {
	if (utils.isNil(e))
		return;
	if (!(e instanceof Object)) {
		console.log("utils.promiseDebug: unexpected type!");
		console.log(e);
		return;
	}

	if ('_ranga_proto_data' in e) {
		console.log(e)
	} else if ('message' in e && 'stack' in e) {
		console.error(e.message);
		console.error(e.stack);
	}
}

utils.delay = (t, v) => {
	return new Promise(function (resolve) {
		setTimeout(resolve.bind(null, v), t)
	});
}

utils.URIDomain = uri => {
	var url = new URL(uri);
	return url.hostname;
}

utils.idbPut = (table, data) => {
	const promise = new Promise((resolve, reject) => {
		let request = indexedDB.open('webcon', 1);
		request.onerror = function (event) {
			console.log('indexedDB open error');
			reject();
		};

		request.onsuccess = function (event) {
			let tran = request.result.transaction([table], 'readwrite')
				.objectStore(table)
				.put(data);

			tran.onsuccess = function (event) {
				resolve();
			};

			tran.onerror = function (event) {
				console.log('indexedDB update error');
				reject();
			}
		};

		request.onupgradeneeded = function (event) {
			let db = event.target.result;
			if (!db.objectStoreNames.contains(table)) {
				db.createObjectStore(table, {
					keyPath: 'id'
				});
			}
		}
	});

	return promise;
}

utils.idbGet = (table, id) => {
	const promise = new Promise((resolve, reject) => {
		let request = indexedDB.open('webcon', 1);
		request.onerror = function (event) {
			console.log('indexedDB open error');
			reject();
		};
		request.onsuccess = function (event) {
			let tran = request.result.transaction([table])
				.objectStore(table)
				.get(id);

			tran.onsuccess = function (event) {
				resolve(tran.result);
			};

			tran.onerror = function (event) {
				console.log('indexedDB read error');
				reject();
			}
		};
		request.onupgradeneeded = function (event) {
			let db = event.target.result;
			if (!db.objectStoreNames.contains(table)) {
				db.createObjectStore(table, {
					keyPath: 'id'
				});
			}
		}
	});

	return promise;
}

utils.idbRemove = (table, id) => {
	const promise = new Promise((resolve, reject) => {
		let request = indexedDB.open('webcon', 1);
		request.onerror = function (event) {
			console.log('indexedDB open error');
			reject();
		};
		request.onsuccess = function (event) {
			let tran = request.result.transaction([table], 'readwrite')
				.objectStore(table)
				.delete(id);

			tran.onsuccess = function (event) {
				resolve(tran.result);
			};

			tran.onerror = function (event) {
				console.log('indexedDB remove error');
				reject();
			}
		};
		request.onupgradeneeded = function (event) {
			let db = event.target.result;
			if (!db.objectStoreNames.contains(table)) {
				db.createObjectStore(table, {
					keyPath: 'id'
				});
			}
		}
	});

	return promise;
}
