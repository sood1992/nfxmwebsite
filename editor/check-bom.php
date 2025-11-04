<?php
/**
 * Check for UTF-8 BOM in PHP files
 */
header('Content-Type: text/plain; charset=utf-8');

echo "=== CHECKING FOR UTF-8 BOM IN PHP FILES ===\n\n";

$files = [
    'config.php' => __DIR__ . '/includes/config.php',
    'functions.php' => __DIR__ . '/includes/functions.php',
    'login.php' => __DIR__ . '/login.php',
];

$utf8_bom = "\xEF\xBB\xBF";

foreach ($files as $name => $path) {
    if (!file_exists($path)) {
        echo "$name: FILE NOT FOUND\n";
        continue;
    }

    $content = file_get_contents($path);
    $firstThree = substr($content, 0, 3);

    echo "$name:\n";

    // Check for UTF-8 BOM
    if ($firstThree === $utf8_bom) {
        echo "  ✗ HAS UTF-8 BOM (This causes headers already sent!)\n";
        echo "  First 3 bytes: " . bin2hex($firstThree) . "\n";
    } else {
        echo "  ✓ No UTF-8 BOM\n";
    }

    // Check first 10 characters
    $first10 = substr($content, 0, 10);
    echo "  First 10 chars: " . var_export($first10, true) . "\n";
    echo "  Hex: " . bin2hex($first10) . "\n";

    // Check for whitespace before <?php
    if (!str_starts_with(ltrim($content), '<?php')) {
        echo "  ✗ WARNING: File doesn't start with <?php\n";
    } else {
        if (str_starts_with($content, '<?php')) {
            echo "  ✓ Starts with <?php (no leading whitespace)\n";
        } else {
            echo "  ⚠ Has whitespace before <?php\n";
            $pos = strpos($content, '<?php');
            echo "  Whitespace bytes: " . $pos . "\n";
        }
    }

    echo "\n";
}

echo "=== RECOMMENDATION ===\n";
echo "If any files have UTF-8 BOM or leading whitespace, they must be fixed.\n";
echo "These invisible characters cause 'headers already sent' errors.\n";
?>
