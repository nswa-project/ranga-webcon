var i18n = {};

String.prototype.format = () => {
	let args = arguments;
	return this.replace(/{(\d+)}/g, (match, number) => {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};

i18n.enabled = false;

i18n.tr = string => {
	if (!i18n.enabled)
		return string;

	try {
		if (string in l10n)
			return l10n[string];
	} catch (e) {}
	return string;
}
_ = s => (i18n.tr(s))

i18n.init = locale => {
	const promise = new Promise((resolve, reject) => {
		if (typeof locale === 'undefined' || locale === null || locale === '') {
			locale = navigator.language;
		}
		if (locale !== "C") {
			locale = locale.toLowerCase();
			webcon.loadScript("l10n", "l10n/" + locale + ".js?v=__RELVERSION__").then(e => {
				i18n.enabled = true;
			}).catch(e => {
				console.log("i18n: l10n data load failed (" + locale + "), I18N disabled.")
			}).finally(() => {
				resolve();
			});
		} else {
			console.log("i18n: I18N disabled.");
			resolve();
		}
	});
	return promise;
}

i18n.runHooks = () => {
	if (!i18n.enabled)
		return;

	let a = document.getElementsByClassName('_tr');
	Array.from(a).forEach(i => {
		i.innerHTML = i18n.tr(i.innerHTML);
		i.classList.remove('_tr');

		if (i.classList.contains('_tr_placeholder')) {
			i.placeholder = i18n.tr(i.placeholder);
			i.classList.remove('_tr_placeholder');
		}
	});
}
