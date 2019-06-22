#!/usr/bin/env bash

grep -hr --exclude-dir=".git" -Po "_\(['\"].*?['\"]\)" "$1" | sed -e "s/^_(['\"]//g" -e "s/['\"])$//g"
