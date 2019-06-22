#!/usr/bin/env python3

import os
import sys
import AdvancedHTMLParser

parser = AdvancedHTMLParser.AdvancedHTMLParser()

for root, dirs, files in os.walk(sys.argv[1]):
	for filename in files:
		filename = os.path.join(root, filename)
		print("=> " + filename, file=sys.stderr)
		if os.path.isfile(filename) and filename.endswith(".html"):
			parser.parseFile(filename)
			items = parser.getElementsByClassName("_tr")
			for item in items:
				print(item.innerHTML)
