# Provider
#set access_key,secret_key correctly
provider "alicloud" {
  region      = "ap-northeast-1"
  access_key  = "LT*********wQ"
  secret_key   = "eB6*********fVU"
}

# VPC
resource "alicloud_vpc" "cloud_shell_tf_vpc1" {
  name       = "cloud_shell_tf_vpc1"
  cidr_block = "172.16.0.0/12"
}
# Vswitch1
resource "alicloud_vswitch" "sbc_migration_vsw1" {
  vpc_id            = "${alicloud_vpc.cloud_shell_tf_vpc1.id}"
  cidr_block        = "172.16.0.0/24"
  availability_zone = "ap-northeast-1a"
}
#security_group
resource "alicloud_security_group" "cloud_shell_tf_sg1" {
  name = "cloud_shell_tf_sg1"
  vpc_id = "${alicloud_vpc.cloud_shell_tf_vpc1.id}"
}
resource "alicloud_security_group_rule" "cloud_shell_tf_all_sgr1" {
  type              = "ingress"
  ip_protocol       = "all"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "1/65535"
  priority          = 1
  security_group_id = "${alicloud_security_group.cloud_shell_tf_sg1.id}"
  cidr_ip           = "0.0.0.0/0"
}
