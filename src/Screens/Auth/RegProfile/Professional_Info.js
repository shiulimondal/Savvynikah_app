// import libraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import Header from '../../../Components/Header/Header';
import { AppButton, AppTextInput, Icon, Picker, useTheme, Text } from 'react-native-basic-elements';
import { FONTS } from '../../../Constants/Fonts';
import StepIndicator from 'react-native-step-indicator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigationService from '../../../Services/Navigation';
import { useRoute } from '@react-navigation/native';
import AuthService from '../../../Services/Auth';
import Toast from "react-native-simple-toast";
import RNPickerSelect from 'react-native-picker-select';
import { MultiSelect } from 'react-native-element-dropdown';

const { height, width } = Dimensions.get('screen')
// create a component
const Professional_Info = ({ navigation }) => {
  const colors = useTheme();
  const route = useRoute()
  const getPersonalData = route.params.personalData
  // console.log('getdatddddddddddddddddddddddddddddddd8888888884111111111+++++++++++++++', getPersonalData);
  const [liveIn, setLiveIn] = useState('');

  const orderStatusData = [
    { name: 'Personal Info' },
    { name: 'Professional Info' },
    { name: 'Other info' },
  ];
  const [position, setPosition] = useState(1);
  const stepIndicatorStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: '#1f421d',
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: '#1f421d',
    stepStrokeUnFinishedColor: '#028e00',
    separatorFinishedColor: '#1f421d',
    separatorUnFinishedColor: '#028e00',
    stepIndicatorFinishedColor: '#1f421d',
    stepIndicatorUnFinishedColor: '#028e00',
    stepIndicatorCurrentColor: '#1f421d',
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
    stepIndicatorLabelCurrentColor: '#FFFFFF',
    stepIndicatorLabelFinishedColor: '#FFFFFF',
    stepIndicatorLabelUnFinishedColor: '#FFFFFF',
    labelColor: '#FFFFFF',
    labelSize: 9,
    currentStepLabelColor: '#1f421d',
    labelAlign: 'center',
    labelFontFamily: FONTS.Inter.medium,
  };
  const [currentPage, setCurrentPage] = useState(0);
  const onStepPress = (position) => {
    setCurrentPage(position);
  };

  const [educationData, setEducationData] = useState([]);
  const [educationId, setEducationId] = useState(null);

  useEffect(() => {
    getEducationData();
  }, []);

  const getEducationData = () => {
    AuthService.getEducationList()
      .then((res) => {
        if (res && res.status === true) {
          setEducationData(res.data);
        }
      })
      .catch((err) => {
        console.log('Error fetching education data:', err);
      });
  };

  const handleSelectEducation = (id) => {
    setEducationId(id);
  };

  const pickerEducationItems = educationData.map((item) => ({
    label: item.name,
    value: item.id,
  }));





  const [languageData, setLanguageData] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  useEffect(() => {
    getLanguageData();
  }, []);

  const getLanguageData = () => {
    AuthService.getLanguagesList()
      .then((res) => {
        if (res && res.status === true) {
          const formattedData = res.data.map(item => ({
            label: item.name, // Display Name
            value: item.id    // Unique ID
          }));
          setLanguageData(formattedData);
        }
      })
      .catch((err) => console.log('Error fetching languages:', err));
  };

  const handleSelectLanguages = (selectedItems) => {
    setSelectedLanguages(selectedItems);
  };

  const [occupationData, setOccupationData] = useState([]);
  const [occupationId, setOccupationId] = useState(null);

  // State for Status
  const [statusData, setStatusData] = useState([]);
  const [statusId, setStatusId] = useState(null);

  // Fetch Occupation Data
  useEffect(() => {
    getOccupationData();
    getStatusData();
  }, []);

  const getOccupationData = () => {
    AuthService.getOccupationList()
      .then((res) => {
        if (res && res.status === true) {
          setOccupationData(res.data);
        }
      })
      .catch((err) => {
        console.log('Error fetching occupation data:', err);
      });
  };

  const handleSelectOccupation = (id) => {
    setOccupationId(id);
  };

  const occupationItems = occupationData.map((item) => ({
    label: item.name, // Occupation Name
    value: item.id,   // Occupation ID
  }));

  // Fetch Status Data
  const getStatusData = () => {
    AuthService.getStatusList()
      .then((res) => {
        if (res && res.status === true) {
          setStatusData(res.data);
        }
      })
      .catch((err) => {
        console.log('Error fetching status data:', err);
      });
  };

  const handleSelectStatus = (id) => {
    setStatusId(id);
  };

  const statusItems = statusData.map((item) => ({
    label: item.name, // Status Name
    value: item.id,   // Status ID
  }));


  const getProfesoanlInfo = () => {
    let hasError = false;
    if (educationId === '') {
      Toast.show('Please Select Education');
      hasError = true;
      return false;
    }
    if (selectedLanguages === '') {
      Toast.show("Please Select Language's");
      hasError = true;
      return false;
    }
    if (occupationId === '') {
      Toast.show("Please Select Ocupation");
      hasError = true;
      return false;
    }
    if (liveIn === '') {
      Toast.show("Please Select Lives In Place");
      hasError = true;
      return false;
    }
    if (statusId === '') {
      Toast.show("Please Select Meritial Status");
      hasError = true;
      return false;
    }

    if (hasError) return;
    let data = {
      "Education": educationId,
      "languages": selectedLanguages,
      "ocupation": occupationId,
      "liveIn": liveIn,
      "Status": statusId,

    }
    const newData = { ...getPersonalData, ...data }
    NavigationService.navigate('Other_Info', { OtherInfoData: newData })
  }


  return (
    <View style={styles.container}>
      <Header title='Profile' />
      <View style={{ marginTop: (15) }}>
        <StepIndicator
          stepCount={3}
          customStyles={stepIndicatorStyles}
          onPress={onStepPress}
          renderLabel={({ label, currentPosition }) => (
            <View style={styles.labelContainer}>
              <Text style={[styles.labeltxt, { color: colors.secondaryFontColor }]}>
                {orderStatusData[Number(label)].name}
              </Text>
            </View>
          )}
          currentPosition={position}
          labels={orderStatusData.map((item, ind) => ind.toString())}
        />
      </View>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

        <View style={{ marginHorizontal: (15), marginTop: (15) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <View style={styles.img_circle}>
              <Image
                source={getPersonalData?.images?.length > 0 ? { uri: getPersonalData?.images[0]?.url } :
                  require('../../../assets/images/user.png')}
                style={styles.user_img} />
            </View>

            <View style={{ marginLeft: (10) }}>
              <Text style={{ ...styles.user_name, color: colors.secondaryFontColor }}>{getPersonalData?.name}</Text>
              <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>{getPersonalData?.sectorName}</Text>
            </View>

          </View>


          <Text style={{ ...styles.input_title, marginTop: 10, color: colors.secondaryFontColor }}>Education</Text>
          {/* <SingleSelectPicker
            data={Educationdata}
            placeholder="Choose Education"
            onSelectItem={handleSelectEducation}
          /> */}

          <View
            style={{
              backgroundColor: '#F6F5F5',
              height: 45,
              borderRadius: 7,
              width: 330,
              borderColor: '#ccc',
              borderWidth: 1,
              justifyContent: 'center',
              paddingLeft: 10,
              marginTop: 7,
            }}
          >
            <RNPickerSelect
              onValueChange={(value) => handleSelectEducation(value)}
              items={pickerEducationItems}
              value={educationId}
              placeholder={{
                label: 'Select Education...',
                value: null,
              }}
              style={{
                inputIOS: {
                  color: 'black',
                },
                inputAndroid: {
                  color: 'black',
                },
              }}
            />
          </View>


          <Text style={{ ...styles.input_title, marginTop: 10, color: colors.secondaryFontColor }}>Language</Text>
          <View
            style={{
              backgroundColor: '#F6F5F5',
              borderRadius: 7,
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 10,
              marginTop: 7,
              width: 330,
            }}
          >
            <MultiSelect
              data={languageData}
              labelField="label"
              valueField="value"
              placeholder={
                selectedLanguages.length > 0
                  ? selectedLanguages.map((id) => {
                    const selectedItem = languageData.find((item) => item.value === id);
                    return selectedItem ? selectedItem.label : null;
                  }).join(', ')
                  : 'Select Languages...'
              }
              value={selectedLanguages}
              onChange={handleSelectLanguages}
            />

          </View>





          <Text style={{ ...styles.input_title, marginTop: 10, color: colors.secondaryFontColor }}>Occupation</Text>
          <View
            style={{
              backgroundColor: '#F6F5F5',
              height: 45,
              borderRadius: 7,
              width: 330,
              borderColor: '#ccc',
              borderWidth: 1,
              justifyContent: 'center',
              paddingLeft: 10,
              marginTop: 7,
            }}
          >
            <RNPickerSelect
              onValueChange={(value) => handleSelectOccupation(value)}
              items={occupationItems}
              value={occupationId}
              placeholder={{
                label: 'Select Occupation...',
                value: null,
              }}
              style={{
                inputIOS: { color: 'black' },
                inputAndroid: { color: 'black' },
              }}
            />
          </View>


          <View style={styles.inputbox_view}>
            <View>
              <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Lives In</Text>
              <AppTextInput
                inputContainerStyle={{ ...styles.inputcontainer_sty }}
                inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                value={liveIn}
                onChangeText={(val) => setLiveIn(val)}
              />
            </View>
            <View>
              <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Status</Text>
              {/* <SinglePicker data={StatusData}
                placeholder="Select Status"
                onSelectItem={handleSelectStatus}
              /> */}


              <View
                style={{
                  backgroundColor: '#F6F5F5',
                  height: 45,
                  borderRadius: 7,
                  width: 160,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  justifyContent: 'center',
                  paddingLeft: 10,
                  marginTop: 7,
                }}
              >
                <RNPickerSelect
                  onValueChange={(value) => handleSelectStatus(value)}
                  items={statusItems}
                  value={statusId}
                  placeholder={{
                    label: 'Select Status...',
                    value: null,
                  }}
                  style={{
                    inputIOS: { color: 'black' },
                    inputAndroid: { color: 'black' },
                  }}
                />
              </View>

            </View>

          </View>


          <View style={{ ...styles.inputbox_view, marginBottom: (30), marginTop: (30) }}>

            <Pressable
              onPress={() => NavigationService.goBack()}
              style={{ ...styles.Previousbutton_sty, borderColor: colors.buttonColor }}>
              <Text style={{ ...styles.buttn_txt, color: colors.buttonColor }}>Previous</Text>
            </Pressable>
            <AppButton
              textStyle={styles.buttn_txt}
              style={styles.button_sty}
              title="Next"
              gradientStart={{ x: 0.3, y: 1 }}
              gradientEnd={{ x: 1, y: 1 }}
              gradient={true}
              gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
              onPress={() => getProfesoanlInfo()}
            />

          </View>
        </View>

      </KeyboardAwareScrollView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelContainer: {
    alignItems: 'center',
  },
  labeltxt: {
    fontFamily: FONTS.Inter.semibold,
    fontSize: 11,
    marginTop: 7
  },
  user_name: {
    fontFamily: FONTS.Inter.bold,
    fontSize: 14,
  },
  inputbox_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,

  },
  input_title: {
    fontSize: 12,
    fontFamily: FONTS.Inter.semibold,
  },
  inputcontainer_sty: {
    alignSelf: 'center',
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 7,
    width: 150,
  },
  img_circle: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  user_img: {
    height: 74,
    width: 74,
    resizeMode: 'cover',
    borderRadius: 35
  },
  edit_img: {
    height: 30,
    width: 30,
    tintColor: 'rgba(30,68,28,255)',
    position: 'absolute',
    bottom: 0,
    left: 50,
  },
  picker_sty: {
    height: 45,
    width: 150,
    borderRadius: 5,
  },
  phoneinput_view: {
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
    justifyContent: 'space-between',
    paddingHorizontal: 7
  },
  buttn_txt: {
    fontFamily: FONTS.Inter.medium,
    fontSize: 13
  },
  button_sty: {
    height: 40,
    width: 150,
    borderRadius: 7,
    marginHorizontal: 0
  },
  Previousbutton_sty: {
    height: 40,
    width: 150,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

});

// make this component available to the app
export default Professional_Info;
