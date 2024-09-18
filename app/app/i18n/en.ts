const en = {
  common: {
    continue: "Continue",
    back: "Go Back",
    connect: "Connect",
    disconnect: "Disconnect",
  },

  permissions: {
    camera: "We need your permission to show the camera",
  },

  termScreen: {
    disclaimer:
      "This program controls your computer, and is capable of damaging your system and performing malicious actions.",
    backup: "I have backed up all my files",
    safety: "I understand the safety implications of running AI generated code on my computer.",
    agree: "I have read and agree to the 01 App ",
    tos: "terms of service",
    safetyReport: "Read Safety Report",
  },

  loginScreen: {
    setup: "Setup Guide",
    report: "Report Bugs",
  },

  welcomeScreen: {
    starting: "Starting...",
    about:
      "The first 01 was built in 8 weeks by 20 open-source contributors in Seattle, Washington.",
  },

  settingScreen: {
    title: "Settings",
    interpreterDescription:
      "The 01 App is a computer-controlling voice assistant, inspired by the Star Trek computer. Developed in North America by the Open Interpreter project.",
    pushToTalk: "Push-to-talk",
    pushToTalkDescription:
      "When enabled, the 01 App listens only while you hold the on-screen button. When disabled, it will try to guess when you’re talking, and does not require any physical interaction.",
    alwaysListen: "Always listen for context",
    alwaysListeningDescription:
      "When this is on, your 01 will always listen to gather context. You'll still need to push the button to prompt a response.",
    wearable: "Wearable Mode",
    wearableDescription:
      "Disables chat interface and displays a minimal full-screen button. Optimized for small screens on wearable devices.",
    autorun: "Autorun Code",
    autorunDescription:
      "When this is on, your 01 will automatically run code. Otherwise, you'll need to permit any code that the 01 wants to run.",
    report: "Report Bugs",
    privacyPolicy: "Privacy Policy",
  },

  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
}

export default en
export type Translations = typeof en
