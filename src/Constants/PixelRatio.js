import { Dimensions } from 'react-native';
import { scale as rnScale, verticalScale as rnVerticalScale, moderateScale as rnModerateScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('screen');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 1) => size + (scale(size) - size) * factor;

const scaleFromRN = rnScale;
const verticalScaleFromRN = rnVerticalScale;
const moderateScaleFromRN = (size, factor = 1) => rnModerateScale(size, factor);

export { scale, verticalScale, moderateScale, scaleFromRN, verticalScaleFromRN, moderateScaleFromRN };
