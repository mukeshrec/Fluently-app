$content = Get-Content 'c:\Users\mukes\Desktop\stutter\fluently-app.html' -Raw
$pattern = '(?s)<style>(.*?)</style>'
$match = [regex]::Match($content, $pattern)
if ($match.Success) {
    $css = $match.Groups[1].Value.Trim()
    [System.IO.File]::WriteAllText('c:\Users\mukes\Desktop\stutter\src\index.css', $css)
    Write-Host "CSS extracted successfully. Length: $($css.Length)"
} else {
    Write-Host "No style block found"
}
