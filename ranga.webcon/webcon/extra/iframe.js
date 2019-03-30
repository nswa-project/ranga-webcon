let extra_iframe = {};

extra_iframe.$ = id => {
	return document.getElementById('ex-iframe-' + id);
}

var extraIframeLoad = uri =>{
	console.log('extraIframeLoad: ' + uri);
	let iframe = extra_iframe.$('iframe');
	iframe.src = uri;
}