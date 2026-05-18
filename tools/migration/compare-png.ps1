param(
    [Parameter(Mandatory = $true)]
    [string] $BaselinePath,

    [Parameter(Mandatory = $true)]
    [string] $CandidatePath,

    [Parameter(Mandatory = $true)]
    [string] $DiffPath,

    [double] $ThresholdPercent = 0.75,

    [int] $PixelThreshold = 16,

    [int] $PositionTolerancePx = 2,

    [double] $MeanAbsoluteDeltaThreshold = 16.0,

    [int] $BaselineCropX = -1,

    [int] $BaselineCropY = -1,

    [int] $BaselineCropWidth = -1,

    [int] $BaselineCropHeight = -1,

    [int] $CandidateCropX = -1,

    [int] $CandidateCropY = -1,

    [int] $CandidateCropWidth = -1,

    [int] $CandidateCropHeight = -1,

    [switch] $RequireStrictPixel
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public sealed class PngDiffResult
{
    public bool ok;
    public int baselineWidth;
    public int baselineHeight;
    public int candidateWidth;
    public int candidateHeight;
    public int comparedWidth;
    public int comparedHeight;
    public long totalPixels;
    public long mismatchedPixels;
    public double mismatchPercent;
    public bool sizeMismatch;
    public string diffPath;
    public int pixelThreshold;
    public int positionTolerancePx;
    public bool strictPixelOk;
    public bool meanDeltaOk;
    public double meanAbsoluteDelta;
    public double meanAbsoluteDeltaThreshold;
    public double similarityPercent;
    public double requiredSimilarityPercent;
    public bool requireStrictPixel;
    public int baselineCropX;
    public int baselineCropY;
    public int baselineCropWidth;
    public int baselineCropHeight;
    public int candidateCropX;
    public int candidateCropY;
    public int candidateCropWidth;
    public int candidateCropHeight;
}

public static class PngDiff
{
    public static PngDiffResult Compare(
        string baselinePath,
        string candidatePath,
        string diffPath,
        double thresholdPercent,
        int pixelThreshold,
        int positionTolerancePx,
        double meanAbsoluteDeltaThreshold,
        int baselineCropX,
        int baselineCropY,
        int baselineCropWidth,
        int baselineCropHeight,
        int candidateCropX,
        int candidateCropY,
        int candidateCropWidth,
        int candidateCropHeight,
        bool requireStrictPixel
    )
    {
        using (var baselineSource = new Bitmap(baselinePath))
        using (var candidateSource = new Bitmap(candidatePath))
        using (var baseline = ToArgb(
            baselineSource,
            baselineCropX,
            baselineCropY,
            baselineCropWidth,
            baselineCropHeight
        ))
        using (var candidate = ToArgb(
            candidateSource,
            candidateCropX,
            candidateCropY,
            candidateCropWidth,
            candidateCropHeight
        ))
        {
            var width = Math.Min(baseline.Width, candidate.Width);
            var height = Math.Min(baseline.Height, candidate.Height);
            var totalPixels = (long)Math.Max(baseline.Width, candidate.Width)
                * Math.Max(baseline.Height, candidate.Height);
            var comparedPixels = (long)width * height;
            var mismatchedPixels = totalPixels - comparedPixels;
            double deltaSum = (totalPixels - comparedPixels) * 255.0 * 3.0;

            Directory.CreateDirectory(Path.GetDirectoryName(diffPath));
            using (var diff = new Bitmap(Math.Max(1, width), Math.Max(1, height), PixelFormat.Format32bppArgb))
            {
                if (width > 0 && height > 0)
                {
                    var rect = new Rectangle(0, 0, width, height);
                    var baselineData = baseline.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                    var candidateData = candidate.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                    var diffData = diff.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

                    try
                    {
                        var baselineBytes = new byte[Math.Abs(baselineData.Stride) * height];
                        var candidateBytes = new byte[Math.Abs(candidateData.Stride) * height];
                        var diffBytes = new byte[Math.Abs(diffData.Stride) * height];
                        Marshal.Copy(baselineData.Scan0, baselineBytes, 0, baselineBytes.Length);
                        Marshal.Copy(candidateData.Scan0, candidateBytes, 0, candidateBytes.Length);

                        for (var y = 0; y < height; y += 1)
                        {
                            for (var x = 0; x < width; x += 1)
                            {
                                var b = y * baselineData.Stride + x * 4;
                                var c = y * candidateData.Stride + x * 4;
                                var d = y * diffData.Stride + x * 4;

                                var delta = GetDelta(baselineBytes, b, candidateBytes, c);
                                if (delta > pixelThreshold && positionTolerancePx > 0)
                                {
                                    var bestDelta = delta;
                                    var radius = Math.Max(0, positionTolerancePx);
                                    for (var dy = -radius; dy <= radius; dy += 1)
                                    {
                                        var yy = y + dy;
                                        if (yy < 0 || yy >= height)
                                        {
                                            continue;
                                        }

                                        for (var dx = -radius; dx <= radius; dx += 1)
                                        {
                                            if (dx == 0 && dy == 0)
                                            {
                                                continue;
                                            }

                                            var xx = x + dx;
                                            if (xx < 0 || xx >= width)
                                            {
                                                continue;
                                            }

                                            var candidateOffset = yy * candidateData.Stride + xx * 4;
                                            var nearbyDelta = GetDelta(baselineBytes, b, candidateBytes, candidateOffset);
                                            if (nearbyDelta < bestDelta)
                                            {
                                                bestDelta = nearbyDelta;
                                                if (bestDelta <= pixelThreshold)
                                                {
                                                    break;
                                                }
                                            }
                                        }

                                        if (bestDelta <= pixelThreshold)
                                        {
                                            break;
                                        }
                                    }

                                    delta = bestDelta;
                                }

                                if (delta > pixelThreshold)
                                {
                                    mismatchedPixels += 1;
                                    deltaSum += delta;
                                    diffBytes[d] = 64;
                                    diffBytes[d + 1] = 64;
                                    diffBytes[d + 2] = 255;
                                    diffBytes[d + 3] = 255;
                                }
                                else
                                {
                                    deltaSum += delta;
                                    var gray = (byte)((candidateBytes[c] + candidateBytes[c + 1] + candidateBytes[c + 2]) / 3);
                                    diffBytes[d] = gray;
                                    diffBytes[d + 1] = gray;
                                    diffBytes[d + 2] = gray;
                                    diffBytes[d + 3] = 255;
                                }
                            }
                        }

                        Marshal.Copy(diffBytes, 0, diffData.Scan0, diffBytes.Length);
                    }
                    finally
                    {
                        baseline.UnlockBits(baselineData);
                        candidate.UnlockBits(candidateData);
                        diff.UnlockBits(diffData);
                    }
                }

                diff.Save(diffPath, ImageFormat.Png);
            }

            var mismatchPercent = totalPixels == 0 ? 100.0 : mismatchedPixels * 100.0 / totalPixels;
            var meanAbsoluteDelta = totalPixels == 0 ? 255.0 : deltaSum / (totalPixels * 3.0);
            var strictPixelOk = baseline.Width == candidate.Width
                && baseline.Height == candidate.Height
                && mismatchPercent <= thresholdPercent;
            var meanDeltaOk = baseline.Width == candidate.Width
                && baseline.Height == candidate.Height
                && meanAbsoluteDelta <= meanAbsoluteDeltaThreshold;
            var similarityPercent = 100.0 - mismatchPercent;
            return new PngDiffResult
            {
                ok = requireStrictPixel ? strictPixelOk : strictPixelOk || meanDeltaOk,
                baselineWidth = baseline.Width,
                baselineHeight = baseline.Height,
                candidateWidth = candidate.Width,
                candidateHeight = candidate.Height,
                comparedWidth = width,
                comparedHeight = height,
                totalPixels = totalPixels,
                mismatchedPixels = mismatchedPixels,
                mismatchPercent = Math.Round(mismatchPercent, 6),
                sizeMismatch = baseline.Width != candidate.Width || baseline.Height != candidate.Height,
                diffPath = diffPath,
                pixelThreshold = pixelThreshold,
                positionTolerancePx = Math.Max(0, positionTolerancePx),
                strictPixelOk = strictPixelOk,
                meanDeltaOk = meanDeltaOk,
                meanAbsoluteDelta = Math.Round(meanAbsoluteDelta, 6),
                meanAbsoluteDeltaThreshold = meanAbsoluteDeltaThreshold,
                similarityPercent = Math.Round(similarityPercent, 6),
                requiredSimilarityPercent = Math.Round(100.0 - thresholdPercent, 6),
                requireStrictPixel = requireStrictPixel,
                baselineCropX = baselineCropX,
                baselineCropY = baselineCropY,
                baselineCropWidth = baselineCropWidth,
                baselineCropHeight = baselineCropHeight,
                candidateCropX = candidateCropX,
                candidateCropY = candidateCropY,
                candidateCropWidth = candidateCropWidth,
                candidateCropHeight = candidateCropHeight,
            };
        }
    }

    private static int GetDelta(byte[] baselineBytes, int baselineOffset, byte[] candidateBytes, int candidateOffset)
    {
        return Math.Abs(baselineBytes[baselineOffset] - candidateBytes[candidateOffset])
            + Math.Abs(baselineBytes[baselineOffset + 1] - candidateBytes[candidateOffset + 1])
            + Math.Abs(baselineBytes[baselineOffset + 2] - candidateBytes[candidateOffset + 2])
            + Math.Abs(baselineBytes[baselineOffset + 3] - candidateBytes[candidateOffset + 3]);
    }

    private static Bitmap ToArgb(
        Bitmap source,
        int cropX,
        int cropY,
        int cropWidth,
        int cropHeight
    )
    {
        var hasCrop = cropWidth > 0 && cropHeight > 0;
        var sourceRect = hasCrop
            ? new Rectangle(
                Math.Max(0, Math.Min(source.Width - 1, cropX)),
                Math.Max(0, Math.Min(source.Height - 1, cropY)),
                Math.Max(1, Math.Min(cropWidth, source.Width - Math.Max(0, Math.Min(source.Width - 1, cropX)))),
                Math.Max(1, Math.Min(cropHeight, source.Height - Math.Max(0, Math.Min(source.Height - 1, cropY))))
            )
            : new Rectangle(0, 0, source.Width, source.Height);
        var bitmap = new Bitmap(sourceRect.Width, sourceRect.Height, PixelFormat.Format32bppArgb);
        using (var graphics = Graphics.FromImage(bitmap))
        {
            graphics.DrawImage(
                source,
                new Rectangle(0, 0, sourceRect.Width, sourceRect.Height),
                sourceRect,
                GraphicsUnit.Pixel
            );
        }

        return bitmap;
    }
}
"@

$result = [PngDiff]::Compare(
    (Resolve-Path -LiteralPath $BaselinePath).Path,
    (Resolve-Path -LiteralPath $CandidatePath).Path,
    $DiffPath,
    $ThresholdPercent,
    $PixelThreshold,
    $PositionTolerancePx,
    $MeanAbsoluteDeltaThreshold,
    $BaselineCropX,
    $BaselineCropY,
    $BaselineCropWidth,
    $BaselineCropHeight,
    $CandidateCropX,
    $CandidateCropY,
    $CandidateCropWidth,
    $CandidateCropHeight,
    [bool] $RequireStrictPixel
)

$result | ConvertTo-Json -Depth 4
