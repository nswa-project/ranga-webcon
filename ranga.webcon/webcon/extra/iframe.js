const $ = id => {
	return document.getElementById('ex-iframe-' + id);
}

var extra_iframe = {};

var extraIframeLoad = (uri, showUri) =>{
	console.log('extraIframeLoad: ' + uri);
	let iframe = $('iframe');
	iframe.src = uri;
	
	if (showUri) {
		$('urishow').classList.remove('hide');
		iframe.addEventListener('load', e => {
			let div = $('urishow');
			div.textContent = '页面由 ' + iframe.src + ' 提供。你与此站点建立的连接' + ((iframe.src.startsWith('https:')) ? '是经过了加密的。' : '不是私密连接。')
		});
	}
}