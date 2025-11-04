<?php
/**
 * Login Diagnostic Tool
 * Upload this to /public_html/nfmw/editor/ and access it via browser
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<html><head><title>Login Diagnostics</title><style>
body { font-family: monospace; padding: 20px; background: #f5f5f5; }
.success { color: green; font-weight: bold; }
.error { color: red; font-weight: bold; }
.warning { color: orange; font-weight: bold; }
.section { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
h2 { color: #667eea; margin-top: 0; }
pre { background: #f8f8f8; padding: 10px; overflow-x: auto; }
code { background: #ffe; padding: 2px 5px; }
</style></head><body>";

echo "<h1>🔍 Neofox Editor - Login Diagnostic Report</h1>";
echo "<p>Generated: " . date('Y-m-d H:i:s') . "</p>";

// Test 1: Check PHP Version
echo "<div class='section'>";
echo "<h2>1. PHP Version</h2>";
$phpVersion = phpversion();
echo "PHP Version: <strong>$phpVersion</strong> ";
if (version_compare($phpVersion, '7.0', '>=')) {
    echo "<span class='success'>✓ Compatible</span>";
} else {
    echo "<span class='error'>✗ PHP 7.0+ required</span>";
}
echo "</div>";

// Test 2: Check if config.php exists and can be loaded
echo "<div class='section'>";
echo "<h2>2. Configuration File</h2>";
$configPath = __DIR__ . '/includes/config.php';
if (file_exists($configPath)) {
    echo "Config file: <span class='success'>✓ Found</span><br>";
    echo "Path: <code>$configPath</code><br>";

    // Check if config has the session lines commented out
    $configContent = file_get_contents($configPath);
    if (strpos($configContent, '// ini_set(\'session.gc_maxlifetime\'') !== false) {
        echo "Session config: <span class='success'>✓ Properly commented out (GOOD!)</span><br>";
    } else if (strpos($configContent, 'ini_set(\'session.gc_maxlifetime\'') !== false) {
        echo "Session config: <span class='error'>✗ NOT commented out (BAD!)</span><br>";
        echo "<strong>ACTION NEEDED:</strong> Comment out lines with session config in config.php<br>";
    }

    // Try to include it
    try {
        require_once $configPath;
        echo "Config load: <span class='success'>✓ Loaded successfully</span><br>";
        echo "Username defined: " . (defined('EDITOR_USERNAME') ? '<span class="success">✓ Yes</span>' : '<span class="error">✗ No</span>') . "<br>";
        echo "Password defined: " . (defined('EDITOR_PASSWORD') ? '<span class="success">✓ Yes</span>' : '<span class="error">✗ No</span>') . "<br>";
    } catch (Exception $e) {
        echo "Config load: <span class='error'>✗ Error: " . $e->getMessage() . "</span><br>";
    }
} else {
    echo "Config file: <span class='error'>✗ Not found</span><br>";
}
echo "</div>";

// Test 3: Check login.php file
echo "<div class='section'>";
echo "<h2>3. Login.php File Check</h2>";
$loginPath = __DIR__ . '/login.php';
if (file_exists($loginPath)) {
    echo "Login file: <span class='success'>✓ Found</span><br>";
    $loginContent = file_get_contents($loginPath);

    // Check for key indicators that it's the new version
    if (strpos($loginContent, 'Configure session BEFORE starting it') !== false) {
        echo "File version: <span class='success'>✓ Updated version detected</span><br>";
    } else {
        echo "File version: <span class='error'>✗ Old version detected</span><br>";
        echo "<strong>ACTION NEEDED:</strong> Replace login.php with the new version<br>";
    }

    if (strpos($loginContent, 'dashboard.php') !== false) {
        echo "Redirect target: <span class='success'>✓ Redirects to dashboard.php</span><br>";
    } else {
        echo "Redirect target: <span class='warning'>⚠ Redirects to index.php</span><br>";
    }
} else {
    echo "Login file: <span class='error'>✗ Not found</span><br>";
}
echo "</div>";

// Test 4: Session Test
echo "<div class='section'>";
echo "<h2>4. Session Configuration Test</h2>";

// Configure session like login.php does
ini_set('session.cookie_lifetime', 86400);
ini_set('session.gc_maxlifetime', 86400);
session_set_cookie_params(86400);

echo "Session cookie lifetime: <code>" . ini_get('session.cookie_lifetime') . "</code> seconds<br>";
echo "Session GC maxlifetime: <code>" . ini_get('session.gc_maxlifetime') . "</code> seconds<br>";

// Try to start session
ob_start();
session_start();
$sessionOutput = ob_get_clean();

if (empty($sessionOutput)) {
    echo "Session start: <span class='success'>✓ No warnings</span><br>";
} else {
    echo "Session start: <span class='error'>✗ Warnings/errors detected:</span><br>";
    echo "<pre>$sessionOutput</pre>";
}

echo "Session ID: <code>" . session_id() . "</code><br>";
$_SESSION['test'] = 'value';
echo "Session write: <span class='success'>✓ Can write to session</span><br>";
echo "</div>";

// Test 5: Password Verification
echo "<div class='section'>";
echo "<h2>5. Password Verification Test</h2>";
if (defined('EDITOR_USERNAME') && defined('EDITOR_PASSWORD')) {
    $testUsername = 'admin';
    $testPassword = 'password';

    echo "Testing credentials: <code>admin</code> / <code>password</code><br>";
    echo "Configured username: <code>" . EDITOR_USERNAME . "</code><br>";

    if ($testUsername === EDITOR_USERNAME) {
        echo "Username match: <span class='success'>✓ Correct</span><br>";
    } else {
        echo "Username match: <span class='error'>✗ Does not match</span><br>";
    }

    if (password_verify($testPassword, EDITOR_PASSWORD)) {
        echo "Password verify: <span class='success'>✓ Password 'password' is correct</span><br>";
    } else {
        echo "Password verify: <span class='error'>✗ Password verification failed</span><br>";
    }
} else {
    echo "<span class='error'>✗ Constants not defined</span><br>";
}
echo "</div>";

// Test 6: Directory Permissions
echo "<div class='section'>";
echo "<h2>6. Directory & File Permissions</h2>";
$dirs = [
    'database' => __DIR__ . '/database',
    'backups' => __DIR__ . '/backups',
    'logs' => __DIR__ . '/logs',
];

foreach ($dirs as $name => $path) {
    if (is_dir($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -4);
        $writable = is_writable($path);
        echo "$name/: <code>$perms</code> " . ($writable ? '<span class="success">✓ Writable</span>' : '<span class="error">✗ Not writable</span>') . "<br>";
    } else {
        echo "$name/: <span class='warning'>⚠ Directory does not exist</span><br>";
    }
}
echo "</div>";

// Test 7: .htaccess Check
echo "<div class='section'>";
echo "<h2>7. .htaccess File Check</h2>";
$htaccessPath = __DIR__ . '/.htaccess';
if (file_exists($htaccessPath)) {
    echo ".htaccess: <span class='success'>✓ Found</span><br>";
    $htaccessContent = file_get_contents($htaccessPath);

    if (strpos($htaccessContent, 'Require all denied') !== false) {
        echo "Apache syntax: <span class='success'>✓ Apache 2.4 syntax detected</span><br>";
    } else if (strpos($htaccessContent, 'Order allow,deny') !== false) {
        echo "Apache syntax: <span class='error'>✗ Old Apache 2.2 syntax detected</span><br>";
        echo "<strong>ACTION NEEDED:</strong> Update .htaccess to Apache 2.4 syntax<br>";
    }
} else {
    echo ".htaccess: <span class='warning'>⚠ Not found</span><br>";
}
echo "</div>";

// Test 8: Simulate Login Process
echo "<div class='section'>";
echo "<h2>8. Login Process Simulation</h2>";
if (defined('EDITOR_USERNAME') && defined('EDITOR_PASSWORD')) {
    echo "Simulating login with admin/password...<br><br>";

    $username = 'admin';
    $password = 'password';

    if (empty($username) || empty($password)) {
        echo "Step 1: <span class='error'>✗ Empty credentials</span><br>";
    } else {
        echo "Step 1: <span class='success'>✓ Credentials not empty</span><br>";
    }

    if ($username === EDITOR_USERNAME) {
        echo "Step 2: <span class='success'>✓ Username matches</span><br>";
    } else {
        echo "Step 2: <span class='error'>✗ Username does not match</span><br>";
    }

    if (password_verify($password, EDITOR_PASSWORD)) {
        echo "Step 3: <span class='success'>✓ Password verified</span><br>";

        // Simulate session setting
        $_SESSION['editor_logged_in'] = true;
        $_SESSION['editor_username'] = $username;
        $_SESSION['login_time'] = time();

        echo "Step 4: <span class='success'>✓ Session variables set</span><br>";
        echo "Session data: <pre>" . print_r($_SESSION, true) . "</pre>";

        echo "<br><strong>✅ LOGIN WOULD SUCCEED</strong><br>";
        echo "Would redirect to: <code>dashboard.php</code><br>";
    } else {
        echo "Step 3: <span class='error'>✗ Password verification failed</span><br>";
        echo "<br><strong>❌ LOGIN WOULD FAIL</strong><br>";
    }
} else {
    echo "<span class='error'>Cannot simulate - constants not defined</span><br>";
}
echo "</div>";

// Test 9: Check if dashboard.php exists
echo "<div class='section'>";
echo "<h2>9. Dashboard File Check</h2>";
$dashboardPath = __DIR__ . '/dashboard.php';
if (file_exists($dashboardPath)) {
    echo "dashboard.php: <span class='success'>✓ Exists</span><br>";
    echo "Size: " . filesize($dashboardPath) . " bytes<br>";
} else {
    echo "dashboard.php: <span class='error'>✗ Not found</span><br>";
    echo "<strong>ACTION NEEDED:</strong> Dashboard file is missing!<br>";
}
echo "</div>";

// Summary
echo "<div class='section' style='border-left-color: #764ba2;'>";
echo "<h2>📋 Summary & Recommendations</h2>";

$issues = [];
if (!file_exists($configPath)) $issues[] = "Config file missing";
if (!file_exists($loginPath)) $issues[] = "Login file missing";
if (!file_exists($dashboardPath)) $issues[] = "Dashboard file missing";

if (empty($issues)) {
    echo "<p class='success'>✅ All critical files are present.</p>";
} else {
    echo "<p class='error'>❌ Issues found:</p><ul>";
    foreach ($issues as $issue) {
        echo "<li>$issue</li>";
    }
    echo "</ul>";
}

echo "<p><strong>Next steps:</strong></p>";
echo "<ol>";
echo "<li>Review any errors marked with <span class='error'>✗</span> above</li>";
echo "<li>If 'LOGIN WOULD SUCCEED' is shown, try logging in at <a href='login.php'>login.php</a></li>";
echo "<li>If issues persist, share this diagnostic report</li>";
echo "</ol>";

echo "<p><strong>Test actual login:</strong> <a href='login.php' style='background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;'>Go to Login Page</a></p>";

echo "</div>";

echo "</body></html>";
?>
