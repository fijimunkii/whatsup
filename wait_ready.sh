#!/bin/sh
#
# wait until app is responding

until [ curl -fs https://localhost:5555 ]; do
  sleep 0.1;
done
