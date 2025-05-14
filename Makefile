PROJECT_NAME=rask

UID=$(shell id -u)
GID=$(shell id -g)

up:
	UID=${UID} GID=${GID} docker compose up -d

setup:
	UID=${UID} GID=${GID} docker compose exec ${PROJECT_NAME} bash -c 'bundle install'

shell:
	UID=${UID} GID=${GID} docker compose exec ${PROJECT_NAME} bash

down:
	UID=${UID} GID=${GID} docker compose down

test:
	UID=${UID} GID=${GID} docker compose exec ${PROJECT_NAME} bundle exec rails test
