@isTest
class SampleIntegrationImplTest {
  @isTest
  static void testConnectPartner() {
    SampleIntegrationImpl rc = new SampleIntegrationImpl();

    Test.setMock(HttpCalloutMock.class, new RestMock());
    Test.startTest();

    service_cloud_voice.ConnectPartnerResponse response = rc.connect(
      new service_cloud_voice.ContactCenterInfo('', '', '', '', '', '')
    );

    Test.StopTest();
  }

  private class RestMock implements HttpCalloutMock {
    public HTTPResponse respond(HTTPRequest req) {
      String fullJson = '{"InstanceSummaryList": [ { "Arn": "string","CreatedTime":1000022,"Id": "string","IdentityManagementType": "string","InboundCallsEnabled": true,"InstanceAlias": "string","InstanceStatus": "string","OutboundCallsEnabled": true,"ServiceRole": "string"}],"NextToken": "string"}';
      HTTPResponse res = new HTTPResponse();
      res.setHeader('Content-Type', 'text/json');
      res.setBody(fullJson);
      res.setStatusCode(200);
      res.setStatus('OK');
      return res;
    }
  }

  @isTest
  static void testAddUsersToContactCenter() {
    service_cloud_voice.UserInfo userInfo = new service_cloud_voice.UserInfo(
      'id',
      'firstName',
      'lastName',
      'userName'
    );
    List<service_cloud_voice.UserInfo> users = new List<service_cloud_voice.UserInfo>();
    users.add(userInfo);
    service_cloud_voice.UserSyncingRequest request = new service_cloud_voice.UserSyncingRequest(
      'contactCenterId',
      'namedCredentials',
      users
    );
    SampleIntegrationImpl rc = new SampleIntegrationImpl();
    rc.addUsersToContactCenter(request);
  }

  @isTest
  static void testRemoveUsersFromContactCenter() {
    service_cloud_voice.UserInfo userInfo = new service_cloud_voice.UserInfo(
      'id',
      'firstName',
      'lastName',
      'userName'
    );
    List<service_cloud_voice.UserInfo> users = new List<service_cloud_voice.UserInfo>();
    users.add(userInfo);
    service_cloud_voice.UserSyncingRequest request = new service_cloud_voice.UserSyncingRequest(
      'contactCenterId',
      'namedCredentials',
      users
    );
    SampleIntegrationImpl rc = new SampleIntegrationImpl();
    rc.removeUsersFromContactCenter(request);
  }

  @isTest
  static void testGetQueues() {
    SampleIntegrationImpl rc = new SampleIntegrationImpl();
    rc.getQueues(
      new service_cloud_voice.ContactCenterInfo('', '', '', '', '', '')
    );
  }

  @isTest
  static void testSetupSamlIdentityProvider() {
    SampleIntegrationImpl rc = new SampleIntegrationImpl();
    rc.setupSamlIdentityProvider(
      new service_cloud_voice.SetupSamlIdpRequest(
        'samlXmlData',
        'namedCredentials'
      )
    );
  }

  @isTest
  static void testGetConnectedAppSetupParams() {
    SampleIntegrationImpl rc = new SampleIntegrationImpl();
    rc.getConnectedAppSetupParams(
      new service_cloud_voice.ContactCenterInfo('', '', '', '', '', '')
    );
  }

  @isTest
  static void testGetSignedUrls() {
    SampleIntegrationImpl rc = new SampleIntegrationImpl();
    List<String> callKeys = new List<String>();
    callKeys.add('1');
    service_cloud_voice.RecordingMediaRequest recordingMediaRequest = new service_cloud_voice.RecordingMediaRequest(
      '',
      callKeys
    );
    rc.getSignedUrls(recordingMediaRequest);
  }
}
