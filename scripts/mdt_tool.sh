#!/usr/bin/env bash

td=()
i=0
while read -r line ; do
	[ -n "$line" ] && td[${#td[@]}]="$line"
	i=$(( $i + 1 ))
done < "$2"

i=0
cat "$1" | while read -r line ; do
	echo "${line}${td[$i]}"
	i=$(( $i + 1 ))
done
