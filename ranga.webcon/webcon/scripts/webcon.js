var webcon = {};

webcon.setToken = value => {
	document.cookie = "USER_TOKEN="+ value + "; path=/cgi-bin";
}