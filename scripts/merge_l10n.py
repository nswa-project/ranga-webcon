#!/usr/bin/env python3

import os
import sys

l10n = {}

fp = open(sys.argv[1], "r")
lines = fp.read().splitlines()
for line in lines:
	l10n[line] = ""
fp.close()

try:
	fp = open(sys.argv[2], "r")
	lines = fp.read().splitlines()
	for line in lines:
		kv = line.split("|", 1)
		if len(kv) != 2:
			continue
		if kv[0] in l10n:
			l10n[kv[0]] = kv[1]
		else:
			print("warning: '" + kv[0] + "' has been dropped")
	fp.close()
except IOError:
	print("A new language file will be created")

fp = open(sys.argv[2], "w")
for key, value in l10n.items():
	if key:
		fp.write(key + "|" + value + "\n")
fp.close()
