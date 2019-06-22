# NSWA Ranga Webconsole Extension. (Open-source version)

The default web-console of NSWA Ranga is based on this open-source version with some small changes such as code compression.

Contribution to this project will ultimately benefit all NSWA Ranga users.

## Build and install

Use Info-ZIP or other zip archive utilities to pack codes to a zip file

```
$ (cd ranga.webcon; zip -FSr ../ranga-webcon.zip .)
```

> You need zip the contents of a directory WITHOUT including the directory itself.

Then, you can use [Ranga command-line client](https://github.com/glider0/ranga-client/) to install it

```shell
$ ranga-cli auth -p       # Log-in superuser first
$ ranga-cli addon install-extension ranga-webcon.zip
```

Or you can install it in default web-console by uploading it.

Then, you need to call NSWA Ranga system to change web-console.

```shell
$ ranga-cli addon set-webcon rostc.ranga.webcon
```

Or you can do it in default web-console.

To switch back to default web-console, run

```shell
$ ranga-cli addon set-webcon ranga.webcon
```

Or you can do it in this web-console.

## Use nginx to reverse proxy the web-console

The NSWA Ranga system is usually installed on a flash memory with a limited erase life. It is therefore not advisable to reinstall the entire extension for minor changes to the web console. So, in order to facilitate the development and debugging of the web console, we recommend using NGINX reverse proxy to solve this problem, which requires some configuration.

We open the NGINX server on port 8000 of the local host, direct the `/webcon` traffic to the local hard disk, and forward the other traffic (mainly to the `/cgi-bin` directory of the system CGI backend) back to the NSWA Ranga system.

As shown below.

```
                            +---------------------+
                            | Local filesystem    |
                            | ranga.webcon/webcon |
                            +---------------------+
                                       |
                                       | /webcon  alias
                                       |
                                       |
                                  +---------+
         http://localhost:8000    |         |
Browser ------------------------> |  NGINX  |
                                  |         |
                                  +---------+
                                       |
                                       | /  proxy_pass
                                       | (/cgi-bin, etc.)
                                       |
                            +---------------------+
                            | NSWA Ranga system   |
                            | http://192.168.1.1/ |
                            +---------------------+
```

Create an NGINX server configuration, we use the `/etc/nginx/sites-enabled/ranga`, and the content of the file is follow.

```
server {
	listen localhost:8000;

	server_name _;
	index index.html;

	location / {
		proxy_pass http://192.168.1.1/;
	}

	location /webcon {
		alias <YOUR ranga.webcon/webcon path>;
	}
}
```

`<YOUR ranga.webcon/webcon path>` is the path to your local web console source's `ranga.webcon/webcon` directory.

And restart the nginx server.

```shell
$ sudo service nginx restart
```

> The process of configuring NGINX may be different on your computer.

## Contribution

What you can do?

- Welcome to fixup issues in the program.

- Welcome to optimize performance for the program.

- Welcome to add features for the program.

What should you pay attention to?

- Work in `ranga.webcon/webcon` path.

- You need to make your code work on Google Chrome (>= 70), Mozilla Firefox (>= 62), and iOS Safari (>= 12). If you haven't got an iPhone to check it, please indicate this.

- You need use `(a, b) => {}`, not `function(a, b) {}`.

- Use `Promise` instead of callbacks whenever possible.

- We reject all patches for port webcon to legacy (or evil) browsers (such like MSIE). If you want, plz fork the repo.

- Please open a Pull-requst or send the `.patch` file by open an Issue.

- You need to use our I18N and L10N framework, please see "I18N and L10N" section.

- You need to explain the purpose of your patch. For example, what problems have you encountered and how you solved it? What is the purpose of your added functionality?

Source tree directory structure?

`.` for index, fonts and logo

`./styles` for css stylesheets

`./scripts` for javascripts

`./pages` for webcon pages

`./scripts/ranga.js` provide the system's API interface wrapper.

`./scripts/swdeploy.js` provide the swdeploy utility.

`./scripts/utils.js` provide utilities for javascripts, for example, `utils.getUNIXTimestamp`.

`./scripts/webcon.js` provide interfaces to control web-console mainly for pages, for example, `webcon.lockScreen`.

`./scripts/dialog.js` provide a generic dialog GUI implement.

`./pages/xxx.html` and `./pages/xxx.js` provide a "xxx" page for web-console.

And many more ... :-)

## I18N and L10N

### In HTML

If you want to let i18n translate the content of your element, add class `_tr` to this element. For example

```HTML
<button class="btnFlat" id="login"><i class="icon icon-user"></i><span class="_tr">Login</span></button>
```

### In JavaScript

#### Static strings

If you want to use a static string in JS code, please use `_("the string")` or `_('the string')`. For example

```JavaScript
webcon.addButton(_('Extra tools'), 'icon-tool',
	b => webcon.dropDownMenu(b, [{
		name: _('Action XXX'),
		func: (n => { //... })
	}, {
		//....
	}]));
```

#### Variables

If you want to translate a variable, use `i18n.tr()` instead. The message extractor will not extract it.

```JavaScript
return i18n.tr(sizes[i])
```

If needed, add the message to `extra-l10n-messages` file.

#### Do not forget runHooks

If your JS dynamically adding elements with un-translated messages, please run `i18n.runHooks()` after adding.

This should be rare, but if there is such a need, use it.

### How to do next

you need GNU bash, GNU grep, GNU sed, python3 and python3-AdvancedHTMLParser

run this command to extract and merge new messages

```shell
$ ./scripts/l10n_extract.sh
```

If you want to add a new language (such like fr-FR), do this

```shell
$ touch l10n/fr-fr
$ ./scripts/l10n_extract.sh

# another method:
$ ./scripts/l10n_extract.sh
$ ./scripts/merge_l10n.py /tmp/ranga-webcon-l10n l10n/fr-fr
```

Edit the l10n file, Translate all messages to the language. And gen js file

> For Chinese, only to edit `zh-cn` locale, and run `./scripts/zh-hans2hant.sh` to generate the zh-hant version.

```shell
$ ./script/gen_l10njs.sh
```

## Copyright and warranty

Copyright (C) 2019 NSWA Ranga Maintainers.

Copyright (C) 2019 Ranga Open-Source Technology Center.

License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html> **With additional license grant original maintainers unlimited rights for this code and the derived codes which are contributed to upstream.**

This is free software; you are free to change and redistribute it.
**There is NO WARRANTY, to the extent permitted by law.**
**If you have purchased a commercial license for the Ranga system,**
**This program which is published from original version has same warranty.**
