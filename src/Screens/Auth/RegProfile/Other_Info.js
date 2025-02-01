// import libraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import Header from '../../../Components/Header/Header';
import { AppButton, AppTextInput, Icon, Picker, useTheme, Text } from 'react-native-basic-elements';
import { FONTS } from '../../../Constants/Fonts';
// import {  } from '../../../Constants/PixelRatio';
import StepIndicator from 'react-native-step-indicator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigationService from '../../../Services/Navigation';
import { useRoute } from '@react-navigation/native';
import SinglePicker from '../../../ui/SinglePicker';
import Toast from "react-native-simple-toast";
import { useDispatch } from 'react-redux';
import { setuser } from '../../../Redux/reducer/User';
import Modal from "react-native-modal";
import Congrats from '../../../Components/CongratsCard/Congrats';
import SingleSelectPicker from '../../../ui/SingleSelectPicker';
import AuthService from '../../../Services/Auth';
import RNPickerSelect from 'react-native-picker-select';

const { height, width } = Dimensions.get('screen')
// create a component
const Other_Info = ({ navigation }) => {
    const dispatch = useDispatch()
    const colors = useTheme();
    const route = useRoute()
    const getOtherInfo = route.params.OtherInfoData
    // console.log('getdatddddddddddddddddddddddddddddddd8888888884111111111+++++++++++++++++++++++++', getOtherInfo);
    const [address, setAddress] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [hobby, setHobby] = useState('');
    const [habbit, setHabbit] = useState('');
    const [about, setAbout] = useState('');
    const [btnLoader, setBtnLoader] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false)

    const orderStatusData = [
        { name: 'Personal Info' },
        { name: 'Professional Info' },
        { name: 'Other info' },
    ];
    const [position, setPosition] = useState(2);
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

    const [stateData, setStateData] = useState([]);
    const [stateId, setStateId] = useState(null);

    const [cityData, setCityData] = useState([]);
    const [cityId, setCityId] = useState(null);

    // Fetch States on Component Mount
    useEffect(() => {
        getStateData();
    }, []);

    const getStateData = () => {
        AuthService.getStateList()
            .then((res) => {
                if (res && res.status === true) {
                    setStateData(res.data);
                }
            })
            .catch((err) => {
                console.log('Error fetching state data:', err);
            });
    };

    const handleStateItem = (id) => {
        setStateId(id);
        setCityId(null); // Reset city when state changes
        getCityData(id);
    };

    const stateItems = stateData.map((item) => ({
        label: item.name, // State Name
        value: item.id,   // State ID
    }));

    const getCityData = (stateId) => {
        if (!stateId) return;

        let data = { state_id: stateId };
        AuthService.getCityList(data)
            .then((res) => {
                if (res && res.status === true) {
                    setCityData(res.data);
                }
            })
            .catch((err) => {
                console.log('Error fetching city data:', err);
            });
    };

    const handleCityItem = (id) => {
        setCityId(id);
    };

    const cityItems = cityData.map((item) => ({
        label: item.name, // City Name
        value: item.id,   // City ID
    }));



    const getUpdateProfile = (() => {
        let hasError = false;
        if (address === '') {
            Toast.show('Please Enter address');
            hasError = true;
            return false;
        }
        if (stateId === '') {
            Toast.show('Please Select State');
            hasError = true;
            return false;
        }
        if (cityId === '') {
            Toast.show('Please Select City');
            hasError = true;
            return false;
        }
        if (pinCode === '') {
            Toast.show('Please Enter Pin');
            hasError = true;
            return false;
        }
        if (hobby === '') {
            Toast.show('Please Enter Hobbies');
            hasError = true;
            return false;
        }
        if (habbit === '') {
            Toast.show('Please Enter Habbits');
            hasError = true;
            return false;
        }
        if (about === '') {
            Toast.show('Please Enter About Yourself');
            hasError = true;
            return false;
        }

        if (hasError) return;
        let data = {
            "name": getOtherInfo?.name,
            "dob": getOtherInfo?.dob,
            "state_id": stateId,
            "city_id": cityId,
            "education_id": getOtherInfo?.Education,
            "maslak_id": getOtherInfo?.maslakId,
            "sect_id": getOtherInfo?.sector,
            "marital_status_id": getOtherInfo?.Status,
            // "caste": getOtherInfo?.cast,
            "caste_id": getOtherInfo?.cast,
            "gender": getOtherInfo?.gender,
            "height": getOtherInfo?.height,
            "weight": getOtherInfo?.weight,
            "age": getOtherInfo?.age,
            "occupation_id": getOtherInfo?.ocupation,
            "address": address,
            "pin": pinCode,
            "lives_in": getOtherInfo?.liveIn,
            "habits": habbit,
            "language_ids": getOtherInfo?.languages,
            "description": about,
            "hobby": hobby,
            "marital_status": getOtherInfo?.Status,
            "images": getOtherInfo?.images
        }
        setBtnLoader(true)
        console.log('Signup data:==========00000000000000000000====', data);
        AuthService.getUpdateRegProfile(data)
            .then((res) => {
                console.log('Signup successful=======================', res);
                if (res && res.status == true) {
                    setModalVisible(true);
                    setTimeout(() => {
                        setModalVisible(false);
                        Toast.show(res.message)
                        AuthService.setAccount(res.data);
                        dispatch(setuser(res.data));
                    }, 3000);
                    setBtnLoader(false);
                } else {
                    setBtnLoader(false)
                    Toast.show(res.message)
                }
            })
            .catch((err) => {
                // console.log('finallllllllllllllllSignup error======', err);
                setBtnLoader(false)
            });
    });


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
                        <View>
                            <View style={styles.img_circle}>
                                <Image
                                    source={getOtherInfo?.images?.length > 0 ? { uri: getOtherInfo?.images[0]?.url } :
                                        require('../../../assets/images/user.png')}
                                    style={styles.user_img} />
                            </View>
                        </View>
                        <View style={{ marginLeft: (10) }}>
                            <Text style={{ ...styles.user_name, color: colors.secondaryFontColor }}>{getOtherInfo?.name}</Text>
                            <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>{getOtherInfo?.sectorName}</Text>
                        </View>
                    </View>

                    <View style={styles.inputbox_view}>
                        <View>
                            <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Address</Text>
                            <AppTextInput
                                inputContainerStyle={{ ...styles.aboutinputcontainer_sty, }}
                                inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                                value={address}
                                onChangeText={(val) => setAddress(val)}
                            />
                        </View>
                    </View>

                    <Text style={{ ...styles.input_title, marginTop: (10), color: colors.secondaryFontColor }}>Select State</Text>
                    {/* <SingleSelectPicker
                        data={stateData}
                        placeholder="Select State"
                        onSelectItem={handleStateItem}
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
                            onValueChange={(value) => handleStateItem(value)}
                            items={stateItems}
                            value={stateId}
                            placeholder={{
                                label: 'Select a State...',
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
                            <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>City</Text>
                            {/* <SinglePicker
                                data={cityData}
                                placeholder="Select City"
                                onSelectItem={handleCityItem}
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
                                    onValueChange={(value) => handleCityItem(value)}
                                    items={cityItems}
                                    value={cityId}
                                    placeholder={{
                                        label: stateId ? 'Select a City...' : 'Select a State first',
                                        value: null,
                                    }}
                                    disabled={!stateId} // Disable City dropdown if no State selected
                                    style={{
                                        inputIOS: { color: 'black' },
                                        inputAndroid: { color: 'black' },
                                    }}
                                />
                            </View>

                        </View>

                        <View>
                            <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Pin</Text>
                            <AppTextInput
                                inputContainerStyle={{ ...styles.inputcontainer_sty }}
                                inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                                value={pinCode}
                                onChangeText={(val) => setPinCode(val)}
                                keyboardType='phone-pad'
                                maxLength={6}
                            />
                        </View>
                    </View>

                    <View style={styles.inputbox_view}>
                        <View>
                            <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Hobby</Text>
                            <AppTextInput
                                inputContainerStyle={{ ...styles.aboutinputcontainer_sty, }}
                                inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                                value={hobby}
                                onChangeText={(val) => setHobby(val)}
                            />
                        </View>
                    </View>

                    <View style={styles.inputbox_view}>
                        <View>
                            <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Habits</Text>
                            <AppTextInput
                                inputContainerStyle={{ ...styles.aboutinputcontainer_sty, }}
                                inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                                value={habbit}
                                onChangeText={(val) => setHabbit(val)}
                            />
                        </View>
                    </View>

                    <View style={styles.inputbox_view}>
                        <View>
                            <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>About Myself</Text>
                            <AppTextInput
                                multiline={true}
                                numberOfLines={4}
                                inputContainerStyle={{ ...styles.aboutinputcontainer_sty, height: (90) }}
                                inputStyle={{ ...styles.text_input, color: colors.secondaryFontColor }}
                                value={about}
                                onChangeText={(val) => setAbout(val)}
                                placeholder='Wright something'
                                textAlign='center'
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
                            onPress={() => getUpdateProfile()}
                            loader={
                                btnLoader
                                    ? {
                                        position: "right",
                                        color: "#fff",
                                        size: "small",
                                    }
                                    : null
                            }
                            disabled={btnLoader}
                        />

                    </View>
                </View>

            </KeyboardAwareScrollView>

            <Modal
                isVisible={isModalVisible}
                // backdropOpacity={1}
                style={{
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={styles.modalView}>
                    <Congrats />
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
    aboutinputcontainer_sty: {
        width: width - 30,
        height: 42,
        borderRadius: 7
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
    modalView: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// make this component available to the app
export default Other_Info;

