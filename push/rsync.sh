#!/bin/bash

wget http://localhost:8001/app/app.js?squeeze=1 -O app.js
rsync -e ssh ./app.js voloko@ukijs.org:/var/www/mobileclienthack.com/public/app/
rsync -e ssh ../connect.js voloko@ukijs.org:/var/www/mobileclienthack.com/public/
sed s/app.js/app.js?`date +%s`/ ../index.html > ./index.html
rsync -e ssh ./index.html voloko@ukijs.org:/var/www/mobileclienthack.com/public/
rsync -e ssh ../login.html voloko@ukijs.org:/var/www/mobileclienthack.com/public/
rsync -e ssh ../*.appcache voloko@ukijs.org:/var/www/mobileclienthack.com/public/
rm app.js
# rm index.html
