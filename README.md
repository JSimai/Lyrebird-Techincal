# Mockingbird

A simplified health consultations app that allows users to write notes, start consultations, generate placeholder summaries, and more. Built with React Native and Expo. While optimized for web usage, the app is also fully functional on mobile devices as a native app in Expo Go.

## Project Overview

This application allows users to:
- Start and stop consultation recordings.
- Write notes before and during consultations.
- Generate placeholder summaries for consultations.
- View consultation history.

## Technical Stack

- Expo
- React Native
- TypeScript

## Installation

1. Clone the repository:

2. Navigate to the project directory:
   ```bash
   cd app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```
2. App will be available at `http://localhost:8081`
3. For mobile access, download Expo Go app (iOS/Android).
4. Scan the QR code with Expo Go app (Android) or camera (iOS).

## Development Notes

### Frontend

Only relevant features are implemented, however, there are many other features that could be added to the frontend.

- Document generation for scripts, letters to GPs, letters to patients or carers, etc.
- The ability to pause the consultation.
- Patient profiles and previous information.

### Backend

As this is a mockup with placeholder data, I decided to not implement a backend. However, if I were to implement a backend, key items to consider, unique to this project, would be:

- Audio recording: I would create a 30-second to 1-minute interval check where when recording, the audio would be split into segments to check for any issues with the microphone, internet connection, or other issues. If an issue had occured in one of the audio segments, we would still have all the older audio segments. An error would be thrown to the frontend to be displayed to the user.
- Summary generation: I would use a LLM to generate the summaries which would take into account the notes, previous patient information, and the audio recording.


### Unit Testing

A series of unit tests should be created to make sure audio recording, audio checking, summary generation, and document generation all work as expected.

### Error Handling

Try and catch blocks should be used to handle errors in the frontend and backend allowing for the user to be informed of any issues without crashing the app or corrupting data.