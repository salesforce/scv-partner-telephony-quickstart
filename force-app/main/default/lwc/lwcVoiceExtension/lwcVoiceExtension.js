/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from 'lwc';

export default class ScvToolkitApiTester extends LightningElement {
    @track headSetControlsDisabled = true;
    payload = '{"key": "value"}';
    teleEventName = 'None';
    teleEvent = 'No events received yet.';

    hasRendered = false;

    constructor() {
        super();
        this.telephonyEventListener = this.onTelephonyEvent.bind(this);
    }

    renderedCallback() {
        if (!this.hasRendered) {
            this.subscribeToVoiceToolkit();
            this.hasRendered = true;
      }
    }

    changeHandler(event) {
        this.payload = event.target.value;
    }

    onSubscribe(event) {
        this.subscribeToVoiceToolkit();
    }

    onUnsubscribe(event) {
        this.unsubscribeFromVoiceToolkit();
    }

    subscribeToVoiceToolkit() {
        const toolkitApi = this.getToolkitApi();

        toolkitApi.addEventListener('callstarted', this.telephonyEventListener);
        toolkitApi.addEventListener('callconnected', this.telephonyEventListener);
        toolkitApi.addEventListener('callended', this.telephonyEventListener);
        toolkitApi.addEventListener('mute', this.telephonyEventListener);
        toolkitApi.addEventListener('unmute', this.telephonyEventListener);
        toolkitApi.addEventListener('hold', this.telephonyEventListener);
        toolkitApi.addEventListener('resume', this.telephonyEventListener);
        toolkitApi.addEventListener('participantadded', this.telephonyEventListener);
        toolkitApi.addEventListener('participantremoved', this.telephonyEventListener);
        toolkitApi.addEventListener('swap', this.telephonyEventListener);
        toolkitApi.addEventListener('conference', this.telephonyEventListener);
        toolkitApi.addEventListener('pauserecording', this.telephonyEventListener);
        toolkitApi.addEventListener('resumerecording', this.telephonyEventListener);
    }

    unsubscribeFromVoiceToolkit() {
        const toolkitApi = this.getToolkitApi();

        toolkitApi.removeEventListener('callstarted', this.telephonyEventListener);
        toolkitApi.removeEventListener('callconnected', this.telephonyEventListener);
        toolkitApi.removeEventListener('callended', this.telephonyEventListener);
        toolkitApi.removeEventListener('mute', this.telephonyEventListener);
        toolkitApi.removeEventListener('unmute', this.telephonyEventListener);
        toolkitApi.removeEventListener('hold', this.telephonyEventListener);
        toolkitApi.removeEventListener('resume', this.telephonyEventListener);
        toolkitApi.removeEventListener('participantadded', this.telephonyEventListener);
        toolkitApi.removeEventListener('participantremoved', this.telephonyEventListener);
        toolkitApi.removeEventListener('swap', this.telephonyEventListener);
        toolkitApi.removeEventListener('conference', this.telephonyEventListener);
        toolkitApi.removeEventListener('pauserecording', this.telephonyEventListener);
        toolkitApi.removeEventListener('resumerecording', this.telephonyEventListener);
    }

    onTelephonyEvent(event) {
        this.teleEventName = event.type;
        this.teleEvent = JSON.stringify(event.detail);
    }

    getToolkitApi() {
      return this.template.querySelector('lightning-service-cloud-voice-toolkit-api');
    }
}