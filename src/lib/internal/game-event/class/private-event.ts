import {GameEvent} from '../game-event'
import * as _ from 'lodash'

export default _.create(GameEvent, {
    detectRecipients: ownerOnlyRecipient
});

function ownerOnlyRecipient() {
    if (!_.isArray(this.observers)) {
        this.observers = [this.observers];
    }
    return Promise.resolve(this.observers);
}
