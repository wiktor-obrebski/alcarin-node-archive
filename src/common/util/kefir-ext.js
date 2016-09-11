import * as Kefir from 'kefir'
import * as R from 'ramda'

Object.assign(Kefir.Observable.prototype, {
    /**
     * @param  {Array<string>} props
     * @return {Kefir.Stream}
     */
    pick(props) {
        return this.map(R.pick(props));
    },
    /**
     * @param  {string} key
     * @return {Kefir.Stream}
     */
    prop(key) {
        return this.map(
            (data) => data[key]
        );
    },
    /**
     * @return Kefir.stream
     */
    playerId$() {
        return this.map(
            (data) => data['__auth'] ? data['__auth']['playerId'] : undefined
        );
    }
});
