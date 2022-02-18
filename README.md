# Speak IT App

This app is based on the [Sample React App fot integration with the Azure Speech service](https://github.com/Azure-Samples/AzureSpeechReactSample) by [Azure-Samples](https://github.com/Azure-Samples).

## Prerequisites

1. This project assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](https://docs.microsoft.com/azure/cognitive-services/speech-service/overview#try-the-speech-service-for-free).
1. Ensure you have [Node.js](https://nodejs.org/en/download/) installed.

## How to run the app

1. Clone this repo, then change directory to the project root and run `npm install` to install dependencies.
1. Run `cp .env.example .env`
1. Add your Azure Speech key and region to the `.env` file, replacing the placeholder text.
1. Run `npm install`
1. To run the Express server and React app together, run `npm run dev`.

## Change recognition language

To change the source recognition language, change the locale strings in `App.js` 

```javascript
speechConfig.speechRecognitionLanguage = 'en-US'
```

For a full list of supported locales, see the [language support article](https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#speech-to-text).

