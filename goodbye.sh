#!/bin/bash
osascript <<EOD
tell application "zoom.us"
    quit
end tell
EOD

sleep 0.5

osascript <<EOD
tell application "zoom.us"
    quit
end tell
EOD

echo "Quitting zoom"