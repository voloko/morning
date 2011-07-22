#!/bin/bash

wget http://localhost:8001/app/app.js?squeeze=1 -O app.js
rsync -e ssh ./app.js voloko@ukijs.org:/var/www/mobileclienthack.com/public/app/
rsync -e ssh ../connect.js voloko@ukijs.org:/var/www/mobileclienthack.com/public/
rsync -e ssh ../*.html voloko@ukijs.org:/var/www/mobileclienthack.com/public/
rsync -e ssh ../*.appcache voloko@ukijs.org:/var/www/mobileclienthack.com/public/
rm app.js
