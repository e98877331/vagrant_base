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

  # default use public network
  config.vm.network "public_network"

  # trusty 64
  config.vm.define "trusty64" do |test|
    test.vm.box = "trusty64"
    # test.vm.box_url = "ftp://172.16.10.200/ubuntu/CloudDataSolution/ArkExpress_release/trusty64.box"
    test.vm.hostname = "trusty64"
    test.vm.network :forwarded_port, guest: 80, host: 8003
    test.vm.network :forwarded_port, guest: 443, host: 8004

    config.vm.provision "shell", path: "deploy/test.sh"

    #test.vm.provision :puppet do |puppet|
    #  puppet.facter = {
    #    "docroot" => "/vagrant/"
    #  }
    #  puppet.manifest_file  = "test.pp"
    #  puppet.manifests_path = "puppet"
    #end
  end

end
