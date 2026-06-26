/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement } from 'lwc';

/**
 * OmniAutoAnswerController — Selective Auto-Answer for Service Cloud Voice
 *
 * WHAT IT DOES
 * ------------
 * Automatically accepts inbound Queue calls the moment they arrive, while
 * leaving DID / direct-extension calls for the agent to accept manually.
 * This mirrors physical ACD behaviour: queue calls ring through automatically,
 * direct calls wait for the agent to pick up.
 *
 * WHY IT EXISTS
 * -------------
 * Salesforce's native "Automatically accept work requests" setting is
 * all-or-nothing. Enabling it auto-accepts every call type, removing agent
 * control over direct calls. Disabling it forces agents to manually click
 * Accept on every call, adding unnecessary friction to high-volume queue work.
 * This component provides the middle ground: auto-accept only where it helps.
 *
 * HOW IT WORKS
 * ------------
 * 1. Subscribes to the Voice Toolkit API's `callstarted` event.
 * 2. Reads `callAttributes` from the event payload to determine routing type.
 * 3. Queue call  → calls acceptCall() immediately; agent is connected silently.
 * 4. DID / direct → does nothing; agent sees the standard Accept button.
 * 5. Subscribes to `callended` to reset state cleanly for the next call.
 *
 * SETUP
 * -----
 * 1. Deploy this component and the Omni_Auto_Answer_Voice_Extension FlexiPage.
 * 2. In Setup → Contact Centers → <your center> → SCV Settings:
 *    - Voice Extension Flexipage: Omni Auto Answer Voice Extension
 *    - Always Show Voice Extension: true
 * 3. Ensure "Automatically accept work requests" is UNCHECKED in Omni-Channel
 *    settings — the built-in setting overrides this component if enabled.
 *
 * ADAPTER COMPATIBILITY
 * ---------------------
 * Partner telephony adapters surface routing context under different key names.
 * Three common ones are checked below. If auto-accept is not firing, uncomment
 * the debug line in handleCallStarted to log the raw payload and identify the
 * exact key your connector uses.
 *
 * TECHNICAL NOTES
 * ---------------
 * - Bound handler references are stored in constructor() so removeEventListener
 *   works correctly (bind() creates a new function reference each time).
 * - disconnectedCallback removes all listeners to prevent memory leaks.
 * - _accepting flag prevents duplicate acceptCall() if the adapter fires
 *   callstarted more than once per call; reset by callended for the next call.
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
            // Log the raw attributes so you can identify the exact key/value your
            // adapter sends for DID / direct-extension calls and add an explicit check.
            console.log('[OmniAutoAnswer] Non-queue call, leaving for manual accept. callAttributes:', JSON.stringify(attrs));
            return;
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
