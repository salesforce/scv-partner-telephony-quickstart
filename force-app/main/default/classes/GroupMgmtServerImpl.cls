/**
* Sample code that acts a server for handling Apex queue management requests.
*/
@RestResource(urlMapping='/SCVPartnerTestServer/v1/Groups/*')
global with sharing class GroupMgmtServerImpl {
  @HttpGet
  global static Map<String, String> listGroups() {
    RestRequest req = RestContext.request;
    Id contactCenterId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
    service_cloud_voice.ContactCenterInfo contactCenterInfo = new service_cloud_voice.ContactCenterInfo(contactCenterId, '', '', '', '', '');
    service_cloud_voice.ListGroupsRequest listGroupsRequest = new service_cloud_voice.ListGroupsRequest(contactCenterInfo);
    SampleQueueManagementImpl queueMgmtImpl = new SampleQueueManagementImpl();
    service_cloud_voice.ListGroupsResponse response = queueMgmtImpl.listGroups(listGroupsRequest);
    return response.getGroups();
  }
   
  @HttpPost
  global static String createGroup(String contactCenterId, String partnerContactCenterId, String internalName, String displayName, String namedCredentials, String orgId, String groupName, String description) {
    RestRequest req = RestContext.request;
    service_cloud_voice.ContactCenterInfo contactCenterInfo = new service_cloud_voice.ContactCenterInfo(contactCenterId, partnerContactCenterId, internalName, displayName, namedCredentials, orgId);
    service_cloud_voice.CreateGroupRequest createGroupRequest = new service_cloud_voice.CreateGroupRequest(contactCenterInfo, groupName, description);
    SampleQueueManagementImpl queueMgmtImpl = new SampleQueueManagementImpl();
    service_cloud_voice.CreateGroupResponse response = queueMgmtImpl.createGroup(createGroupRequest);
    return response.getGroupId();
  }
   
  @HttpPut
  global static boolean associateUsersWithGroup(String contactCenterId, String partnerContactCenterId, String internalName, String displayName, String namedCredentials, String orgId, String groupId, List<String> userIdList) {
    // Create UserInfo from user id given that UserInfo is not an accepted Request param type
    List<service_cloud_voice.UserInfo> userInfoList = new List<service_cloud_voice.UserInfo>();
    service_cloud_voice.UserInfo userInfo;
    for (String userId : userIdList) {
      userInfo = new service_cloud_voice.UserInfo(userId, '', '', '');
      userInfoList.add(userInfo);
    }

    RestRequest req = RestContext.request;
    service_cloud_voice.ContactCenterInfo contactCenterInfo = new service_cloud_voice.ContactCenterInfo(contactCenterId, partnerContactCenterId, internalName, displayName, namedCredentials, orgId);
    service_cloud_voice.SyncUsersWithGroupRequest syncUsersWithGroupRequest = new service_cloud_voice.SyncUsersWithGroupRequest(contactCenterInfo, groupId, userInfoList);
    SampleQueueManagementImpl queueMgmtImpl = new SampleQueueManagementImpl();
    service_cloud_voice.SyncUsersWithGroupResponse response = queueMgmtImpl.associateUsersWithGroup(syncUsersWithGroupRequest);
    return response.getSuccess();
  }
}