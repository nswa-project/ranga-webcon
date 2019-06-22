#!/usr/bin/env bash

BASEDIR=$(dirname "$0")

TMPFILE="/tmp/ranga-webcon-l10n"

echo "Extracting javascript strings..."
"$BASEDIR/extract_js_string.sh" ranga.webcon > "$TMPFILE"

echo "Extracting HTML strings..."
"$BASEDIR/extract_dom_string.py" ranga.webcon >> "$TMPFILE"

echo "Add extra strings..."
cat extra-l10n-messages >> "$TMPFILE"

for i in `ls l10n` ; do
	echo "Merge new words to $i"
	"$BASEDIR/merge_l10n.py" "$TMPFILE" "l10n/$i"
done
