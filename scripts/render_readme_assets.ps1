$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $bulletFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)

    $graphics.DrawString("Detection Gap Coverage Lab", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("•", $bulletFont, $altAccentBrush, 108, $y)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Overview proof" `
    -Subtitle "Telemetry health, control coverage, playbook drift, and incident posture in one vendor-neutral SecOps operator surface." `
    -Bullets @(
        "High-severity detection coverage gaps surface before audits, SOC drift, or trust degradation.",
        "Telemetry and playbook issues stay visible instead of buried in admin configuration state.",
        "Incident packets make detection, collaboration, and automation ownership explicit."
    )

New-ProofImage -Path (Join-Path $screenshots "02-detection-lane-proof.png") `
    -Title "Detection lane" `
    -Subtitle "Every lane keeps owner, risk focus, status, and next action visible." `
    -Bullets @(
        "Identity, endpoint, collaboration, and automation lanes stay separated cleanly.",
        "Coverage drift remains obvious.",
        "Incident paths are ready for operator review."
    )

New-ProofImage -Path (Join-Path $screenshots "03-coverage-gaps-proof.png") `
    -Title "Coverage gaps" `
    -Subtitle "Gaps map severity, owner, principal, scope, and the exact detection posture that fired." `
    -Bullets @(
        "Identity and automation signals surface first.",
        "Owner mapping keeps detection and SOC accountability explicit.",
        "The lane is grounded in reusable coverage evidence."
    )

New-ProofImage -Path (Join-Path $screenshots "04-incident-posture-proof.png") `
    -Title "Incident posture" `
    -Subtitle "Packets tie completeness, blocker, owner, and response timing together." `
    -Bullets @(
        "Privileged identity tuning, connector recovery, collaboration ingestion, and playbook repair packets stay readable.",
        "Red/yellow/green incident posture is easy to scan.",
        "The system is shaped for real SecOps coverage proof."
    )
