<?php

declare(strict_types=1);

$sqlitePath = __DIR__ . '/../database/database.sqlite';
$outputDir = __DIR__ . '/../database/backups/sqlite-export';

if (!is_file($sqlitePath)) {
    fwrite(STDERR, "SQLite database not found at {$sqlitePath}\n");
    exit(1);
}

if (!is_dir($outputDir) && !mkdir($outputDir, 0777, true) && !is_dir($outputDir)) {
    fwrite(STDERR, "Unable to create export directory: {$outputDir}\n");
    exit(1);
}

$pdo = new PDO('sqlite:' . $sqlitePath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$tablesStmt = $pdo->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'");
$tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

foreach ($tables as $table) {
    $rowsStmt = $pdo->query(sprintf('SELECT * FROM "%s"', str_replace('"', '""', (string) $table)));
    $rows = $rowsStmt->fetchAll(PDO::FETCH_ASSOC);
    $tableFile = $outputDir . DIRECTORY_SEPARATOR . $table . '.json';
    file_put_contents($tableFile, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

file_put_contents($outputDir . DIRECTORY_SEPARATOR . 'tables.json', json_encode($tables, JSON_PRETTY_PRINT));

echo 'Export complete. Tables exported: ' . count($tables) . PHP_EOL;
