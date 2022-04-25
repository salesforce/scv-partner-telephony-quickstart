/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, track, api } from 'lwc';
export default class AgentConfig extends LightningElement {
    @track queueId;
    @track callerId;
    _settings = {};

    onQueueIdChange(event) {
        this.queueId = event.detail.value;
    }

    onCallerIdChange(event) {
        this.callerId = event.detail.value;
    }

    @api
    save() {
        this._settings = {
            queueId: this.queueId,
            callerId: this.callerId
        };
    }

    @api
    cancel() {
        this.queueId = this._settings.queueId;
        this.callerId = this._settings.callerId;
    }
}