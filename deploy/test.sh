#!/bin/bash

apt-get install --no-install-recommends -y python-pip apache2 libapache2-mod-wsgi

pip install django django-appconf django-pipeline django-user-accounts pyjade

# TODO install pinax-theme
if [ -f "/vagrant/deploy/packagies/pinax-theme/setup.py" ];then
    echo "pinax-theme-bootstrap haven't installed, please read README before install."
    exit 1
fi
cd /vagrant/deploy/packages/pinax-theme/
python setup.py install

# Deploy code
#mkdir -p /opt/base/www/
#cp -rf /vagrant/base/* /opt/base/www/
ln -s /home/vagrant/src/base /opt/base/www
mkdir -p /opt/base/db

python /opt/base/www/manage.py syncdb --noinput
# python /opt/base/www/manage.py collectstatic --noinput

chown -R www-data: /opt/base/db
# Enable apache
cp -r /vagrant/deploy/config/etc /
# a2dissite 000-default
# a2ensite base
