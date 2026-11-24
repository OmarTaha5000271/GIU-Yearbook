# Verification — 24 November 2026

- PHP 8.4.28 CLI and Composer 2.11.3 executed successfully.
- XAMPP portable Apache served `info.php` with PHP 8.2.12 and the Apache handler (HTTP 200).
- Apache served the GET search form successfully (HTTP 200).
- GET and POST script/HTML input was escaped; an array-shaped query parameter produced no PHP warning.
- Laravel 13.43 started at port 8000; the homepage and `/api/books` returned 200.
- All migrations ran successfully against XAMPP MariaDB 10.4.32 using the MySQL connection.
- Three HTTP POST requests created Dune, Emma and Persuasion with status 201. GET list and individual book routes returned the saved values.
- A direct SQL query confirmed all three rows in `books`.
- A missing title returned 422 with `errors.title`.
- A temporary fourth book tested optional year, PATCH, DELETE (204), and subsequent GET (404). The three sample books were retained.

Requests were sent programmatically, rather than through the Postman GUI. The supplied collection reproduces them in Postman. Database rows were inspected with SQL rather than manually through phpMyAdmin.

The PHPUnit feature suite is included but could not run in this restricted Windows session: PHP's `is_readable()` rejected the bootstrap file even though direct reads worked. Laravel's cache manifests also required a local-only workaround for an `is_writable()` false negative; original vendor code was restored before the HTTP checks. No vendor workaround is included in Git. The HTTP/MySQL results above are independent of PHPUnit and were observed directly.

Local preview used Apache on `127.0.0.1:8080`, Laravel on `127.0.0.1:8000`, and MariaDB on `127.0.0.1:3306`. These processes must be started again after a restart. Portable tools and database files are outside the repository; follow the README to reproduce setup on another machine.
