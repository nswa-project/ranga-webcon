var webcon = {};
var scriptSet = new Set();

webcon.setToken = value => {
	document.cookie = "USER_TOKEN=" + value + "; path=/cgi-bin";
}

webcon.loadScript = (name, url) => {
	const promise = new Promise((resolve, reject) => {
		console.log("webcon.loadScript: name: " + name);
		if (name === null || scriptSet.has(name) === false) {
			let script = document.createElement("script");
			script.type = 'text/javascript';
			script.src = url;
			script.onload = () => {
				console.log("webcon.loadScript: script " + name + " loaded (" + url + ")");
				resolve(true);
			};
			script.onerror = () => {
				console.log("webcon.loadScript: script " + name + " failed to load (" + url + ")");
				reject(null);
			};
			document.body.appendChild(script);
			scriptSet.add(name);

		} else {
			console.log("webcon.loadScript: script " + name + " has loaded");
			resolve(false);
		}
	});

	return promise;
}

webcon.contentSetTitle = title => {
	document.getElementById('webcon_title').innerHTML = title;
}

webcon.contentLoadData = (data, html) => {
	if (html) {
		document.getElementById('webcon_content').innerHTML = data;
	} else {
		document.getElementById('webcon_content').textContent = data;
	}
}

webcon.contentLoadUri = (uri, html) => {
	return utils.ajaxGet(uri).then(r => {
		webcon.contentLoadData(r, html);
	})
}
