/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, track, wire, api } from 'lwc';
import { publish, subscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/ServiceCloudVoiceMessageChannel__c";

export default class Lms_LWC extends LightningElement {
    @wire(MessageContext)
    messageContext;

    @api handleMessage;
     
    constructor() {
        super();
    }

    connectedCallback() {
        subscribe(this.messageContext, 
            SAMPLEMC, 
            (message) => {
                if(message.source != 'CONNECTOR'){
                    this.handleMessage(message.payload);
                }
            },
            {scope: APPLICATION_SCOPE}
        );
    }

    @api
    publishMessage(message) {
        publish(this.messageContext, SAMPLEMC,  { source : 'CONNECTOR', payload:message});
    }
}