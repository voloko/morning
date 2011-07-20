#!/bin/bash

wget http://localhost:8001/app/app.js?squeeze=1 -O app.js
rsync -e ssh ./app.js voloko@ukijs.org:/var/www/ukijs.org/public/morning/app/
rsync -e ssh ../login.html voloko@ukijs.org:/var/www/ukijs.org/public/morning/
rsync -e ssh ./index.html voloko@ukijs.org:/var/www/ukijs.org/public/morning/
rm app.js
