var ranga = {};
ranga.api = {};
ranga.api.swdeploy = {};

ranga.errcode = [
	"Success",
	"Invalid argument",
	"Function not implemented",
	"Permission denied",
	"Internal fault",
	"Resource temporarily unavailable",
	"Operation would block",
	"Input/output error",
	"Device or resource busy"
];

ranga.errstr = code => {
	return ranga.errcode[code];
}

ranga.ajax = (url, data, callback) => {
	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			callback((xhr.status === 200), xhr.status, xhr.responseText);
		}
	}

	xhr.open("POST", url, true);
	if (data === null) {
		xhr.send();
	} else if (typeof data === 'string') {
		let blob = new Blob([data], {
			type: 'text/plain'
		});
		xhr.send(blob);
	} else {
		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		xhr.send(data);
	}
}

ranga.parseProto = text => {
	let index = text.indexOf("\n\n");
	let arr = text.substring(0, index).split('\n');
	let proto = {};

	for (var i = 0; i < arr.length; i++) {
		var pos = arr[i].indexOf(": ");
		if (pos === -1)
			continue;

		var key = arr[i].substring(0, pos);
		var value = arr[i].substring(pos + 2);

		proto["" + key + ""] = value;
	}

	proto.payload = text.substring(index + 2);
	return proto;
}

ranga.protoAjax = (url, data) => {
	const promise = new Promise((resolve, reject) => {
		ranga.ajax(url, data, (success, status, response) => {
			let proto = null;
			if (success)
				proto = ranga.parseProto(response);

			if (success && ('code' in proto) && proto.code === '0') {
				resolve(proto);
			} else {
				if (proto !== null)
					proto["_ranga_proto_data"] = 1;
				reject(proto);
			}
		});
	});

	return promise;
}

ranga.api.auth = password => {
	return ranga.protoAjax("/cgi-bin/auth?m=pw&pw=" + encodeURIComponent(password), null);
}

ranga.api.disp = (section, target, args) => {
	return ranga.protoAjax("/cgi-bin/disp?section=" + encodeURIComponent(section) + "&target=" + encodeURIComponent(target), args.join("\n") + "\n");
}

ranga.api.disp_upload = (section, target, filename, raw) => {
	return ranga.protoAjax("/cgi-bin/disp?section=" + encodeURIComponent(section) + "&target=" + encodeURIComponent(target) + "&mode=upload&filename=" + encodeURIComponent(filename), raw);
}

ranga.api.config = (target, args) => {
	return ranga.api.disp('config', target, args);
}

ranga.api.action = (target, args) => {
	return ranga.api.disp('action', target, args);
}

ranga.api.query = (target, args) => {
	return ranga.api.disp('query', target, args);
}

ranga.api.addonList = () => {
	return ranga.protoAjax("/cgi-bin/addon?action=list", null);
}

ranga.api.componentsList = () => {
	return ranga.protoAjax("/cgi-bin/addon?action=ls-components", null);
}

ranga.api.addonInfo = pkgname => {
	return ranga.protoAjax("/cgi-bin/addon?action=info&pkgname=" + encodeURIComponent(pkgname), null);
}

ranga.api.addonInstall = blob => {
	return ranga.protoAjax("/cgi-bin/addon?action=install", blob);
}

ranga.api.addonRemove = pkgname => {
	return ranga.protoAjax("/cgi-bin/addon?action=remove&pkgname=" + encodeURIComponent(pkgname), null);
}

ranga.api.setWebcon = extension => {
	return ranga.protoAjax("/cgi-bin/addon?action=setwebcon&pkgname=" + encodeURIComponent(extension), null);
}

ranga.api.swdeploy.upload = (blob, reboot = false) => {
	return ranga.protoAjax("/cgi-bin/swupload?action=patch" + (reboot ? "&reboot=1" : ""), blob);
}

ranga.api.swdeploy.log = () => {
	return ranga.protoAjax("/cgi-bin/swupload?action=log", null);
}

ranga.api.swdeploy.status = blob => {
	return ranga.protoAjax("/cgi-bin/swupload?action=status", blob);
}

ranga.api.swdeploy.action = action => {
	switch (action) {
		case 'fp_earse_configure':
			return ranga.protoAjax("/cgi-bin/swupload?action=" + action, null);
			break;
		default:
			console.error("ranga.api.swdeploy.action: unsupported action invoked: " + action);
			return Promise.reject();
			break;
	}
}

ranga.cachedSysinfo = null;
ranga.sysinfo = ignoreCache => {
	const promise = new Promise((resolve, reject) => {
		if (ranga.cachedSysinfo === null || ignoreCache) {
			ranga.api.query('sysinfo', ['-vp']).then(proto => {
				ranga.cachedSysinfo = ranga.parseProto(proto.payload + "\n\n");
				resolve(ranga.cachedSysinfo);
			}).catch(e => {
				reject();
			})
		} else {
			resolve(ranga.cachedSysinfo);
		}
	});

	return promise;
}
