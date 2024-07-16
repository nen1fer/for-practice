$filePath = "src/schedule .js"
$lineNumber = 4
$insertText = "const TOKEN = '333ghp_33385wsQ4Ojah7YhLjyHdKTBm7eihKjtX10z0tW';”
$insertText -replace "3", ""

$lines = Get-Content $filePath
$lines = $lines[0..$lineNumber] + "`n$insertText" + $lines[($lineNumber+1)..($lines.Length - 1)]
$lines | Set-Content $filePath
