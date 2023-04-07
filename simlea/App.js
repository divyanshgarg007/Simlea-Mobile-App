/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import RootNavigator from './src/navigation';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import * as connection from './src/database/DBConnection';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://85732fc878db45d6b2e82e6eaa1d4b4e@o4503925686992896.ingest.sentry.io/4504843711873024',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

const App = props => {
  // if (!__DEV__) {
  //   console = {};
  //   console.log = () => { };
  //   console.error = () => { };
  // }
  // Set up a callback to fire when AppState changes (when the app goes to/from the background)
  useEffect(function () {
    async function fetchData() {
      // You can await here
      const db = await connection.getDatabase();
    }
    fetchData();
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
};

export default Sentry.wrap(App);
//export default App;
