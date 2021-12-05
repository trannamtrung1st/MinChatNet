FROM cassandra:4.0.1
WORKDIR /etc/cassandra/
COPY cassandra.yaml .
COPY init.sh /
COPY create-user.cql /
COPY finish-setup.cql /
ENTRYPOINT ["/init.sh"]