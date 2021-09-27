export const JSONRPCMethods = {

  bouncer: {
    users: {
      getMyProfile: 'bouncer.users.getMyProfile',
      updateMyProfile: 'bouncer.users.updateMyProfile'
    },
    rooms: {
      join: 'bouncer.rooms.join',
      getUserRooms: 'boucer.rooms.getUserRooms',
      getPendingRooms: 'bouncer.rooms.getPendingRooms'
    }
  },
  room: {
    message: {
      write: 'room.message.write',
      read: 'room.message.read'
    },
    section: {
      users: 'room.section.getUsers',
      userUpdate: 'room.section.userUpdate' // create profile or update + join section + join room
    }
  }
};
