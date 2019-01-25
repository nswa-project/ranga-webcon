# NSWA Ranga Webconsole Extension. (Open-source version)

## Build and install

Use Info-ZIP or other zip archive creater to pack extension to a zip file

```
$ (cd ranga.webcon; zip -FSr ../ranga-webcon.zip .)
```

> You need zip the contents of a directory WITHOUT including the directory itself.

Then, you can use [Ranga command-line client](https://github.com/glider0/ranga-client/) to install it

```
$ ranga-cli auth -p       # Log-in superuser first
$ ranga-cli addon install-extension ranga-webcon.zip
```

Or you can install it in default web-console by uploading it.

Then, you need to call NSWA Ranga system to change web-console.

```
$ ranga-cli addon set-webcon rostc.ranga.webcon
```

Or you can do it in default web-console.

To switch back to default web-console, run

```
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

`<YOUR ranga.webcon/webcon path>` is the path to your local web console source's `/webcon` directory.

And restart the nginx server.

```
$ sudo service nginx restart
```

> The process of configuring NGINX may be different on your computer.

## Contribution

TODO

## Copyright and warranty

Copyright (C) 2019 NSWA Ranga Maintainers.

Copyright (C) 2019 Ranga Open-Source Technology Center.

License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html> **With additional license grant original maintainers unlimited rights for this code and the derived codes which are contributed to upstream.**

This is free software; you are free to change and redistribute it.
**There is NO WARRANTY, to the extent permitted by law.**
**If you have purchased a commercial license for the Ranga system,**
**This program which is published from original version has same warranty.**
