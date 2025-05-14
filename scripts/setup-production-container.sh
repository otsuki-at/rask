#!/bin/bash

# This scripts is for setting up rask image
# * Create rask image

function usage() {
    cat <<_EOT_
Description:
    Setup Rask container

Note:
    This script is only for production environment.
    If you want to use development environment, build image with 'rask/Dockerfile'

Usage:
    setup-docker.sh <UserName>
    <UserName> : name of user that runs rask container.
_EOT_
}

function main() {
    cd $(dirname $0)
    cd ../

    if [ "$1" = "" ]; then
        usage
        exit 1
    fi

    if ! user_exists $1; then
        echo
        echo "Error:"
        echo "     Specified user does not exist"
        exit 1
    fi

    if ! [ -e .env ]; then
        echo
        echo "Error:"
        echo "    Not found: .env"
        echo "Help:"
        echo "    create .env from .env.sample"
        exit 1
    fi

    if ! [ -e config/master.key ]; then
            echo
            echo "Error:"
            echo "    'config/master.key' not found."
            echo "Help:"
            echo "    Bring master.key for current credentials.yml.enc"
            exit 1
    fi

    echo
    echo "Creating Rask image"
    if ! docker build -f Dockerfile_production \
            -t rask:$(git describe --tags --abbrev=0 || echo latest) \
            --build-arg UID=$(id -u $1) --build-arg GID=$(id -g $1) \
            .
        then
        echo
        echo "Error:"
        echo "    Failed to build docker image"
        exit 1
    fi

    echo "Done."
}

function user_exists() {
    if id -u $1 > /dev/null; then
        return 0
    else
        return 1
    fi
}

main $1
