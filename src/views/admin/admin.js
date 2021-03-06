import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { HisJsonForm, HisSociSetupSchema,HisSociSetupUiSchema, UserButton,createAssessments,createEvents, updateDataStore,getMappings,getDataStoreValue,sendMessage } from 'components';
import uuid from 'uuid/v4';
import { UrlContext } from '../../App';
import { generateUid } from 'd2/uid';
import moment from 'moment';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));
let adminData = [];
const getSubmittedData =(dataSaved)=>{
  
  adminData = dataSaved;
  return adminData;
}

let allAssessments = [];


const currentEvents = {
  program:'EQnIPsQzZ8R',
  programStage:'hKuDUonVytS',
  orgUnit:'wMpIrpoib8b',
  status: 'ACTIVE',
  eventDate: moment().format('YYYY-MM-DD'),
  completedDate: moment().format('YYYY-MM-DD'),
}


let initialAssessments = { 
  tracking:{},
  background:{}
};

const HisAdmin = (props) => {
  const urlContextValue = useContext(UrlContext);
  const d2 = urlContextValue.d2;
  const api = d2.Api.getApi();

  const classes = useStyles();

  const schema = HisSociSetupSchema;
  const uiSchema = HisSociSetupUiSchema;
  const defaultData = { 
    id: uuid(),
    date:moment().format("YYYY-MM-DD"),
    status:"NOT_STARTED", 
    respondentType:"Consensus",
    coverage:[{ id: uuid() }],
    respondents:[{ id: uuid() }] 
  };

  const addId=(data)=>{
    if(!isEmpty(data)){
      data.map((d)=>{
        const respondents = d.respondents;
        if(!isEmpty(respondents)){
          respondents.map((respondent)=>{
            respondent.id=has(respondent,'id')?respondent.id:uuid();
            respondent.event = generateUid();
            return respondent;
          });
          
          d.respondents = respondents;
        }
        return d;
      });
    }
    return data;
  }

  const save = async(event) => {
    let  tableData = [ adminData.data];
    tableData[0].respondentType = 'Consensus';
    tableData = addId(tableData);

    initialAssessments.tracking.userid = d2.currentUser.id;
    initialAssessments.tracking.username = d2.currentUser.username;
    //initialAssessments.tracking.email = d2.currentUser.email?d2.currentUser.email:"";
    initialAssessments.tracking.status = tableData[0].status;
    initialAssessments.tracking.respondentType = tableData[0].respondentType;    
    initialAssessments.tracking.period = tableData[0].period;
    initialAssessments.tracking.location = tableData[0].location;
    initialAssessments.tracking.date = tableData[0].date;
    initialAssessments.tracking.id = defaultData.id;
    initialAssessments.background.event = generateUid();
    initialAssessments.background.reference = defaultData.id;
    initialAssessments.background.stakeholders = tableData[0].respondents;
    initialAssessments.background.coverage = tableData[0].coverage;
    initialAssessments.background.hisType = tableData[0].hisType;
    initialAssessments.background.purpose = tableData[0].purpose;
    initialAssessments.background.mainChallenge = tableData[0].mainChallenge;
    tableData[0].event = initialAssessments.background.event;
    /**
     * Get mappings from the datastore mapping namespace
     */
    const mappings = await getDataStoreValue(d2,'his_soci_tool','mappings');
    /**
     * Create assessments from consensus assessment
     */

    allAssessments = createAssessments(initialAssessments);
    /**
     * Save to setup datastore key
     * 
     */
    updateDataStore(d2,'his_soci_tool','setup',tableData,'setup','id');

    /**
    Creating Data Api
    **/
    
    const dhis2SingleEvents = createEvents(allAssessments,currentEvents);

    /*
    Post data to DHIS2
    */

    
    const mappedEvents =getMappings(mappings,dhis2SingleEvents);
    updateDataStore(d2,'his_soci_tool','assessments',allAssessments,'assessments','tracking.id');
    const messages = sendMessage(tableData[0],['EMAIL'],{id:d2.currentUser.id},d2.system.systemInfo.contextPath,d2.currentUser);
    api.post('events?strategy=CREATE_AND_UPDATE',mappedEvents);
    api.post("messages",messages.programMessages);
    api.post("messageConversations",messages.conversations);
  }

  return (
    <div className={classes.root}>
      {
        <div className={classes.content}>
          <HisJsonForm title={ 'Create HIS SOCI Assessment' } data={ defaultData } schema={ schema } uiSchema= { uiSchema } getSubmittedData={ getSubmittedData }/>
        </div>
      }
      <UserButton color="primary" variant="contained" value="Submit" getFormData={ (ev)=>save(ev) }/>
    </div>
  );
};

export default HisAdmin;
