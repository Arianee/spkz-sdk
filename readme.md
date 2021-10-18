# SPKZ SDK

## Get started

```bash
npm i @arianee/spkz-sdk -S
```

In your index.ts or js.
```javascript

// It will create or retrieve wallet from local storage if there is one
const proxyWallet=createOrRetrieveWallet();

// For testing purpose you can use this method
await proxyWallet.wallets.addWalletFromPrivateKey('your very unique private key');
```

Now you have proxy wallet that allow you to send message on behalf of your blockchain wallet.

```javascript

await proxyWallet.room.sendMessage({
        roomId:0,
        sectionId:'chat',
        messageContent:{
        title:'Hello world'
        }
    });

```

Boom! You have just sent your very first message. Behind the curtain, SPKZ-SDK add JWT authorizations and others cryptographic elements to be sure that no one can send a message on your behalf!


## Environment
Env is set to prod by default.

```javascript
process.env.spkzEnv='dev'
```
or 
```javascript
window.spkzEnv='dev';
```
