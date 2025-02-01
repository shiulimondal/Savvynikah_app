// import libraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions, TouchableOpacity } from 'react-native';
import Header from '../../../Components/Header/Header';
import { AppButton, AppTextInput, Icon, Picker, useTheme, Text } from 'react-native-basic-elements';
import { FONTS } from '../../../Constants/Fonts';
import StepIndicator from 'react-native-step-indicator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MultiSelectPicker from '../../../ui/MultiSelectPicker';
import SingleSelectPicker from '../../../ui/SingleSelectPicker';
import NavigationService from '../../../Services/Navigation';
import { useRoute } from '@react-navigation/native';
import AuthService from '../../../Services/Auth';
import SinglePicker from '../../../ui/SinglePicker';
import Toast from "react-native-simple-toast";
import { useSelector } from 'react-redux';
import HomeService from '../../../Services/HomeServises';
import EducationPicker from '../../../ui/EducationPicker';
import OcupationPicker from '../../../ui/OcupationPicker';
import StatusPicker from '../../../ui/StatusPicker';

const { height, width } = Dimensions.get('screen')
// create a component
const EditProfessionalInfo = ({ navigation }) => {
  const { userData } = useSelector(state => state.User)
  const colors = useTheme();
  const route = useRoute()
  const getPersonalData = route.params.personalData

  console.log('getPersonalDatagetPersonalDatagetPersonalData=====================', getPersonalData);


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

  useEffect(() => {
    getEducationData()
  }, [])

  useEffect(() => {
    getLanguageData(),
      getOcupationData()
  }, [])

  useEffect(() => {
    getOcupationData()
  }, [])

  useEffect(() => {
    getStatusData()
  }, [])

  const [userProfileData, setUserProfileData] = useState([])
  useEffect(() => {
    geUserFullProfile()
  }, [])

  const geUserFullProfile = () => {
    HomeService.getUserProfile()
      .then((res) => {
        console.log('langgggggggggggggggggggggggggg---------------------------------------ggggggggg', JSON.stringify(res));
        if (res && res.status === true) {

          const data = res.data;
          console.log('langgggggggggggggggggggggggggggggggggggggg', data.languages);

          setUserProfileData(data);
          if (data?.education) setEducationData(prevData => prevData.some(item => item.id === data?.education?.id) ? prevData : [...prevData, data.education]);
          setEducatonId(data?.education?.id)

          if (data?.occupation) setOcupationData(prevData => prevData.some(item => item.id === data?.occupation?.id) ? prevData : [...prevData, data.occupation]);

          setOcupationId(data?.occupation?.id)

          if (data?.languages) {
            setLanguageData(prevData => {
              const newLanguages = data?.languages?.filter(lang => !prevData.some(item => item.id === lang.id));
              return [...prevData, ...newLanguages];
            });
          }

          // if (data?.languages) setLanguageData(prevData => prevData.some(item => item.id === data?.languages?.id) ? prevData : [...prevData, data.languages]);
          // setLanguageId(data?.languages ? data.languages.map(lang => lang.id) : []);
          setLanguageId(data?.languages?.map(langId => langId.id))
          setLiveIn(data?.lives_in)
          if (data?.user_marital_status) setStatusData(prevData => prevData.some(item => item.id === data?.user_marital_status?.id) ? prevData : [...prevData, data.user_marital_status]);
          setStatusId(data?.user_marital_status?.id)
        }
      })
      .catch((err) => {
        console.log('errrr', err);

      })
  }

  const [Languagedata, setLanguageData] = useState([])
  const [LanguageId, setLanguageId] = useState([]);

  const getLanguageData = () => {
    AuthService.getLanguagesList()
      .then((res) => {
        // console.log('ressectorrrrrrrrrrrrrr====================', res);
        if (res && res.status == true) {
          const formattedLanguages = res.data.map(lang => ({
            value: lang.id,
            label: lang.name,
          }));

          setLanguageData(formattedLanguages);
        }
      })
      .catch((err) => {
        console.log('secterr', err);

      })
  }

  const handleSelectLanguages = (selectedLanguages) => {
    setLanguageId(selectedLanguages.map(lang => lang.value));
  };

  const [Educationdata, setEducationData] = useState([])
  const [educationId, setEducatonId] = useState(null);

  const getEducationData = () => {
    AuthService.getEducationList()
      .then((res) => {
        // console.log('ressectorrrrrrrrrrrrrr====================', res);
        if (res && res.status == true) {
          setEducationData(res.data)
        }
      })
      .catch((err) => {
        console.log('secterr', err);

      })
  }

  const handleSelectEducation = (item) => {
    setEducatonId(item);
  };




  const [Ocupationdata, setOcupationData] = useState([])
  const [OcupationId, setOcupationId] = useState(null);

  const getOcupationData = () => {
    AuthService.getOccupationList()
      .then((res) => {
        // console.log('ressectorrrrrrrrrrrrrr====================', res);
        if (res && res.status == true) {
          setOcupationData(res.data)
        }
      })
      .catch((err) => {
        console.log('secterr', err);

      })
  }

  const handleSelectOcupation = (item) => {
    setOcupationId(item);
  };

  const [StatusData, setStatusData] = useState([])
  const [StatusId, setStatusId] = useState(null);
  const getStatusData = () => {
    AuthService.getStatusList()
      .then((res) => {
        // console.log('ressectorrrrrrrrrrrrrr====================', res);
        if (res && res.status == true) {
          setStatusData(res.data)
        }
      })
      .catch((err) => {
        console.log('secterr', err);

      })
  }

  const handleSelectStatus = (item) => {
    setStatusId(item);
  };

  console.log('secterr------------------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', StatusId);


  const getProfesoanlInfo = () => {

    let data = {
      "Education": educationId,
      "languages": LanguageId,
      "ocupation": OcupationId,
      "liveIn": liveIn,
      "Status": StatusId,
    }
    const newData = { ...getPersonalData, ...data }
    NavigationService.navigate('EditOtherInfo', { OtherInfoData: newData })
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

            <TouchableOpacity >
              <View style={styles.img_circle}>
                <Image
                  source={getPersonalData?.images?.length > 0 ? { uri: getPersonalData?.images[0]?.url } :
                    require('../../../assets/images/user.png')}
                  style={styles.user_img} />
              </View>
            </TouchableOpacity>


            <View style={{ marginLeft: (10) }}>
              <Text style={{ ...styles.user_name, color: colors.secondaryFontColor }}>{getPersonalData?.name}</Text>
              <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>{getPersonalData?.sectorName}</Text>
            </View>

          </View>


          <Text style={{ ...styles.input_title, marginTop: 10, color: colors.secondaryFontColor }}>Education</Text>
          {/* <EducationPicker
            data={Educationdata}
            placeholder="Choose Education"
            onSelectItem={handleSelectEducation}
          /> */}

          <EducationPicker
            labelKey="name"
            valueKey="id"
            placeholder="Choose Education"
            options={Educationdata}
            selectedValue={educationId}
            onValueChange={handleSelectEducation}
          />

          <Text style={{ ...styles.input_title, marginTop: 10, color: colors.secondaryFontColor }}>Language</Text>
          <MultiSelectPicker
            data={Languagedata}
            placeholder="Choose Languages"
            onSelectItem={handleSelectLanguages}
          />

          <Text style={{ ...styles.input_title, marginTop: 10, color: colors.secondaryFontColor }}>Ocupation</Text>

          {/* <OcupationPicker
            data={Ocupationdata}
            placeholder="Choose Occupation"
            onSelectItem={handleSelectOcupation}
          /> */}

          <OcupationPicker
            labelKey="name"
            valueKey="id"
            placeholder="Choose Occupation"
            options={Ocupationdata}
            selectedValue={OcupationId}
            onValueChange={handleSelectOcupation}
          />


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

              <StatusPicker
                labelKey="name"
                valueKey="id"
                placeholder="Select State"
                options={StatusData}
                selectedValue={StatusId}
                onValueChange={handleSelectStatus}
              />

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
export default EditProfessionalInfo;
