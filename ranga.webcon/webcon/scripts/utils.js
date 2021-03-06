var utils = {};

utils.inhibitorForPromiseErrorHandler = {};

utils.getUNIXTimestamp = () => {
	return parseInt(new Date().getTime() / 1000);
}

utils.UNIXToDateString = timestamp => {
	return new Date(timestamp * 1000).toString();
}

utils.formatBytes = (bytes, decimals) => {
	if (bytes == 0) return '0 Bytes';
	let k = 1024;
	let dm = decimals <= 0 ? 0 : decimals || 2;
	let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	//let sizes = ['字节', '千字节', '兆字节', '吉字节', '太字节', '拍字节', '艾字节', '泽字节', '尧字节'];
	let i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + i18n.tr(sizes[i]);
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

utils.isFailedProto = object => {
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
/*
utils.ArrayBufferToHexedString = buffer => {
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
*/
utils.__idbCreateTable = (event, table) => {
	let db = event.target.result;
	if (!db.objectStoreNames.contains(table)) {
		db.createObjectStore(table, {
			keyPath: 'id'
		});
	}
}

utils.idbPut = (table, data) => {
	const promise = new Promise((resolve, reject) => {
		let request = indexedDB.open(table, 1);
		request.onerror = function (event) {
			console.log('indexedDB open error');
			reject();
		};

		request.onsuccess = function (event) {
			let tran = request.result.transaction([table], 'readwrite').objectStore(table).put(data);

			tran.onsuccess = function (event) {
				resolve();
			};

			tran.onerror = function (event) {
				console.log('indexedDB update error');
				reject();
			}
		};

		request.onupgradeneeded = function (event) {
			utils.__idbCreateTable(event, table);
		}
	});

	return promise;
}

utils.idbGet = (table, id) => {
	const promise = new Promise((resolve, reject) => {
		let request = indexedDB.open(table, 1);
		request.onerror = function (event) {
			console.log('indexedDB open error');
			reject();
		};
		request.onsuccess = function (event) {
			let tran = request.result.transaction([table]).objectStore(table).get(id);
			tran.onsuccess = function (event) {
				resolve(tran.result);
			};
			tran.onerror = function (event) {
				console.log('indexedDB read error');
				reject();
			}
		};
		request.onupgradeneeded = function (event) {
			utils.__idbCreateTable(event, table);
		}
	});

	return promise;
}

utils.idbRemove = (table, id) => {
	const promise = new Promise((resolve, reject) => {
		let request = indexedDB.open(table, 1);
		request.onerror = function (event) {
			console.log('indexedDB open error');
			reject();
		};
		request.onsuccess = function (event) {
			let tran = request.result.transaction([table], 'readwrite').objectStore(table).delete(id);

			tran.onsuccess = function (event) {
				resolve(tran.result);
			};

			tran.onerror = function (event) {
				console.log('indexedDB remove error');
				reject();
			}
		};
		request.onupgradeneeded = function (event) {
			utils.__idbCreateTable(event, table);
		}
	});

	return promise;
}

utils.BigEdtionToBrowserHost = uint8array => {
	return parseInt(Array.prototype.map.call(uint8array, x => ('00' + x.toString(16)).slice(-2)).join(''), 16);
	//return parseInt(utils.ArrayBufferToHexedString(uint8array), 16);
}

utils.concatTypedArrays = (a, b) => {
	let c = new(a.constructor)(a.length + b.length);
	c.set(a, 0);
	c.set(b, a.length);
	return c;
}

utils.__sethValid = uint8Array => {
	if (uint8Array[0] === 0x23 && uint8Array[1] === 0x33 &&
		utils.BigEdtionToBrowserHost(uint8Array.subarray(2, 4)) === 3)
		return true;
	return false;
}

utils.sethGetMetadata = uint8Array => {
	if (!utils.__sethValid(uint8Array))
		return null;

	let start = utils.BigEdtionToBrowserHost(uint8Array.subarray(8, 16)),
		cycle = utils.BigEdtionToBrowserHost(uint8Array.subarray(4, 8)),
		offset = utils.BigEdtionToBrowserHost(uint8Array.subarray(16, 20)),
		length = uint8Array.length - offset,
		lpg = utils.BigEdtionToBrowserHost(uint8Array.subarray(20, 24));
	return {
		start: start,
		end: start + parseInt(length / lpg) * cycle,
		offset: offset,
		cycle: cycle,
		lpg: lpg
	};
}

utils.sethGetNKPin = (timestamp, uint8Array) => {
	let meta = utils.sethGetMetadata(uint8Array);
	if (utils.isNil(meta))
		return null;

	let offset = meta.offset + parseInt((timestamp - meta.start) / meta.cycle) * meta.lpg;
	console.log("utils.sethGetNKPin: offset: " + offset);
	if (offset < 0)
		return null;

	let prefixArray = new Uint8Array(2);

	prefixArray[0] = uint8Array[30];
	prefixArray[1] = uint8Array[31];

	let array = utils.concatTypedArrays(prefixArray, uint8Array.subarray(offset, offset + meta.lpg));
	let binary = '';
	for (var i = 0; i < array.byteLength; i++) {
		binary += String.fromCharCode(array[i]);
	}

	return btoa(binary);
}

utils.sethGetUsername = uint8Array => {
	if (!utils.__sethValid(uint8Array))
		return null;

	let raw = uint8Array.subarray(33, 80);
	let username = '';

	for (let i = 0; i < raw.length; i++) {
		if (raw[i] === 0) {
			break;
		}

		username = username + String.fromCharCode(raw[i]);
	}

	console.log('utils.sethGetUsername: ' + username);
	return username;
}

/*
utils.sethGetTimeStamp = blob => {
	const promise = new Promise((resolve, reject) => {
		new Response(blob.slice(0, 8)).arrayBuffer().then(y => {
			resolve(parseInt(utils.ArrayBufferToHexedString(y), 16));
		}).catch(() => reject());
	});
	return promise;
}

utils.sethGetNKPin = (timestamp, blob) => {
	const promise = new Promise((resolve, reject) => {
		utils.sethGetTimeStamp(blob).then(start => {
			let offset = parseInt((timestamp - start) / 5) * 7;
			console.log("utils.sethGetNKPin: offset: " + offset + ", size: " + blob.size);
			if (offset > 0) {
				offset += 8;
				new Response(blob.slice(offset, offset + 8)).arrayBuffer().then(y => {
					let buffer = new ArrayBuffer(10);
					let array = new Uint8Array(buffer),
						dataArray = new Uint8Array(y);

					array[0] = 13; // '\r'
					array[1] = 49; // '1'
					array[2] = dataArray[0];
					array[3] = dataArray[1];
					array[4] = dataArray[2];
					array[5] = dataArray[3];
					array[6] = dataArray[4];
					array[7] = 32; // ' '
					array[8] = dataArray[5];
					array[9] = dataArray[6];
					
					let binary = '';
					for (var i = 0; i < array.byteLength; i++) {
						binary += String.fromCharCode(array[i]);
					}
					resolve(btoa(binary));
				}).catch(() => reject());
			} else {
				reject()
			}
		}).catch(() => reject());
	});
	return promise;
}
*/
