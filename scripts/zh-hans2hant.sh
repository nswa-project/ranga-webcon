#!/usr/bin/env bash

opencc -c s2twp.json -i l10n/zh-cn -o l10n/zh-tw
opencc -c s2hk.json -i l10n/zh-cn -o l10n/zh-hk
