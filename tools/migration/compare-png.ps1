param(
    [Parameter(Mandatory = $true)]
    [string] $BaselinePath,

    [Parameter(Mandatory = $true)]
    [string] $CandidatePath,

    [Parameter(Mandatory = $true)]
    [string] $DiffPath,

    [double] $ThresholdPercent = 0.75,

    [int] $PixelThreshold = 16
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
}

public static class PngDiff
{
    public static PngDiffResult Compare(
        string baselinePath,
        string candidatePath,
        string diffPath,
        double thresholdPercent,
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
            var totalPixels = (long)Math.Max(baseline.Width, candidate.Width)
                * Math.Max(baseline.Height, candidate.Height);
            var comparedPixels = (long)width * height;
            var mismatchedPixels = totalPixels - comparedPixels;

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

                                var delta =
                                    Math.Abs(baselineBytes[b] - candidateBytes[c])
                                    + Math.Abs(baselineBytes[b + 1] - candidateBytes[c + 1])
                                    + Math.Abs(baselineBytes[b + 2] - candidateBytes[c + 2])
                                    + Math.Abs(baselineBytes[b + 3] - candidateBytes[c + 3]);

                                if (delta > pixelThreshold)
                                {
                                    mismatchedPixels += 1;
                                    diffBytes[d] = 64;
                                    diffBytes[d + 1] = 64;
                                    diffBytes[d + 2] = 255;
                                    diffBytes[d + 3] = 255;
                                }
                                else
                                {
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
            return new PngDiffResult
            {
                ok = baseline.Width == candidate.Width
                    && baseline.Height == candidate.Height
                    && mismatchPercent <= thresholdPercent,
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
            };
        }
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

$result = [PngDiff]::Compare(
    (Resolve-Path -LiteralPath $BaselinePath).Path,
    (Resolve-Path -LiteralPath $CandidatePath).Path,
    $DiffPath,
    $ThresholdPercent,
    $PixelThreshold
)

$result | ConvertTo-Json -Depth 4
