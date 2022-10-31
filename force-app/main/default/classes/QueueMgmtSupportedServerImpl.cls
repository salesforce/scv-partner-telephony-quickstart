/**
* Sample code that acts a server for handling Apex queue management requests.
*/
@RestResource(urlMapping='/SCVPartnerTestServer/v1/isQueueUserGroupingSupported/*')
global with sharing class QueueMgmtSupportedServerImpl {
 
  @HttpGet
  global static boolean supportsQueueUserGrouping() {       
    RestRequest req = RestContext.request;
    Id contactCenterId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
    service_cloud_voice.ContactCenterInfo contactCenterInfo = new service_cloud_voice.ContactCenterInfo(contactCenterId, '', '', '', '', '');
    SampleQueueManagementImpl queueMgmtImpl = new SampleQueueManagementImpl();
    service_cloud_voice.QueueUserGroupingResponse response = queueMgmtImpl.supportsQueueUserGrouping(contactCenterInfo);
    return response.isQueueUserGroupingSupported();
  }
}