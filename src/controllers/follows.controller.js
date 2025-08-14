import * as followsService from "../services/follows.service.js";

export const addFollowerController = async (req, res) => {
    const followerId = req.user._id;
    const { followingId } = req.params;

    const result = await followsService.addFollower(followerId, followingId);

    res.status(201).json(result);
}

export const unfollowByIdController = async (req, res) => {
    const followerId = req.user._id;
    const { followingId } = req.params;
    const result = await followsService.unfollowById(followerId, followingId);

    res.json(result);
}

export const getFollowersController = async (req, res) => {
    const { userId } = req.params;
    const result = await followsService.getFollowers(userId);

    res.json(result);
}

export const getFollowingController = async (req, res) => {
    const { userId } = req.params;
    const result = await followsService.getFollowings(userId);

    res.json(result);
}
