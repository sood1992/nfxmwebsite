<?php
/**
 * Final test - exactly mimics login.php without any echo statements
 * This will tell us if login actually works or not
 */

// NO OUTPUT until the very end

// Start output buffering FIRST
ob_start();

// Configure session
ini_set('session.cookie_lifetime', 86400);
ini_set('session.gc_maxlifetime', 86400);
session_set_cookie_params(86400);

// Start session
session_start();

// Clean buffer
ob_end_clean();

// Load config
require_once __DIR__ . '/includes/config.php';

// Check if headers can be sent now
if (headers_sent($file, $line)) {
    // Headers already sent - we have a problem
    ob_start();
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login Test - FAILED</title>
        <style>
            body { font-family: monospace; padding: 20px; background: #fee; }
            .error { color: red; font-weight: bold; font-size: 18px; }
            pre { background: white; padding: 15px; border: 2px solid red; }
        </style>
    </head>
    <body>
        <h1 class="error">❌ LOGIN WILL FAIL</h1>
        <p>Headers have already been sent, so redirect cannot work.</p>
        <pre>
Headers sent from: <?= $file ?>

Line number: <?= $line ?>

This file is outputting something before the redirect can happen.
        </pre>
        <p><strong>Action needed:</strong> Fix the file mentioned above.</p>
    </body>
    </html>
    <?php
    ob_end_flush();
} else {
    // Headers NOT sent - we can redirect!

    // Simulate login
    $username = 'admin';
    $password = 'password';

    if ($username === EDITOR_USERNAME && password_verify($password, EDITOR_PASSWORD)) {
        $_SESSION['editor_logged_in'] = true;
        $_SESSION['editor_username'] = $username;
        $_SESSION['login_time'] = time();

        // Try to redirect
        ob_start();
        header('Location: dashboard.php');
        ob_end_flush();
        exit;
    }
}
?>
