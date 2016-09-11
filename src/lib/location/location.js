import * as R from 'ramda'
import * as Kefir from 'kefir'

import {createService} from '../game-object-service'

const Location = createService('location', {
    // inside: loadInsideContainer,
    // link: () => ({
    //     type: 'loc',
    //     id: this.id
    // })

    /**
     * temporary, world global location where everybody goes
     */
    fetchGlobal() {
        return Location.find(Kefir.constant({
            'spec': 'global'
        })).map((val) => val[0]).flatMap(R.ifElse(
            R.isEmpty, createGlobalLocation, Kefir.constant
        ));

        function createGlobalLocation() {
            console.log('here');
            return Location.create(Kefir.constant({
                'spec': 'global'
            }));
        }
    }
});

export default Location;

// function loadInsideContainer() {
//     if (!this._inside) {
//         var containerFactory = require('../../internal/container').Factory;
//         this._inside = containerFactory(this, 'inside');
//     }
//     return this._inside;
// }
