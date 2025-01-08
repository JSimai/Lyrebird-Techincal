import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Pressable } from 'react-native';
import { generalStyles } from '../styles/general';
import { commandTabStyles } from '../styles/commandTab';
import { notesStyles } from '../styles/notes';
import { consultationsStyles } from '../styles/consultations';
import { StatusBar } from 'expo-status-bar';
import { Keyboard } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, firstNames, lastNames, summaries } from '../utils/constants';
import { audioRecorder } from '../utils/audioRecorder';

interface Consultation {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  note: string;
  summary: {
    text: string;
    subjective: string;
    pmh: string;
    medications: string;
    familyHistory: string;
    examination: string;
    assessment: string;
    plan: string;
  };
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

// const generateRandomTime = () => {
//   const hour = Math.floor(Math.random() * (17 - 9) + 9); // 9 AM to 5 PM
//   const minute = Math.floor(Math.random() * 6) * 10; // 0, 10, 20, 30, 40, 50
//   const ampm = hour >= 12 ? 'PM' : 'AM';
//   const hour12 = hour > 12 ? hour - 12 : hour;
//   return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
// };

export default function Index() {

  const [consultationStatus, setConsultationStatus] = useState("waiting");
  const [currentNote, setCurrentNote] = useState('');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [patientName, setPatientName] = useState(generateRandomName());
  const [showDocPopup, setShowDocPopup] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const names = patientName.split(' ');
      const response = await fetch('http://localhost:3000/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: names[0],
          lastName: names[1]
        })
      });
      
      if (!response.ok) throw new Error('Failed to create patient');
      const patient = await response.json();
      setCurrentPatient(patient);

      await audioRecorder.startRecording();
      setConsultationStatus("recording");
      setActiveTab('summary');
      // Start timer
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const stopRecording = async () => {
    try {
      // Clear timer
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
      setConsultationStatus("generating");
      const { audioBlob, transcription } = await audioRecorder.stopRecording();
      Keyboard.dismiss();

      // Send transcription to backend for summary generation
      const response = await fetch('http://localhost:3000/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transcription,
          patientId: currentPatient?.id,
          notes: currentNote
        })
      });

      if (!response.ok) throw new Error('Failed to generate summary');
      const { summary, consultation } = await response.json();

      setConsultations([
        {
          id: consultation.id,
          patientName: patientName,
          date: new Date(consultation.date),
          time: consultation.time,
          note: consultation.notes,
          summary: consultation.summary
        },
        ...consultations
      ]);
      
      setConsultationStatus("summary");
      setActiveTab('summary');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      alert('Failed to stop recording: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const nextPatient = () => {
    // Need to add extra notes onto the previously written notes if post consultation notes are written.
    setConsultationStatus("waiting");
    setActiveTab('summary');
    setCurrentNote('');
    setCurrentPatient(null);
    const newName = generateRandomName();
    setPatientName(newName);
    resetTimer();
  };

  const resetTimer = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
    setRecordingDuration(0);
  };

  const renderConsultation = ({ item: consultation }: { item: Consultation }, version: string) => {
    return (
      <ScrollView style={consultationsStyles.currentConsultationItem}>
        <Text style={consultationsStyles.consultationHeader}>
          {consultation.patientName} - {consultation.date.toLocaleDateString()} - {consultation.time}
        </Text>
        
        {version === "Transcript" ?
            <Text style={consultationsStyles.summary}>{consultation.summary.text}</Text>
          :
          <>
            <Text style={consultationsStyles.subHeader}>Subjective</Text>
            <Text style={consultationsStyles.summary}>{consultation.summary.subjective}</Text>

            <Text style={consultationsStyles.subHeader}>Past Medical History</Text>
            <Text style={consultationsStyles.summary}>{consultation.summary.pmh}</Text>

            <Text style={consultationsStyles.subHeader}>Medications</Text>
            <Text style={consultationsStyles.summary}>{consultation.summary.medications}</Text>

            <Text style={consultationsStyles.subHeader}>Family History</Text>
            <Text style={consultationsStyles.summary}>{consultation.summary.familyHistory}</Text>

            <Text style={consultationsStyles.subHeader}>Examination</Text>
            <Text style={consultationsStyles.summary}>{consultation.summary.examination}</Text>

            <Text style={consultationsStyles.subHeader}>Assessment</Text>
            <Text style={consultationsStyles.summary}>{consultation.summary.assessment}</Text>

            <Text style={consultationsStyles.subHeader}>Plan</Text>
            <Text style={consultationsStyles.summary}>{consultation.summary.plan}</Text>

            <Text style={consultationsStyles.subHeader}>Consultation Notes</Text>
            <Text style={consultationsStyles.summary}>{consultation.note ? consultation.note : 'No notes.'}{'\n\n\n\n\n\n\n'}</Text>
          </>
        }

        
      </ScrollView>
    );
  };

  const renderHistoryConsultation = ({ item: consultation, index, separators }: { item: Consultation, index: number, separators: any }) => {
    // Check if this consultation is from yesterday and if it's the first one from yesterday
    let isFirstYesterdayConsult = index === 0 && 
      consultation.date.toDateString() === new Date(Date.now() - 86400000).toDateString();
    
    if (index > 0) {
      isFirstYesterdayConsult = consultation.date.toDateString() !== new Date().toDateString() &&
        consultations[index-1].date.toDateString() !== new Date(Date.now() - 86400000).toDateString();
    }

    return (
      <View>
        {isFirstYesterdayConsult && (
          <View style={consultationsStyles.dateSeparator}>
            <Text style={consultationsStyles.dateSeparatorText}>Older</Text>
            <View style={consultationsStyles.divider}/>
          </View>
        )}
        <View style={consultationsStyles.consultationItem}>
          <Text style={consultationsStyles.consultationHeader}>
            {consultation.patientName} - {consultation.date.toLocaleDateString()} - {consultation.time}
          </Text>
          <Text style={consultationsStyles.summary}>{consultation.summary.subjective}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    return () => {
      // Cleanup socket when component unmounts
      audioRecorder.cleanup();
    };
  }, []);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch('http://localhost:3000/consultations');
        if (!response.ok) throw new Error('Failed to fetch consultations');
        const data = await response.json();
        
        // Transform data to match the Consultation interface
        const formattedConsultations = data.map((consultation: any) => ({
          id: consultation.id,
          patientName: `${consultation.patient.firstName} ${consultation.patient.lastName}`,
          date: new Date(consultation.date),
          time: consultation.time,
          note: consultation.notes,
          summary: consultation.summary
        }));
        
        setConsultations(formattedConsultations);
      } catch (error) {
        console.error('Failed to fetch consultations:', error);
        alert('Failed to load consultations. Please try again later.');
      }
    };

    fetchConsultations();
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <View style={generalStyles.container}>
      <StatusBar style="light" backgroundColor="#457CBF" />

      <View style={generalStyles.header}>
        <MaterialCommunityIcons name="bird" size={24} color="white" />
        <Text style={generalStyles.headerText}>Mockingbird</Text>
      </View>

      <View>
        <View style={generalStyles.patientInfoSection}>
          <View style={generalStyles.patientNameCont}>
            <Text style={generalStyles.patientName}>{patientName}</Text>
            {consultationStatus === "recording" ? 
              <View style={commandTabStyles.recordButton}>
                <View style={commandTabStyles.recordingIndicator} />
                <Text style={commandTabStyles.recordingTimeText}>{formatDuration(recordingDuration)}</Text>
              </View>
              : (consultationStatus === "generating" || consultationStatus === "summary") ?
              <View style={commandTabStyles.recordButton}>
                <View style={[commandTabStyles.recordingIndicator, {backgroundColor: COLORS.SUCCESS}]} />
                <Text style={commandTabStyles.recordingTimeText}>{formatDuration(recordingDuration)}</Text>
              </View>
              :
              <View/>
            }
          </View>
          <Text style={generalStyles.consultDateTime}>
            {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={generalStyles.mainContent}>
        <View style={notesStyles.notesSection}>
          <Text style={generalStyles.sectionTitle}>Notepad</Text>
          <TextInput
            style={notesStyles.input}
            value={currentNote}
            onChangeText={setCurrentNote}
            placeholder="Write notes here..."
            multiline
            textAlignVertical="top"
          />
        </View>
        <View style={generalStyles.divider}/>
        <View style={consultationsStyles.consultationsSection}>
          <View style={consultationsStyles.tabSelector}>
            <TouchableOpacity style={activeTab === 'summary' ? [consultationsStyles.tabButton, {backgroundColor: '#457CBF'}] : consultationsStyles.tabButton} onPress={() => setActiveTab('summary')}>
              <Text style={[consultationsStyles.tabButtonText, {color: activeTab === 'summary' ? 'white' : '#457CBF'}]}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={activeTab === 'transcript' ? [consultationsStyles.tabButton, {backgroundColor: '#457CBF'}] : consultationsStyles.tabButton} onPress={() => setActiveTab('transcript')}>
              <Text style={[consultationsStyles.tabButtonText, {color: activeTab === 'transcript' ? 'white' : '#457CBF'}]}>Transcript</Text>
            </TouchableOpacity>
            <TouchableOpacity style={activeTab === 'history' ? [consultationsStyles.tabButtonHistory, {backgroundColor: '#457CBF'}] : consultationsStyles.tabButtonHistory} onPress={() => setActiveTab('history')}>
              <MaterialIcons name="history" size={24} color={activeTab === 'history' ? 'white' : '#457CBF'} />
            </TouchableOpacity>
          </View>
          {activeTab === 'transcript' ?
            <View style={{flex: 1}}>
              {consultationStatus === "waiting" ?
                <Text>Begin recording to start generating transcript.</Text>
                : consultationStatus === "recording" ?
                <Text>Transcript will display once recording is stopped.</Text>
                : consultationStatus === "generating" ?
                <Text>Generating transcript...</Text>
                : consultationStatus === "summary" &&
                renderConsultation({ item: consultations[0] }, "Transcript")
              }
            </View>
            : activeTab === 'summary' ?
            <View style={{flex: 1}}>
              {consultationStatus === "waiting" ?
                <Text>Begin recording to start generating summary.</Text>
                : consultationStatus === "recording" ?
                <Text>Summary will display once recording is stopped.</Text>
                : consultationStatus === "generating" ?
                <Text>Generating summary...</Text>
                : consultationStatus === "summary" &&
                renderConsultation({ item: consultations[0] }, "Summary")
              }
            </View>
            :
            <FlatList
              style={consultationsStyles.consultationsList}
              data={consultations}
              renderItem={renderHistoryConsultation}
              keyExtractor={(item) => item.id}
            />
          }
        </View>
      </View>

      <View style={commandTabStyles.container}>
        {consultationStatus === "waiting" ?
          <View style={commandTabStyles.tab}>
            <TouchableOpacity
              style={commandTabStyles.recordButton}
              onPress={startRecording}
            >
              <Entypo name="mic" size={20} color={COLORS.PRIMARY} />
              <Text style={commandTabStyles.buttonText}>Start Recording</Text>
            </TouchableOpacity>
          </View>
          : consultationStatus === "recording" ?
          <View style={commandTabStyles.tab}>
            <View style={commandTabStyles.recordButtonCont}>
              <View style={commandTabStyles.recordButton}>
                <View style={commandTabStyles.recordingIndicator} />
                <Text style={commandTabStyles.recordingIndicatorText}>Recording...</Text>
              </View>
              <Text style={commandTabStyles.recordingTimeText}>{formatDuration(recordingDuration)}</Text>
              <View style={commandTabStyles.divider}/>
              <Pressable testID="stop-button" style={commandTabStyles.stopButton} onPress={stopRecording}>
                {({pressed, hovered}) => (
                  <Entypo 
                    name="controller-stop" 
                    size={28} 
                    color={hovered ? COLORS.RECORDING : COLORS.GRAY_500} 
                  />
                )}
              </Pressable>
            </View>
          </View>
          : consultationStatus === "generating" ?
          <View style={commandTabStyles.tab}>
            <View style={commandTabStyles.recordButton}>
              <Entypo name="pencil" size={20} color={COLORS.GRAY_800} />
              <Text style={[commandTabStyles.buttonText, {color: COLORS.GRAY_800}]}>Generating...</Text>
            </View>
            <Text style={commandTabStyles.recordingTimeText}>{formatDuration(recordingDuration)}</Text>
          </View>
          :
          <View>
            {showDocPopup && (
              <View style={commandTabStyles.popupContainer}>
                <Text style={commandTabStyles.popupText}>
                  This button would offer users to generate letters to GPs, Patients, and Carers, as well as any other relevant generative docs.
                </Text>
              </View>
            )}
            <View style={commandTabStyles.tab}>
              <TouchableOpacity
                style={commandTabStyles.recordButton}
                onPress={() => setShowDocPopup(!showDocPopup)}
              >
                <Entypo name="circle-with-plus" size={20} color={COLORS.PRIMARY} />
                <Text style={commandTabStyles.buttonText}>{showDocPopup ? 'Hide Popup' : 'Generate Doc'}</Text>
              </TouchableOpacity>
              <View style={commandTabStyles.divider}/>
              <TouchableOpacity
                style={commandTabStyles.recordButton}
                onPress={nextPatient}
              >
                <Entypo name="arrow-with-circle-right" size={20} color={COLORS.GRAY_800} />
                <Text style={[commandTabStyles.buttonText, {color: COLORS.GRAY_800}]}>Next Patient</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        }
      </View>
    </View>
  );
}
