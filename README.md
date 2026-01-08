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

Shopfront expects an ES Module which exports either the application or the following three functions:

- `execute`
- `registerSendMessage`
- `onReceiveMessage`

Exporting the application is the easiest and recommended option, make sure it's exported as default:

```javascript
import { Bridge } from "@shopfront/bridge";

const application = Bridge.createApplication({
    id          : "<< my client id >>",
    communicator: "javascript",
});

export default application;
```
If you're wanting to do something custom or don't want to expose the application to Shopfront, then you can instead
expose the methods individually from the application:

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

> [!NOTE]
> When exporting the methods individually, you may receive the TypeScript error "TS2742: The inferred type of 
> onReceiveMessage cannot be named without a reference to Bridge". You can resolve this by specifying the type 
> directly:
> ```javascript
> export const onReceiveMessage: typeof application.communicator.onReceiveMessage = application.communicator.onReceiveMessage;
> ```
