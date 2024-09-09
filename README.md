# 01 App

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

### The AI assistant for computer control.
Control your computer and smart home with voice commands from anywhere. The 01 App connects to a server on your home machine, enabling remote access to your files, apps, and IoT devices.

<br>

**Capabilities:**
- File management: Search, move, and share files across your system
- App integration: Interact with email, calendars, notes, and reminders
- Smart home control: Manage lights, thermostats, and other connected devices
- Custom automations: Teach your 01 to perform specific workflows

**Server Setup:**
1. Install Python 3.11
2. Clone the [01 GitHub](https://github.com/openinterpreter/01) repository
3. Follow server [setup](https://01.openinterpreter.com/software/server/livekit-server) instructions
4. Scan the generated QR code with the 01 App

<br>

The app is available for download from the [Apple App Store](https://apps.apple.com/ca/app/01-light/id6601937732) and [Google Play Store](https://play.google.com/store/apps/details?id=com.interpreter.app). 

<br>

This is an open-source release for developers. Pull requests are encouraged to improve the app! Expect updates to the pull request process as we figure things out. Pre-commit checks are in the pipeline! 

The 01 is an open-source platform for conversational devices, inspired by the Rabbit R1 and Star Trek computer.

<br>

This repository uses a boilerplate from [Infinite Red](https://infinite.red) with the following stack:

- Expo
- React Native
- React Navigation
- MobX State Tree
- TypeScript
- And more! 

<br>

# Start Cooking

**Note on Contributions:** We plan to open for contributions in the near future after we've got the necessary processes in place. Please check back for updates on our contribution guidelines! Thanks for your support and interest in the project.

**Install dependencies**
```
cd app
bun install
```

If you don't have a simulator setup you can follow the [Android Studio Emulator](https://docs.expo.dev/workflow/android-studio-emulator/) and [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) setup guides by Expo.

<br>

**Install the app on the iOS or Android simulator**
```
bun ios
bun android
```

For development purposes you will have to manually connect to the LiveKit server on the simulator by making the changes according to the commented code in `app/screens/LoginScreen.tsx`.

More scripts for development purposes are defined in `app/package.json`.

<br>

# Repository Structure

### ./app directory

The inside of the `app` directory follows the structure below:

```
app
├── components
├── config
├── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
└── app.tsx
```

**components**
This is where your reusable components live which help you build your screens.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truly shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./assets directory

This directory is designed to organize and store various assets, making it easy for you to manage and use them in your application. The assets are further categorized into subdirectories, including `fonts`, `icons`, `images`:

```
assets
├── fonts
├── icons
└── images
```

**icons**
This is where your icon assets will live. These icons can be used for buttons, navigation elements, or any other UI components. The recommended format for icons is PNG, but other formats can be used as well.


**images**
This is where your images will live, such as background images, logos, or any other graphics. You can use various formats such as PNG, JPEG, or GIF for your images.

How to use your `icon` or `image` assets:

```
import { Image } from 'react-native';

const MyComponent = () => {
  return (
    <Image source={require('../assets/images/my_image.png')} />
  );
};
```

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find templates you can customize to help you get started with React Native.

### ./test directory

This directory will hold your Jest configs and mocks.

## Running Maestro end-to-end tests

[Maestro Setup](https://ignitecookbook.com/docs/recipes/MaestroSetup) recipe from the [Ignite Cookbook](https://ignitecookbook.com/)!

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). You can read the full license text [here](LICENSE).

Copyright 2024 Open Interpreter, Inc.