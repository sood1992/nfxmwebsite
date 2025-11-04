<?php
/**
 * Test if sessions persist across page loads
 */

// Start output buffering
ob_start();

// Configure session
ini_set('session.cookie_lifetime', 86400);
ini_set('session.gc_maxlifetime', 86400);
session_set_cookie_params(86400);

// Start session
session_start();

ob_end_clean();

// Check if we've been here before
$visitCount = $_SESSION['visit_count'] ?? 0;
$visitCount++;
$_SESSION['visit_count'] = $visitCount;
$_SESSION['test_data'] = 'Session is working!';
$_SESSION['timestamp'] = time();

?>
<!DOCTYPE html>
<html>
<head>
    <title>Session Persistence Test</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .info { color: blue; }
        pre { background: #f8f8f8; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🔍 Session Persistence Test</h1>

    <div class="box">
        <h2>Visit Count: <?= $visitCount ?></h2>

        <?php if ($visitCount == 1): ?>
            <p class="info">First visit! Session has been created.</p>
            <p><strong>Action:</strong> Refresh this page (F5) or click the button below.</p>
            <p>If the visit count increases, sessions are working correctly!</p>
        <?php else: ?>
            <p class="success">✓ Session is persisting! Visit count increased to <?= $visitCount ?>.</p>
            <p>This means sessions ARE working on your server.</p>
        <?php endif; ?>

        <button onclick="location.reload()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
            Refresh Page
        </button>
    </div>

    <div class="box">
        <h2>Session Data</h2>
        <pre><?php print_r($_SESSION); ?></pre>
    </div>

    <div class="box">
        <h2>Session Info</h2>
        <p><strong>Session ID:</strong> <?= session_id() ?></p>
        <p><strong>Session Name:</strong> <?= session_name() ?></p>
        <p><strong>Session Save Path:</strong> <?= session_save_path() ?></p>
        <p><strong>Cookie Params:</strong></p>
        <pre><?php print_r(session_get_cookie_params()); ?></pre>
    </div>

    <div class="box">
        <h2>Test Login Simulation</h2>
        <?php
        // Simulate login
        $_SESSION['editor_logged_in'] = true;
        $_SESSION['editor_username'] = 'admin';
        $_SESSION['login_time'] = time();
        ?>
        <p>✓ Login session variables have been set!</p>
        <p><strong>Now test:</strong> <a href="dashboard.php" style="color: blue; text-decoration: underline;">Go to Dashboard</a></p>
        <p>If dashboard loads successfully, login should work!</p>
        <p>If it redirects back here or to login, there's a session check issue in dashboard.php</p>
    </div>

    <div class="box">
        <h2>📋 Diagnosis</h2>
        <?php if ($visitCount > 1): ?>
            <p class="success">✓ Sessions ARE persisting correctly!</p>
            <p class="info">The login reload issue is likely caused by:</p>
            <ul>
                <li>Dashboard.php not finding the session correctly</li>
                <li>Session check in dashboard.php failing</li>
                <li>A redirect loop between login and dashboard</li>
            </ul>
            <p><strong>Next step:</strong> Click the "Go to Dashboard" link above to test if dashboard accepts the session.</p>
        <?php else: ?>
            <p class="info">Refresh this page to see if sessions persist.</p>
        <?php endif; ?>
    </div>
</body>
</html>
