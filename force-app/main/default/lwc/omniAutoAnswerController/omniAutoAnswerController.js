/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement } from 'lwc';

/**
 * Automatically accepts inbound Queue calls while leaving DID / direct-extension
 * calls for the agent to accept manually.
 *
 * Deploy this component as a Voice Extension on your Contact Center (Setup →
 * Contact Centers → <your center> → SCV Settings → Voice Extension Flexipage).
 * Leave "Automatically accept work requests" unchecked in Omni-Channel settings
 * so that this component — not Salesforce — controls accept behavior.
 *
 * Partner telephony adapters surface routing context in callAttributes.
 * The key name varies by adapter; the three most common are checked below.
 * If none match, enable the debug block and inspect the console output to find
 * the exact key your connector uses.
 */
export default class OmniAutoAnswerController extends LightningElement {
    _hasRendered = false;
    _accepting = false; // guard against duplicate callstarted events per call

    constructor() {
        super();
        // Store bound references so the same function can be passed to removeEventListener
        this._onCallStarted = this.handleCallStarted.bind(this);
        this._onCallEnded = this.handleCallEnded.bind(this);
    }

    renderedCallback() {
        if (this._hasRendered) return;
        this._hasRendered = true;

        const toolkit = this.template.querySelector(
            'lightning-service-cloud-voice-toolkit-api'
        );
        if (!toolkit) return;

        this._toolkit = toolkit;
        toolkit.addEventListener('callstarted', this._onCallStarted);
        toolkit.addEventListener('callended', this._onCallEnded);
    }

    disconnectedCallback() {
        if (this._toolkit) {
            this._toolkit.removeEventListener('callstarted', this._onCallStarted);
            this._toolkit.removeEventListener('callended', this._onCallEnded);
        }
    }

    handleCallStarted(event) {
        if (this._accepting) return; // prevent duplicate acceptCall on repeated events

        const detail = event.detail || {};
        const attrs = detail.callAttributes || {};

        /*
         * Uncomment to log the raw callAttributes payload and identify which
         * key your telephony adapter uses if auto-accept is not firing:
         *
         * console.log('[OmniAutoAnswer] callAttributes:', JSON.stringify(detail));
         */

        // Key names observed across common partner telephony adapters
        const isQueueCall =
            attrs.routingType === 'Queue' ||
            attrs.callRoutingType === 'Queue' ||
            attrs.queueCall === true;

        if (!isQueueCall) {
            return; // DID / direct-extension call — leave manual Accept for the agent
        }

        this._accepting = true;
        console.log('[OmniAutoAnswer] Queue call detected, auto-accepting.');

        this._toolkit
            .acceptCall()
            .then(() => console.log('[OmniAutoAnswer] Call accepted successfully.'))
            .catch((err) => {
                console.error('[OmniAutoAnswer] acceptCall failed:', err);
                this._accepting = false; // reset so a retry is possible
            });
    }

    handleCallEnded() {
        this._accepting = false; // reset for the next call
    }
}
