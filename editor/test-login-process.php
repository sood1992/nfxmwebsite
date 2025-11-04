<?php
/**
 * Test actual login process to find where headers are being sent
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<pre>";
echo "=== TESTING LOGIN PROCESS STEP BY STEP ===\n\n";

// Test 1: Start with output buffering like login.php does
echo "Step 1: Starting output buffering...\n";
ob_start();
echo "   ✓ ob_start() called\n";

// Test 2: Configure session
echo "Step 2: Configuring session...\n";
ini_set('session.cookie_lifetime', 86400);
ini_set('session.gc_maxlifetime', 86400);
session_set_cookie_params(86400);
echo "   ✓ Session configured\n";

// Test 3: Start session
echo "Step 3: Starting session...\n";
$sessionStarted = @session_start();
if ($sessionStarted) {
    echo "   ✓ Session started successfully\n";
} else {
    echo "   ✗ Session failed to start\n";
    $error = error_get_last();
    if ($error) {
        echo "   Error: " . $error['message'] . "\n";
    }
}

// Test 4: Clean output buffer
echo "Step 4: Cleaning output buffer...\n";
ob_end_clean();
echo "   ✓ Output buffer cleaned\n";

// Test 5: Load config
echo "Step 5: Loading config.php...\n";
ob_start(); // Start new buffer to catch any output from config
require_once __DIR__ . '/includes/config.php';
$configOutput = ob_get_clean();
if (empty($configOutput)) {
    echo "   ✓ config.php loaded with NO output\n";
} else {
    echo "   ✗ config.php produced output:\n";
    echo "   Length: " . strlen($configOutput) . " bytes\n";
    echo "   Content (first 200 chars): " . substr(var_export($configOutput, true), 0, 200) . "\n";
}

// Test 6: Try to set a header (this is what login.php does when redirecting)
echo "Step 6: Testing if we can set headers now...\n";
if (headers_sent($file, $line)) {
    echo "   ✗ Headers already sent!\n";
    echo "   Sent from: $file on line $line\n";
} else {
    echo "   ✓ Headers NOT sent yet - we can redirect!\n";
}

// Test 7: Simulate the actual login process
echo "\nStep 7: Simulating actual login with credentials...\n";
$_POST['username'] = 'admin';
$_POST['password'] = 'password';

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if ($username === EDITOR_USERNAME && password_verify($password, EDITOR_PASSWORD)) {
    echo "   ✓ Credentials verified\n";

    $_SESSION['editor_logged_in'] = true;
    $_SESSION['editor_username'] = $username;
    $_SESSION['login_time'] = time();

    echo "   ✓ Session variables set\n";

    // Now try to redirect
    echo "   Testing redirect...\n";
    if (headers_sent($file, $line)) {
        echo "   ✗ Cannot redirect - headers already sent\n";
        echo "   Sent from: $file on line $line\n";
    } else {
        echo "   ✓ CAN redirect! Login would work!\n";
    }
} else {
    echo "   ✗ Credential verification failed\n";
}

// Test 8: Check for whitespace at end of config.php
echo "\nStep 8: Checking config.php for trailing whitespace...\n";
$configFile = __DIR__ . '/includes/config.php';
$configContent = file_get_contents($configFile);
$configLength = strlen($configContent);
$configTrimmed = rtrim($configContent);
$trimmedLength = strlen($configTrimmed);

if ($configLength === $trimmedLength) {
    echo "   ✓ No trailing whitespace\n";
} else {
    $diff = $configLength - $trimmedLength;
    echo "   ✗ Found $diff trailing whitespace characters\n";
}

// Check if it ends with ?>
if (substr($configTrimmed, -2) === '?>') {
    echo "   ⚠ Warning: config.php ends with ?> (should be removed)\n";
} else {
    echo "   ✓ config.php does not end with ?>\n";
}

// Test 9: Check functions.php
echo "\nStep 9: Checking functions.php...\n";
$functionsFile = __DIR__ . '/includes/functions.php';
if (file_exists($functionsFile)) {
    $functionsContent = file_get_contents($functionsFile);
    $functionsLength = strlen($functionsContent);
    $functionsTrimmed = rtrim($functionsContent);
    $trimmedLength = strlen($functionsTrimmed);

    if ($functionsLength === $trimmedLength) {
        echo "   ✓ No trailing whitespace\n";
    } else {
        $diff = $functionsLength - $trimmedLength;
        echo "   ✗ Found $diff trailing whitespace characters\n";
    }

    // Check if it ends with ?>
    if (substr($functionsTrimmed, -2) === '?>') {
        echo "   ⚠ Warning: functions.php ends with ?> (should be removed)\n";
    } else {
        echo "   ✓ functions.php does not end with ?>\n";
    }
} else {
    echo "   ⚠ functions.php not found\n";
}

echo "\n=== FINAL VERDICT ===\n";
if (!headers_sent()) {
    echo "✓ SUCCESS! Login should work. Headers have not been sent.\n";
    echo "  If login still fails, the issue might be browser cache or cookies.\n";
    echo "  Try clearing browser cache and cookies for this site.\n";
} else {
    headers_sent($file, $line);
    echo "✗ PROBLEM FOUND! Headers sent from: $file on line $line\n";
    echo "  This is what's preventing login from working.\n";
}

echo "</pre>";
?>
