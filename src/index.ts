import { SPKZJSONRPC } from './services/JSONRPCServer';
import { clearWallet, createOrRetrieveWallet } from './services/walletBrowserCreator/walletCreator';
import { SPKZ } from './services/wallet';

export { SPKZJSONRPC, createOrRetrieveWallet, clearWallet, SPKZ };

/* RPC methods:
const payload=
{
    "jsonrpc": "2.0",
    "method": "group.readAllMessages",
    "params": {
    "roomId": "8200974",
        "section": "chat",
        "sub":"",
    "authentification": {
        "hash": "0xe2d3ff92cb1427e3e68b9a2a1bea7aac70ca47afe2be63405284f417a432eca2",
            "signature": "0x9fe5c7b068dc98449f98fc315e3b87ceecd121faf0cd2258bd7592435d63943d78aa46f14c2ed584eb3f7f53033f5412db325e2618823d03e7a8526f2918f3a01c",
            "room": "{\"domain\":{\"chainId\":137,\"name\":\"Spkz beta 🧪\",\"version\":\"1\"},\"message\":{\"why\":\"You need to sign this payload to access the spkz messages.\\n This signature is valid for 24 hour\\n\\n\",\"timestamp\":\"2021-06-21T09:02:35.105Z\",\"duration\":"1 day\",\"emitter\":\"0xefea1123d4ed5d342f429049aa014bf628d10108\", \"localpubkey\":\"0x80101d826fb410aa940924f243d5de4d3211aefe\"},\"types\":{\"EIP712Domain\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"version\",\"type\":\"string\"},{\"name\":\"chainId\",\"type\":\"uint256\"}]},\"primaryType\":\"EIP712Domain\"}"
    }
},
    "id": "39722672"
}
const messagingWallet = await createOrRetrieveWallet(); // ox2
// createWallet
// getLocalWallet

// wallet.address ???

await messagingWallet.addFromMetamask(); // ox1 20eth
await messagingWallet.addFromMetamask(); // ox1 30 eth

await messagingWallet.addFromCustomWallet.getPayloadToSign; // ox1 30 eth
await messagingWallet.addFromCustomWallet.add(); // ox1 30 eth

await messageWallet.room(22).joinRoom(); // ok or throw error.
// declare comme membre de la room
// return {url: 'https://spkz.com/room/tokenId', data: ROOMNFT, owner}

// list room I have access
await messageWallet.rooms.getRooms(); // Array<{url: 'https://spkz.com/room/tokenId', data: ROOMNFT, owner}>
await messageWallet.rooms.canJoin([tokenIds]); // Array<{url: 'https://spkz.com/room/tokenId', data: ROOMNFT, owner}>
await messageWallet.rooms.createRoom([tokenIds]); // Array<{url: 'https://spkz.com/room/tokenId', data: ROOMNFT, owner}>

await messageWallet.room(22).leaveRoom(tokenId); // ok or throw error.

// I have joined a room 1233
await messageWallet.room(22).getMessages();
await messageWallet.room(22).sendMessage();
await messageWallet.room(22).canJoin();
await messageWallet.room(22).getMembers();

await messageWallet.profile.set(); // ok or throw error.
await messageWallet.profile.get(); // ok or throw error.
*/
