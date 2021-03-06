export const ActionTypes = {
  USERS: {
    addOrUpdateUser: 'USERS.addUser'
  },
  SECTION: {
    addMembers: 'SECTION.addMembers'
  },
  ROOM: {
    addOrUpdateRooms: 'ROOM.addOrUpdateRooms',
    setVerifiedRooms: 'ROOM.setVerifiedRooms',
    setFeaturedRooms: 'ROOM.setFeaturedRooms'
  },
  MESSAGE: {
    paginationStatus: 'ROOM.paginationStatus',
    addMessage: 'ROOM.addMessage',
    toggleWS: 'ROOM.WS',
    toggleInitialFetch: 'ROOM.initialFetch'
  },
  NOTIFICATION: {
    newMessageCounts: 'NOTIFICATION.newMessageCount',
    updateFetchStatus: 'NOTIFICATION.updateFetchStatus',
    updateNewMessageCountForASection: 'NOTIFICATION.updateMessageCountForOneSection',
    incrementNewMessageCountForASection: 'NOTIFICATION.incrementMessageCountForOneSection'
  },
  FetchStatus: {
    updateFetchStatus: 'FetchStatus.updateFetchStatus'
  },
  HELLOWORLD: {
    ADDNAME: 'helloWorldReducer.addName'
  },
  USERROOMS: {
    addOrUpdateUserRooms: 'USERROOMS.addOrUpdateUserRooms'
  }
};
