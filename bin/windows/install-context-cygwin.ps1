# Define paths and registry keys
$cygwinPath = "C:\cygwin64"
$cygstartPath = "$cygwinPath\bin\mintty.exe"

# Check if Cygwin is installed in the expected location
if (-not (Test-Path $cygstartPath)) {
    Write-Host "Cygwin does not appear to be installed in $cygwinPath. Please install Cygwin or update the path in this script."
    exit
}

# Function to create registry entries
function Add-ContextMenu {
    param (
        [string]$Name,
        [string]$Command,
        [string]$IconPath
    )

    $basePath = "HKCU:\Software\Classes\Directory\shell"
    $cmdPath = "$basePath\$Name\command"

    # Create the shell command
    New-Item -Path $basePath -Name $Name -Force | Out-Null
    New-Item -Path "$basePath\$Name" -Name "command" -Force | Out-Null
    Set-ItemProperty -Path "$basePath\$Name" -Name "(Default)" -Value $Name -Force
    Set-ItemProperty -Path $cmdPath -Name "(Default)" -Value $Command -Force

    # Optional: Set an icon if provided
    if ($IconPath) {
        Set-ItemProperty -Path "$basePath\$Name" -Name "Icon" -Value $IconPath -Force
    }
}

# Add cygstart context menu
$cygstartCommand = "`"$cygstartPath`" `"%V`""
Add-ContextMenu -Name "OpenWithCygstart" -Command $cygstartCommand -IconPath "$cygwinPath\Cygwin.ico"

Write-Host "Context menu item for opening with cygstart has been added."
Write-Host "Please restart Explorer (or log off and log back in) to see changes."