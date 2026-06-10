$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath "."
$workspace = Resolve-Path -LiteralPath "..\..\.."
$assets = Join-Path $root "assets"

$sourceDirs = @(
  (Join-Path $workspace "Kaynaklar\İttihatçılık\görseller"),
  (Join-Path $workspace "Kaynaklar\İttihatçılık\Görseller"),
  (Join-Path $workspace "Kaynaklar\İttihatçılık\gorseller"),
  (Join-Path $workspace "Kaynaklar\İttihatçılık\Gorseller")
)

function Copy-FirstMatch {
  param(
    [string[]] $Patterns,
    [string] $DestinationName
  )

  foreach ($dir in $sourceDirs) {
    if (-not (Test-Path -LiteralPath $dir)) { continue }

    $files = Get-ChildItem -LiteralPath $dir -File
    foreach ($pattern in $Patterns) {
      $match = $files | Where-Object { $_.Name -match $pattern } | Select-Object -First 1
      if ($match) {
        Copy-Item -LiteralPath $match.FullName -Destination (Join-Path $assets $DestinationName) -Force
        Write-Output "Copied $($match.Name) -> $DestinationName"
        return
      }
    }
  }
}

Copy-FirstMatch -Patterns @("ittihat.*terakki.*(üç|uc|ucl|ücl|üçlü|uclu)", "uclu", "üçlü") -DestinationName "ittihat-terakki-uclu.png"
Copy-FirstMatch -Patterns @("^it.*arma", "ittihat.*arma", "arma") -DestinationName "it-arma.png"
Copy-FirstMatch -Patterns @("ahmed.*r(ı|i)za", "r(ı|i)za") -DestinationName "ahmed-riza.png"
