# Laravel Skeleton

This is the Moon Pixels skeleton for building Laravel applications.

## Local installation

The project is using Docker for local development via Laravel Sail. Therefore, you need to have Docker installed and
running on your machine.

You should also have the `sail` command available on your system. If you don't have it, you can alias it by running:

```shell
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
```

1. Clone the repository and cd into the project directory

   ```shell
   git clone git@github.com:moonpixels/laravel-skeleton-vue.git && cd laravel-skeleton
   ```

2. Install the dependencies

   ```shell
   docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs
   ```

3. Copy the `.env.example` file to `.env` and update the environment variables

   ```shell
   cp .env.example .env
   ```

4. Start sail

   ```shell
   sail up -d
   ```

5. Generate the application key

   ```shell
   sail artisan key:generate
   ```

6. Create the database

   ```shell
   touch database/database.sqlite
   ```

7. Run the migrations

   ```shell
   sail artisan migrate
   ```

8. Install the NPM dependencies

   ```shell
   sail npm install
   ```

9. Start the development server

   ```shell
   sail npm run dev
   ```

10. Visit `http://localhost` in your browser
