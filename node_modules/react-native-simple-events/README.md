# React Native - Events
## Overview
  While not technically only a React Native Package, it was built specifically for the need to have a very simple & lightweight method to register various parts of our React Native Application for callbacks when events were fired.  

## Simplicity
  While the package is simple, it doesn't have protection built-in so it should only be used for the most basic of needs.
  
## API
    
0.  **on(eventID, listenerID, callback)**: When you want to listen for an event you can register a callback using "on" and passing the event you want to listen to, an ID for removing in the future, and a callback function.
0.  **trigger(eventID, eventData)**: Trigger an event using the "trigger" function.
0.  **remove(eventID, listenerID)**: Remove an ID on the given event so it won't receive callbacks anymore.
0.  **removeAll(eventID)**: Remove all registered callbacks on a given eventID.

## Example

### First Component (Listener)

```js
var Events = require('react-native-simple-events');
var React = require('react-native');

let {
  Text
} = React;

var ListenComponent = React.createClass({

    componentDidMount() { Events.on('Ready', 'myID', this.onReady) },
    
    componentWillUnmount() { Events.rm('Ready', 'myID') },
    
    onReady: (data) => { console.log('--- onReady Triggered ---'); console.log(data) },
    
    render() { return <Text> Listener Component 1 </Text> },

});

module.exports = ListenComponent;
```

### Second Component (Trigger)

```js
var Events = require('react-native-simple-events');
var React = require('react-native');
let {
  TouchableOpacity
} = React;
var TriggerComponent = React.createClass({

    triggerEvent() { Events.trigger('Ready', {my: 'data'}) },
    
    render() {
        return <TouchableOpacity onPress={() => this.triggerEvent()}> Press Me To Emit Event! </TouchableOpacity>;
    },

});

module.exports = TriggerComponent;
```

## Source

Since the source is so short, I figured I would add it here for your own review

```js
var Callbacks = {};

var Events = {
    on: (at, id, callback) => { return Events.listen(at, id, callback) },
    listen: (at, id, callback) => {
        if (at == '') { return false }
        if (at in Callbacks) {
            Callbacks[at][id] = callback;
        } else {
            Callbacks[at] = {};
            Callbacks[at][id] = callback;
        }
        return id;
    },
    t: (at, data) => { return Events.trigger(at, data) },
    trigger: (at, data) => {
        data = data || ''; var obj = Callbacks[at];
        for (var prop in obj) { if (obj.hasOwnProperty(prop)) { obj[prop](data) } }
    },
    rm: (at, id) => { return Events.remove(at, id) },
    remove: (at, id) => { delete Callbacks[at][id] },
    removeAll: (at) => { delete Callbacks[at] }
};

module.exports = Events;
```
