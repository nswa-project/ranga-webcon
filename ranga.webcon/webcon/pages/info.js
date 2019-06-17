var page_info = {};

const page_info_init = () => {
	let div = document.getElementById('page_info_main');
	ranga.sysinfo(false).then(info => {
		utils.pageAddSection(div, 'Ranga 软件版本');
		div.innerHTML += "系统版本：" + info.version + "<br>";
		div.innerHTML += "内核版本：" + info.kernel + "<br>";
		div.innerHTML += "<a target=_blank href='" + webcon.supportSiteMain + "/updates/'>系统更新发布站点</a><br>";
		utils.pageAddSection(div, '设备信息');
		div.innerHTML += "架构：" + info.arch + "<br>";
		div.innerHTML += "芯片：" + info.chip + "<br>";
		div.innerHTML += "板子：" + info.board + "<br>";
		div.innerHTML += "模型名称：" + info.model + "<br>";
		return ranga.api.query('sysinfo', ['-uU']);
	}).then(proto => {
		let info = ranga.parseProto(proto.payload + "\n\n");
		utils.pageAddSection(div, '资源使用');
		let arr = info.memory.split('/');
		div.innerHTML += "总内存：" + arr[0] + " 千字节<br>";
		div.innerHTML += "内存（已使用）：" + arr[1] + " 千字节<br>";
		div.innerHTML += "内存（已缓存）：" + arr[2] + " 千字节<br>";
		div.innerHTML += "内存（已缓冲）：" + arr[3] + " 千字节<br>";
		div.innerHTML += "内存（共享）：" + arr[4] + " 千字节<br>";
		div.innerHTML += "存储：" + info.storage.replace(/K/g, '千字节').replace(/M/g, '兆字节') + "<br>";
		div.innerHTML += "系统负载：" + info.uptime + "<br>";
		utils.pageAddSection(div, 'Ranga 系统法律信息');
		div.innerHTML += "<a target=_blank href='/osl.html'>开放源代码许可<br>";
		div.innerHTML += "<a target=_blank href='/eul.txt' onclick='page_into_eul(); return false;'>Ranga 最终用户许可协议<br>";
		utils.pageAddSection(div, 'Web 控制台法律信息');
		div.innerHTML += "<a target=_blank href='https://github.com/glider0/ranga-webcon/COPYING'>Web 控制台授权<br>";
		div.innerHTML += "<a target=_blank href='https://fontawesome.com/license'>Font Awesome 图标创作共用许可<br>";
		div.innerHTML += "<a target=_blank href='https://www.apache.org/licenses/LICENSE-2.0.html'>Google Material.io 图标许可<br>";
	}).catch(defErrorHandler);
}

const page_into_eul = () => {
	utils.ajaxGet("/eul.txt").then(r => {
		dialog.simple(r.replace(/\n/g, "<br>"))
	});
}
