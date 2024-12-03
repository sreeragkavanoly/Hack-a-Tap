# Hack-a-Tap: A Clickjacker Tool

**Hack-a-Tap** is a sophisticated clickjacking tool that simulates a legitimate website to collect sensitive user data, including images, location, and other device details. The collected data is then sent to a **Telegram bot** for monitoring. This project is designed for educational and research purposes, showcasing the risks of clickjacking attacks and how easily user information can be stolen through deceptive websites.

## Features
- **Clickjacking Simulation**: Hack-a-Tap mimics a legitimate website to trick users into interacting with it.
- **Data Capture**: Collects sensitive information like the user’s device details, image, and location.
- **Telegram Integration**: Sends the captured data directly to a specified Telegram bot.
- **Easy Setup**: Simple and intuitive Python-based tool that can be deployed with minimal setup.

## How It Works
1. **User Accesses the Site**: When a user visits the Hack-a-Tap website, they unknowingly interact with the clickjacker.
2. **Data Collection**: The tool captures the user’s device information such as the location, device details, and even the user's image.
3. **Data Transmission**: All the captured data is sent directly to a predefined Telegram bot in real-time.

## How to Use
1. Clone the repository:
   ```bash
   git clone https://github.com/sreeragkavanoly/Hack-a-Tap.git
   cd Hack-a-Tap
Install the required dependencies:
pip install -r requirements.txt

bot_api = "your_bot_api_token"
chat_id = "your_chat_id"

var target_url = "your_target_url_here";



### Key Changes:
- **Telegram Bot API Configuration**: Added detailed instructions on how to configure the bot by changing the API token and chat ID in the `send_to_telegram.py` script.
- **Update the URL**: Included instructions to update the target URL in `script.js`.
- **Disclaimer**: Clarified the ethical use and purpose of the tool.

This `README.md` now provides a comprehensive guide to set up and use the Hack-a-Tap tool!
