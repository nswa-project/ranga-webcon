var doctor = {};

doctor.results = {
	WAN_DOWN: ["WAN 口网线未插入或无信号", "WAN 口完全无信号，你可能没有将 WAN 口网线连接到可用端口上，或者网线接触不良。", "检查 WAN 口网线连接"],
	INVALID_USERNAME: ["没有设置 Netkeeper 拨号用户", "你还没有设置过 Netkeeper 拨号用户，或者你按下了路由器的重置按钮。", "前往 Web 控制台上的功能菜单，设置 Netkeeper 用户中设置你的拨号用户名和密码"],
	NOT_DIALED: ["未开始拨号", "你似乎尚未开始拨号，或者 WAN 口未启动", "尝试重新拨号|检查 WAN 口网线连接"],
	DIAL_TIMEOUT: ["拨号超时", "你似乎没有将 WAN 口网线连接到可用端口上，或者连接接触不良。或者你的 ISP 出现了问题。以及如果你使用错误的密码尝试在路由器上多次拨号，此端口可能被 ISP 封禁", "检查网线是否插好|检查网线是否插入到路由器 WAN 口和 ISP 提供的接口（可能是一个交换机端口）|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题|如果路由器的拨号端口被 ISP 封禁，尝试等待 1 个小时再进行拨号，或者尝试修改 WAN 口 MAC 地址"],
	DIAL_SUCCESS: ["拨号似乎已经成功", "我们检测到拨号成功了，请返回上一步检查", "返回检查，如果仍然未连接请尝试重试拨号"],
	ISP_PSK_DENIED: ["用户的用户名或密码错误或（RFC1334_PEER_MSG_UNKNOWN1）", "对方在 RFC1334 的某种协议中返回了未知且不可读的信息。无标准互联网规范保证实施一致，根据我们的使用经验猜测，这可能是由于你的用户名或密码错误导致的。", "检查你的用户名和密码是否正确|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题"],
	ISP_MULTIPLE_DENIED: ["重复登录", "你的帐号已经在另一处登录，或者在其他终端没有正常退出", "在其他终端断开连接|尝试在 ISP 提供的网页上使用“强制下线”功能"],
	ISP_NK_PIN_ERROR: ["Netkeeper PIN 错误", "似乎你设置的系统时钟不对，因此无法计算正确的 PIN 码", "请检查是否为路由器设置了正确的系统时钟|如果你使用自动同步时间，请检查本地系统时钟和时区"],
	ISP_BALANCE_INSUFFICIENT: ["账户余额不足（RFC1334_PEER_MSG_UNKNOWN2）", "对方在 RFC1334 的某种协议中返回了未知且不可读的信息。无标准互联网规范保证实施一致，根据我们的使用经验猜测，这可能是由于你的账户余额不足导致的。", "检查是否宽带账户余额，请联系你的 ISP 充值|检查你的用户名和密码是否正确|检查系统日志获取信息|请尝试等一小会重新拨号|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题"],
	ISP_USER_NO_EXISTING: ["账户不存在（RFC1334_PEER_MSG_UNKNOWN3）", "对方在 RFC1334 的某种协议中返回了未知且不可读的信息。无标准互联网规范保证实施一致，根据我们的使用经验猜测，这可能是由于你的设置的用户名未在你的 ISP 注册（例如设置了错误的用户名）。", "检查你的用户名和密码是否正确|检查系统日志获取信息|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题"],
	UNKNOWN_RFC1334MSG: ["未知问题（RFC1334_PEER_MSG_UNKNOWN0）", "你的检测结果出乎预料，对方在 RFC1334 的某种协议中返回了未知或不可读的信息，并且我们到目前为止没有遇到过这个消息。<br>据 RFC1334 请求批注（原文：The Message field is zero or more octets, and its contents are implementation dependent. It is intended to be human readable, and MUST NOT affect operation of the protocol. It is recommended that the message contain displayable ASCII characters 32 through 126 decimal. Mechanisms for extension to other character sets are the topic of future research.），消息字段是实现独立的，但推荐使用人类可读的字符，因此请检查日志确认，可能包含具体错误原因。", "检查系统日志以找到解决方案|请尝试等一小会重新拨号|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题|你的环境可能具有研究价值，请考虑将系统日志和你的操作环境反馈给我们"],
	UNKNOWN: ["未知问题", "你的检测结果出乎预料", "检查系统日志以找到解决方案|请尝试等一小会重新拨号|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题|你的环境可能具有研究价值，请考虑将系统日志和你的操作环境反馈给我们"]
};

doctor.analysis = () => {
	webcon.lockScreen();
	ranga.api.action('doctor', []).then(proto => {
		console.log(proto.payload);

		let idx = proto.payload.indexOf('\n');
		let code = proto.payload.substring(0, idx);
		let log = proto.payload.substr(idx + 2);

		if (code in doctor.results) {
			let result = doctor.results["" + code];
			dialog.simple("对你的问题的最佳猜测: <b>" + result[0] + "</b><br>" + result[1] + "<br><br><b>请尝试以下解决方法：</b><br>" + result[2].replace(/\|/gi, '<br>') + ((log === null) ? "" :
				"<br><br>以下是最近一次拨号的日志，可能对解决问题有所帮助（包含你的拨号用户名，分享之前建议根据需要进行脱敏处理）<br><pre style='overflow-x: auto;'>" + utils.raw2HTMLString(log) + "</pre>"));
		} else {
			dialog.simple("Invalid response code. You may need to upgrade web-console.");
		}
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
	});
}
