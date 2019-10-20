var page_info = {};

const page_info_init = () => {
	let div = document.getElementById('page_info_main');
	ranga.sysinfo(false).then(info => {
		utils.pageAddSection(div, _('Ranga software version'));
		div.innerHTML += _("System version: {0}").format(info.version) + "<br>";
		div.innerHTML += _("Kernel version: {0}").format(info.kernel) + "<br>";

		div.innerHTML += _("You are now in <b>{0}</b> updating channel.").format(info.channel) + "<br>";
		if (info.channel !== "stable") {
			div.innerHTML += _("{0} channel is a testing channel which may be unstable.").format(info.channel) + "<br>";
		}

		div.innerHTML += "<a target=_blank href='" + webcon.supportSiteMain + "/updates/'>{0}</a><br>".format(_("System update release site"));
		utils.pageAddSection(div, _('Device Information'));
		div.innerHTML += _("Architecture: {0}").format(info.arch) + "<br>";
		div.innerHTML += _("Chip: {0}").format(info.chip) + "<br>";
		div.innerHTML += _("Board: {0}").format(info.board) + "<br>";
		div.innerHTML += _("Model name: {0}").format(info.model) + "<br>";
		return ranga.api.query('sysinfo', ['-uU']);
	}).then(proto => {
		let info = ranga.parseProto(proto.payload + "\n\n");
		utils.pageAddSection(div, _('Resource usage'));
		let arr = info.memory.split('/');
		div.innerHTML += _("Total memory: {0} KB").format(arr[0]) + "<br>";
		div.innerHTML += _("Memory (used): {0} KB").format(arr[1]) + "<br>";
		div.innerHTML += _("Memory (cached): {0} KB").format(arr[2]) + "<br>";
		div.innerHTML += _("Memory (buffered): {0} KB").format(arr[3]) + "<br>";
		div.innerHTML += _("Memory (shared): {0} KB").format(arr[4]) + "<br>";
		div.innerHTML += _("Storage: {0}").format(info.storage.replace(/K/g, _('KB')).replace(/M/g, _('MB'))) + "<br>";
		div.innerHTML += _("System uptime: {0}").format(info.uptime) + "<br>";
		utils.pageAddSection(div, _('Ranga System Legal Information'));
		div.innerHTML += "<a target=_blank href='/osl.html'>{0}<br>".format(_("Open source license"));
		div.innerHTML += "<a target=_blank href='/eul.txt' onclick='page_into_eul(); return false;'>{0}<br>".format(_("Ranga End User License Agreement"));
		utils.pageAddSection(div, _('Web console legal information'));
		div.innerHTML += "<a target=_blank href='https://github.com/glider0/ranga-webcon/COPYING'>{0}<br>".format(_("Web console license agreement"));
		div.innerHTML += "<a target=_blank href='https://fontawesome.com/license'>{0}<br>".format(_("Font Awesome Icon Creation Common License"));
		div.innerHTML += "<a target=_blank href='https://www.apache.org/licenses/LICENSE-2.0.html'>{0}<br>".format(_("Google Material.io icon license"));
	}).catch(defErrorHandler);
}

const page_into_eul = () => {
	utils.ajaxGet("/eul.txt").then(r => {
		dialog.simple(r.replace(/\n/g, "<br>"))
	});
}
