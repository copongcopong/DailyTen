
import React, { Component } from 'react';
const Ractive = require('../Lib/rn-ractive');

import DB  from './AppDb';
const _ = require('lodash');
var Chance = require('chance');
const chance = new Chance;

Store = new Ractive({data: {_appdb: new DB} });

if(global.__DEV__) {
  Store.observe('*', function(o,n,k){

    console.log("AppStore Global Listener", {o: o, n: n, k: k});

  });
}

class Compo extends Component {
  constructor(props) {
    super(props);
  }

  setupState(states) {
    if(states === undefined) return {};
    var nstates = {};
    var funcs = {};
    for(k in states) {
      if(k[0] !== '$') {
        nstates[k] = states[k];
      } else {
        funcs[k] = states[k];
      }
  }
    console.log("setupState", nstates, funcs, states);
    this.Store.setState(nstates, true, funcs);
    this.state = nstates;
  }

  componentWillMount() {
    //AppStore.fire('Screen1.init', this);
    this.Store.mountComponent(this);
    this.setupState(this.initState);


  }

  componentDidMount() {
    //console.log("DADD", this.props.data);
  }
  componentWillUnMount() {
    //AppStore.set('Screen1._c', null);
    this.Store.unmountComponent();
  }

  hook(k) {
    var states = this.Store.get('_state');
    console.log("HOOOK", states);
    for(kk in states) {
      var v = states[kk];
      this._setRowState(kk, v);
    }

    if(k != undefined) {
//      this._setRowState(k);
    } else {
    }

  }

  _setRowState(k, v) {
    if(v != undefined) {
      state = v;
    } else {
      state = this.Store.get('_state.' + k);
    }

    preProcessor = this.Store.get('_state_cb.$' + k);

    if(typeof preProcessor === 'function') {
      state = preProcessor(state);
    } else if(preProcessor !== undefined) {
      var s = preProcessor.split(".");
      var obj = this.Store.get("$" + s[0]);
      if(obj) {
        state = obj[s[1]].call(obj, state);
      }
    }

    if(state) this.setState({k: state});
  }

}

const AppStoreSolo = Ractive.extend({
  rComponent: null,
  BaseComponent: Compo,
  chance: chance,
  cacheToDb: false,
  onconfig: function(opts) {
    console.log('AppStoreSolo', this.namespace);
    var aDB = new DB;
    this.DB = aDB;
    this.set('_storedb', aDB.db);
    this.initDebug();


    if(this.cacheToDb !== false) {

      if(this.cacheToDb === true) {
        this.setDbKey = '_local/appstore_' + chance.hash({length: 10});
      } else {
        this.setDbKey = '_local/appstore_' + this.cacheToDb;
      }

    }
  },

  saveStateToDb: function() {

    if(this.setDbKey === undefined) return;
/*
    var state = this.get('_state');
    var pDB = this.get('_storedb');
    var idid = this.setDbKey;

    function p() {
      pDB.put({
        _id: idid,
        state: state
      }).then(function(){
        console.log("saveStateToDb success");
      }).catch(function(err){
        console.log("saveStateToDb Error", err, idid);
      });
    }


    pDB.remove(idid)
     .then(p).catch(function(err){
       console.log("ERROR REMOVE DB", err);
       p();
     });

*/

  },

  getStateFromDb: function(cb) {
    if(this.setDbKey === undefined) return null;

    var pDB = this.get('_storedb');


    return pDB.get(this.setDbKey)
      .then(cb).catch(function(err) {

        console.log("ERROR DB CACHE", this.setDbKey, err);
        cb(null);
      });

  },

  initDebug: function() {
    if(global.__DEV__) {
      this.observe('*', function(o,n,k){

        console.log("AppStoreSolo Global Listener", {o: o, n: n, k: k});

      });
    }
  },

  setDB: function() {

    this.set('_storedb', new DB);
  },

  mountComponent: function(c) {
    this.rComponent = c;
  },

  unmountComponent: function() {


    this.rComponent = null;
    this.stateObserver.cancel();

  },

  setState: function(obj, mount, funcs) {

    if(mount) {
      this.set('_state_init', obj);
      if(funcs != undefined) {
        this.set('_state_cb', funcs);
      }
      var dbstate = this.getStateFromDb((dstate) => {
        console.log("dbstate", dstate);
        if(dstate != null) this.set('_state', dstate.state);
      });
    }
    console.log("X02", obj, mount, funcs);


    //if(dbstate != null) this.set('_state', dbstate);
    if(this.rComponent !== null) {
      hasExist = this.get('_state');
      if(hasExist) {
        obj = hasExist;
        obj._x = 1;
        this.rComponent.setState(obj);
      } else {
        obj._x = 2;
        console.log("X2", obj);
        this.set('_state', obj);
        this.syncObserverState();
      }
      if(this.rComponent.hook) this.rComponent.hook();


    }

  },

  syncObserverState: function() {
    this.stateObserver = this.observe('_state.*', function(n, o, keypath) {
      console.log("AppStoreSolo observing ", keypath);
      var kk = keypath.split('.');
      var val = this.get(kk[0] + '.' + kk[1]);
      var k = kk[1];

      console.log("KKK", kk, k, val);
      if(this.rComponent.hook) this.rComponent.hook();
      this.saveStateToDb();
      //this.rComponent.setState({k: val});
    });
  },

  getState(k) {
    return this.rComponent.state[k];
  }

});

export default AppStoreSolo;
