import type { Request, Response } from 'express';
import { user } from '@/services/v1/index.service';
import type { UserRequest } from '@/middlewares/auth.middleware';

export const createPostController = async (req: Request, res: Response) => {
    const { text, tags, image_link } = req.body;
    const id = (req as UserRequest).user?.id;

    if (!id || !text || !tags) {
        return res.status(400).json({ error: 'id, text, and tags are required' });
    }

    try {
        const newPost = await user.createPost(id, text, tags, image_link);
        return res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the post' });
    }
};

export const getPostController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const userPosts = await user.getPost(id);
        return res.status(200).json(userPosts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching user posts' });
    }
};

export const feedByFollowingController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const feed = await user.feedByFollowing(id);
        return res.status(200).json(feed);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching feed' });
    }
};


export const feedByTagsController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const feed = await user.feedByTags(id);
        return res.status(200).json(feed);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching feed' });
    }
};

export const getUserProfileController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const userProfile = await user.getUserProfile(id);
        return res.status(200).json({status : true, message : 'success', data : userProfile});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching user profile' });
    }
};

export const editUserInfoController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;
    const { username, name, bio, country } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const updatedUser = await user.editUserInfo(id, { username, name, bio, country });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while updating user info' });
    }
};


export const editUserTagsController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;
    const { tags } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const updatedUser = await user.editUserTags(id, tags);
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while updating user tags' });
    }
};

export const likePostController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;
    const { postId } = req.params;

    if (!id || !postId) {
        return res.status(400).json({ error: 'User ID and Post ID are required' });
    }

    try {
        const like = await user.likePost(id, parseInt(postId));
        return res.status(201).json(like);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while liking the post' });
    }
};

export const unlikePostController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;
    const { postId } = req.params;

    if (!id || !postId) {
        return res.status(400).json({ error: 'User ID and Post ID are required' });
    }

    try {
        await user.unlikePost(id, parseInt(postId));
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while unliking the post' });
    }
};


export const createReminderController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;
   const { title, content, deadline_time } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const reminder = await user.createReminder(id, title, content, new Date(deadline_time));
        return res.status(201).json(reminder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the reminder' });
    }
};

export const createDiaryController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const diary = await user.createDiary(id, title, content);
        return res.status(201).json(diary);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the diary' });
    }
};


// export const createNoteController = async (req: Request, res: Response) => {
//     const id = (req as UserRequest).user?.id;
//     const { title, content } = req.body;

//     if (!id) {
//         return res.status(400).json({ error: 'User ID is required' });
//     }

//     try {
//         const note = await user.createNote(id, title, content);
//         return res.status(201).json(note);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'An error occurred while creating the note' });
//     }
// };

export const createRandomQuoteController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const quote = await user.createRandomQuote(id, title, content);
        return res.status(201).json(quote);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the random quote' });
    }
};

export const getRemindersController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const reminders = await user.getReminders(id);
        return res.status(200).json(reminders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching reminders' });
    }
};

export const getDiaryController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const diary = await user.getDiary(id);
        return res.status(200).json(diary);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching diary' });
    }
};

// export const getNotesController = async (req: Request, res: Response) => {
//     const id = (req as UserRequest).user?.id;

//     if (!id) {
//         return res.status(400).json({ error: 'User ID is required' });
//     }

//     try {
//         const notes = await user.getNotes(id);
//         return res.status(200).json(notes);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'An error occurred while fetching notes' });
//     }
// };

export const getRandomQuotesController = async (req: Request, res: Response) => {
    const id = (req as UserRequest).user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const quotes = await user.getRandomQuotes(id);
        return res.status(200).json(quotes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching random quotes' });
    }
};