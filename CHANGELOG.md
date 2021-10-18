#  Spkz SDK
#  Release notes
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

