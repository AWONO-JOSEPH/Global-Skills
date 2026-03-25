<?php

declare(strict_types=1);

$sqlitePath = __DIR__ . '/../database/database.sqlite';
$outputDir = __DIR__ . '/..';

if (!is_file($sqlitePath)) {
    fwrite(STDERR, "SQLite database not found at {$sqlitePath}\n");
    exit(1);
}

$pdo = new PDO('sqlite:' . $sqlitePath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$tablesStmt = $pdo->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'migrations'");
$tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

foreach ($tables as $table) {
    $rowsStmt = $pdo->query(sprintf('SELECT * FROM "%s"', str_replace('"', '""', (string) $table)));
    $rows = $rowsStmt->fetchAll(PDO::FETCH_ASSOC);
    $tableFile = $outputDir . DIRECTORY_SEPARATOR . $table . '_export.json';
    file_put_contents($tableFile, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "Exported table: {$table} to {$table}_export.json (" . count($rows) . " rows)\n";
}

echo 'Export complete. Tables exported: ' . count($tables) . PHP_EOL;
