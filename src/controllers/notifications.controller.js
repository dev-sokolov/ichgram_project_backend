import * as notificationsService from "../services/notifications.service.js"

export const getNotificationsController = async(req, res) => {
    const userId = req.user._id;
    const result = await notificationsService.getNotifications(userId);
    
    res.json(result);
}