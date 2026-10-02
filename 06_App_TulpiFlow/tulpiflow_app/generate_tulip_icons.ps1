Add-Type -AssemblyName System.Drawing

function Draw-Tulip {
    param(
        [System.Drawing.Graphics]$g,
        [float]$size,
        [bool]$isForegroundOnly = $false,
        [bool]$isRound = $false
    )

    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if (-not $isForegroundOnly) {
        $bgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 6, 9, 17)) # #060911
        if ($isRound) {
            $g.FillEllipse($bgBrush, 0, 0, $size, $size)
        } else {
            # Rounded rect squircle
            $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
            $rad = $size * 0.22
            $path.AddArc(0, 0, $rad*2, $rad*2, 180, 90)
            $path.AddArc($size - $rad*2, 0, $rad*2, $rad*2, 270, 90)
            $path.AddArc($size - $rad*2, $size - $rad*2, $rad*2, $rad*2, 0, 90)
            $path.AddArc(0, $size - $rad*2, $rad*2, $rad*2, 90, 90)
            $path.CloseFigure()
            $g.FillPath($bgBrush, $path)

            # Subtle outer glow border
            $borderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(60, 99, 102, 241), [Math]::Max(1.0, $size * 0.02))
            $g.DrawPath($borderPen, $path)
            $path.Dispose()
            $borderPen.Dispose()
        }
        $bgBrush.Dispose()

        # Center glow ellipse
        $glowPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
        $glowPath.AddEllipse($size * 0.15, $size * 0.15, $size * 0.7, $size * 0.7)
        $glowBrush = [System.Drawing.Drawing2D.PathGradientBrush]::new($glowPath)
        $glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(70, 129, 140, 248) # indigo-400 glow
        $glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 6, 9, 17))
        $g.FillPath($glowBrush, $glowPath)
        $glowBrush.Dispose()
        $glowPath.Dispose()
    }

    # Center and scale coordinates: SVG viewbox is 0..24
    $scaleRatio = if ($isForegroundOnly) { 0.58 } else { 0.65 }
    $s = $size * $scaleRatio / 24.0
    $ox = ($size - (24.0 * $s)) / 2.0
    $oy = ($size - (24.0 * $s)) / 2.0

    # Flower Gradient Brush (Indigo to Violet to Fuchsia)
    $gradBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.PointF]::new($ox + 4*$s, $oy + 4*$s),
        [System.Drawing.PointF]::new($ox + 20*$s, $oy + 22*$s),
        [System.Drawing.Color]::FromArgb(255, 168, 85, 247), # Purple
        [System.Drawing.Color]::FromArgb(255, 99, 102, 241)   # Indigo
    )
    $strokeWidth = [Math]::Max(2.0, 1.8 * $s)

    # 1. Outer Petals Path
    $petalsPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $petalsPath.AddBezier(
        $ox + 12*$s, $oy + 14*$s,
        $ox + 7.5*$s, $oy + 14*$s,
        $ox + 5*$s, $oy + 9.5*$s,
        $ox + 5*$s, $oy + 5*$s
    )
    $petalsPath.AddBezier(
        $ox + 5*$s, $oy + 5*$s,
        $ox + 8*$s, $oy + 5*$s,
        $ox + 10.5*$s, $oy + 7*$s,
        $ox + 12*$s, $oy + 10*$s
    )
    $petalsPath.AddBezier(
        $ox + 12*$s, $oy + 10*$s,
        $ox + 13.5*$s, $oy + 7*$s,
        $ox + 16*$s, $oy + 5*$s,
        $ox + 19*$s, $oy + 5*$s
    )
    $petalsPath.AddBezier(
        $ox + 19*$s, $oy + 5*$s,
        $ox + 19*$s, $oy + 9.5*$s,
        $ox + 16.5*$s, $oy + 14*$s,
        $ox + 12*$s, $oy + 14*$s
    )
    $petalsPath.CloseFigure()

    # Fill petals with elegant translucent glow
    $petalFillBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.PointF]::new($ox + 12*$s, $oy + 5*$s),
        [System.Drawing.PointF]::new($ox + 12*$s, $oy + 14*$s),
        [System.Drawing.Color]::FromArgb(180, 192, 132, 252),
        [System.Drawing.Color]::FromArgb(140, 99, 102, 241)
    )
    $g.FillPath($petalFillBrush, $petalsPath)
    $petalFillBrush.Dispose()

    # Petals outline
    $petalPen = [System.Drawing.Pen]::new($gradBrush, $strokeWidth)
    $petalPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $petalPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $petalPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $g.DrawPath($petalPen, $petalsPath)
    $petalPen.Dispose()
    $petalsPath.Dispose()

    # 2. Central Crown Petal
    $centerPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $centerPath.AddLine($ox + 12*$s, $oy + 5*$s, $ox + 12*$s, $oy + 10*$s)
    $centerPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 236, 72, 153), $strokeWidth * 0.9)
    $centerPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $centerPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawPath($centerPen, $centerPath)
    $centerPen.Dispose()
    $centerPath.Dispose()

    # 3. Stem
    $stemPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 129, 140, 248), $strokeWidth)
    $stemPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $stemPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($stemPen, $ox + 12*$s, $oy + 14*$s, $ox + 12*$s, $oy + 22*$s)

    # 4. Leaves / base arc: path d="M8 22c0-3 1.8-5 4-5s4 2 4 5"
    $basePath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $basePath.AddBezier(
        $ox + 8*$s, $oy + 22*$s,
        $ox + 8*$s, $oy + 19*$s,
        $ox + 9.8*$s, $oy + 17*$s,
        $ox + 12*$s, $oy + 17*$s
    )
    $basePath.AddBezier(
        $ox + 12*$s, $oy + 17*$s,
        $ox + 14.2*$s, $oy + 17*$s,
        $ox + 16*$s, $oy + 19*$s,
        $ox + 16*$s, $oy + 22*$s
    )
    $g.DrawPath($stemPen, $basePath)
    $stemPen.Dispose()
    $basePath.Dispose()
    $gradBrush.Dispose()
}

function Generate-IconFile {
    param(
        [string]$filePath,
        [int]$size,
        [bool]$isForeground = $false,
        [bool]$isRound = $false
    )
    $dir = Split-Path -Parent $filePath
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $bmp = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::Transparent)

    Draw-Tulip -g $g -size $size -isForegroundOnly $isForeground -isRound $isRound

    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated: $filePath ($size x $size)"
}

$resRoot = "android/app/src/main/res"

$densities = @(
    @{ name = "mipmap-mdpi"; launcherSize = 48; fgSize = 108 },
    @{ name = "mipmap-hdpi"; launcherSize = 72; fgSize = 162 },
    @{ name = "mipmap-xhdpi"; launcherSize = 96; fgSize = 216 },
    @{ name = "mipmap-xxhdpi"; launcherSize = 144; fgSize = 324 },
    @{ name = "mipmap-xxxhdpi"; launcherSize = 192; fgSize = 432 }
)

foreach ($d in $densities) {
    $folder = Join-Path $resRoot $d.name
    Generate-IconFile -filePath (Join-Path $folder "ic_launcher.png") -size $d.launcherSize -isForeground $false -isRound $false
    Generate-IconFile -filePath (Join-Path $folder "ic_launcher_round.png") -size $d.launcherSize -isForeground $false -isRound $true
    Generate-IconFile -filePath (Join-Path $folder "ic_launcher_foreground.png") -size $d.fgSize -isForeground $true -isRound $false
}

Generate-IconFile -filePath "tulpi_icon_256.png" -size 256 -isForeground $false -isRound $false
Generate-IconFile -filePath "tulpi_icon_512.png" -size 512 -isForeground $false -isRound $false
Write-Output "ALL_ICONS_SUCCESS"
