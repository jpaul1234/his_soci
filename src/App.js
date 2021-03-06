import React from 'react';
import { HashRouter as Router} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';

validate.validators = {
  ...validate.validators,
  ...validators
};

export const UrlContext = React.createContext({
  d2: null,
  apiEngineUrl:null,
  dhis2Url: null,
  isAdmin: false,
  isAssessmentAdmin: false,
});

const App = ( props ) => {
  let urls = {
    d2: props.d2,
    apiEngineUrl: props.apiEngineUrl,
    dhis2Url:props.baseUrl,
    isAdmin: props.isAdmin,
    isAssessmentAdmin: props.isAssessmentAdmin,
  };
  return (
    <ThemeProvider theme={theme}>
      <UrlContext.Provider value={ urls }>
        <Router>
          <Routes {...props } />
        </Router>
      </UrlContext.Provider>
    </ThemeProvider>
  );
}
export default App;
