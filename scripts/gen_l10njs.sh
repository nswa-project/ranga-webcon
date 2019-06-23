#!/usr/bin/env bash

BASEDIR=$(dirname "$0")

TO="ranga.webcon/webcon/l10n"

gen() {
	cat <<EOF
var l10n = {
EOF

	cat "$1" | while read -r line ; do
		line=`sed -e 's/\\\"/\"/g' -e 's/\"/\\\"/g' <<< "$line"`
		key=`cut -d '|' -f 1 <<< "$line"`
		value=`cut -d '|' -f 2 <<< "$line"`
		[ -n "$key" -a -n "$value" ] && echo "\"$key\":\"$value\","
	done

	cat <<EOF
};
EOF
}

for i in `ls l10n` ; do
	echo "generate $i.js"
	gen "l10n/$i" > "$TO/${i}.js"
done
