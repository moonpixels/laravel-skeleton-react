# Laravel Skeleton (React)

This is the Moon Pixels skeleton for building Laravel applications with Inertia and React.

## Local installation

The project is using Docker for local development via Laravel Sail. Therefore, you need to have Docker installed and
running on your machine.

You should also have the `sail` command available on your system. If you don't have it, you can alias it by running:

```shell
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
```

1. Clone the repository and cd into the project directory

   ```shell
   git clone git@github.com:moonpixels/laravel-skeleton-react.git && cd laravel-skeleton-react
   ```

2. Install the dependencies

   ```shell
   docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php84-composer:latest \
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

7. Run the migrations and seed the database

   ```shell
   sail artisan migrate:fresh --seed
   ```

8. Install the NPM dependencies

   ```shell
   sail npm install
   ```

9. Build the assets

   ```shell
   sail npm run build
   ```

10. Run the tests

    ```shell
    sail composer test
    ```

If the tests pass, you should be good to go.

### Post-installation steps

Once you have the project set up, you may also want to perform the following post-installation steps:

#### Starting the development server

You can now start the development server by running:

```shell
sail npm run dev
```

The application should now be available at [http://localhost](http://localhost).

#### Creating public storage symlink

To store files in the `public` directory, you need to create a symlink to the `storage/app/public` directory. You can do
this by running:

```shell
sail artisan storage:link
```

#### Running backend code checks via composer

There are a few composer scripts available for running code checks. You can run the following commands to check the
code:

```shell
# Run Rector automatic refactoring
sail composer rector

# Run Pint code styling
sail composer pint

# Run PHPStan static analysis
sail composer stan

# Run Pest tests
sail composer test

# Run all checks
sail composer checks
```

> You should always run `sail composer checks` before pushing your code. This will ensure that your code is clean and
> passes all checks that are enforced by the project CI/CD pipeline.

#### Running frontend code checks via npm

There are also a few npm scripts available for running code checks. You can run the following commands to check the
code:

```shell
# Run ESLint static analysis
sail npm run lint

# Run Prettier code styling
sail npm run format

# Run all checks
sail npm run checks
```

> You should always run `sail npm run checks` before pushing your code. This will ensure that your code is clean and
> passes all checks that are enforced by the project CI/CD pipeline.

## Additional services

The project comes with a few additional services which are enabled by default. These services are detailed below.

### Redis

Redis is used for caching and session management by default in the environment file. The Redis service is available on
port `6379`. You can adjust this port in the environment file by updating the `FORWARD_REDIS_PORT` variable.

You may also use Redis for the queue service. To do this, update the `QUEUE_CONNECTION` variable in the environment file
to `redis`. Laravel Horizon is used to manage the queues. You can access the Horizon dashboard
at [http://localhost/horizon](http://localhost/horizon). Remember, if you make a change to the queue configuration or
any jobs while using the Redis queue driver, you will need to restart the queue worker for the changes to take effect.
You can do this by running:

```shell
sail artisan horizon:terminate
```

> For the most part, you should use the `sync` queue driver for local development.

### MinIO

MinIO is an S3-compatible object storage service. The MinIO service is available on port `9000`. You can access the
MinIO dashboard at [http://localhost:8900](http://localhost:8900). The default username and password for the console are
`sail` and `password`, respectively. By default, the environment file is set to use the `local` disk for file storage.
However, you can update it to use MinIO by updating the `FILESYSTEM_DISK` variable in the environment file to `s3`.

You can update the ports used by MinIO by updating the `FORWARD_MINIO_PORT` and `FORWARD_MINIO_DASHBOARD_PORT` variables
in the environment file.

### Mailpit

Mailpit is a simple mail testing service. The Mailpit service is available on port `1025` and you can access the Mailpit
dashboard at [http://localhost:8025](http://localhost:8025). By default, the environment file is set to use the Mailpit
service for emails. If you need to change the ports, you can update the `FORWARD_MAILPIT_PORT` and
`FORWARD_MAILPIT_DASHBOARD_PORT` variables in the environment file.
