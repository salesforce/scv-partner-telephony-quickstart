/**
* Sample code that acts a server for handling Apex queue management requests.
*/
@RestResource(urlMapping='/SCVPartnerTestServer/v1/Queues/*')
global with sharing class QueueMgmtServerImpl {

  @HttpGet
  global static Map<String, String> listQueues() {
    RestRequest req = RestContext.request;
    Id contactCenterId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
    service_cloud_voice.ContactCenterInfo contactCenterInfo = new service_cloud_voice.ContactCenterInfo(contactCenterId, '', '', '', '', '');
    service_cloud_voice.ListQueuesRequest listQueuesRequest = new service_cloud_voice.ListQueuesRequest(contactCenterInfo);
    SampleQueueManagementImpl queueMgmtImpl = new SampleQueueManagementImpl();
    service_cloud_voice.ListQueuesResponse response = queueMgmtImpl.listQueues(listQueuesRequest);
    return response.getQueues();
  }
 
  @HttpPost
  global static String createQueue(String contactCenterId, String partnerContactCenterId, String internalName, String displayName, String namedCredentials, String orgId, String queueName) {
    RestRequest req = RestContext.request;
    service_cloud_voice.ContactCenterInfo contactCenterInfo = new service_cloud_voice.ContactCenterInfo(contactCenterId, partnerContactCenterId, internalName, displayName, namedCredentials, orgId);
    service_cloud_voice.CreateQueueRequest createQueueRequest = new service_cloud_voice.CreateQueueRequest(contactCenterInfo, queueName);
    SampleQueueManagementImpl queueMgmtImpl = new SampleQueueManagementImpl();
    service_cloud_voice.CreateQueueResponse response = queueMgmtImpl.createQueue(createQueueRequest);
    return response.getQueueId();
  }
    
  @HttpDelete
  global static boolean removeQueue() {
    RestRequest req = RestContext.request;
    Id queueId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
    service_cloud_voice.ContactCenterInfo contactCenterInfo = new service_cloud_voice.ContactCenterInfo('', '', '', '', '', '');
    service_cloud_voice.RemoveQueueRequest removeQueueRequest = new service_cloud_voice.RemoveQueueRequest(contactCenterInfo, queueId);
    SampleQueueManagementImpl queueMgmtImpl = new SampleQueueManagementImpl();
    service_cloud_voice.RemoveQueueResponse response = queueMgmtImpl.removeQueue(removeQueueRequest);
    return response.getSuccess();
  } 

  @HttpPut
  global static boolean associateUsersAndGroupsWithQueue(String contactCenterId, String partnerContactCenterId, String internalName, String displayName, String namedCredentials, String orgId, String queueId, List<String> userIdList, List<String> groupIdList) {
    // Create UserInfo from user id given that UserInfo is not an accepted Request param type
    List<service_cloud_voice.UserInfo> userInfoList = new List<service_cloud_voice.UserInfo>();
    service_cloud_voice.UserInfo userInfo;
    for (String userId : userIdList) {
      userInfo = new service_cloud_voice.UserInfo(userId, '', '', '');
      userInfoList.add(userInfo);
    }

    // Create GroupInfo from group id given that GroupInfo is not an accepted Request param type
    List<service_cloud_voice.GroupInfo> groupInfoList = new List<service_cloud_voice.GroupInfo>();
    service_cloud_voice.GroupInfo groupInfo;
    for (String groupId : groupIdList) {
      groupInfo = new service_cloud_voice.GroupInfo(groupId, '');
      groupInfoList.add(groupInfo);
    }

    RestRequest req = RestContext.request;
    service_cloud_voice.ContactCenterInfo contactCenterInfo = new service_cloud_voice.ContactCenterInfo(contactCenterId, partnerContactCenterId, internalName, displayName, namedCredentials, orgId);
    service_cloud_voice.SyncUsersAndGroupsWithQueueRequest associateUsersAndGroupsWithQueueRequest = new service_cloud_voice.SyncUsersAndGroupsWithQueueRequest(contactCenterInfo, queueId, userInfoList, groupInfoList);
    SampleQueueManagementImpl queueMgmtImpl = new SampleQueueManagementImpl();
    service_cloud_voice.SyncUsersAndGroupsWithQueueResponse response = queueMgmtImpl.associateUsersAndGroupsWithQueue(associateUsersAndGroupsWithQueueRequest);
    return response.getSuccess();
  }

}