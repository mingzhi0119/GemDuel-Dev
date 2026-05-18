param(
    [Parameter(Mandatory = $true)]
    [string] $ArtifactRoot,

    [string] $MatrixPath = "",

    [string] $Scenarios = "",

    [string] $Viewports = "",

    [int] $Top = 12,

    [int] $GridColumns = 12,

    [int] $GridRows = 8,

    [int] $PixelThreshold = -1,

    [switch] $IncludeAppShell,

    [string] $OutJson = "",

    [string] $OutMarkdown = "",

    [string] $CropRoot = ""
)

$ErrorActionPreference = 'Stop'

if ($PSVersionTable.PSEdition -ne 'Core') {
    throw 'analyze-png-hotspots.ps1 requires PowerShell 7+ (pwsh). Run it through `pnpm parity:ui-hotspots -- ...` or `pwsh -File tools/migration/analyze-png-hotspots.ps1 ...`.'
}

Add-Type -AssemblyName System.Drawing
if ($PSVersionTable.PSEdition -eq 'Core') {
    Add-Type -AssemblyName System.Private.Windows.GdiPlus
    Add-Type -AssemblyName System.Private.Windows.Core
    $drawingReferences = @(
        [System.Drawing.Bitmap].Assembly.Location,
        [System.Drawing.Rectangle].Assembly.Location,
        [System.Reflection.Assembly]::Load('System.Private.Windows.GdiPlus').Location,
        [System.Reflection.Assembly]::Load('System.Private.Windows.Core').Location
    )
} else {
    $drawingReferences = @('System.Drawing')
}
Add-Type -ReferencedAssemblies $drawingReferences -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public sealed class PngHotspotRegionSpec
{
    public string key;
    public int x;
    public int y;
    public int width;
    public int height;
}

public sealed class PngHotspotRegionMetric
{
    public string key;
    public int x;
    public int y;
    public int width;
    public int height;
    public long totalPixels;
    public long mismatchedPixels;
    public double mismatchPercent;
    public double similarityPercent;
    public double meanAbsoluteDelta;
}

public static class PngHotspotAnalyzer
{
    public static PngHotspotRegionMetric[] AnalyzeRegions(
        string baselinePath,
        string candidatePath,
        PngHotspotRegionSpec[] regions,
        int pixelThreshold
    )
    {
        using (var baselineSource = new Bitmap(baselinePath))
        using (var candidateSource = new Bitmap(candidatePath))
        using (var baseline = ToArgb(baselineSource))
        using (var candidate = ToArgb(candidateSource))
        {
            var width = Math.Min(baseline.Width, candidate.Width);
            var height = Math.Min(baseline.Height, candidate.Height);
            var results = new PngHotspotRegionMetric[regions.Length];
            var resultCount = 0;
            if (width <= 0 || height <= 0)
            {
                return new PngHotspotRegionMetric[0];
            }

            var imageRect = new Rectangle(0, 0, width, height);
            var baselineData = baseline.LockBits(imageRect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            var candidateData = candidate.LockBits(imageRect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            try
            {
                var baselineBytes = new byte[Math.Abs(baselineData.Stride) * height];
                var candidateBytes = new byte[Math.Abs(candidateData.Stride) * height];
                Marshal.Copy(baselineData.Scan0, baselineBytes, 0, baselineBytes.Length);
                Marshal.Copy(candidateData.Scan0, candidateBytes, 0, candidateBytes.Length);

                foreach (var region in regions)
                {
                    var x = Math.Max(0, region.x);
                    var y = Math.Max(0, region.y);
                    var x2 = Math.Min(width, x + Math.Max(0, region.width));
                    var y2 = Math.Min(height, y + Math.Max(0, region.height));
                    var regionWidth = Math.Max(0, x2 - x);
                    var regionHeight = Math.Max(0, y2 - y);
                    var totalPixels = (long)regionWidth * regionHeight;
                    long mismatchedPixels = 0;
                    double deltaSum = 0.0;

                    for (var yy = y; yy < y2; yy += 1)
                    {
                        var baselineRow = yy * baselineData.Stride;
                        var candidateRow = yy * candidateData.Stride;
                        for (var xx = x; xx < x2; xx += 1)
                        {
                            var b = baselineRow + xx * 4;
                            var c = candidateRow + xx * 4;
                            var delta = GetDelta(baselineBytes, b, candidateBytes, c);
                            if (delta > pixelThreshold)
                            {
                                mismatchedPixels += 1;
                            }

                            deltaSum += delta;
                        }
                    }

                    var mismatchPercent = totalPixels == 0 ? 0.0 : mismatchedPixels * 100.0 / totalPixels;
                    var meanAbsoluteDelta = totalPixels == 0 ? 0.0 : deltaSum / (totalPixels * 4.0);
                    results[resultCount] = new PngHotspotRegionMetric
                    {
                        key = region.key,
                        x = x,
                        y = y,
                        width = regionWidth,
                        height = regionHeight,
                        totalPixels = totalPixels,
                        mismatchedPixels = mismatchedPixels,
                        mismatchPercent = Math.Round(mismatchPercent, 6),
                        similarityPercent = Math.Round(100.0 - mismatchPercent, 6),
                        meanAbsoluteDelta = Math.Round(meanAbsoluteDelta, 6),
                    };
                    resultCount += 1;
                }
            }
            finally
            {
                baseline.UnlockBits(baselineData);
                candidate.UnlockBits(candidateData);
            }

            var trimmed = new PngHotspotRegionMetric[resultCount];
            Array.Copy(results, trimmed, resultCount);
            return trimmed;
        }
    }

    private static int GetDelta(byte[] baselineBytes, int baselineOffset, byte[] candidateBytes, int candidateOffset)
    {
        return Math.Abs(baselineBytes[baselineOffset] - candidateBytes[candidateOffset])
            + Math.Abs(baselineBytes[baselineOffset + 1] - candidateBytes[candidateOffset + 1])
            + Math.Abs(baselineBytes[baselineOffset + 2] - candidateBytes[candidateOffset + 2])
            + Math.Abs(baselineBytes[baselineOffset + 3] - candidateBytes[candidateOffset + 3]);
    }

    private static Bitmap ToArgb(Bitmap source)
    {
        var bitmap = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb);
        using (var graphics = Graphics.FromImage(bitmap))
        {
            graphics.DrawImageUnscaled(source, 0, 0);
        }

        return bitmap;
    }
}
"@

function Split-FilterList([string] $Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) {
        return @()
    }

    return $Value.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
}

function Get-ScenarioId($Row) {
    $screenshot = [string] $Row.artifacts.electronScreenshot
    if (-not [string]::IsNullOrWhiteSpace($screenshot)) {
        return Split-Path -Leaf (Split-Path -Parent $screenshot)
    }

    return ([string] $Row.scenario).ToLowerInvariant().Replace(' parity', '').Replace(' ', '-')
}

function Get-ViewportId($Row) {
    $screenshot = [string] $Row.artifacts.electronScreenshot
    if (-not [string]::IsNullOrWhiteSpace($screenshot)) {
        return [IO.Path]::GetFileNameWithoutExtension($screenshot)
    }

    if ([string] $Row.scenario -match '\((\d+x\d+)\)') {
        return $Matches[1]
    }

    return "unknown"
}

function New-RegionSpec([string] $Key, [int] $X, [int] $Y, [int] $Width, [int] $Height) {
    $spec = New-Object PngHotspotRegionSpec
    $spec.key = $Key
    $spec.x = $X
    $spec.y = $Y
    $spec.width = $Width
    $spec.height = $Height
    return $spec
}

function Convert-ToSafeFileName([string] $Value) {
    $safe = if ([string]::IsNullOrWhiteSpace($Value)) { 'unknown' } else { $Value }
    foreach ($char in [IO.Path]::GetInvalidFileNameChars()) {
        $safe = $safe.Replace($char, '-')
    }

    return ($safe -replace '[^\w.-]+', '-').Trim('-')
}

function Save-BitmapCrop([string] $SourcePath, [string] $OutputPath, $Region) {
    if ([string]::IsNullOrWhiteSpace($SourcePath) -or -not (Test-Path -LiteralPath $SourcePath)) {
        return $false
    }

    $source = [System.Drawing.Bitmap]::FromFile($SourcePath)
    try {
        $x = [Math]::Max(0, [int] $Region.x)
        $y = [Math]::Max(0, [int] $Region.y)
        $x2 = [Math]::Min($source.Width, $x + [Math]::Max(0, [int] $Region.width))
        $y2 = [Math]::Min($source.Height, $y + [Math]::Max(0, [int] $Region.height))
        $width = [Math]::Max(0, $x2 - $x)
        $height = [Math]::Max(0, $y2 - $y)
        if ($width -le 0 -or $height -le 0) {
            return $false
        }

        $directory = Split-Path -Parent $OutputPath
        if (-not [string]::IsNullOrWhiteSpace($directory)) {
            New-Item -ItemType Directory -Force -Path $directory | Out-Null
        }

        $rect = [System.Drawing.Rectangle]::new($x, $y, $width, $height)
        $crop = $source.Clone($rect, $source.PixelFormat)
        try {
            $crop.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        } finally {
            $crop.Dispose()
        }

        return $true
    } finally {
        $source.Dispose()
    }
}

function Save-HotspotCrops(
    [string] $CropRootPath,
    [string] $ScenarioId,
    [string] $ViewportId,
    [string] $Kind,
    $Regions,
    [string] $ElectronScreenshot,
    [string] $UnityScreenshot,
    [string] $VisualDiffImage
) {
    if ([string]::IsNullOrWhiteSpace($CropRootPath)) {
        return @()
    }

    $cropRows = @()
    $rank = 0
    foreach ($region in @($Regions)) {
        $rank += 1
        $safeKey = Convert-ToSafeFileName ([string] $region.key)
        $prefix = Join-Path $CropRootPath (Join-Path $ScenarioId (Join-Path $ViewportId ("{0}-{1:00}-{2}" -f $Kind, $rank, $safeKey)))
        $electronOut = "$prefix-electron.png"
        $unityOut = "$prefix-unity.png"
        $diffOut = "$prefix-diff.png"

        $wroteElectron = Save-BitmapCrop $ElectronScreenshot $electronOut $region
        $wroteUnity = Save-BitmapCrop $UnityScreenshot $unityOut $region
        $wroteDiff = Save-BitmapCrop $VisualDiffImage $diffOut $region

        if ($wroteElectron -or $wroteUnity -or $wroteDiff) {
            $cropRows += [pscustomobject] @{
                kind = $Kind
                rank = $rank
                key = $region.key
                rect = [pscustomobject] @{
                    x = $region.x
                    y = $region.y
                    width = $region.width
                    height = $region.height
                }
                electron = if ($wroteElectron) { $electronOut } else { $null }
                unity = if ($wroteUnity) { $unityOut } else { $null }
                diff = if ($wroteDiff) { $diffOut } else { $null }
            }
        }
    }

    return $cropRows
}

$artifactRootPath = (Resolve-Path -LiteralPath $ArtifactRoot).Path
if ([string]::IsNullOrWhiteSpace($MatrixPath)) {
    $MatrixPath = Join-Path $artifactRootPath 'parity-matrix.json'
}

if ([string]::IsNullOrWhiteSpace($OutJson)) {
    $OutJson = Join-Path $artifactRootPath 'hotspot-report.json'
}

if ([string]::IsNullOrWhiteSpace($OutMarkdown)) {
    $OutMarkdown = Join-Path $artifactRootPath 'hotspot-report.md'
}

if ([string]::IsNullOrWhiteSpace($CropRoot)) {
    $cropRootPath = ""
} else {
    $cropRootPath = $CropRoot
    if (-not [IO.Path]::IsPathRooted($cropRootPath)) {
        $cwdCropRootPath = [IO.Path]::GetFullPath((Join-Path (Get-Location).Path $cropRootPath))
        $artifactRootPrefix = $artifactRootPath.TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
        if ($cwdCropRootPath.StartsWith($artifactRootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
            $cropRootPath = $cwdCropRootPath
        } else {
            $cropRootPath = Join-Path $artifactRootPath $cropRootPath
        }
    }
    New-Item -ItemType Directory -Force -Path $cropRootPath | Out-Null
    $cropRootPath = (Resolve-Path -LiteralPath $cropRootPath).Path
}

$scenarioFilter = @(Split-FilterList $Scenarios)
$viewportFilter = @(Split-FilterList $Viewports)
$matrixRows = Get-Content -LiteralPath $MatrixPath -Raw | ConvertFrom-Json
$reportRows = @()

foreach ($row in $matrixRows) {
    $scenarioId = Get-ScenarioId $row
    $viewportId = Get-ViewportId $row
    if ($scenarioFilter.Count -gt 0 -and $scenarioFilter -notcontains $scenarioId) {
        continue
    }

    if ($viewportFilter.Count -gt 0 -and $viewportFilter -notcontains $viewportId) {
        continue
    }

    $electronScreenshot = [string] $row.artifacts.electronScreenshot
    $unityScreenshot = [string] $row.artifacts.unityScreenshot
    $visualDiffPath = [string] $row.artifacts.visualDiff
    $visualDiffImage = [string] $row.artifacts.visualDiffImage
    if (
        [string]::IsNullOrWhiteSpace($electronScreenshot) -or
        [string]::IsNullOrWhiteSpace($unityScreenshot) -or
        [string]::IsNullOrWhiteSpace($visualDiffPath) -or
        -not (Test-Path -LiteralPath $electronScreenshot) -or
        -not (Test-Path -LiteralPath $unityScreenshot) -or
        -not (Test-Path -LiteralPath $visualDiffPath) -or
        ([string]::IsNullOrWhiteSpace($visualDiffImage) -and -not [string]::IsNullOrWhiteSpace($cropRootPath))
    ) {
        continue
    }

    $visualDiff = Get-Content -LiteralPath $visualDiffPath -Raw | ConvertFrom-Json
    $threshold = if ($PixelThreshold -ge 0) { $PixelThreshold } else { [int] $visualDiff.pixelThreshold }
    if ($threshold -lt 0) {
        $threshold = 16
    }

    $regions = New-Object 'System.Collections.Generic.List[PngHotspotRegionSpec]'
    foreach ($comparison in @($visualDiff.boundingBoxes.comparisons)) {
        $key = [string] $comparison.key
        if (-not $IncludeAppShell -and $key -eq 'app.shell') {
            continue
        }

        $rect = $comparison.electron
        if ($null -eq $rect) {
            continue
        }

        $regions.Add((New-RegionSpec `
            $key `
            ([int] [Math]::Round([double] $rect.x)) `
            ([int] [Math]::Round([double] $rect.y)) `
            ([int] [Math]::Round([double] $rect.width)) `
            ([int] [Math]::Round([double] $rect.height))))
    }

    $gridRegions = New-Object 'System.Collections.Generic.List[PngHotspotRegionSpec]'
    $imageWidth = [int] $visualDiff.comparedWidth
    $imageHeight = [int] $visualDiff.comparedHeight
    if ($imageWidth -le 0) {
        $imageWidth = [int] $visualDiff.baselineWidth
    }

    if ($imageHeight -le 0) {
        $imageHeight = [int] $visualDiff.baselineHeight
    }

    $columns = [Math]::Max(1, $GridColumns)
    $gridRowsCount = [Math]::Max(1, $GridRows)
    for ($gridY = 0; $gridY -lt $gridRowsCount; $gridY += 1) {
        $y = [int] [Math]::Floor($gridY * $imageHeight / $gridRowsCount)
        $y2 = [int] [Math]::Floor(($gridY + 1) * $imageHeight / $gridRowsCount)
        for ($gridX = 0; $gridX -lt $columns; $gridX += 1) {
            $x = [int] [Math]::Floor($gridX * $imageWidth / $columns)
            $x2 = [int] [Math]::Floor(($gridX + 1) * $imageWidth / $columns)
            $gridRegions.Add((New-RegionSpec "grid.$gridX.$gridY" $x $y ($x2 - $x) ($y2 - $y)))
        }
    }

    $regionMetrics = @([PngHotspotAnalyzer]::AnalyzeRegions(
        $electronScreenshot,
        $unityScreenshot,
        $regions.ToArray(),
        $threshold
    ))
    $gridMetrics = @([PngHotspotAnalyzer]::AnalyzeRegions(
        $electronScreenshot,
        $unityScreenshot,
        $gridRegions.ToArray(),
        $threshold
    ))

    $topRegions = @(
        $regionMetrics |
            Sort-Object -Property mismatchedPixels -Descending |
            Select-Object -First ([Math]::Max(1, $Top))
    )
    $imageArea = [int64] [Math]::Max(1, $imageWidth) * [int64] [Math]::Max(1, $imageHeight)
    $fullscreenAreaCutoff = [double] $imageArea * 0.8
    $topNonFullscreenRegions = @(
        $regionMetrics |
            Where-Object {
                ([double] ([int64] $_.width * [int64] $_.height)) -lt $fullscreenAreaCutoff -and
                $_.mismatchedPixels -gt 0
            } |
            Sort-Object -Property mismatchedPixels -Descending |
            Select-Object -First ([Math]::Max(1, $Top))
    )
    $topDenseRegions = @(
        $regionMetrics |
            Where-Object {
                ([double] ([int64] $_.width * [int64] $_.height)) -lt $fullscreenAreaCutoff -and
                $_.totalPixels -ge 100 -and
                $_.mismatchedPixels -gt 0
            } |
            Sort-Object -Property mismatchPercent, mismatchedPixels -Descending |
            Select-Object -First ([Math]::Max(1, $Top))
    )
    $topGrid = @(
        $gridMetrics |
            Sort-Object -Property mismatchedPixels -Descending |
            Select-Object -First ([Math]::Max(1, $Top))
    )
    $cropRows = @()
    if (-not [string]::IsNullOrWhiteSpace($cropRootPath)) {
        $cropRows += Save-HotspotCrops $cropRootPath $scenarioId $viewportId 'semantic' $topRegions $electronScreenshot $unityScreenshot $visualDiffImage
        $cropRows += Save-HotspotCrops $cropRootPath $scenarioId $viewportId 'semantic-nonfull' $topNonFullscreenRegions $electronScreenshot $unityScreenshot $visualDiffImage
        $cropRows += Save-HotspotCrops $cropRootPath $scenarioId $viewportId 'semantic-dense' $topDenseRegions $electronScreenshot $unityScreenshot $visualDiffImage
        $cropRows += Save-HotspotCrops $cropRootPath $scenarioId $viewportId 'grid' $topGrid $electronScreenshot $unityScreenshot $visualDiffImage
    }

    $reportRows += [pscustomobject] @{
        scenario = $scenarioId
        scenarioName = $row.scenario
        viewport = $viewportId
        status = $row.status
        visualSimilarityPercent = $visualDiff.similarityPercent
        visualMismatchPercent = $visualDiff.mismatchPercent
        pixelThreshold = $threshold
        electronScreenshot = $electronScreenshot
        unityScreenshot = $unityScreenshot
        visualDiff = $visualDiffPath
        visualDiffImage = $visualDiffImage
        topSemanticRegions = $topRegions
        topNonFullscreenSemanticRegions = $topNonFullscreenRegions
        topDenseSemanticRegions = $topDenseRegions
        topGridRegions = $topGrid
        crops = $cropRows
    }
}

$report = [pscustomobject] @{
    artifactRoot = $artifactRootPath
    matrixPath = (Resolve-Path -LiteralPath $MatrixPath).Path
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    pixelThresholdMode = if ($PixelThreshold -ge 0) { 'override' } else { 'visual-diff-json' }
    includeAppShell = [bool] $IncludeAppShell
    cropRoot = if ([string]::IsNullOrWhiteSpace($cropRootPath)) { $null } else { $cropRootPath }
    top = $Top
    grid = [pscustomobject] @{
        columns = $GridColumns
        rows = $GridRows
    }
    rows = $reportRows
}

$jsonDirectory = Split-Path -Parent $OutJson
if (-not [string]::IsNullOrWhiteSpace($jsonDirectory)) {
    New-Item -ItemType Directory -Force -Path $jsonDirectory | Out-Null
}

$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $OutJson -Encoding UTF8

$markdownDirectory = Split-Path -Parent $OutMarkdown
if (-not [string]::IsNullOrWhiteSpace($markdownDirectory)) {
    New-Item -ItemType Directory -Force -Path $markdownDirectory | Out-Null
}

$md = New-Object System.Collections.Generic.List[string]
$md.Add('# Pixel Hotspot Report')
$md.Add('')
$md.Add(('- Artifact root: `{0}`' -f $artifactRootPath))
$md.Add(('- Matrix: `{0}`' -f $MatrixPath))
$md.Add(('- Generated: `{0}`' -f $report.generatedAt))
$md.Add('- Pixel threshold: per-row visual diff JSON unless overridden')
$md.Add(('- App shell included: `{0}`' -f ([bool] $IncludeAppShell)))
if (-not [string]::IsNullOrWhiteSpace($cropRootPath)) {
    $md.Add(('- Crop root: `{0}`' -f $cropRootPath))
}
$md.Add('')
$md.Add('## Rows')
$md.Add('')
$md.Add('| Scenario | Viewport | Status | Similarity | Top semantic hotspot | Top non-fullscreen semantic hotspot | Top dense semantic hotspot |')
$md.Add('| --- | --- | --- | ---: | --- | --- | --- |')
foreach ($row in $reportRows) {
    $topRegion = @($row.topSemanticRegions)[0]
    $topLabel = if ($null -eq $topRegion) {
        'n/a'
    } else {
        "$($topRegion.key) ($($topRegion.mismatchPercent)% / $($topRegion.mismatchedPixels) px)"
    }
    $topNonFullscreenRegion = @($row.topNonFullscreenSemanticRegions)[0]
    $topNonFullscreenLabel = if ($null -eq $topNonFullscreenRegion) {
        'n/a'
    } else {
        "$($topNonFullscreenRegion.key) ($($topNonFullscreenRegion.mismatchPercent)% / $($topNonFullscreenRegion.mismatchedPixels) px)"
    }
    $topDenseRegion = @($row.topDenseSemanticRegions)[0]
    $topDenseLabel = if ($null -eq $topDenseRegion) {
        'n/a'
    } else {
        "$($topDenseRegion.key) ($($topDenseRegion.mismatchPercent)% / $($topDenseRegion.mismatchedPixels) px)"
    }
    $md.Add(('| `{0}` | `{1}` | {2} | {3}% | {4} | {5} | {6} |' -f $row.scenario, $row.viewport, $row.status, $row.visualSimilarityPercent, $topLabel, $topNonFullscreenLabel, $topDenseLabel))
}

foreach ($row in $reportRows) {
    $md.Add('')
    $md.Add(('## {0} `{1}`' -f $row.scenario, $row.viewport))
    $md.Add('')
    $md.Add("- Status: $($row.status)")
    $md.Add("- Visual similarity: $($row.visualSimilarityPercent)%")
    $md.Add("- Visual mismatch: $($row.visualMismatchPercent)%")
    $md.Add('')
    $md.Add('### Top Semantic Regions')
    $md.Add('')
    $md.Add('| Region | Mismatch | Mismatched px | Mean delta | Rect |')
    $md.Add('| --- | ---: | ---: | ---: | --- |')
    foreach ($region in @($row.topSemanticRegions)) {
        $rect = "$($region.x),$($region.y),$($region.width),$($region.height)"
        $md.Add(('| `{0}` | {1}% | {2} | {3} | `{4}` |' -f $region.key, $region.mismatchPercent, $region.mismatchedPixels, $region.meanAbsoluteDelta, $rect))
    }

    $md.Add('')
    $md.Add('### Top Non-Fullscreen Semantic Regions')
    $md.Add('')
    $md.Add('| Region | Mismatch | Mismatched px | Mean delta | Rect |')
    $md.Add('| --- | ---: | ---: | ---: | --- |')
    foreach ($region in @($row.topNonFullscreenSemanticRegions)) {
        $rect = "$($region.x),$($region.y),$($region.width),$($region.height)"
        $md.Add(('| `{0}` | {1}% | {2} | {3} | `{4}` |' -f $region.key, $region.mismatchPercent, $region.mismatchedPixels, $region.meanAbsoluteDelta, $rect))
    }

    $md.Add('')
    $md.Add('### Top Dense Semantic Regions')
    $md.Add('')
    $md.Add('| Region | Mismatch | Mismatched px | Mean delta | Rect |')
    $md.Add('| --- | ---: | ---: | ---: | --- |')
    foreach ($region in @($row.topDenseSemanticRegions)) {
        $rect = "$($region.x),$($region.y),$($region.width),$($region.height)"
        $md.Add(('| `{0}` | {1}% | {2} | {3} | `{4}` |' -f $region.key, $region.mismatchPercent, $region.mismatchedPixels, $region.meanAbsoluteDelta, $rect))
    }

    $md.Add('')
    $md.Add('### Top Grid Regions')
    $md.Add('')
    $md.Add('| Region | Mismatch | Mismatched px | Mean delta | Rect |')
    $md.Add('| --- | ---: | ---: | ---: | --- |')
    foreach ($region in @($row.topGridRegions)) {
        $rect = "$($region.x),$($region.y),$($region.width),$($region.height)"
        $md.Add(('| `{0}` | {1}% | {2} | {3} | `{4}` |' -f $region.key, $region.mismatchPercent, $region.mismatchedPixels, $region.meanAbsoluteDelta, $rect))
    }

    if (@($row.crops).Count -gt 0) {
        $md.Add('')
        $md.Add('### Hotspot Crops')
        $md.Add('')
        $md.Add('| Kind | Rank | Region | Electron | Unity | Diff |')
        $md.Add('| --- | ---: | --- | --- | --- | --- |')
        foreach ($crop in @($row.crops)) {
            $md.Add(('| `{0}` | {1} | `{2}` | `{3}` | `{4}` | `{5}` |' -f $crop.kind, $crop.rank, $crop.key, $crop.electron, $crop.unity, $crop.diff))
        }
    }
}

$md | Set-Content -LiteralPath $OutMarkdown -Encoding UTF8

[pscustomobject] @{
    ok = $true
    rows = $reportRows.Count
    json = (Resolve-Path -LiteralPath $OutJson).Path
    markdown = (Resolve-Path -LiteralPath $OutMarkdown).Path
} | ConvertTo-Json -Depth 4
