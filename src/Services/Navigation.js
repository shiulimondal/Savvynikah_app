import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';

let navigatorRef;

function setTopLevelNavigator(ref) {
    navigatorRef = ref;
}

function navigate(routeName, params) {
    navigatorRef.dispatch(
        CommonActions.navigate({
            name: routeName,
            params: params,
        })
    );
}

function replace(routeName, params) {
    navigatorRef.dispatch(
        StackActions.replace(routeName, params)
    );
}

function openDrawer() {
    navigatorRef.dispatch(DrawerActions.openDrawer());
}

function closeDrawer() {
    navigatorRef.dispatch(DrawerActions.closeDrawer());
}

function goBack() {
    navigatorRef.dispatch(CommonActions.goBack());
}

const NavigationService = {
    setTopLevelNavigator,
    navigate,
    replace,
    openDrawer,
    closeDrawer,
    goBack,
    
};

export default NavigationService;
