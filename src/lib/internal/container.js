/*
 this module needs to be fixed, was wrote for mongodb
 */
var _         = require('lodash');

var substance = require('../substance');
var living    = require('../living');

/**
 * container is abstraction - object that can store some substantion, chars or
 * others things inside itself. it can be location, character, container, vehicle, etc.
 */
var Container = {
    key: 'inventory-doc-key',
    // GameObject that will get container interface
    subject: null,
    /**
     * create new substance based on specific material and data,
     * inside this container
     */
    createSubstance: createSubstanceInsideContainer,
    /**
     * delete substance from this container, if it is inside
     */
    destroyInside: deleteSomethingInsideContainer,
    /**
     * put some substation to this container.
     * it will be removed from parent container.
     */
    put: putToContainer,
};

module.exports = {
    Container: Container,
    Factory: (subject, key) => _.create(Container, {
        key: key,
        subject: subject
    }),
};


async function createSubstanceInsideContainer(material, data) {
    var substanceRaw = Object.assign({}, data, {
        id: mongo.ObjectID(),
        material: _.omit(material._raw, '_id')
    });
    var collection = db().collection(this.subject.collection);

    var pushStruct = _.set({}, this.key, substanceRaw);
    await collection.updateAsync(
        {_id: this.subject.id},
        {$push: pushStruct}
    );

    return substance.SubstanceFactory(this, substanceRaw);
}

async function deleteSomethingInsideContainer(object) {
    var collection = db().collection(this.subject.collection);
    var pullStruct = _.set({}, this.key, {
        _id: object.id
    });
    await collection.update(
        {_id: this.subject.id},
        {$pull: pullStruct}
    );
    substance.container = null;
    return substance;
}

async function putToContainer(object) {
    /**
     * TODO: it's need "Two Phase Commits" to make substances move atomic.
     * in other cases we will sometimes have magic "breeding" of substances, or
     * strange disappearances
     * http://docs.mongodb.org/manual/tutorial/perform-two-phase-commits/ *
     */
    // substance ALWAYS is in some container, so `substance.container`

    var collection = db().collection(this.subject.collection);

    if (object.container) {
        await object.container.destroyInside(object);
    }

    var pushStruct = _.set({}, this.key, object.link());
    await collection.updateAsync(
        {_id: this.subject.id},
        {$push: pushStruct}
    );

    object.container = this;

    return object;
}

