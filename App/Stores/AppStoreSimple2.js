
import React, { Component } from 'react';
const Ractive = require('../Lib/rn-ractive');

//const Ractive2 = require('../Lib/ractive2');
const _ = require('lodash');
var Chance = require('chance');
const chance = new Chance;
import {AsyncStorage} from 'react-native';
import Immutable from 'immutable';

class Compo extends Component {
  constructor(props) {
    super(props);
  }

  setStore = (store) => { this.Store = store; }

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

    this.Store.fire('RN:setupState');
  }

  resetState(obj) {
    if(obj === undefined) obj = this.initState;
    this.setupState(obj);
  }

  componentWillMount() {
    this.Store.mountComponent(this);
    this.setupState(this.initState);

    this.Store.fire('RN:componentWillMount');

  }

  shouldComponentUpdate(nextProps, nextState) {
    var olds = this.Store.get('_state$'), news = Immutable.fromJS(nextState);
    var go = !Immutable.is(olds, news);
    console.log('shouldComponentUpdate?', go, 'theSame?', olds === news, olds, news);
    return go;
  }

  componentDidMount() {
    this.Store.fire('RN:componentDidMount');
  }
  componentWillUnMount() {
    this.Store.unmountComponent();
    this.Store.fire('RN:componentWillUnMount');
  }

  goToView(id, comp) {

    const { navigate } = this.props.navigation;

    if(comp !== undefined) return navigate(id, {Component: comp, showHeader: true});

    return navigate(id);

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

const AppStoreSimple = Ractive.extend({
  data: function() {
   return {
      _state$: null,
      _state: {}
    }

  },
  rComponent: null,
  BaseComponent: Compo,
  chance: chance,
  cacheToDb: false,
  persistToDb: false,
  onconfig: function(opts) {
    console.log('AppStoreSimple', this.namespace);

    this.initDebug();


    if(this.persistToDb !== false) {

      if(this.persistToDb === true) {
        this.setDbKey = '_local/appstore_' + chance.hash({length: 10});
      } else {
        this.setDbKey = '_local/appstore_' + this.persistToDb;
      }
      //alert(this.setDbKey);
      AsyncStorage.getItem(this.setDbKey, (r) => {
        console.log("**** Saved State is in the JSON", r);
      });
    }
  },

  clearDb: function() {
    if(this.setDbKey === undefined) return;

    return AsyncStorage.removeItem(this.setDbKey);
  },

  saveStateToDb: function(cb) {

    if(this.setDbKey === undefined) return;

    var idid = this.setDbKey;

    if(cb === undefined) {
      cb = function(res){

      };
    }
    var data = this.get('_state');

    console.log(">>> saveStateToDb:" + idid, data, this.get(''));
    dataMerge = {};
    dataMerge.state = data;
    return AsyncStorage.mergeItem(idid, JSON.stringify(dataMerge))
      .then(function(res){
        cb(res);
        if(global.__DEV__) {
          console.log("**** saveStateToDb:" + idid, res);
        }
      })
      .catch(function(e){
      console.log('**** saveStateToDb > UNABLE TO SAVE', e);
    });
  },

  getStateFromDb: function(cb) {
    if(this.setDbKey === undefined) return null;

    var idid = this.setDbKey;

    if(cb === undefined) {
      cb = function(res){
        if(global.__DEV__) {
          console.log("getStateFromDb:" + idid, res);
        }
      };
    }

    return AsyncStorage.getItem(idid)
      .then(function(res){
        cb(res);

      }).catch(function(err) {

        console.log("ERROR DB CACHE", idid, err);
        cb(null);
      });

  },

  initDebug: function() {
    if(global.__DEV__) {
      this.observe('*.*.*.*', _.debounce(function(o,n,keypath){
        if(this.setDbKey) k = 'DBkey is ' + this.setDbKey;
        var data = this.get('');
        console.log("[DEBUG] AppStoreSimple Global Listener "+k, {data: data, o: o, n: n, keypath: keypath, DBkey: k, args: arguments});

      }));
    }
  },



  mountComponent: function(c) {
    this.rComponent = c;
  },

  unmountComponent: function() {


    this.rComponent = null;
    this.stateObserver.cancel();

  },

  resetStateAndDb: function() {
    var base = this.get('_state_init');
    this.set('_state', base);
    
    setTimeout(()=>{
      this.clearDb().then(() => {
      
        this.prepareComponentState(true);
      });
        
      }, 100);
    
  },

  setState: function(obj, mount, funcs) {

    if(mount) {
      console.log("***** setState MOUNT", obj, funcs);
      this.set('_state_init', obj);
      if(funcs != undefined) {
        this.set('_state_cb', funcs);
      }

      var dbstate = this.getStateFromDb((dstateStr) => {
        //console.log("dbstate", dstateStr);
        var dstate = JSON.parse(dstateStr);
        if(dstate != null) {
          this.set('_state', dstate.state);
        }
        this.prepareComponentState();
      });
    } else {
      this.prepareComponentState();
    }

    //console.log("X02", obj, mount, funcs);

  },

  prepareComponentState: function(reset) {
    if(this.rComponent !== null) {

      hasExist = this.get('_state');
      if(hasExist) {
        obj = hasExist;
        //obj._x = 1;
        //obj.__e = "hasExist";
        this.rComponent.setState(obj);
      } else {
        var obj = this.get('_state_init');
        //obj._x = 2;
        //obj.__e = "hasExist:false";
        //console.log("X2", obj);
        this.set('_state', obj);

      }

      if(reset === undefined) this.syncObserverState();
      if(this.rComponent.hook) this.rComponent.hook();

      this.syncImmutableState();
      
    }

  },

  syncObserverState: function() {


    this.stateObserver = this.observe('_state', _.debounce(function(n, o, keypath) {
      this.syncImmutableState();
      console.log("AppStoreSolo observing ", keypath);
      //var kk = keypath.split('.');
      //var val = this.get(kk[0] + '.' + kk[1]);
      //var k = kk[1];

      console.log("_state changes", {n:n, o:o, keypath:keypath, keypath2: Ractive.splitKeypath(keypath), args: arguments});
      if(this.rComponent.hook) this.rComponent.hook();
      this.saveStateToDb();
      //this.rComponent.setState({k: val});
    }));
  },

  syncImmutableState: function() {
    var s = this.get('_state');
    this.set('_state$', Immutable.fromJS(s));
  },

  //_debounce: _.debounce.bind(this)

  getState(k) {
    return this.rComponent.state[k];
  }

});

export default AppStoreSimple;
