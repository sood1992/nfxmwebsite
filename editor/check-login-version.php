<?php
/**
 * Quick check to verify login.php has output buffering
 */
header('Content-Type: text/plain');

$loginFile = __DIR__ . '/login.php';
$content = file_get_contents($loginFile);

echo "=== LOGIN.PHP VERSION CHECK ===\n\n";

// Check for output buffering
if (strpos($content, 'ob_start()') !== false) {
    echo "✓ Output buffering code FOUND (ob_start)\n";
} else {
    echo "✗ Output buffering code MISSING (ob_start)\n";
    echo "   ACTION: You need to update login.php!\n";
}

// Check for the bulletproof comment
if (strpos($content, 'Bulletproof Version') !== false) {
    echo "✓ Bulletproof version comment FOUND\n";
} else {
    echo "✗ Bulletproof version comment MISSING\n";
}

// Check for ob_end_clean
if (strpos($content, 'ob_end_clean()') !== false) {
    echo "✓ Output buffer cleanup code FOUND (ob_end_clean)\n";
} else {
    echo "✗ Output buffer cleanup code MISSING (ob_end_clean)\n";
}

// Show first 30 lines
echo "\n=== FIRST 30 LINES OF login.php ===\n\n";
$lines = explode("\n", $content);
for ($i = 0; $i < min(30, count($lines)); $i++) {
    printf("%3d: %s\n", $i + 1, $lines[$i]);
}

echo "\n=== VERDICT ===\n";
if (strpos($content, 'ob_start()') !== false && strpos($content, 'ob_end_clean()') !== false) {
    echo "✓ login.php has the correct version with output buffering!\n";
    echo "   If login still doesn't work, the issue is elsewhere.\n";
} else {
    echo "✗ login.php DOES NOT have output buffering code!\n";
    echo "   You need to replace the file with the updated version.\n";
}
?>
