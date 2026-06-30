$port = 5510
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
  $listener.Start()
} catch {
  Write-Host "로컬 서버를 시작하지 못했습니다."
  Write-Host "포트 $port 이(가) 이미 사용 중인지 확인해 주세요."
  Write-Host "오류: $($_.Exception.Message)"
  exit 1
}

Write-Host "RE:MUSE - http://localhost:$port/"
Write-Host "종료하려면 이 창을 닫으세요."
Start-Sleep -Milliseconds 400
Start-Process "http://localhost:$port/"

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response

  $localPath = $request.Url.LocalPath
  if ($localPath -eq '/') { $localPath = '/index.html' }

  $relativePath = $localPath.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
  $filePath = Join-Path $root $relativePath

  if (Test-Path $filePath -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $ext = [IO.Path]::GetExtension($filePath).ToLower()
    $response.ContentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
    $response.Headers.Add('Referrer-Policy', 'strict-origin-when-cross-origin')
    $response.Headers.Add('Cache-Control', 'no-cache, no-store, must-revalidate')
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $response.StatusCode = 404
    $notFound = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
    $response.OutputStream.Write($notFound, 0, $notFound.Length)
  }

  $response.Close()
}
