import mongoose from "mongoose";

export const getPostAggregationPipeline = (postId) => {
  const pipeline = [];

  if (postId) {
    pipeline.push({
      $match: { _id: new mongoose.Types.ObjectId(postId) },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        likedUserIds: {
          $map: {
            input: "$likes",
            as: "like",
            in: "$$like.user",
          },
        },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
      },
    },
    {
      $project: {
        description: 1,
        image: 1,
        createdAt: 1,
        likesCount: 1,
        likedUserIds: 1,
        commentsCount: 1,
        "author._id": 1,
        "author.username": 1,
        "author.avatar": 1,
      },
    }
  );

  return pipeline;
};