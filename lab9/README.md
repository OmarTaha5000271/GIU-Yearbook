# Lab 9: PHP forms and a Books API

This folder contains the three Lab 9 tasks. The Angular yearbook remains at the repository root; the new Laravel backend is in `books-api`.

## Task 1 — Local setup

1. Install [XAMPP](https://www.apachefriends.org/download.html) and start Apache and MySQL in its control panel.
2. Install [PHP 8.4 or newer](https://www.php.net/downloads.php) and [Composer](https://getcomposer.org/download/). This project's locked dependencies were resolved with PHP 8.4. Laravel 13 itself needs PHP 8.3+, while the Windows XAMPP bundle may have an older PHP. Use PHP 8.4 for Composer and Artisan; Apache can use its bundled PHP for the plain forms.
3. Verify `php -v` and `composer --version`. Enable `curl`, `fileinfo`, `mbstring`, `openssl`, `pdo_mysql`, `pdo_sqlite`, `sqlite3`, and `zip` in the CLI PHP configuration.
4. Copy `php-forms` into XAMPP's `htdocs` as `lab9`. Open `http://localhost/lab9/info.php` to check Apache/PHP, then `http://localhost/lab9/index.php` for Task 2. Keep `info.php` local; it exposes configuration details.
5. Open `http://localhost/phpmyadmin` and create a database named **books**. Do not drop an existing database.
6. In a terminal opened in `lab9/books-api`, run:

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate
php artisan route:list --path=api
php artisan serve
```

The example environment uses MySQL on `127.0.0.1:3306`, database `books`, username `root`, and an empty password, matching a default local XAMPP setup. Change these values in `.env` if your installation differs. `.env` is ignored by Git. After changing it, run `php artisan config:clear`.

Open `http://localhost:8000` for Laravel and `http://localhost:8000/api/books` for the API. API routing is already registered in `bootstrap/app.php`, so there is no need to rerun `install:api` just to create the route file.

## Task 2 — Plain PHP

`php-forms/index.php` includes:

- A GET form that searches book titles and safely displays the search text.
- A POST form that displays a name and email without putting them in the URL.
- A greeting function with a guest fallback.
- An associative array of three books printed with `json_encode`.
- `htmlspecialchars` for every piece of user input printed in HTML, including input attributes. Missing keys and array-shaped parameters do not cause warnings.

Try `<script>alert(1)</script>` as a name or search. It should display as text, never run. POST is not encryption: it moves the fields into the request body.

## Task 3 — Laravel API

| Method | URL | Result |
| --- | --- | --- |
| GET | `/api/books` | All books, 200 |
| POST | `/api/books` | Create a book, 201 |
| GET | `/api/books/{id}` | One book, or 404 |
| PUT / PATCH | `/api/books/{id}` | Update the supplied fields, 200 |
| DELETE | `/api/books/{id}` | Delete one book, 204 |

The migration creates `id`, `title`, `author`, nullable integer `year`, and timestamps. The Book model allows mass assignment only for `title`, `author`, and `year`. Route model binding returns 404 for missing books.

Import `Lab9.postman_collection.json` into Postman. Run **Create Dune**, **Create Emma**, and **Create Persuasion**, then **List books** and **Show one book**. Each successful POST remembers its new ID in `bookId`. Inspect the three rows in phpMyAdmin before running the optional delete request. Repeating the create requests deliberately creates more records.

Send JSON with `Accept: application/json` and `Content-Type: application/json`, for example:

```json
{"title":"Dune","author":"Frank Herbert","year":1965}
```

**What should happen when the title is missing?** The slide's unvalidated example reaches the database and fails with HTTP 500 because title cannot be null. This implementation checks input first and returns HTTP **422** with `errors.title`, without inserting a row. Author is also required; year is optional and must be an integer from 1 to 9999 when supplied.

## Tests

```powershell
php artisan test
```

The feature tests use a separate SQLite database in memory, never the `books` database. They check three POSTs, list/show, optional year, ignored extra fields, validation, updates, deletion, and missing IDs. The actual development connection remains MySQL.

The application is a local learning API with no authentication, as requested in this lab.
