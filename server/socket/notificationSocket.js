let notificationNamespace;

export const initNotificationSocket = (io) => {
  notificationNamespace = io.of('/notifications');

  notificationNamespace.on('connection', (socket) => {
    console.log('Socket connected to notifications:', socket.id);

    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`Socket ${socket.id} joined notification room: ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from notifications');
    });
  });

  return notificationNamespace;
};

export const sendRealTimeNotification = (userId, notification) => {
  if (notificationNamespace) {
    if (userId === 'ALL') {
      notificationNamespace.emit('notification', notification);
    } else {
      notificationNamespace.to(userId.toString()).emit('notification', notification);
    }
  }
};
