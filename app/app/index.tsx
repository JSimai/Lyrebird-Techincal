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

const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

const generateRandomTime = () => {
  const hour = Math.floor(Math.random() * (17 - 9) + 9); // 9 AM to 5 PM
  const minute = Math.floor(Math.random() * 6) * 10; // 0, 10, 20, 30, 40, 50
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

export default function Index() {

  const [consultationStatus, setConsultationStatus] = useState("waiting");
  const [currentNote, setCurrentNote] = useState('');
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: Date.now().toString(),
      patientName: "Sarah Mitchell",
      date: new Date(),
      time: generateRandomTime(),
      note: currentNote,
      summary: { 
        text: "Hi there, welcome, good morning. Can you tell me your name and what brings you in today? Hi, my name is Sarah Mitchell. I've been feeling unwell for a few days. I have a persistent headache, some nausea, and occasional dizziness. I've been in before. I'm an existing patient. I see. Well, nice to see you again. Have you experienced these symptoms before? Uh, not really. It started three days ago after I had a long day at work. Yes, it was really long, very stressful. I also haven't been sleeping very well. Okay. Are you taking any medications currently? And do you have any known medical conditions? I take daily antihistamine for allergies and I had a panadol a couple days ago, but no other medications or major health issues. Got it. Any recent changes in your diet, stress levels or maybe exposure to allergens? I've been stressed with work. Like I said, I skipped a few meals this week. Otherwise, no major changes. Understood. Based on what you've described, it sounds like your symptoms may be related to stress and lack of rest. I'd recommend staying hydrated, eating regular meals, and trying to get more sleep. If the symptoms persist or worsen we can run some tests to rule out other causes. Does that sound good to you? Makes sense. I'll try those suggestions. Great. If you need anything else, don't hesitate to reach out. Take care.", 
        subjective: "Sarah Mitchell reports feeling unwell for a few days with a persistent headache, nausea, and occasional dizziness. Symptoms started three days ago after a long, stressful day at work and poor sleep.", 
        pmh: "No major health issues reported.", 
        medications: "Daily antihistamine for allergies, Panadol taken a couple of days ago.", 
        familyHistory: "Not discussed in this consultation.", 
        examination: "No physical examination findings were discussed.", 
        assessment: "Symptoms may be related to stress and lack of rest.", 
        plan: "Recommend staying hydrated, eating regular meals, and getting more sleep. If symptoms persist or worsen, consider running tests to rule out other causes."
      },
    }
  ]);
  const [activeTab, setActiveTab] = useState('summary');
  const [patientName, setPatientName] = useState(generateRandomName());
  const [consultTime, setConsultTime] = useState(generateRandomTime());
  const [showDocPopup, setShowDocPopup] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      await audioRecorder.startRecording();
      setConsultationStatus("recording");
      setActiveTab('summary');
      // Start timer
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please try again.');
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
      console.log('Received from audioRecorder:', { transcription });
      Keyboard.dismiss();

      // Send transcription to backend for summary generation
      const response = await fetch('http://localhost:3000/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcription })
      });

      const { summary } = await response.json();

      // console.log('Summary:', summary);

      // const summary = { 
      //   text: "Hi there, welcome, good morning. Can you tell me your name and what brings you in today? Hi, my name is Sarah Mitchell. I've been feeling unwell for a few days. I have a persistent headache, some nausea, and occasional dizziness. I've been in before. I'm an existing patient. I see. Well, nice to see you again. Have you experienced these symptoms before? Uh, not really. It started three days ago after I had a long day at work. Yes, it was really long, very stressful. I also haven't been sleeping very well. Okay. Are you taking any medications currently? And do you have any known medical conditions? I take daily antihistamine for allergies and I had a panadol a couple days ago, but no other medications or major health issues. Got it. Any recent changes in your diet, stress levels or maybe exposure to allergens? I've been stressed with work. Like I said, I skipped a few meals this week. Otherwise, no major changes. Understood. Based on what you've described, it sounds like your symptoms may be related to stress and lack of rest. I'd recommend staying hydrated, eating regular meals, and trying to get more sleep. If the symptoms persist or worsen we can run some tests to rule out other causes. Does that sound good to you? Makes sense. I'll try those suggestions. Great. If you need anything else, don't hesitate to reach out. Take care.", 
      //   subjective: "Sarah Mitchell reports feeling unwell for a few days with a persistent headache, nausea, and occasional dizziness. Symptoms started three days ago after a long, stressful day at work and poor sleep.", 
      //   pmh: "No major health issues reported.", 
      //   medications: "Daily antihistamine for allergies, Panadol taken a couple of days ago.", 
      //   familyHistory: "Not discussed in this consultation.", 
      //   examination: "No physical examination findings were discussed.", 
      //   assessment: "Symptoms may be related to stress and lack of rest.", 
      //   plan: "Recommend staying hydrated, eating regular meals, and getting more sleep. If symptoms persist or worsen, consider running tests to rule out other causes."
      // }

      const newConsultation: Consultation = {
        id: Date.now().toString(),
        patientName: patientName,
        date: new Date(),
        time: consultTime,
        note: currentNote,
        summary: summary,
      };

      setConsultations([newConsultation, ...consultations]);
      setConsultationStatus("summary");
      setActiveTab('summary');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      alert('Failed to stop recording. Please try again.');
    }
  };

  const nextPatient = () => {
    // Need to add extra notes onto the previously written notes if post consultation notes are written.
    setConsultationStatus("waiting");
    setActiveTab('summary');
    setCurrentNote('');
    setPatientName(generateRandomName());
    setConsultTime(generateRandomTime());
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
            {new Date().toLocaleDateString()} - {consultTime}
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
