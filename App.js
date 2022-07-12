/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  NativeModules,
  PermissionsAndroid,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const checkPermissions = async () => {
  console.log('checking SMS permissions');
  let hasPermissions = false;
  try {
    hasPermissions = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    );
    if (!hasPermissions) return false;
    // hasPermissions = await PermissionsAndroid.check(
    //   PermissionsAndroid.PERMISSIONS.SEND_SMS
    // );
    // if (!hasPermissions) return false;
  } catch (e) {
    console.error(e);
  }
  return hasPermissions;
};

const requestPermissions = async () => {
  let granted = {};
  try {
    console.log('requesting SMS permissions');
    granted = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        // PermissionsAndroid.PERMISSIONS.SEND_SMS
      ],
      {
        title: 'Example App SMS Features',
        message: 'Example SMS App needs access to demonstrate SMS features',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log(granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use SMS features');
    } else {
      console.log('SMS permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const ListSMS = () => {
  const [smslist, setSmslist] = useState([]);
  let hasPermissions = false;
  const {SMSModule} = NativeModules;

  const onPressLearnMore = () => {
    if (!SMSModule) {
      setSmslist([]);
      return;
    }

    SMSModule.readSMS(
      data => {
        console.log('DATA FROM MODULE :: ', data);
        setSmslist(JSON.parse(data));
      },
      error => {
        setSmslist([]);
      },
    );
  };

  useEffect(async () => {
    if (Platform.OS === 'android') {
      try {
        if (!(await this.checkPermissions())) {
          await this.requestPermissions();
        }

        if (await this.checkPermissions()) {
          hasPermissions = true;
        }
      } catch (e) {
        console.error(e);
      }
    }
  });

  if (!SMSModule) return <Text>Module could not be loaded...</Text>;

  if (smslist.length == 0)
    return (
      <Section title="List SMS">
        <Text> There are no SMSs ..</Text>
        <Button
          onPress={onPressLearnMore}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </Section>
    );

  return (
    <Section title="List SMS">
      <Button
        onPress={onPressLearnMore}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      {smslist.map(data => {
        return <Text>{data.body}</Text>;
      })}
    </Section>
  );
};

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <ListSMS />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
