# -*- mode: ruby -*-
# vi: set ft=ruby :

# Usage:
# vagrant up MIB       - start up standard ubuntu.

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Set the Timezone to Taipei and dpkg-noninteractie.
  config.vm.provision :shell, :inline => "echo \"Asia/Taipei\" | sudo tee /etc/timezone  > /dev/null 2>&1 && sudo dpkg-reconfigure --frontend noninteractive tzdata > /dev/null 2>&1 && sudo apt-get update > /dev/null 2>&1"

  # Enable virtualbox display
  config.vm.provider "virtualbox" do |v|
    # v.gui = true
    v.memory = 1024
    v.gui = false
  end

  #config premission
    config.vm.synced_folder "./", "/home/vagrant/src",
    owner: "vagrant",
    group: "www-data",
    mount_options: ["dmode=775,fmode=664"]

  # default use public network
  # config.vm.network "private_network", ip: "192.168.2.115"

  # trusty 64
  config.vm.define "base" do |base|
    base.vm.box = "ubuntu/trusty64"
    base.vm.box_url = "https://vagrantcloud.com/ubuntu/boxes/trusty64/versions/1/providers/virtualbox.box"

    base.vm.hostname = "base"
    base.vm.network :forwarded_port, guest: 80, host: 8003
    base.vm.network :forwarded_port, guest: 443, host: 8004
    base.vm.network :forwarded_port, guest: 8000, host: 8000
    
    config.vm.provision :shell do |shell|
      shell.inline = "mkdir -p /etc/puppet/modules
        apt-get install -y puppet-common
        (puppet module list |grep  puppetlabs-apt) || puppet module install puppetlabs-apt --version 1.7.0
        (puppet module list |grep  stankevich-python) || puppet module install stankevich-python --version 1.8.2"
    end

    base.vm.provision :puppet do |puppet|
      puppet.facter = {
        "docroot" => "/vagrant/"
      }
      puppet.manifest_file  = "base.pp"
      puppet.manifests_path = "deploy/puppet/manifests"
    end
  end

end
