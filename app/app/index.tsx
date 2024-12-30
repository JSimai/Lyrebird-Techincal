import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Pressable } from 'react-native';
import { generalStyles } from '../styles/general';
import { commandTabStyles } from '../styles/commandTab';
import { notesStyles } from '../styles/notes';
import { consultationsStyles } from '../styles/consultations';
import { StatusBar } from 'expo-status-bar';
import { Keyboard } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, firstNames, lastNames, summaries } from '../utils/constants';

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
  const generatePastConsultation = (hoursAgo: number): Consultation => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(9 + hoursAgo); // Spread throughout yesterday (starting at 9 AM)
    
    return {
      id: (Date.now() - hoursAgo * 3600000).toString(),
      patientName: generateRandomName(),
      date: yesterday,
      time: `${(9 + hoursAgo > 12 ? 9 + hoursAgo - 12 : 9 + hoursAgo)}:00 ${9 + hoursAgo >= 12 ? 'PM' : 'AM'}`,
      note: "",
      summary: summaries[Math.floor(Math.random() * summaries.length)],
    };
  };

  const [isRecording, setIsRecording] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [consultations, setConsultations] = useState<Consultation[]>([
    generatePastConsultation(6),  // 3:00 PM yesterday
    generatePastConsultation(4),  // 1:00 PM yesterday
    generatePastConsultation(2),  // 11:00 AM yesterday
  ]);
  const [activeTab, setActiveTab] = useState('history');
  const [patientName, setPatientName] = useState(generateRandomName());
  const [consultTime, setConsultTime] = useState(generateRandomTime());
  const [showDocPopup, setShowDocPopup] = useState(false);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setActiveTab('current');
      // Placeholder for actual recording functionality
      console.log('Recording started');
      
      // await audioRecorder.startRecording();
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false); // Reset state if recording fails
      alert('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      Keyboard.dismiss();
      // Placeholder for actual recording functionality
      console.log('Recording stopped');
      
      // const recordingResult = await audioRecorder.stopRecording();
      
      const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];

      const newConsultation: Consultation = {
        id: Date.now().toString(),
        patientName: patientName,
        date: new Date(),
        time: consultTime,
        note: currentNote,
        summary: randomSummary,
      };

      setConsultations([newConsultation, ...consultations]);
      setActiveTab('current');
      setCurrentNote('');
      setPatientName(generateRandomName());
      setConsultTime(generateRandomTime());
      
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(true); // Keep recording state if stop fails
      alert('Failed to stop recording. Please try again.');
    }
  };

  const renderConsultation = ({ item: consultation }: { item: Consultation }) => (
    <ScrollView style={consultationsStyles.currentConsultationItem}>
      <Text style={consultationsStyles.consultationHeader}>
        {consultation.patientName} - {consultation.date.toLocaleDateString()} - {consultation.time}
      </Text>
      
      <Text style={consultationsStyles.subHeader}>Summary</Text>
      <Text style={consultationsStyles.summary}>{consultation.summary.text}</Text>

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

      <Text style={consultationsStyles.subHeader}>Written Notes</Text>
      <Text style={consultationsStyles.summary}>{consultation.note ? consultation.note : 'No notes.'}{'\n\n\n\n\n\n\n'}</Text>
    </ScrollView>
  );

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
          <Text style={consultationsStyles.summary} numberOfLines={2}>{consultation.summary.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={generalStyles.container}>
      <StatusBar style="light" backgroundColor="#457CBF" />

      <View style={generalStyles.header}>
        <MaterialCommunityIcons name="bird" size={24} color="white" />
        <Text style={generalStyles.headerText}>Mockingbird</Text>
      </View>

      <View>
        <View style={[generalStyles.patientInfoSection, isRecording && {backgroundColor: COLORS.RECORDING_200}]}>
          <Text style={generalStyles.patientName}>{patientName}</Text>
          <Text style={generalStyles.consultDateTime}>
            {new Date().toLocaleDateString()} - {consultTime}
          </Text>
        </View>
      </View>

      <View style={generalStyles.mainContent}>
        <View style={notesStyles.notesSection}>
          <Text style={generalStyles.sectionTitle}>Notes</Text>
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
          <Text style={generalStyles.sectionTitle}>Consultation Summaries</Text>
          <View style={consultationsStyles.tabSelector}>
            <TouchableOpacity style={activeTab === 'current' ? consultationsStyles.tabButtonSelected : consultationsStyles.tabButton} onPress={() => setActiveTab('current')}>
              <Text style={[consultationsStyles.tabButtonText, {color: activeTab === 'current' ? 'white' : '#457CBF'}]}>Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={activeTab === 'history' ? consultationsStyles.tabButtonSelected : consultationsStyles.tabButton} onPress={() => setActiveTab('history')}>
              <Text style={[consultationsStyles.tabButtonText, {color: activeTab === 'history' ? 'white' : '#457CBF'}]}>History</Text>
            </TouchableOpacity>
          </View>
          {activeTab === 'current' ?
            <View style={{flex: 1}}>
              {consultations[0] && !isRecording && renderConsultation({ item: consultations[0] })}
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
        {isRecording ?
          <View style={commandTabStyles.tab}>
            <View style={commandTabStyles.recordButtonCont}>
              <View style={commandTabStyles.recordButton}>
                <View style={commandTabStyles.recordingIndicator} />
                <Text style={commandTabStyles.recordingIndicatorText}>Recording...</Text>
              </View>
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
                onPress={startRecording}
              >
                <Entypo name="mic" size={20} color={COLORS.PRIMARY} />
                <Text style={commandTabStyles.buttonText}>Start Recording</Text>
              </TouchableOpacity>
              <View style={commandTabStyles.divider}/>
              <TouchableOpacity
                style={commandTabStyles.recordButton}
                onPress={() => setShowDocPopup(!showDocPopup)}
              >
                <Entypo name="circle-with-plus" size={20} color={COLORS.GRAY_800} />
                <Text style={[commandTabStyles.buttonText, {color: COLORS.GRAY_800}]}>{showDocPopup ? 'Hide Popup' : 'Generate Doc'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    </View>
  );
}
