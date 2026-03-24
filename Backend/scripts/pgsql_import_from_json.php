<?php

declare(strict_types=1);

$sourceDir = __DIR__ . '/../database/backups/sqlite-export';
$tablesFile = $sourceDir . '/tables.json';

if (!is_file($tablesFile)) {
    fwrite(STDERR, "Missing tables.json export file. Run scripts/sqlite_export.php first.\n");
    exit(1);
}

$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbPort = getenv('DB_PORT') ?: '5432';
$dbName = getenv('DB_DATABASE') ?: '';
$dbUser = getenv('DB_USERNAME') ?: '';
$dbPass = getenv('DB_PASSWORD') ?: '';

if ($dbName === '' || $dbUser === '') {
    fwrite(STDERR, "PostgreSQL credentials are missing (DB_DATABASE / DB_USERNAME).\n");
    exit(1);
}

$dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $dbHost, $dbPort, $dbName);
$pdo = new PDO($dsn, $dbUser, $dbPass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$tables = json_decode((string) file_get_contents($tablesFile), true, 512, JSON_THROW_ON_ERROR);

foreach ($tables as $table) {
    $tableFile = $sourceDir . '/' . $table . '.json';
    if (!is_file($tableFile)) {
        continue;
    }

    $rows = json_decode((string) file_get_contents($tableFile), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($rows) || count($rows) === 0) {
        continue;
    }

    $pdo->beginTransaction();
    try {
        $quotedTable = '"' . str_replace('"', '""', (string) $table) . '"';
        $pdo->exec("TRUNCATE TABLE {$quotedTable} RESTART IDENTITY CASCADE");

        foreach ($rows as $row) {
            $columns = array_keys($row);
            $quotedColumns = array_map(
                static fn (string $col): string => '"' . str_replace('"', '""', $col) . '"',
                $columns
            );
            $placeholders = array_map(static fn (string $col): string => ':' . $col, $columns);

            $sql = sprintf(
                'INSERT INTO %s (%s) VALUES (%s)',
                $quotedTable,
                implode(', ', $quotedColumns),
                implode(', ', $placeholders)
            );

            $stmt = $pdo->prepare($sql);
            foreach ($row as $key => $value) {
                $stmt->bindValue(':' . $key, $value);
            }
            $stmt->execute();
        }

        $pdo->commit();
        echo "Imported table: {$table} (" . count($rows) . " rows)\n";
    } catch (Throwable $e) {
        $pdo->rollBack();
        fwrite(STDERR, "Import failed for table {$table}: {$e->getMessage()}\n");
        exit(1);
    }
}

echo "PostgreSQL import complete.\n";
