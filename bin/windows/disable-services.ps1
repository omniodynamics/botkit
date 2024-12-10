param (
    [Parameter(Mandatory=$true)]
    [string]$RegexPattern
)

# Function to disable services matching the regex
function Disable-MatchingServices {
    param (
        [string]$Pattern
    )

    # Get all services and filter them based on the regex pattern
    $services = Get-Service | Where-Object { $_.Name -match $Pattern -or $_.DisplayName -match $Pattern }

    if ($services) {
        Write-Host "Found the following services matching the pattern '$Pattern':"
        $services | ForEach-Object {
            Write-Host "- $($_.Name) ($($_.DisplayName))"
        }

        $confirmation = Read-Host "Are you sure you want to disable these services? (Y/N)"
        if ($confirmation -eq 'Y' -or $confirmation -eq 'y') {
            foreach ($service in $services) {
                try {
                    Write-Host "Disabling service: $($service.Name)"
                    Set-Service -Name $service.Name -StartupType Disabled
                    Stop-Service -Name $service.Name -Force -ErrorAction Stop
                    Write-Host "Service $($service.Name) has been disabled and stopped."
                } catch {
                    Write-Host "Failed to disable service $($service.Name): $_"
                }
            }
        } else {
            Write-Host "Operation cancelled."
        }
    } else {
        Write-Host "No services found matching the pattern '$Pattern'."
    }
}

# Use the function with the provided regex pattern (case-insensitive)
Disable-MatchingServices -Pattern $RegexPattern