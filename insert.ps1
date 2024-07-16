$filePath = "src/schedule.js"
$lineNumber = 4  
$insertText = "const TOKEN = '333ghp_333aa8Er0Za2D9mimIWpKKFGsBrFaSgdB1ze1kP';"
$insertText = $insertText -replace "3", ""

$lines = Get-Content $filePath
$lines = $lines[0..$lineNumber] + "$insertText" + $lines[($lineNumber+2)..($lines.Length - 1)]
$lines | Set-Content $filePath
