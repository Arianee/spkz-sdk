export const ActionTypes = {
  USERS: {
    addOrUpdateUser: 'USERS.addUser'
  },
  ROOM: {
    addOrUpdateRoom: 'ROOM.addOrUpdateRoom'
  },
  MESSAGE: {
    paginationStatus: 'ROOM.paginationStatus',
    addMessage: 'ROOM.addMessage',
    toggleWS: 'ROOM.WS',
    toggleInitialFetch: 'ROOM.initialFetch'
  },
  NOTIFICATION: {
    newMessageCounts: 'NOTIFICATION.newMessageCount'
  },
  HELLOWORLD: {
    ADDNAME: 'helloWorldReducer.addName'
  }
};
