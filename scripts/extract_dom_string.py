#!/usr/bin/env python3

import os
import sys
import AdvancedHTMLParser

parser = AdvancedHTMLParser.AdvancedHTMLParser()
formatter = AdvancedHTMLParser.AdvancedHTMLSlimTagMiniFormatter(slimSelfClosing=True)

for root, dirs, files in os.walk(sys.argv[1]):
	for filename in files:
		filename = os.path.join(root, filename)
		if os.path.isfile(filename) and filename.endswith(".html"):
			print("=> " + filename, file=sys.stderr)
			parser.parseFile(filename)
			items = parser.getElementsByClassName("_tr")
			for item in items:
				if (item.innerHTML is not None and item.innerHTML is not ""):
					formatter.parseStr(item.innerHTML)
					print(formatter.getHTML().replace('<br/>', '<br>'))
			items = parser.getElementsByClassName("_tr_placeholder")
			for item in items:
				print(item.placeholder)
