import { Audio } from 'expo-av';
import io, { Socket } from 'socket.io-client';

class AudioRecorder {
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  private chunks: Blob[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private socket: Socket | null = null;
  private transcription: string = '';
  private static instance: AudioRecorder | null = null;
  private webmHeaders: Uint8Array | null = null;
  private lastSecondOfAudio: Blob | null = null;
  private chunkInterval = 10000; // Keep 10 seconds per chunk
  private previousEndingPhrase: string = '';

  constructor() {
    if (AudioRecorder.instance) {
      return AudioRecorder.instance;
    }

    console.log('Initializing AudioRecorder...');
    this.initializeSocket();
    AudioRecorder.instance = this;
  }

  private initializeSocket() {
    // Clean up existing socket if it exists
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    this.socket.on('connect', () => {
      console.log('Socket connected with ID:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected:', this.socket?.id);
    });
    
    this.socket.on('transcription', (text: string) => {
      console.log('Received transcription:', text);
      // Check if the new text starts with the end of the previous transcription
      if (this.previousEndingPhrase) {
        // Find where the overlap ends
        const overlap = this.findLongestCommonStart(this.previousEndingPhrase, text);
        if (overlap) {
          // Only add the non-overlapping part
          text = text.slice(overlap.length);
        }
      }
      
      // Store the end of this transcription for next time
      this.previousEndingPhrase = text.split(' ').slice(-10).join(' '); // Store last 10 words
      
      this.transcription += (this.transcription ? ' ' : '') + text.trim();
    });

    this.socket.on('error', (error: string) => {
      console.error('Socket error:', error);
    });
  }

  // Add cleanup method
  public cleanup() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    console.log('Starting recording...');
    if (!(await this.requestPermissions())) {
      throw new Error('Microphone permission not granted');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      this.chunks = [];
      this.transcription = '';
      this.webmHeaders = null;
      this.lastSecondOfAudio = null;

      let isFirstChunk = true;

      this.mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0) {
          console.log('Audio chunk received, size:', e.data.size);
          
          if (this.socket?.connected) {
            const arrayBuffer = await e.data.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            if (isFirstChunk) {
              // Store headers from first chunk
              this.webmHeaders = uint8Array.slice(0, 4000);
              console.log('Sending first chunk to server...');
              this.socket.emit('audioChunk', Array.from(uint8Array));
              isFirstChunk = false;
            } else {
              // Add headers to subsequent chunks
              const withHeaders = new Uint8Array(this.webmHeaders!.length + uint8Array.length);
              withHeaders.set(this.webmHeaders!);
              withHeaders.set(uint8Array, this.webmHeaders!.length);

              // If we have audio from the last chunk, prepend it
              if (this.lastSecondOfAudio) {
                const lastAudioArray = new Uint8Array(await this.lastSecondOfAudio.arrayBuffer());
                const withOverlap = new Uint8Array(withHeaders.length + lastAudioArray.length);
                withOverlap.set(lastAudioArray);
                withOverlap.set(withHeaders, lastAudioArray.length);
                console.log('Sending chunk with overlap to server...');
                this.socket.emit('audioChunk', Array.from(withOverlap));
              } else {
                console.log('Sending chunk with headers to server...');
                this.socket.emit('audioChunk', Array.from(withHeaders));
              }
            }

            // Store the last second of this chunk for next time
            const blob = new Blob([e.data], { type: 'audio/webm;codecs=opus' });
            const duration = 2000; // 2 seconds
            const lastTwoSeconds = await this.extractLastSeconds(blob, duration);
            this.lastSecondOfAudio = lastTwoSeconds;
          }
        }
      };

      this.mediaRecorder.start(this.chunkInterval);
      this.isRecording = true;
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  // Helper function to extract the last N seconds from a blob
  private async extractLastSeconds(blob: Blob, duration: number): Promise<Blob> {
    const arrayBuffer = await blob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    
    // Look for WebM cluster markers from the end
    // WebM cluster ID is 0x1F43B675
    const clusterMarker = [0x1F, 0x43, 0xB6, 0x75];
    let lastClusterStart = -1;
    
    // Start from near the end of the file, looking for the last complete cluster
    for (let i = data.length - 4; i >= 0; i--) {
      if (data[i] === clusterMarker[0] &&
          data[i + 1] === clusterMarker[1] &&
          data[i + 2] === clusterMarker[2] &&
          data[i + 3] === clusterMarker[3]) {
        lastClusterStart = i;
        break;
      }
    }
    
    if (lastClusterStart === -1) {
      console.log('No cluster marker found, skipping overlap');
      return new Blob([], { type: 'audio/webm;codecs=opus' });
    }
    
    // Get the last cluster and add WebM headers
    const lastCluster = data.slice(lastClusterStart);
    const withHeaders = new Uint8Array(this.webmHeaders!.length + lastCluster.length);
    withHeaders.set(this.webmHeaders!);
    withHeaders.set(lastCluster, this.webmHeaders!.length);
    
    return new Blob([withHeaders], { type: 'audio/webm;codecs=opus' });
  }

  async stopRecording(): Promise<{ audioBlob: Blob; transcription: string }> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve({ audioBlob: new Blob(), transcription: '' });
        return;
      }

      let finalTranscriptionReceived = false;
      const finalTranscriptionHandler = (text: string) => {
        console.log('Received final transcription:', text);
        // Just mark as received, don't add the text
        finalTranscriptionReceived = true;
      };

      this.socket?.on('transcription', finalTranscriptionHandler);

      this.mediaRecorder.onstop = async () => {
        // Wait for final transcription
        await new Promise<void>(resolve => {
          const checkTranscription = setInterval(() => {
            if (finalTranscriptionReceived) {
              clearInterval(checkTranscription);
              this.socket?.off('transcription', finalTranscriptionHandler);
              resolve();
            }
          }, 100);
          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkTranscription);
            this.socket?.off('transcription', finalTranscriptionHandler);
            resolve();
          }, 5000);
        });

        const audioBlob = new Blob(this.chunks, { type: 'audio/webm;codecs=opus' });
        this.chunks = [];
        this.isRecording = false;
        resolve({ 
          audioBlob, 
          transcription: this.transcription.trim() 
        });
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  // Helper function to find the longest common start between two strings
  private findLongestCommonStart(str1: string, str2: string): string {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let commonLength = 0;
    
    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
      if (words1[i] === words2[i]) {
        commonLength = i + 1;
      } else {
        break;
      }
    }
    
    return words1.slice(0, commonLength).join(' ');
  }
}

// Create a single instance that will be reused
export const audioRecorder = new AudioRecorder();