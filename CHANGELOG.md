#  Spkz SDK
#  Release notes
## v1.5.0 ( 2021-12-13 )

### **feat (28):**
 - feat(cicd): Delete publish-package.json from spkz-sdk
 - feat(moon): add moon blockchain rpc
 - feat(walletConnect): add wallet connect for metamask
 - feat(network): add networks
 - feat(opensea): opensea api key
 - feat(poap): strategy poap
 - feat(cicd): Make spkz test run every 1H
 - feat(websocket): improve websocket stability
 - feat(signature): change signature to be readable on metamask
 - feat(strategy): is-exact-address improvement
 - feat(messages): on new message, increment count
 - feat(loungeowner): enriched Information
 - feat(message): reset message count of a section
 - feat(strategy): Improve amounts
 - feat(strategy): native crypto balance of
 - feat(messages): message count
 - feat(publish): update package publish
 - feat(redux): add redux
 - feat(messages): remove sectionId
 - feat(messages): limit in sdk to 50
 - feat(messages): get message from sdk
 - feat(messages): get not read messages
 - feat(messages): add fromTimestamp&#x2F;toTimestamp at message read
 - feat(lastViewed): rpc last viewed method
 - feat(strategy): add strategy opensea collection balanceOf
 - feat(erc1155): implement erc155 balance of
 - feat(erc721): balance of issued by strategy
 - feat(ens): manage symbol name fallback

### **fix (10):**
 - fix(lastViewed): return last viewed and previous
 - fix(walletConnect): add dependencies walletconnect
 - fix(messages): new message count
 - fix(updateStatus): fetch status is not undefined
 - fix(message): fix observable return nothing if no message in section
 - fix(redux): fix subscribe interop
 - fix(messages): remove typo
 - fix(logo): logo
 - fix(erc20): if erc20 symbol is bytes instead of string
 - fix(ownerOf): pass token id to check strategies

### **refactor (1):**
 - refactor(services): refacto services

### **test (1):**
 - test(refacto): refacto test

### **release (1):**
 - release(version): Increase next develop version of v1.4.0

## v1.4.0 ( 2021-10-21 )

### **fix (1):**
 - fix(erc721): details balance

### **release (1):**
 - release(version): Increase next develop version of v1.3.0

## v1.3.0 ( 2021-10-18 )

### **feat (1):**
 - feat(logo): erc20 custom logo

### **release (1):**
 - release(version): Increase next develop version of v1.2.0

## v1.2.1 ( 2021-10-18 )

### **fix (1):**
 - fix(cicd): Release

## v1.2.0 ( 2021-10-18 )

### **release (1):**
 - release(version): Increase next develop version of v1.1.0

## v1.1.0 ( 2021-10-18 )

### **feat (60):**
 - feat(verify): add rule to verify json
 - feat(jwt): add iat in jwt
 - feat(cache): improve cache
 - feat(nft): validate nft room
 - feat(abbreviate): format 0
 - feat(abbreviate): create helper for abbreviate and minBalance
 - feat(abbreviate): abbrevite token number erc20
 - feat(contract): set contract address 137
 - feat(rpc): rights are sent back by rpc
 - feat(token): add name
 - feat(link): create auth link
 - feat(assets): logo attribute for non erc-20 token
 - feat(erc20): readable sum
 - feat(metamask): add method to get metamask installation link
 - feat(dry): pass dry
 - feat(metamask): add signature v4
 - feat(typing): update user profile interface
 - feat(verified): rooms Id
 - feat(room): check room type
 - feat(localstorage): scope local storage keys
 - feat(cache): create cache for strategies
 - feat(cache): add cache on profile and user room
 - feat(verified): add verified in model
 - feat(typing): update roomSection typing
 - feat(typing): add logo in typing
 - feat(erc721): add erc721 enriched information
 - feat(strategies): get enriched informations
 - feat(profile): change typing userProfile
 - feat(rights): join room check join room
 - feat(uat): modify uat env
 - feat(rights): on join section check read and write
 - feat(cache): expose fetch room service to be able to set cache
 - feat(room): add cache on rooms
 - feat(websocket): handle multi websocket
 - feat(room): update recommended and feature rooms
 - feat(error): rpc return error with details
 - feat(websocket): add eventemitter for websocket
 - feat(roomDetails): change model
 - feat(env): create env service
 - feat(bouncer): change bouncer url in client
 - feat(rpc): rpc try catch properly errors
 - feat(room): expose fetchRoomService in utils
 - feat(env): for rooms
 - feat(room): fetch nft room
 - feat(bouncer): create method to fetch recommened rooms and featured rooms
 - feat(rpc): all params to string
 - feat(websocket): add websocket
 - feat(rpc): update room rpc
 - feat(bouncer): bouncer and user rpc
 - feat(roomOwner): add roomOwner strategy (+env)
 - feat(strategy): is-exact-adress
 - feat(erc721): manage erc721 balanceOf strategies
 - feat(strategy): get rpc from remote
 - feat(metamask): simple metamask implementation
 - feat(strategy): update strategy
 - feat(rpc): pass right parameters to read and write
 - feat(npm): expose in index
 - feat(proxy): method to check if authorizations jwt are still valid
 - feat(utils): create utils services
 - feat(init): init project

### **fix (30):**
 - fix(cache): inverse then and catch
 - fix(abbreviate): abbreviate small number
 - fix(dependecy): add dependency
 - fix(logotoken): logo token in json
 - fix(service): catch error at getroom
 - fix(logo): erc20 tolowercase for zapper picture
 - fix(strategy): check is exact address lowercase
 - fix(assets): add logo when needed
 - fix(metamask): fix unavailable method in mm-mobile
 - fix(profile): return empty object if no profile
 - fix(dependencies): add object-hash in publish-package.json
 - fix(profile): expose interface
 - fix(error): fix missing error
 - fix(cicd): package
 - fix(env): fix fetchRoomService as singleton
 - fix(join): fix join room
 - fix(env): fix env issues
 - fix(bouncer): fix bouncer user query model
 - fix(room): fix recommended room typinh
 - fix(room): fix recommended room typinh
 - fix(ci): Node 14
 - fix(rpc): rpc write message return a json
 - fix(models): rename models name
 - fix(websocket): fix websocket
 - fix(package): fix package lock
 - fix(websocket): add dependencies
 - fix(nodejs): some fixes to make it works on nodejs
 - fix(rpc): fix async web3provider
 - fix(ci): Dependencies
 - fix(ci): Persist dist

### **chore (6):**
 - chore(contract): add polygon smart contract address
 - chore(contract): update contract address
 - chore(node): change node url matic
 - chore(ci): Disable unpublish
 - chore(ci): Switch to spkz-sdk
 - chore(naming): change naming to match conventions

### **test (1):**
 - test(test): fix test

### **release (1):**
 - release(version): Increase next develop version of v1.0.0

## v1.0.1 ( 2021-09-21 )

### **fix (2):**
 - fix(ci): Persist dist
 - fix(ci): Release-ci

## v1.0.0 ( 2021-09-21 )

### **feat (4):**
 - feat(ci): add ci
 - feat(boilerplate): add test and lint
 - feat(readme): add how to change remote url
 - feat(express): install express and dependencies

### **chore (1):**
 - chore(archi): create folder architectures

