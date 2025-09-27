db-run:
	@docker-compose build
	@docker-compose up

db-down:
	docker-compose down

db-clean:
	@docker-compose down
	@docker compose rm -v

# Removes all installed packages
clean:
	rm -rf ./node_modules

# Installs everything required for the environment
install:
	@npm install -g cspell@latest
	@npm install

# Checks all files for misspelled words
spellcheck:
	cspell .

# Runs the application locally to be able to view the website as it would in production based on the current code
run:
	node index.js