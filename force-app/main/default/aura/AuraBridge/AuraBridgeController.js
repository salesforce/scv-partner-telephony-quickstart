/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

({
    /*
    	Publish Messages from connector to LMS channel 
    */ 
    publishMessage : function(component, event, helper) {
        var message = event.getParam('arguments').message;
        //Adding source field to avoid echo so that we do not return the same message back to connector
        component.find('sampleMessageChannel').publish({ source : 'CONNECTOR', payload:message});
    },
    
    /*
    	Subscribe to messages from LMS Channel. Filter out messages received from connector 
    */
    handleMessage: function(cmp, message, helper) { 
    	var messageWrapper = message.getParams();
    	if(messageWrapper.source != 'CONNECTOR') {
        	cmp.get("v.handleMessage")(messageWrapper.payload);
    	}
    }
})