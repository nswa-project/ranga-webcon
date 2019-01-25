var dialog = {};

dialog.show = (text, btns) => {
	let dialog_back = document.createElement("div");
	let dialog = document.createElement("div");
	let dialog_text = document.createElement("div");
	let dialog_btn = document.createElement("div");

	dialog_back.className = "md_dialog_back";
	dialog.className = "md_dialog";
	dialog_text.className = "md_dialog_text";
	dialog_btn.className = "md_dialog_btns";

	dialog.appendChild(dialog_text);
	dialog.appendChild(dialog_btn);

	dialog_back.appendChild(dialog);
	dialog_text.innerHTML = text;

	for (var i = 0; i < btns.length; i++) {
		var button = document.createElement("button");
		dialog_btn.appendChild(button);
		button.classList.add('btnFlat');
		button.addEventListener('click', ((f, a) => e => f(a))(btns[i].func, dialog_back), false);
		button.textContent = btns[i].name;
	}

	document.body.appendChild(dialog_back);
	return dialog_back;
}

dialog.close = dialog_back => {
	dialog_back.removeChild(dialog_back.firstChild);

	dialog_back.classList.remove("fadein_show_veryfast");
	dialog_back.classList.add("fadein_reset_veryfast");
	dialog_back.style.pointerEvents = "none";
	setTimeout(function () {
		document.body.removeChild(dialog_back);
	}, 200);
}

dialog.textWidget = dialog_back => {
	return dialog_back.firstChild.firstChild;
}

dialog.simple = (text, close_btn_text) => {
	close_btn_text = close_btn_text || "关闭";
	dialog.show(text, [{
		name: close_btn_text,
		func: dialog.close
    }]);
}
