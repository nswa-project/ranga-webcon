var doctor = {};

doctor.results = {
	WAN_DOWN: ["WAN 口网线未插入或无信号", "WAN 口完全无信号，你可能没有将 WAN 口网线连接到可用端口上，或者网线接触不良。", "检查 WAN 口网线连接|检查网线质量问题"],
	INVALID_USERNAME: ["没有设置 Netkeeper 拨号用户", "你还没有设置过 Netkeeper 拨号用户，或者你按下了路由器的重置按钮。", "前往 Web 控制台上的功能菜单，设置 Netkeeper 用户中设置你的拨号用户名和密码"],
	NOT_DIALED: ["未开始拨号", "你似乎尚未开始拨号，或者 WAN 口未启动", "尝试重新拨号|检查 WAN 口网线连接"],
	DIAL_TIMEOUT: ["拨号超时", "你似乎没有将 WAN 口网线连接到可用端口上，或者连接接触不良。或者你的 ISP 出现了问题。以及如果你使用错误的密码尝试在路由器上多次拨号，此端口可能被 ISP 封禁", "检查网线是否插好|检查网线是否插入到路由器 WAN 口和 ISP 提供的接口（可能是一个交换机端口）|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题|如果路由器的拨号端口被 ISP 封禁，尝试等待 1 个小时再进行拨号，或者尝试修改 WAN 口 MAC 地址"],
	DIAL_SUCCESS: ["拨号似乎已经成功", "我们检测到拨号成功了，请返回上一步检查", "返回检查，如果仍然未连接请尝试重试拨号"],
	ISP_PSK_DENIED: ["用户的用户名或密码错误", "这可能是由于你的用户名或密码错误导致的。也可能是你的宽带账户已经注销。", "检查你的用户名和密码是否正确|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题"],
	ISP_ACCOUNT_BUSY: ["重复登录", "你的帐号已经在另一处登录，或者在其他终端没有正常退出", "在其他终端断开连接|尝试在 ISP 提供的网页上使用“强制下线”功能"],
	ISP_NK_PIN_ERROR: ["Netkeeper PIN 错误", "似乎你设置的系统时钟不对，因此无法计算正确的 PIN 码", "请检查是否为路由器设置了正确的系统时钟|如果你使用自动同步时间，请检查本地系统时钟和时区"],
	ISP_NK_PIN_FAILED: ["Netkeeper PIN/Hash 失败", "你的系统时钟应该正确，但是你似乎使用错误的用户名或算法计算的 NK PIN。", "如果你正在使用 Seth 服务，请确保数据正确且与你的用户名匹配|如果你正在使用拦截服务，请确保你在客户端输入了相同的用户名|保险起见，请检查是否为路由器设置了正确的系统时钟|保险起见，如果你使用自动同步时间，请检查本地系统时钟和时区"],
	ISP_NK_OLD_ALGORITHM: ["旧 Netkeeper 算法已被封禁", "旧 Netkeeper 算法已被封禁，如果 ISP 不进行解封，你只能使用其他方法，如 Seth 服务或者拦截服务。", "切换到 Seth 服务或者拦截服务"],
	ISP_BALANCE_INSUFFICIENT: ["账户余额不足", "对方在 RFC1334 的某种协议中返回了未知且不可读的信息。无标准互联网规范保证实施一致，根据我们的使用经验猜测，这可能是由于你的账户余额不足导致的。", "检查是否宽带账户余额，请联系你的 ISP 充值|检查你的用户名和密码是否正确|检查系统日志获取信息|请尝试等一小会重新拨号|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题"],
	ISP_USER_NO_EXISTING: ["账户不存在", "对方在 RFC1334 的某种协议中返回了未知且不可读的信息。无标准互联网规范保证实施一致，根据我们的使用经验猜测，这可能是由于你的设置的用户名未在你的 ISP 注册（例如设置了错误的用户名）。", "检查你的用户名和密码是否正确|检查系统日志获取信息|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题"],
	ISP_MULTIPLE_DENIED: ["重复登录/拒绝单号多拨", "对方在 RFC1334 的某种协议中返回了未知且不可读的信息。无标准互联网规范保证实施一致，根据我们的使用经验猜测，这可能是由于你尝试在单一端口上尝试重复连接单一账户。也可能是你的帐号已经在另一处登录，或者在其他终端没有正常退出", "在其他终端断开连接|尝试在 ISP 提供的网页上使用“强制下线”功能|检查接口的认证信息|检查系统日志获取信息|检查你的多宿主配置|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题"],
	ISP_AAA_FAILED: ["身份验证，授权和记帐失败", "对端声称它遇到了身份验证，授权和记帐的问题，这应该是你的 ISP 的一个问题。请联系你的 ISP 解决。", "尝试在 ISP 提供的网页上使用“强制下线”功能|检查接口的认证信息|检查你的多宿主配置|尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题"],
	UNKNOWN_RFC1334MSG: ["未知问题（RFC1334_PEER_MSG_UNKNOWN0）", "你的检测结果出乎预料，对方在 RFC1334 的某种协议中返回了未知或不可读的信息，并且我们到目前为止没有遇到过这个消息。<br>据 RFC1334 请求批注（原文：The Message field is zero or more octets, and its contents are implementation dependent. It is intended to be human readable, and MUST NOT affect operation of the protocol. It is recommended that the message contain displayable ASCII characters 32 through 126 decimal. Mechanisms for extension to other character sets are the topic of future research.），消息字段是实现独立的，但推荐使用人类可读的字符，因此请检查日志确认，可能包含具体错误原因。", "检查系统日志以找到解决方案|请尝试等一小会重新拨号|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题|你的环境可能具有研究价值，请考虑将系统日志和你的操作环境反馈给我们"],
	SETH_NEED_TO_SYNC: ["你的 Seth 数据需要同步", "你尚未获取 Seth 数据或者数据已经过期，请进行同步。", "从 Seth 服务同步数据|检查你的计划任务是否设置正确，以及是否启用计划任务服务开机自启动"],
	SETH_SAVED_EXPIRED: ["Seth 安全断开保存的数据失效", "Seth 安全断开保存的数据可能无法使用，这可能是由于距上次 Seth 安全断开间隔时间太长，或者你的账户在这段时间内被在其他地方登录了", "重新拨号，Seth 将不会使用上次安全断开保存的数据，而会使用 Seth 数据"],
	WAIT_TIME_TOO_SHORT: ["罕见的等待时间过短", "这可能是 NSWA Ranga 的系统缺陷导致的", "检查网线是否插好|检查系统日志以找到解决方案|请尝试等一小会重新拨号|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题|你的环境可能具有研究价值，请考虑将系统日志和你的操作环境反馈给我们"],
	SYS_ERROR: ["拨号过程被被信号中断", "拨号过程被不明来源的信号中断，这可能是 NSWA Ranga 的系统缺陷导致的", "检查网线是否插好|检查系统日志以找到解决方案|请尝试等一小会重新拨号|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题|你的环境可能具有研究价值，请考虑将系统日志和你的操作环境反馈给我们"],
	UNKNOWN: ["未知问题", "你的检测结果出乎预料", "检查系统日志以找到解决方案|请尝试等一小会重新拨号|检查是否 ISP 出现了问题，请尝试在计算机上直接使用 ISP 的拨号工具进行拨号检查能否拨号，如果失败请联系 ISP 工单客服解决问题|你的环境可能具有研究价值，请考虑将系统日志和你的操作环境反馈给我们"]
};

doctor.analysis = () => {
	webcon.lockScreen('拨号医生正在收集必要的信息...');
	ranga.api.action('doctor', []).then(proto => {
		console.log(proto.payload);

		let idx = proto.payload.indexOf('\n');
		let code = proto.payload.substring(0, idx);
		let log = proto.payload.substr(idx + 2);

		if (code in doctor.results) {
			let result = doctor.results["" + code];

			dialog.adv(null, null, "对你的问题的最佳猜测: <b>" + result[0] + "</b><br>" + result[1] + "<br><br><b>请尝试以下解决方法：</b><br>" + result[2].replace(/\|/gi, '<br>') + ((log === null) ? "" :
				"<br><br>以下是最近一次拨号的日志，可能对解决问题有所帮助（包含你的拨号用户名，分享之前建议根据需要进行脱敏处理）<br><pre style='overflow-x: auto;'>" + utils.raw2HTMLString(log) + "</pre>"), [{
				name: "好",
				func: dialog.close
			}], {
				noMaxWidth: 1
			});
		} else {
			dialog.simple("Invalid response code. You may need to upgrade web-console.");
		}
	}).catch(defErrorHandler).finally(() => {
		webcon.unlockScreen();
	});
}

doctor.notify = () => {
	webcon.sendNotify('doctor', 'icon-info', '需要帮助吗', '看起来你遇到了点小麻烦。启动拨号医生可能能帮助你解决 Netkeeper PPPoE 连接问题。<br>拨号医生通过分析数据，努力作出一个最准确的问题报告，并给出参考解决方案。拨号医生只支持 Netkeeper 协议，且不支持服务器伪装拦截法。', 'info', true,
		[{
			name: '启动拨号医生',
			func: doctor.analysis
		}]);
}
