#!/bin/bash

set -e

REPO_NAME="nomlab/rask"
REMOTE_NAME="origin"

function main(){
    cd "$(dirname "$0")" || exit 1

    # Get current tag of this repository
    local_tag=$(git describe --tags --abbrev=0 2> /dev/null || echo v0.0.0)
    echo "Local Version: $local_tag"

    # Get latest tag from GitHub
    remote_tag=$(curl -s "https://api.github.com/repos/$REPO_NAME/releases/latest" | jq -r '.tag_name')
    echo "Remote Version: $remote_tag"


    # If the remote tag is newer than the local tag, update the Rask
    if greater_than "$remote_tag" "$local_tag"; then
        echo "Need to update Rask to $remote_tag"

        # Pull latest tag
        git pull $REMOTE_NAME tag "$remote_tag"

        # Update Rask image
        ./scripts/setup-production-container.sh "$USER"

        # Stop Rask container and then Rask is restarted by systemd
        ./bin/launch-production stop

        echo "Rask has been updated to $remote_tag"
    else
        echo "No new version available."
    fi
}

# Args: (version1: SemanticVersion, version2: SemanticVersion)
# Return: 0 if "version1 > version2", 1 if "version1 <= version2"
greater_than() {
    local ver1="$1"
    local ver2="$2"

    ver1="${ver1#v}"
    ver2="${ver2#v}"

    IFS='.' read -r -a v1_parts <<< "$ver1"
    IFS='.' read -r -a v2_parts <<< "$ver2"

    for i in 0 1 2; do
        v1_part="${v1_parts[i]:-0}"
        v2_part="${v2_parts[i]:-0}"

        if (( 10#$v1_part < 10#$v2_part )); then
            return 1
        elif (( 10#$v1_part > 10#$v2_part )); then
            return 0
        fi
    done

    return 1
}

main "$@"
