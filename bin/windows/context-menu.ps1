# Define the registry path for directory context menu items
$regPath = "Registry::HKEY_CURRENT_USER\Software\Classes\Directory\Background\shell"

# Define the name of your custom menu item
$menuName = "CustomAction"

# Define the command to execute when the menu item is clicked
$command = 'C:\cygwin64\bin\mintty.exe -e C:\cygwin64\bin\bash.exe --rcfile ~/.bashrc'

# Create the new menu item
New-Item -Path $regPath -Name $menuName -Force

# Set the display name for the menu item
Set-ItemProperty -Path "$regPath\$menuName" -Name "(Default)" -Value "Custom Directory Action" -Force

# Optionally, add an icon (replace path with actual icon path if needed)
# Set-ItemProperty -Path "$regPath\$menuName" -Name "Icon" -Value "C:\path\to\icon.ico"

# Create the command subkey
New-Item -Path "$regPath\$menuName" -Name "command" -Force

# Set the command to run when the menu item is clicked
Set-ItemProperty -Path "$regPath\$menuName\command" -Name "(Default)" -Value $command -Force

Write-Output "Custom context menu item added successfully."