<?php
function inputText(array $source, string $key): string
{
    return isset($source[$key]) && is_string($source[$key]) ? trim($source[$key]) : '';
}

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function greet(string $name): string
{
    return 'Hello, ' . ($name !== '' ? $name : 'guest') . '!';
}

$search = inputText($_GET, 'search');
$name = inputText($_POST, 'name');
$email = inputText($_POST, 'email');
$submitted = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$books = [
    ['title' => 'Dune', 'author' => 'Frank Herbert', 'year' => 1965],
    ['title' => 'Emma', 'author' => 'Jane Austen', 'year' => 1815],
    ['title' => 'Persuasion', 'author' => 'Jane Austen', 'year' => 1817],
];
$results = array_filter($books, fn ($book) => $search === '' || stripos($book['title'], $search) !== false);
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lab 9 · PHP forms</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #f5f5f3; color: #202020; font: 16px/1.6 system-ui, sans-serif; }
    main { max-width: 780px; margin: 40px auto; padding: 0 20px; }
    section { background: white; border: 1px solid #ddddd8; border-radius: 8px; padding: 24px; margin: 24px 0; }
    h1, h2 { line-height: 1.2; } h1 { font-family: Georgia, serif; }
    label { display: block; margin-top: 12px; }
    input { width: 100%; padding: 12px; border: 1px solid #73736f; border-radius: 4px; font: inherit; }
    button { background: #b52430; color: white; border: 0; padding: 12px 20px; margin-top: 16px; border-radius: 4px; font: inherit; cursor: pointer; }
    pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #f5f5f3; padding: 16px; }
    .result { overflow-wrap: anywhere; }
    :focus-visible { outline: 3px solid #d39424; outline-offset: 3px; }
  </style>
</head>
<body><main>
  <p>WEB PROGRAMMING / LAB 9</p>
  <h1>Books, forms, and a little PHP.</h1>
  <section>
    <h2>Search the bookshelf</h2>
    <form method="get" action="index.php">
      <label for="search">Book title</label>
      <input id="search" name="search" value="<?= escape($search) ?>">
      <button type="submit">Search</button>
    </form>
    <p class="result">You searched for: <?= $search !== '' ? escape($search) : 'all books' ?></p>
    <ul>
      <?php foreach ($results as $book): ?>
        <li><?= escape($book['title']) ?> — <?= escape($book['author']) ?> (<?= $book['year'] ?>)</li>
      <?php endforeach; ?>
    </ul>
    <?php if (!$results): ?><p>No matching books.</p><?php endif; ?>
  </section>
  <section>
    <h2>Say hello</h2>
    <form method="post" action="index.php">
      <label for="name">Your name</label><input id="name" name="name" value="<?= escape($name) ?>">
      <label for="email">Email</label><input id="email" name="email" type="email" value="<?= escape($email) ?>">
      <button type="submit">Send</button>
    </form>
    <?php if ($submitted): ?>
      <div class="result" role="status"><p><?= escape(greet($name)) ?></p><p>Email: <?= escape($email) ?></p></div>
    <?php endif; ?>
  </section>
  <section><h2>The same books as JSON</h2>
    <pre><?= escape(json_encode($books, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)) ?></pre>
  </section>
</main></body></html>
