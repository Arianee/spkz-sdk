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
      updateProfile: 'room.section.updateProfile',
      users: 'room.section.getUsers',
      join: 'room.section.join'
    }
  }
};
