<?php
/**
 * BULLETPROOF Login - Handles ALL output issues
 */

// Start output buffering at MAXIMUM level
ob_start();

// Catch EVERYTHING before it gets sent
while (ob_get_level() > 0) {
    ob_end_clean();
}
ob_start();

// Configure session
@ini_set('session.cookie_lifetime', 86400);
@ini_set('session.gc_maxlifetime', 86400);
@session_set_cookie_params(86400);

// Start session
@session_start();

// Clean any output that happened
ob_clean();

// Load config
require_once __DIR__ . '/includes/config.php';

// Clean again after config load
ob_clean();

$error = '';

// Already logged in?
if (isset($_SESSION['editor_logged_in']) && $_SESSION['editor_logged_in'] === true) {
    ob_clean();
    header('Location: dashboard.php');
    ob_end_flush();
    exit;
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = 'Please enter username and password';
    } elseif ($username === EDITOR_USERNAME && password_verify($password, EDITOR_PASSWORD)) {
        // SUCCESS!
        $_SESSION['editor_logged_in'] = true;
        $_SESSION['editor_username'] = $username;
        $_SESSION['login_time'] = time();

        // Log the login
        $logDir = __DIR__ . '/logs';
        if (!is_dir($logDir)) {
            @mkdir($logDir, 0755, true);
        }
        $logFile = $logDir . '/activity.log';
        $logEntry = json_encode([
            'timestamp' => date('Y-m-d H:i:s'),
            'action' => 'user_login',
            'username' => $username,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ]);
        @file_put_contents($logFile, $logEntry . PHP_EOL, FILE_APPEND);

        // Redirect - clean buffer first
        ob_clean();
        header('Location: dashboard.php');
        ob_end_flush();
        exit;
    } else {
        $error = 'Invalid username or password';
    }
}

// Now output the HTML
ob_clean();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Neofox Visual Editor</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .login-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 420px;
            overflow: hidden;
        }

        .login-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }

        .login-header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .login-header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .login-body {
            padding: 40px 30px;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
            font-size: 14px;
        }

        .input-group {
            position: relative;
        }

        .input-group i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
        }

        .form-control {
            width: 100%;
            padding: 15px 15px 15px 45px;
            border: 2px solid #e1e4e8;
            border-radius: 10px;
            font-size: 15px;
            transition: all 0.3s;
        }

        .form-control:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .error-message {
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn-login {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .credentials-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            font-size: 13px;
            color: #1e40af;
        }

        .credentials-box strong {
            display: block;
            margin-bottom: 8px;
        }

        .credentials-box code {
            background: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>🦊 Visual Editor</h1>
            <p>Powerful, Intuitive, Easy to Use</p>
        </div>

        <div class="login-body">
            <?php if ($error): ?>
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="form-group">
                    <label for="username">Username</label>
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input type="text" id="username" name="username" class="form-control"
                               placeholder="Enter username" required autofocus>
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" name="password" class="form-control"
                               placeholder="Enter password" required>
                    </div>
                </div>

                <button type="submit" class="btn-login">
                    <i class="fas fa-sign-in-alt"></i> Sign In to Editor
                </button>
            </form>

            <div class="credentials-box">
                <strong>🔑 Default Login Credentials:</strong>
                Username: <code>admin</code><br>
                Password: <code>password</code>
            </div>
        </div>
    </div>
</body>
</html>
<?php ob_end_flush(); ?>
