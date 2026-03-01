$cars = @{
    "fusca-1500.jpg" = "https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800"
    "opala-ss.jpg" = "https://images.unsplash.com/photo-1555562852-6cc1c6407358?q=80&w=800"
    "maverick-gt.jpg" = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800"
    "chevette.jpg" = "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800"
    "pontiac-gto.jpg" = "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=800"
    "dodge-charger.jpg" = "https://images.unsplash.com/photo-1620641120042-88f01b12b5f7?q=80&w=800"
    "chevelle-ss454.jpg" = "https://images.unsplash.com/photo-1612040904005-72861cda0850?q=80&w=800"
    "hotrod-traditional.jpg" = "https://images.unsplash.com/photo-1536413233824-34c979724be4?q=80&w=800"
    "showrod-chrome-king.jpg" = "https://images.unsplash.com/photo-1589134142073-ed621dc5c652?q=80&w=800"
    "camaro-ss.jpg" = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800"
    "mustang-gt.jpg" = "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=800"
}

$destPath = "assets/cars"
if (-not (Test-Path $destPath)) { New-Item -ItemType Directory -Path $destPath }

foreach ($car in $cars.GetEnumerator()) {
    $fileName = $car.Key
    $url = $car.Value
    $fullPath = Join-Path $destPath $fileName
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "Downloading $fileName..."
        Invoke-WebRequest -Uri $url -OutFile $fullPath
    } else {
        Write-Host "$fileName already exists."
    }
}
Write-Host "Done!"
