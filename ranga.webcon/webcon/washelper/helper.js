var washelper = {};

washelper.magic = '1';

washelper.installExtension = (downloadURI, returnTo) => {
	window.location.href = 'http://ranga.lan/webcon/washelper/?action=insext&download_uri=' + encodeURIComponent(downloadURI) + '&return_to=' + encodeURIComponent(returnTo);
}

washelper.installTheme = (downloadURI, returnTo) => {
	window.location.href = 'http://ranga.lan/webcon/washelper/?action=instheme&download_uri=' + encodeURIComponent(downloadURI) + '&return_to=' + encodeURIComponent(returnTo);
}