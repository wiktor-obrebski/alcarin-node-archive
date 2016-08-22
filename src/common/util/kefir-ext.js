import * as Kefir from 'kefir'

Object.assign(Kefir.Observable.prototype, {
    prop: function prop(key) {
        return this.map(
            (data) => data[key]
        );
    }
});
