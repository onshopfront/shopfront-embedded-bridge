# Shopfront Embedded Bridge

This is the bridge library to use with the Shopfront Embedded API.

For more information, check out the documentation on the 
[Shopfront developer website](https://developer.onshopfront.com/documentation/Embedded/Introduction).

## Frame vs JavaScript Communicator

The embedded bridge supports two ways of use, one is through an embedded frame (default) and the second is direct 
JavaScript communication where the application is loaded into the main thread, this form of communication is only
available to certain apps that have contacted Shopfront first.

### Frame Communicator

The setup of the frame is the default way of use, and nothing special is required from applications that use it.

### JavaScript Communicator

Shopfront expects an ES Module which exports the following three functions:

- `execute`
- `registerSendMessage`
- `onReceiveMessage`

The application exposes methods allowing your application to work directly with this, all you need to do is
export them:

```javascript
import { Bridge } from "@shopfront/bridge";

const application = Bridge.createApplication({
    id          : "<< my client id >>",
    communicator: "javascript",
});

export const execute = application.communicator.execute;
export const registerSendMessage = application.communicator.registerSendMessage;
export const onReceiveMessage = application.communicator.onReceiveMessage;
```

Alternatively, you can export the application as the default item and Shopfront will automatically infer the functions 
from it. When using this method, it can be the only item exported from the module.

```javascript
import { Bridge } from "@shopfront/bridge";

const application = Bridge.createApplication({
    id          : "<< my client id >>",
    communicator: "javascript",
});

export default application;
```
