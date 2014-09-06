#! /bin/bash

# Load the VERBOSE setting and other rcS variables
. /lib/init/vars.sh

# Define LSB log_* functions.
# Depend on lsb-base (>= 3.2-14) to ensure that this file is present
# and status_of_proc is working.
. /lib/lsb/init-functions

echo "Starting Install Process"

#npm install

mkdir /etc/oauth2/
cp daemon/oauth2 /etc/init.d/
cp daemon/oauth2.conf /etc/oauth2/

echo "Success!"
