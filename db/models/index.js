'use strict'

// Require our models. Running each module registers the model into sequelize
// so any other part of the application could call sequelize.model('User')
// to get access to the User model.

const app = require('APP')
    , debug = require('debug')(`${app.name}:models`)
    // Our model files export functions that take a database and return
    // a model. We call these functions "meta models" (they are models of
    // models).
    //
    // This lets us avoid cyclic dependencies, which can be hard to reason
    // about.
    , metaModels = {
      OAuth: require('./oauth'),
      User: require('./user'),
      Thing: require('./thing'),
      Favorite: require('./favorite'),
      // ---------- Add new models here ----------
    }
    , {mapValues} = require('lodash')

module.exports = db => {
  // Create actual model classes by calling each meta model with the
  // database.
  const models = mapValues(metaModels, defineModel => defineModel(db))

  /*
  At this point, all our models have been created. We just need to
  create the associations between them.

  We pass the responsibility for this onto the models themselves:
  If they export an `associations` method, we'll call it, passing
  in all the models that have been defined.

  This lets us move the association logic to the model files,
  so all the knowledge about the structure of each model remains
  self-contained.

  The Sequelize docs suggest a similar setup:

  https://github.com/sequelize/express-example#sequelize-setup
  */
  Object.keys(metaModels)
    .forEach(name => {
      const {associations} = metaModels[name]
      if (typeof associations === 'function') {
        debug('associating model %s', name)
        // Metamodel::associations(self: Model, others: {[name: String]: Model}) -> ()
        //
        // Associate self with others.
        associations.call(metaModels[name], models[name], models)
      }
    })

  return models
}
