// import libraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Image, PermissionsAndroid, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../../../Components/Header/Header';
import { AppButton, AppTextInput, Icon, Picker, useTheme, Text } from 'react-native-basic-elements';
import { FONTS } from '../../../Constants/Fonts';
// import { moderateScale } from '../../../Constants/PixelRatio';
import StepIndicator from 'react-native-step-indicator';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import NavigationService from '../../../Services/Navigation';
import SinglePicker from '../../../ui/SinglePicker';
import Modal from 'react-native-modal';
import HttpClient from '../../../Utils/HttpClient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AuthService from '../../../Services/Auth';
import Toast from "react-native-simple-toast";
import SingleSelectPicker from '../../../ui/SingleSelectPicker';
import HomeService from '../../../Services/HomeServises';
import { useSelector } from 'react-redux';
import GenderPicker from '../../../ui/GenderPicker';
import CastPicker from '../../../ui/CastPicker';

// create a component
const EditPresonalInfo = ({ navigation }) => {
  const route = useRoute()
  const { userData } = useSelector(state => state.User)

  const colors = useTheme();
  const [DateData, setDateData] = useState('');
  const [getAge, setGetAge] = useState('');
  const [AgeData, setAgeData] = useState('');
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [ImageData, setImageData] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const orderStatusData = [
    { name: 'Personal Info' },
    { name: 'Professional Info' },
    { name: 'Other info' },
  ];
  const [position, setPosition] = useState(0);
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const DatehandleConfirm = (date) => {
    // console.log('date', moment(date).format('YYYY-MM-DD'));
    setGetAge(moment(date).format('YYYY-MM-DD'));
    setDob(moment(date).format('YYYY-MM-DD'))
    setDateData(date);
    hideDatePicker();
  };

  useEffect(() => {
    if (getAge) {
      const age = calculateAge(getAge);
      setAgeData(age);
    } else {
      console.warn('Birth date is not defined.');
    }
  }, [getAge]);

  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) {
      console.error('Invalid birth date:', birthDate);
      return NaN;
    }

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    const dayDifference = today.getDate() - birth.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }

  const openCamera = async (type, options) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "App Camera Permission",
            message: "App needs access to your camera",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Camera permission denied");
          return;
        }
      }
      onButtonPress(type, options);
    } catch (err) {
      console.warn(err);
    }
  };

  const onButtonPress = async (type, options) => {
    try {
      const result = type === 'capture'
        ? await launchCamera(options)
        : await launchImageLibrary({ ...options, selectionLimit: 0 });

      if (result?.assets) {
        console.log('Selected images:==============================', result.assets);

        const selectedAssets = result.assets.map(asset => ({
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type,
          uri: asset.uri,
        }));
        setSelectedDocuments(prev => [...prev, ...selectedAssets]);
        try {
          const response = await HttpClient.uploadFile('/upload-images', selectedAssets, {});
          setImageData(response?.data)
          setModalVisible(false);
        } catch (error) {
          console.error('Image Upload Error:========================', error);
          setModalVisible(false);
        }
      }
    } catch (error) {
      console.error('Error in onButtonPress:', error);
      setModalVisible(false);
    }
  };

  const [sectorData, setSectorData] = useState([])
  const [sectorId, setSectorId] = useState(null);
  const [sectorName, setSectorName] = useState(null);

  const handleSelectItem = (id) => {
    const selectedItem = sectorData.find(item => item.id === id);
    setSectorId(id);
    setSectorName(selectedItem?.name || null);
  };

  useEffect(() => {
    getSectData()
  }, [])

  const getSectData = () => {
    HomeService.getsectList()
      .then((res) => {
        // console.log('ressec>>>>>>>>>>>>>>>>>>>>>>>----sectot----------0000000000000000000000000000', res);

        if (res && res.status == true) {
          setSectorData(res.data)
        }

      })
      .catch((err) => {
        console.log('secterr', err);

      })
  }
  const [userProfileData, setUserProfileData] = useState([])
  useEffect(() => {
    geUserFullProfile()
  }, [])


  const geUserFullProfile = () => {
    setLoading(true);
    HomeService.getUserProfile()
      .then((res) => {
        // console.log('---------------------------fatchhhhhh--------000000000000000000000000000000------', JSON.stringify(res));
        if (res && res.status === true) {
          const data = res.data;
          setUserProfileData(data);
          setName(data.name || '');
          setImageData(data.profile_images || []);
          if (data.sect) setSectorData(prevData => prevData.some(item => item.id === data.sect.id) ? prevData : [...prevData, data.sect]);
          setSectorId(data.sect?.id);
          if (data.user_caste) setCastData(prevData => prevData.some(item => item.id === data.user_caste.id) ? prevData : [...prevData, data.user_caste]);
          setCastId(data.user_caste?.id);
          setDob(data.dob || '');
          setDateData(data.dob || '');
          setGenderId(data.gender || null);
          setAgeData(data.age || '');
          setHeight(data.height || '');
          setWeight(data.weight || '');
          if (data.maslak) setCastData(prevData => prevData.some(item => item.id === data.maslak.id) ? prevData : [...prevData, data.maslak]);
          setMaslakId(data.maslak?.id || null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log('errrr-------------======================---------', err);
        setLoading(false);
      })
  }

  useEffect(() => {
    getMaslakData(),
      getCastkData()
  }, [])

  const [maslakData, setMaslakData] = useState([])
  const [maslakId, setMaslakId] = useState(null);

  const getMaslakData = () => {
    HomeService.getMaslakList()
      .then((res) => {
        // console.log('ressectorrrrrrrrrrrrrr', res);
        if (res && res.status == true) {
          setMaslakData(res.data)
        }

      })
      .catch((err) => {
        console.log('secterr', err);

      })
  }
  const handleSelectMaslak = (item) => {
    setMaslakId(item);
  };


  const [castData, setCastData] = useState([])
  const [castId, setCastId] = useState(null);
  const handleSelectCast = (item) => {
    setCastId(item);
  };
  const getCastkData = () => {
    AuthService.getCastkList()
      .then((res) => {
        // console.log('ressectorrrrrrrrrrrrrr', res);
        if (res && res.status == true) {
          setCastData(res.data)
        }

      })
      .catch((err) => {
        console.log('secterr', err);

      })
  }



  const [genderId, setGenderId] = useState(null);
  const [genderName, setGenderName] = useState(null);

  const handleSelectGender = (selectedItem) => {
    if (!selectedItem) return;
    setGenderId(selectedItem.id);
    setGenderName(selectedItem.name)
  };



  const getPersonalInfo = () => {

    const transformedImages = Object.values(ImageData || {}).map(image => ({
      fileName: image.fileName,
      url: image.url
    }));

    let data = {
      "name": name,
      "sector": sectorId,
      "sectorName": sectorName,
      "cast": castId,
      "dob": dob,
      "gender": genderName,
      "age": AgeData,
      "height": height,
      "weight": weight,
      "maslakId": maslakId,
      "images": transformedImages,
    }

    // console.log('gggggggggggggggggggggggggggggggggggggggggg',data);

    NavigationService.navigate('EditProfessionalInfo', { personalData: data })
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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : (
        <>

          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

            <View style={{ marginHorizontal: (15), marginTop: (15) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={toggleModal}>
                  <View style={styles.img_circle}>
                    <Image
                      source={ImageData.length > 0 ? { uri: ImageData[0]?.url } :
                        require('../../../assets/images/user.png')}
                      style={styles.user_img} />
                  </View>
                  <Image source={require('../../../assets/images/edit.png')} style={styles.edit_img} />
                </TouchableOpacity>
                <Text style={{ ...styles.user_name, color: colors.secondaryFontColor }}>{userProfileData?.name}</Text>
              </View>

              <View style={styles.inputbox_view}>
                <View>
                  <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Name</Text>
                  <AppTextInput
                    inputContainerStyle={{ ...styles.inputcontainer_sty }}
                    inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                    value={name}
                    onChangeText={(val) => setName(val)}
                  />
                </View>
                <View>
                  <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Select Sector</Text>


                  <SinglePicker
                    labelKey="name"
                    valueKey="id"
                    placeholder="Select State"
                    options={sectorData}
                    selectedValue={sectorId}
                    onValueChange={handleSelectItem}
                  />
                </View>
              </View>

              <View style={styles.inputbox_view}>
                <View>
                  <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Cast</Text>
                  <CastPicker
                    labelKey="name"
                    valueKey="id"
                    placeholder="Select Cast"
                    options={castData}
                    selectedValue={castId}
                    onValueChange={handleSelectCast} />


                </View>

                <View>
                  <Text style={{ ...styles.input_title, marginBottom: 5, color: colors.secondaryFontColor }}>Date of Birth</Text>
                  <Pressable
                    onPress={showDatePicker}
                    style={{ ...styles.phoneinput_view, height: 42, borderColor: colors.borderColor }}>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={val => {
                        DatehandleConfirm(val);
                        setDateData(val);
                      }}
                      onCancel={hideDatePicker}
                    />
                    <Text style={{ ...styles.data_txt, color: colors.secondaryFontColor }}>{DateData ? moment(DateData).format('L') : 'YYYY/MM/DD'}</Text>
                    <Pressable onPress={showDatePicker}>
                      <Icon type='AntDesign' name='calendar' color={colors.dark_btn_color} />
                    </Pressable>
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputbox_view}>
                <View>
                  <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Gender</Text>
                  {/* <GenderPicker
                // label="Gender"
                labelKey="name"
                valueKey="id"
                placeholder="Select Gender"
                options={[
                  { id: 1, name: 'Male' },
                  { id: 2, name: 'Female' }
                ]}
                selectedValue={genderId} // This will now correctly update
                onValueChange={handleSelectGender} // Pass the full object
              /> */}

                  <AppTextInput
                    inputContainerStyle={{ ...styles.inputcontainer_sty }}
                    inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                    value={genderId}
                    // onChangeText={(val) => setHeight(val)}
                    editable={false}
                  />

                </View>
                <View>
                  <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Height (Cm)</Text>
                  <AppTextInput
                    inputContainerStyle={{ ...styles.inputcontainer_sty }}
                    inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                    value={height}
                    onChangeText={(val) => setHeight(val)}
                    keyboardType='number-pad'
                  />
                </View>

              </View>

              <View style={styles.inputbox_view}>
                <View>
                  <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Weight</Text>
                  <AppTextInput
                    inputContainerStyle={{ ...styles.inputcontainer_sty }}
                    inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                    value={weight}
                    onChangeText={(val) => setWeight(val)}
                    keyboardType='number-pad'
                  />
                </View>


                <View>
                  <Text style={{ ...styles.input_title, marginBottom: 5, color: colors.secondaryFontColor }}>Age</Text>
                  <View style={{ ...styles.inputcontainer_sty, alignItems: 'flex-start', justifyContent: 'center', borderColor: colors.borderColor }}>
                    <Text style={{ ...styles.data_txt, color: colors.secondaryFontColor }}>{AgeData}</Text>
                  </View>
                </View>
              </View>
              <Text style={{ ...styles.input_title, marginTop: (10), color: colors.secondaryFontColor }}>Maslak</Text>
              <SingleSelectPicker
                labelKey="name"
                valueKey="id"
                placeholder="Select Maslak"
                options={maslakData}
                selectedValue={maslakId}
                onValueChange={handleSelectMaslak} />
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
                  onPress={() => getPersonalInfo()}
                />

              </View>
            </View>

          </KeyboardAwareScrollView>

        </>
      )}

      <Modal isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Upload Photo!</Text>
          <TouchableOpacity
            style={styles.modalbutton}
            onPress={() => openCamera('capture', {
              saveToPhotos: true,
              mediaType: 'photo',
              includeBase64: false,
              maxWidth: 500,
              maxHeight: 500,
              quality: 0.5
            })}
          >
            <Text style={styles.modalbuttonText}>
              <Icon name="camera" size={18} type='Entypo' color={colors.second_txt} />
              {" "}Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalbutton}
            onPress={() => openCamera('library', {
              selectionLimit: 1,
              mediaType: 'photo',
              includeBase64: false,
              maxWidth: 500,
              maxHeight: 500,
              quality: 0.5
            })}
          >
            <Text style={styles.modalbuttonText}>
              <Icon name="image" size={18} type='Entypo' color={colors.second_txt} />
              {" "}Library
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
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
    marginLeft: 10,
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
  data_txt: {
    fontSize: 13,
    fontFamily: FONTS.Inter.medium,
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
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 15,
    fontSize: 18,
    color: '#000',
    fontFamily: 'sans-serif',
  },
  modalbutton: {
    marginBottom: 10,
  },
  modalbuttonText: {
    fontSize: 18,
    padding: 10,
    color: '#000',
    fontFamily: FONTS.Inter.medium,
  },
});

// make this component available to the app
export default EditPresonalInfo;
