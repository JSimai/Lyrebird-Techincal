# Mockingbird

A simplified health consultations app that allows users to write notes, start consultations, generate transcripts and summaries, and more. Built with React Native, Expo, Express and Prisma.

## Project Overview

This application allows users to:
- Start and stop consultation recordings.
- Write notes before and during consultations.
- Generate transcripts and summaries for consultations.
- View consultation history.

## Technical Stack

- Expo
- React Native
- TypeScript
- Express
- Prisma
- PostgreSQL

## Installation

1. Clone the repository:

2. Navigate to frontend project directory:
   ```bash
   cd app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. In seperate terminal, navigate to Backend project directory:
   ```bash
   cd backend
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the frontenddevelopment server:
   ```bash
   npm start
   ```
2. App will be available at `http://localhost:8081`
3. For mobile access, download Expo Go app (iOS/Android).
4. Scan the QR code with Expo Go app (Android) or camera (iOS).
5. Alternatively, it can be run on a mobile simulator.
6. In the other terminal, start the backend development server:
   ```bash
   npm run dev
   ```

## Development Notes

### Frontend

Only relevant features are implemented, however, there are many other features that could be added to the frontend.

- Currently a placeholder; document generation for scripts, letters to GPs, letters to patients or carers, etc.
- The ability to pause the consultation.
- Patient profiles and previous information.
- Instead of a simple list for the history, I would implement a calendar view with the ability to filter by date, time, and patient info for both past and future appointments.

### Backend

Built with Express, Prisma, and PostgreSQL. Allows for audio transcription using OpenAI's Whisper API. Done in 10-second chunks to allow for the transcription to be done in a timely manner as well as consistent error checking. 2-second overlap is added to the audio to make sure the transcription is complete. Once the transcription is complete, the summary is generated using a GPT-4o model.

Patient and consultation data is stored in a PostgreSQL database.


### Unit Testing

I have created a few very simple unit tests to make sure the UI works as expected. A series of unit tests should be created to make sure audio recording, audio checking, summary generation, and document generation all work as expected when full stack functionality is implemented.

### Error Handling

Try and catch blocks are used to handle errors in the frontend allowing for the user to be informed of any issues without crashing the app or corrupting data.