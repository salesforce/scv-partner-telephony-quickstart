/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, track, wire } from 'lwc';
import { publish, subscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/ServiceCloudVoiceMessageChannel__c";

export default class Lms_LWC extends LightningElement {
    @wire(MessageContext)
    messageContext;
    @track myMessage = '';
    @track receivedMessage = '';
     
    constructor() {
        super();
    }

    connectedCallback() {
        subscribe(this.messageContext, 
            SAMPLEMC, 
            (message) => {
                this.handleMessage(message);
            },
            {scope: APPLICATION_SCOPE}
        );
    }

    handleChange(event) {
        this.myMessage = event.target.value;
    }

    publishMessage() {
        const message = { message: this.myMessage };
        publish(this.messageContext, SAMPLEMC, {source : 'LWC', payload:message});
    }
       
    handleMessage(message) {
        if (message.source != 'LWC') {
            this.receivedMessage = message ? JSON.stringify(message.payload, null, '\t') : 'no message payload';  
        }
    }
}