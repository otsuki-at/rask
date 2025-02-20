up:
	docker compose up -d

setup:
	docker compose exec myapp bash -c 'bundle install'
<<<<<<< HEAD
	docker compose exec myapp bash -c 'bundle exec rails webpacker:install'
	docker compose exec myapp bash -c 'bundle exec rails tailwindcss:install'
=======
>>>>>>> 5aeacd6 (Port files from the Rask project)
	docker compose exec myapp bash -c 'bundle exec rails db:migrate'
	docker compose exec myapp bash -c 'bundle exec rails assets:precompile'

start:
	docker compose exec myapp bash -c 'bundle exec rails server -b 0.0.0.0'

myapp:
	docker compose exec myapp bash

down:
	docker compose down --rmi all --volumes

rails-test:
	docker compose exec myapp bundle exec rails test
