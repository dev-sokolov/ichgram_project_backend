import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

import User from "../db/User.js";
import Post from "../db/Post.js";
import Like from "../db/Like.js";
import Comment from "../db/Comment.js";
import Follow from "../db/Follow.js";
import Message from "../db/Message.js";
import Notification from "../db/Notification.js";
import cloudinary from "../utils/cloudinary.js";

import { addFollower } from "./follows.service.js";
import { toggleLike } from "./likes.service.js";
import { addComment } from "./comments.service.js";

import {
    DEMO_EMAIL,
    DEMO_PASSWORD,
    DEMO_USERNAME,
} from "../constants/demoAccount.js";

const avatarFor = (seed) =>
    `https://api.dicebear.com/9.x/lorelei/png?seed=${encodeURIComponent(seed)}&size=256`;

const image = (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const SHOWCASE = [
    {
        email: "maya.frames@ichgram.com",
        username: "maya.frames",
        fullName: "Maya Chen",
        description: "Photographer. Chasing late light and quiet streets.",
        link: "mayachen.photo",
        posts: [
            {
                seedKey: "showcase-maya-coast",
                description: "Last light on the Amalfi coast. Shot this while waiting for the ferry.",
                image: image("photo-1507525428034-b723cf961d3e"),
                daysAgo: 2,
            },
            {
                seedKey: "showcase-maya-street",
                description: "Lisbon tiles after the rain.",
                image: image("photo-1515886657613-9f3515b0c78f"),
                daysAgo: 6,
            },
        ],
    },
    {
        email: "lena.voyage@ichgram.com",
        username: "lena.voyage",
        fullName: "Lena Vogel",
        description: "Travel notes, slow mornings, and trails without a signal.",
        link: "lenavogel.com",
        posts: [
            {
                seedKey: "showcase-lena-mountains",
                description: "Trail coffee above the clouds.",
                image: image("photo-1469474968028-56623f02e42e"),
                daysAgo: 1,
            },
            {
                seedKey: "showcase-lena-city",
                description: "Getting lost is the itinerary.",
                image: image("photo-1467269204594-9661b134dd2b"),
                daysAgo: 4,
            },
        ],
    },
    {
        email: "marco.eats@ichgram.com",
        username: "marco.eats",
        fullName: "Marco Rossi",
        description: "Cook. Sunday sauces and the bar around the corner.",
        link: "marcorossi.kitchen",
        posts: [
            {
                seedKey: "showcase-marco-pasta",
                description: "Sunday ragù, four hours, no shortcuts.",
                image: image("photo-1473093295043-cdd812d0e601"),
                daysAgo: 3,
            },
            {
                seedKey: "showcase-marco-coffee",
                description: "The bar around the corner still knows my order.",
                image: image("photo-1495474472287-4d71bcdd2085"),
                daysAgo: 8,
            },
        ],
    },
    {
        email: "sofia.studio@ichgram.com",
        username: "sofia.studio",
        fullName: "Sofia Alvarez",
        description: "Designer. Layouts, concrete, and long shadows.",
        link: "sofia.studio",
        posts: [
            {
                seedKey: "showcase-sofia-desk",
                description: "Shipping the new layout tonight.",
                image: image("photo-1498050108023-c5249f4df085"),
                daysAgo: 5,
            },
            {
                seedKey: "showcase-sofia-architecture",
                description: "Concrete, glass, and a very long shadow.",
                image: image("photo-1487958449943-2429e8be8625"),
                daysAgo: 9,
            },
        ],
    },
];

const DEMO_PROFILE = {
    username: DEMO_USERNAME,
    fullName: "Alex Rivera",
    description: "Product designer exploring cities, coffee, and quiet morning light.",
    link: "ichgram.com/alex.demo",
    avatar: avatarFor("AlexRivera"),
    avatarId: "",
    verify: true,
    verificationCode: "",
    accountType: "demo",
};

const DEMO_POSTS = [
    {
        seedKey: "demo-hike",
        description: "Morning loop before the city wakes up.",
        image: image("photo-1551632811-561732d1e306"),
        daysAgo: 1,
    },
    {
        seedKey: "demo-cafe",
        description: "Working from a corner table. The new editor feels good.",
        image: image("photo-1445116572660-236099ec97a0"),
        daysAgo: 7,
    },
];

const atDaysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const createPost = async (authorId, data) => {
    const post = await Post.create({
        author: authorId,
        seedKey: data.seedKey,
        description: data.description,
        image: data.image,
        createdAt: atDaysAgo(data.daysAgo),
    });

    await User.findByIdAndUpdate(authorId, { $addToSet: { posts: post._id } });
    return post;
};

const say = async (senderId, recipientId, text) => {
    await Message.create({
        sender: senderId,
        recipient: String(recipientId),
        message: text,
    });
};

const ensureShowcaseUsers = async () => {
    const users = {};

    for (const person of SHOWCASE) {
        let user = await User.findOne({ email: person.email });

        if (user && user.accountType !== "showcase") {
            console.warn(`Showcase profile ${person.email} was skipped because that email is already registered.`);
            continue;
        }

        if (!user) {
            const password = await bcrypt.hash(randomBytes(24).toString("hex"), 10);
            user = await User.create({
                email: person.email,
                username: person.username,
                fullName: person.fullName,
                password,
                verify: true,
                verificationCode: "",
                accountType: "showcase",
                avatar: avatarFor(person.fullName),
                description: person.description,
                link: person.link,
            });
        }

        users[person.username] = user;
    }

    return users;
};

const ensureShowcaseGraph = async (users) => {
    const authors = Object.values(users);
    if (authors.length < SHOWCASE.length) return;

    const existingPosts = await Post.countDocuments({
        seedKey: { $regex: /^showcase-/ },
        author: { $in: authors.map((user) => user._id) },
    });

    if (existingPosts > 0) return;

    const posts = {};
    for (const person of SHOWCASE) {
        const author = users[person.username];
        for (const item of person.posts) {
            posts[item.seedKey] = await createPost(author._id, item);
        }
    }

    const follows = [
        ["maya.frames", "lena.voyage"],
        ["maya.frames", "marco.eats"],
        ["maya.frames", "sofia.studio"],
        ["lena.voyage", "maya.frames"],
        ["lena.voyage", "marco.eats"],
        ["marco.eats", "maya.frames"],
        ["marco.eats", "sofia.studio"],
        ["sofia.studio", "lena.voyage"],
        ["sofia.studio", "maya.frames"],
    ];

    for (const [follower, following] of follows) {
        await addFollower(users[follower]._id, users[following]._id);
    }

    const likes = [
        ["maya.frames", "showcase-lena-mountains"],
        ["maya.frames", "showcase-marco-pasta"],
        ["maya.frames", "showcase-sofia-desk"],
        ["lena.voyage", "showcase-maya-coast"],
        ["lena.voyage", "showcase-marco-coffee"],
        ["lena.voyage", "showcase-sofia-architecture"],
        ["marco.eats", "showcase-maya-street"],
        ["marco.eats", "showcase-lena-city"],
        ["marco.eats", "showcase-sofia-desk"],
        ["sofia.studio", "showcase-maya-coast"],
        ["sofia.studio", "showcase-lena-mountains"],
        ["sofia.studio", "showcase-marco-pasta"],
    ];

    for (const [username, seedKey] of likes) {
        await toggleLike(users[username]._id, posts[seedKey]._id);
    }

    await addComment(users["lena.voyage"]._id, posts["showcase-maya-coast"]._id, {
        text: "The light here is unreal. What lens did you use?",
    });
    await addComment(users["marco.eats"]._id, posts["showcase-lena-mountains"]._id, {
        text: "I need this view with a warm cup.",
    });
    await addComment(users["sofia.studio"]._id, posts["showcase-marco-pasta"]._id, {
        text: "Four hours well spent.",
    });
    await addComment(users["maya.frames"]._id, posts["showcase-sofia-architecture"]._id, {
        text: "This frame is so clean.",
    });

    await say(users["lena.voyage"]._id, users["maya.frames"]._id, "Are you still in Lisbon?");
    await say(users["maya.frames"]._id, users["lena.voyage"]._id, "Until Sunday. The light has been kind.");
    await say(users["lena.voyage"]._id, users["maya.frames"]._id, "Send me the ferry frame when it's graded.");
    await say(users["maya.frames"]._id, users["lena.voyage"]._id, "Already in your folder.");

    await say(users["marco.eats"]._id, users["maya.frames"]._id, "Come by the kitchen after the shoot.");
    await say(users["maya.frames"]._id, users["marco.eats"]._id, "Only if the ragù is ready.");
    await say(users["marco.eats"]._id, users["maya.frames"]._id, "It has been ready for an hour.");
};

export const ensureDemoUser = async () => {
    let user = await User.findOne({ email: DEMO_EMAIL });

    if (user && user.accountType !== "demo") {
        console.warn(`Demo login was not created because ${DEMO_EMAIL} already belongs to another account.`);
        return null;
    }

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    if (!user) {
        user = await User.create({
            email: DEMO_EMAIL,
            password: passwordHash,
            ...DEMO_PROFILE,
        });
        return user;
    }

    const passwordMatches = await bcrypt.compare(DEMO_PASSWORD, user.password);
    if (!passwordMatches) {
        user.password = passwordHash;
        await user.save();
    }

    return user;
};

const destroyCloudinaryAsset = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.warn("Demo asset cleanup failed:", error.message);
    }
};

const resetDemoWorkspaceNow = async (demoId) => {
    const users = await ensureShowcaseUsers();
    await ensureShowcaseGraph(users);

    const demoPosts = await Post.find({ author: demoId });
    const postIds = demoPosts.map((post) => post._id);
    const demo = await User.findById(demoId);

    await Like.deleteMany({ $or: [{ user: demoId }, { post: { $in: postIds } }] });
    await Comment.deleteMany({ $or: [{ user: demoId }, { post: { $in: postIds } }] });
    await Notification.deleteMany({
        $or: [{ sender: demoId }, { recipient: demoId }, { post: { $in: postIds } }],
    });
    await Follow.deleteMany({ $or: [{ follower: demoId }, { following: demoId }] });
    await Message.deleteMany({
        $or: [{ sender: demoId }, { recipient: { $in: [String(demoId), demoId] } }],
    });

    for (const post of demoPosts) {
        await destroyCloudinaryAsset(post.imageId);
    }
    await destroyCloudinaryAsset(demo?.avatarId);

    await Post.deleteMany({ author: demoId });
    await User.updateMany(
        {},
        { $pull: { followers: demoId, followings: demoId, posts: { $in: postIds } } }
    );

    await User.updateOne(
        { _id: demoId },
        {
            $set: {
                ...DEMO_PROFILE,
                posts: [],
                followers: [],
                followings: [],
            },
        }
    );

    const posts = {};
    for (const item of DEMO_POSTS) {
        posts[item.seedKey] = await createPost(demoId, item);
    }

    const maya = users["maya.frames"];
    const lena = users["lena.voyage"];
    const marco = users["marco.eats"];

    if (maya) await addFollower(demoId, maya._id);
    if (lena) await addFollower(demoId, lena._id);
    if (lena) await addFollower(lena._id, demoId);

    const marcoPasta = await Post.findOne({ seedKey: "showcase-marco-pasta" });
    const lenaMountains = await Post.findOne({ seedKey: "showcase-lena-mountains" });

    if (marcoPasta) await toggleLike(demoId, marcoPasta._id);
    if (lenaMountains) {
        await addComment(demoId, lenaMountains._id, {
            text: "Saving this trail for the next trip.",
        });
    }

    if (maya && posts["demo-hike"]) {
        await toggleLike(maya._id, posts["demo-hike"]._id);
        await addComment(maya._id, posts["demo-hike"]._id, {
            text: "You always find the quiet hours.",
        });
        await say(maya._id, demoId, "Did the morning loop survive the rain?");
        await say(demoId, maya._id, "Mostly. I shot the last ten minutes.");
        await say(maya._id, demoId, "Send it over, I want to see the color.");
        await say(demoId, maya._id, "Posted it just now.");
    }
};

let resetQueue = Promise.resolve();

export const resetDemoWorkspace = (demoId) => {
    const job = resetQueue.then(() => resetDemoWorkspaceNow(demoId));
    resetQueue = job.then(() => undefined, () => undefined);
    return job;
};

export const ensureDemoContent = async () => {
    const users = await ensureShowcaseUsers();
    await ensureShowcaseGraph(users);

    const demo = await ensureDemoUser();
    if (!demo) return;

    const demoPosts = await Post.countDocuments({
        author: demo._id,
        seedKey: { $regex: /^demo-/ },
    });

    if (demoPosts === 0) {
        await resetDemoWorkspace(demo._id);
    }

    console.log("Demo content is ready");
};

export const isDemoAccount = (user) =>
    Boolean(user && user.email === DEMO_EMAIL && user.accountType === "demo");
