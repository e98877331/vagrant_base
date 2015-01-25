# -*- mode: ruby -*-
# vi: set ft=ruby :

$user = 'vagrant'

$user_bash_prefix = "sudo -u ${user} -H bash -l -c"
$root_bash_prefix = 'sudo -H bash -l -c'

Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin', '/usr/local/bin']
}

# Add Source
class add_source {
  class {'apt':
    disable_keys => true
  }

  file { "/etc/apt/apt.conf.d/99auth":
    owner => root,
    group => root,
    content => "APT::Get::AllowUnauthenticated yes;",
    mode => 644;
  }

}
class { 'add_source': }

# Pre-install
class pre_install {

  exec { 'install_config_shell':
    command =>
      "${root_bash_prefix} 'apt-get install --no-install-recommends -y'"
  }

  package { [
    'python-pip', 'apache2', 'libapache2-mod-wsgi', 'git'
    ]:
    ensure => installed
  }

  exec { 'download pinax-theme':
    command =>
      "${root_bash_prefix} 'pip install git+https://github.com/pinax/pinax-theme-bootstrap.git'"
  }
}
class { 'pre_install':
  require => Class['add_source']
}

class pre_settings {
}

class{ 'pre_settings':
    require => Class['pre_install']
}


# Post-install
class post_install {

  # install pip-require
  python::requirements { '/vagrant/base/pip.require': }

  # install node-require
  #exec { 'install_node_require':
  #  command =>
  #    "${root_bash_prefix} 'npm config set registry http://registry.npmjs.eu && npm install -g coffee-script@1.7.1 yuglify@0.1.4'"
  #}

  # link django app
  exec { 'link_django_app':
    command =>
      "${root_bash_prefix} \
      'rm -rf /opt/base/www && mkdir -p /opt/base && \
       ln -sf /vagrant/base /opt/base && \
       mv /opt/base/base /opt/base/www'"
  }
}
class { 'post_install':
  require => Class['pre_settings']
}

# Post-settings
class post_settings {
  # load fixtures
  exec { 'load_fixture':
    command =>
      "${root_bash_prefix} \
      'mkdir -p /opt/base/db && \
       python /opt/base/www/manage.py syncdb --noinput'",
  }

  # collect static
  exec { 'collect_static':
    command =>
      "${root_bash_prefix} \
      'python /opt/base/www/manage.py collectstatic --noinput'",
  }

  # TODO i18n compile messages
  #exec { 'compile_messages':
  #  command =>
  #    "${root_bash_prefix} \
  #    'python /opt/base/www/manage.py compilemessages -l zh_TW'",
  #}
}
class { 'post_settings':
  require => Class['post_install']
}
