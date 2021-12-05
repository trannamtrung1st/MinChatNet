#!/bin/sh

# ALTER KEYSPACE system_auth WITH replication = {'class': 'NetworkTopologyStrategy', 'DC1': 3, 'DC2': 3};

echo Init Cassandra

cassandra -R

echo Wait for initialization
sleep 5

while cqlsh -e 'help' 2>&1 >/dev/null | grep ConnectionRefusedError ; do
	echo Wait 5s!
    sleep 5
done

echo Prepare to run CQL
sleep 15

cqlsh -u cassandra -p cassandra -f /create-user.cql

cqlsh -u admin -p 123456 -f /finish-setup.cql

echo Finish setup CQL
while true ; do
	sleep 60
done