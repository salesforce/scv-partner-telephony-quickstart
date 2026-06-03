# Service Cloud Voice Partner Telephony Sample Application

This is a sample application that demonstrates the Service Cloud Voice Partner Telephony integration implementation. The Service Cloud Voice partners need to provide an integration implementation to customers via a management package on Appexchange. This sample application is designed to use Salesforce CLI and 2nd 2nd generation packaging to create the managed package that contains the integration implementation sample.

## Table of contents
-   [Setup Dev Hub and Namespace Orgs](#setup-dev-hub-and-namespace-orgs)
-   [Create an SFDX Project](#create-an-sfdx-project)
-   [Create and Release Your Package](#create-and-release-your-package)
-   [Deploy to a Scratch Org](#deploy-to-a-scratch-org)
-   [First-Generation Package and Metadata API](#first-generation-package-and-metadata-api)

## Setup Dev Hub and Namespace Orgs

1. Create an org with Dev Hub features enabled.
 - Create a Developer Edition org.
   - Enable Lightning Experience.
   - Enable Dev Hub features. From Setup, enter `Dev Hub` in the Quick Find box and select **Dev Hub**. Then, click **Enable**.
   - Enable **Unlocked Packages and Second-Generation Managed Packages** from the `Dev Hub` setup page 
2. Create a namespace org.
 - Create a Developer Edition org.
   - Enable Lightning Experience.
   - [Create a namespace](https://developer.salesforce.com/docs/atlas.en-us.228.0.lightning.meta/lightning/namespaces_creating.htm).
     - Note: Choose your namespace carefully. If you're trying out this feature or need a namespace for testing purposes, choose a disposable namespace. Don't choose a namespace that you want to use in the future for a production org or some other real use case. Once you associate a namespace with an org, you can't change it or reuse it.
Use Namespace Registry to register the namespace that you created. To learn more, see [Link a Namespace to a Dev Hub Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_reg_namespace.htm).
In the sfdx-project.json file, specify your namespace using the **namespace** attribute.
3. [Create a connected app](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_connected_app.htm) in your Dev Hub org for authorization. The app allows you to set the refresh token timeout, specify IP ranges, and more. Use any name, for example, Dev Hub Connected App.
4. To authenticate into the dev hub, use the following sfdx command. 
 - For **HUB_ORG_ALIAS**, choose any name. 
 - For **CLIENT_ID**, use the consumer key of the connected app you created. 
 - For **INSTANCE_URL**, use [https://login.salesforce.com](https://login.salesforce.com/).
       ```
       sfdx force:auth:web:login --setdefaultdevhubusername --setalias <HUB_ORG_ALIAS> --clientid <CLIENT_ID> --instanceurl <INSTANCE_URL>
       ```
 - You’ll be prompted for the secret. Use the Consumer Secret from the connected app. To retrieve it, click **Click to reveal** under Consumer Secret.

**Tip**: To view the OAuth client ID and personal connected app secret, from Setup, enter `App Manager` in the Quick Find box and click **App Manager**. Click **Connected App** → **Consumer Key **and** Consumer Secret**. To learn about more authentication methods, see [Authorize an Org Using the Web Server Flow](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_web_flow.htm).

## Create an SFDX Project

Allow Service Cloud Voice to communicate with your telephony provider. The package you're creating includes a ConversationVendorInfo instance and other optional resources.

1. Clone the `scv-partner-telephony-quickstart` repository.

```shell
        git clone --recurse-submodules https://github.com/salesforce/scv-partner-telephony-quickstart
        cd scv-partner-telephony-quickstart
        npm install     // this will install sfdx cli
        //if it does not work, try 'npm i --legacy-peer-deps' 
```

   - You can also install the Salesforce CLI separately, see [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)
   - You may need to update the "sfdcLoginUrl" and "signupTargetLoginUrl" on your sfdx-project.json based on the Salesforce instance you work on, and "namespace" based on the namespace you created.
   - If you already have Salesforce CLI installed, please make sure to update it to the latest version by `sfdx update` This is very important because we've added our new Metadata type supported
   - Make sure to use current API version in the sfdx project. You can find it in the sfdx-project.json, and if you have the local API version override, see [this help doc](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_troubleshoot_api_sync.htm).
   - If you are not using the current API version, you may see errors related to the ConversationVendorInfo Metadata type. The error message from Salesforce CLI will be similar to: `Unexpected file found in package directory: /Users/.../scv-partner-telephony-quickstart/force-app/main/default/ConversationVendorInformation/sampleVendor.ConversationVendorInformation-meta.xml`

2. Create your Conversation Vendor Information instance. You can find a sample file in `scv-partner-telephony-quickstart/force-app/main/default/ConversationVendorInformation/sampleVendor.ConversationVendorInformation-meta.xml`.
    - ConversationVendorInfo is a Setup entity that stores basic information about a telephony vendor.
    - An AppExchange package should at least have one ConversationVendorInfo instance.
    - A ConversationVendorInfo record is required when customers creating a Contact Center by importing an XML file in their Salesforce org.
    - Set developerName field to a desired unique name, and it needs to be matched with the file name.
    - Set masterLabel field to desired Display name for the Telephony Provider. This will show up in the Contact Center record as a Telephony provider.
    - Set connectorUrl field to the URL of the connector.
        - If you are testing with the demo-scv-connector, use the absolute link, for example: https://www.myTelephonyDemo.com:8080
        - You can also choose to host the connector as a Visualforce page from the same Salesforce managed package, use the relative URL format, for example: `/apex/<namespace>__<connector visual force page name>`.
    - Set customLoginUrl field to the URL that is used to load the telephony system login page. If you are not using it, remove it. If you are testing with the demo-scv-connector, it requires an absolute URL, for example: `https://www.myTelephonyDemo.com:8080/login.html`.
    - Set bridgeComponent field to: `<package-namespace>:<lms bridge name>`. If you are not using it, you can remove it. If you are testing with the demo-scv-connector, you can use `{your_namespace}:lwcBridge` or `{your_namespace}:AuraBridge`.
    - Set clientAuthMode field, possible value are "SSO", "Custom" and "Mixed"
    - Set serverAuthMode field, possible value is "OAuth" and "None"

3. Develop your connector. For a sample implementation, you can find it in our submodule: scv-partner-telephony-quickstart/demo-connector in the repository.
    - There are two options to host the connector for the customers.
        - Host in a Visualforce page
            - This requires to use of the static resource and a Visualforce page to host the connector.
            - Compile your connector file. If you are testing with the demo-scv-connector, you can run `npm run build:dev`, it will compile the file and output to /dist folder
            - Add all the files from the /dist folder to /main/default/staticresources in the sfdx project
            - Make sure you have the corresponding -meta.xml files for the resources added in staticresources. To learn more about how to add static resources, see [Salesforce DX Project Structure and Source Format](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_source_file_format.htm)
            - Create a connector Visualforce page inside scv-partner-telephony-quickstart/force-app/main/default/pages/ as follows 
            ``` 
                <apex:page> 
                    <apex:includeScript value="{!$Resource.REPLACE_WITH_CONNECTOR_RESOURCE_NAME}"/> 
                </apex:page>
            ```
            - Put the relative URL to the connectorUrl field in the Conversation Vendor Information instace, for example: `/apex/<namespace>__<connector visual force page name>`
        - Host in a standalone server
            - If you are testing with the demo-scv-connector, you will need to put the absolute URL in the connectorUrl field in the Conversation Vendor Information instance, for example: https://www.myTelephonyDemo.com:8080

4. Update the following resources as needed.
 - find all the files that contains the word REPLACE_WITH_NAMESPACE_NAME and replace it with your namespace. You could run a command like this one: sed -i ``` 's/REPLACE_WITH_NAMESPACE_NAME/mynamespace/g' * ```
    - **Aura Bridge:** This is a sample Aura bridge component. When referring to the LMS channel, use the namespace as a prefix: `<namespace>__<lms channel name>__c`
        - In force-app/main/default/aura/AuraBridge/AuraBridge.cmp, change `<lightning:messageChannel type="REPLACE_WITH_NAMESPACE_NAME__ServiceCloudVoiceMessageChannel__c" ..` to `<lightning:messageChannel type="<namespace>__<lms channel name>__c" ..`
    - **Aura LMS Sample:** This is a sample Aura component that subscribes to the lightning message channel. When referring to the LMS channel, use the namespace as a prefix: `<namespace>__<lms channel name>__c`
        - In force-app/main/default/aura/AuraLmsSample/AuraLmsSample.cmp, change `<lightning:messageChannel type="REPLACE_WITH_NAMESPACE_NAME__ServiceCloudVoiceMessageChannel__c" ..` to `<lightning:messageChannel type="<namespace>__<lms channel name>__c"`
    - **LWC Bridge:** This is a sample LWC bridge component. When referring to the LMS channel, do not use the namespace as a prefix.
    - **LWC LMS Sample: ** This is a sample LWC component that subscribes to the lightning message channel. When referring to the LMS channel, do not use the namespace as a prefix.

## Create and Release Your Package

Use the following commands to create, update, and install the package.
First run this command: sfdx config:set defaultdevhubusername=<DEV_HUB_USERNAME>


**Create the package**

```
sfdx force:package:create --name "<Package Name>" --path force-app --packagetype Managed --errornotificationusername <Dev Hub Username>

```

**Create a package version**

```
sfdx force:package:version:create --package "<Package Name>" --installationkeybypass --definitionfile config/project-scratch-def.json --skipvalidation --wait 20 -c
```

The same command is used to create newer versions of the package. This command results in an installation link that can be used in customer orgs.

`Successfully created the package version [08cB0000000****IA0]. Subscriber Package Version Id: 04tB0000000d****IAQ`
`Package Installation URL: [https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB00000****DIAQ](https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB0000000d2wDIAQ)`

**Release a package version**

Each new package version is marked as beta when created. As you develop your package, you may create several package versions before you create a version that is ready to be released and distributed. Only released package versions can be listed on AppExchange and installed in customer orgs.
 Before you promote the package version, ensure that the user permission, Promote a package version to released, is enabled in the Dev Hub org associated with the package. Consider creating a permission set with this user permission, and then assign the permission set to the appropriate user profiles. When you're ready to release, use `force:package:version:promote`.

```
sfdx force:package:version:promote --package "Expense Manager@1.3.0-7"
```

If the command is successful, a confirmation message appears.

```
Successfully promoted the package version, ID: 04tB0000000719qIAA to released.
```

After the update succeeds, view the package details.

```
sfdx force:package:version:report --package "Expense Manager@1.3.0.7"
```

Confirm that the value of the Released property is true.

```
=== Package Version
NAME VALUE
────────────────────────────── ───────────────────
Name ver 1.0
Alias Expense Manager-1.0.0.5
Package Version Id 05iB0000000CaahIAC
Package Id 0HoB0000000CabmKAC
Subscriber Package Version Id 04tB0000000NPbBIAW
Version 1.0.0.5
Description update version
Branch
Tag git commit id 08dcfsdf
Released true
Created Date 2018-05-08 09:48
Installation URL
https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB0000000NPbBIAW
```

You can promote and release only once for each package version number, and you can’t undo this change.

To learn more, see [Workflow for Second-Generation Packages](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_dev2gp_workflow.htm).

## Deploy to a Scratch Org

**Create a scratch org**

You can create a scratch org to test your package. You can enable the Service Cloud Voice Partner Telephony features in a scratch org by specifying `ServiceCloudVoicePartnerTelephony` in the features field in your scratch org definition. This may take a few minutes. 

```
sfdx force:org:create --definitionfile config/project-scratch-def.json --targetusername <Dev Hub Username>
```

**Open the scratch org**

To find a list of scratch orgs, including the one you created, run this command.

```
sfdx force:org:list --verbose
```

To open the scratch org, run this command.

```
sfdx force:org:open -u <scratch org username>
```

**Install the package**

Run this command. **Target Org Username** is the org where you want to install the package.  

```
sfdx force:package:install --package "<Packge Name>@<Package Version>" --targetusername <Target Org Username> 
```

Or, use the installation URL from before.

Look for an email indicating whether the package was installed. If the installation failed, review the email for details and try again. 
To learn more about installation methods, see [Install Packages with the CLI](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_dev2gp_install_pkg_cli.htm).

## First-Generation Package and Metadata API

If you prefer to use a First-Generation managed package contain all the resources from this sample repository, you can always do so.
1. Ensure you have the Service Cloud Voice Partner Telephony license in your Salesforce org where you want to create the package.
2. You can always clone this repository and use Salesforce CLI to convert all the resources source-formatted files into metadata that you can deploy using Metadata API.
    - Complete step 1 in [Create an SFDX Project](#create-an-sfdx-project), which will help you to clone this repo and install the Salesforce CLI.
    - Use force:source:convert command to convert source-formatted files into metadata. See [the command document here](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_source.htm#cli_reference_force_source_convert).
Example: ```$ sfdx force:source:convert -r path/to/source -d path/to/outputdir -n 'My Package'```
3. After you deploy the resource using Metadata API in your org, you can create and upload a managed package. Please see our [ISVforce guide on how to create and upload a managed package](https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/packaging_uploading.htm).

## Get started with quick-start-partner-telephony package
You can check the Partner Telephony features  in your Partner Telephony Enabled Org.  We have published a sample quick-start package which you can install in your org, create a Contact center and get started. 

* Install quick-start-partner-telephony package in your org (https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB00000007T1S) in your Org
*  quick-start-partner-telephony package has two ConversationVendorInfo records. You can reference to one while creating a contact center. The difference between them is the connector URL, one points to localhost (127.0.0.1) and  another points to VF page (quickStartPT__quickStartPTVFConnector). Both of them require you to run a local server, For localhost you need to host the connector from  http://127.0.0.1/ and for VF page you only need server to call SCRT APIs which is common part for both options.

**Package components are as follows**

| Name	                   | Type	                 | Description
|-------------------------|-------------------------|--------------------------------------------------------|
|AuraLmsSample	     |Aura Component Bundle	   |Voice Call Record Home Aura Component to demonstrate LMS 
|AuraMessageBridge	|Aura Component Bundle	|Aura bridge component  needed for LMS messages 
|ServiceCloudVoiceMessageChannel	|Lightning Message Channel	LMS channel
|connectorPage	|Visualforce Page	|Connector page used as connector Url. 
|demoConnector	|Static Resource	|js script referenced in Connector VF page
|loginPage	|Visualforce Page	|demo Login Page used in Omni for partner Login
|login_page	|Static Resource	|js script referenced in login VF page
|logo	|Static Resource	|image icon
|lwcBridge	|Lightning Web Component Bundle	|LWC bridge component  needed for LMS messages 
|lwcLmsSample	|Lightning Web Component Bundle	|Voice Call Record Home LWC Component to demonstrate LMS 
|agentConfig	|Lightning Web Component Bundle	|LWC Agent Settings Component
|quickStartPTVFConnector	|Conversation Vendor Information	|Conversation Vendor Info record for VF page connector
|quickStartPartnerTelephony	|Conversation Vendor Information	|Conversation Vendor Info record for localhost connector
|remote_control	|Static Resource	|VF page for simulator page (aka remote)
|simulatorPage	|Visualforce Page	|JS script refrenced in Simulator VF Page
|slds_stylesheet	|Static Resource	|css for Simulator VF Page
|symbols	|Static Resource	|image icons

**Setup Instructions**

* After installing the quick-start-partner-telephony package.
* Follow Partner telephony Setup instructions to create contact center and assigning permission sets. 
* Import a Contact Center Xml https://salesforce.quip.com/aNQOA0C8m0Vk. Set reqVendorInfoApiName as needed. 

  - quickStartPT__quickStartPartnerTelephony (For connector from localhost)

       - quickStartPartnerTelephony is the developer name of the Conversation Vendor Info record where connector Url is pointing to Localhost i.e                          https://127.0.0.1:8080/. Make sure connector is running on localhost 8080.


  - quickStartPT__quickStartPTVFConnector (For connector from VF Page)

       - You need to start a server for  SCRT server calls like (Inbound call, transcription, call recording). and one initial call to set org details.Included           VF page in package  is using localhost:3030 for SCRT calls i.e http://127.0.0.1:3030/ and configuring the org details using configureTenantInfo call.

       - You need to enable Cors on the server to enable calls to other domain from VF connector.
             
       - Run npm install cors in demo connector.  `npm install cors`
       
       - Add following two lines in server.mjs.
           
```javascript
              import cors from 'cors';
              app.use(cors());
```       

* Package also includes LMS channel and Aura/lwc Record Home components and bridge components which you can add to  Voice Call RH and play with LMS. 
* Note VF page connector is using AuraBridgeComponent and localhost connector is using lwcBridge component which are part of package.


