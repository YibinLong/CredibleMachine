#!/bin/bash

# Ports used by this project
PORTS=(8080 8081 4173)

for PORT in "${PORTS[@]}"; do
    PID=$(lsof -ti :$PORT 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "Killing process on port $PORT (PID: $PID)"
        kill -9 $PID
    else
        echo "Port $PORT is free"
    fi
done
