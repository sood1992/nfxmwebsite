<?php
/**
 * Custom Session Handler using SQLite Database
 * Fixes session persistence issues on shared hosting
 */

class DatabaseSessionHandler implements SessionHandlerInterface
{
    private $db;
    private $dbPath;

    public function __construct($dbPath)
    {
        $this->dbPath = $dbPath;
    }

    public function open($savePath, $sessionName): bool
    {
        try {
            $this->db = new SQLite3($this->dbPath);

            // Create sessions table if it doesn't exist
            $this->db->exec("
                CREATE TABLE IF NOT EXISTS sessions (
                    id TEXT PRIMARY KEY,
                    data TEXT,
                    last_access INTEGER,
                    created_at INTEGER
                )
            ");

            return true;
        } catch (Exception $e) {
            error_log("Session handler open error: " . $e->getMessage());
            return false;
        }
    }

    public function close(): bool
    {
        if ($this->db) {
            $this->db->close();
        }
        return true;
    }

    public function read($id): string|false
    {
        try {
            $stmt = $this->db->prepare('SELECT data FROM sessions WHERE id = :id');
            $stmt->bindValue(':id', $id, SQLITE3_TEXT);
            $result = $stmt->execute();
            $row = $result->fetchArray(SQLITE3_ASSOC);

            if ($row) {
                return $row['data'];
            }
            return '';
        } catch (Exception $e) {
            error_log("Session handler read error: " . $e->getMessage());
            return '';
        }
    }

    public function write($id, $data): bool
    {
        try {
            $stmt = $this->db->prepare('
                INSERT OR REPLACE INTO sessions (id, data, last_access, created_at)
                VALUES (:id, :data, :last_access, COALESCE((SELECT created_at FROM sessions WHERE id = :id), :created_at))
            ');
            $stmt->bindValue(':id', $id, SQLITE3_TEXT);
            $stmt->bindValue(':data', $data, SQLITE3_TEXT);
            $stmt->bindValue(':last_access', time(), SQLITE3_INTEGER);
            $stmt->bindValue(':created_at', time(), SQLITE3_INTEGER);

            return $stmt->execute() !== false;
        } catch (Exception $e) {
            error_log("Session handler write error: " . $e->getMessage());
            return false;
        }
    }

    public function destroy($id): bool
    {
        try {
            $stmt = $this->db->prepare('DELETE FROM sessions WHERE id = :id');
            $stmt->bindValue(':id', $id, SQLITE3_TEXT);
            return $stmt->execute() !== false;
        } catch (Exception $e) {
            error_log("Session handler destroy error: " . $e->getMessage());
            return false;
        }
    }

    public function gc($maxlifetime): int|false
    {
        try {
            $stmt = $this->db->prepare('DELETE FROM sessions WHERE last_access < :expire');
            $stmt->bindValue(':expire', time() - $maxlifetime, SQLITE3_INTEGER);
            $stmt->execute();
            return $this->db->changes();
        } catch (Exception $e) {
            error_log("Session handler gc error: " . $e->getMessage());
            return 0;
        }
    }
}

/**
 * Initialize database-based session handling
 */
function initDatabaseSessions($dbPath)
{
    $handler = new DatabaseSessionHandler($dbPath);
    session_set_save_handler($handler, true);

    // Configure session
    ini_set('session.cookie_lifetime', 86400); // 24 hours
    ini_set('session.gc_maxlifetime', 86400);
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_strict_mode', 1);

    // Set cookie parameters
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}
