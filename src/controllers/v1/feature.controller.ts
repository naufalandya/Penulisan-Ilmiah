import type { Request, Response } from 'express';
import { user } from '@/services/v1/index.service';
import type { UserRequest } from '@/middlewares/auth.middleware';
import path from 'path'
import { imagekit } from '@/config/imagekit.config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export interface CustomRequest extends Request {
    file?: Express.Multer.File;
}

export const createPostController = async (req: Request, res: Response) => {
    const { text, tags, category } = req.body;
    const id = (req as any).user?.id;
    const image_link = req.file;

    console.log(image_link)
  
    if (!id) {
      return res.status(400).json({ error: 'Invalid token' });
    }
  
    if (!text || !tags || !category) {
      return res.status(400).json({ error: 'Text, category, and tags are required' });
    }
  
    if (category !== 'LEARN' && category !== 'SPEECH') {
      return res.status(400).json({ error: 'Category must be "LEARN" or "SPEECH"' });
    }
  
    let fileUrl = 'aa';
  
    if (image_link) {
      try {
        const fileBase64 = image_link.buffer.toString("base64");
        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(image_link.originalname),
          file: fileBase64,
        });
        console.log('wow', response)
  
        fileUrl = response.url;
      } catch (error) {
        console.log('Error uploading file to ImageKit:', error);
        return res.status(500).json({ error: 'An error occurred while uploading the file' });
      }
    }

    console.log(fileUrl)
  
    try {
      const newPost = await user.createPost(id, text, tags, fileUrl, category);
      return res.status(201).json(newPost);
    } catch (error) {
      console.log('Error creating post:', error);
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

export const getRandomSpeechPosts = async (req: Request, res: Response) => {
    const { page = 1 } = req.query;
    const limit = 12;
  
    try {
      const totalCount = await prisma.posts.count({
        where: { category: 'SPEECH' },
      });
  
      const offset = (Number(page) - 1) * limit;
  
      // Fetch posts with include relations
      const posts = await prisma.posts.findMany({
        where: { category: 'SPEECH' },
        include: {
          image_link_post: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });
  
      // Shuffle posts array for random order
      shuffleArray(posts);
  
      // Paginate and limit results
      const paginatedPosts = posts.slice(offset, offset + limit);
  
      const totalPages = Math.ceil(totalCount / limit);
  
      res.status(200).json({
        posts: paginatedPosts,
        totalCount,
        page: Number(page),
        totalPages,
        itemsPerPage: limit,
      });
    } catch (error) {
      console.error('Error fetching speech posts:', error);
      res.status(500).json({ error: 'Failed to fetch speech posts. Please try again later.' });
    }
  };
  
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  export const getRandomLearnPosts = async (req: Request, res: Response) => {
    const { page = 1 } = req.query;
    const limit = 12;
  
    try {
      const totalCount = await prisma.posts.count({
        where: { category: 'SPEECH' },
      });
  
      const offset = (Number(page) - 1) * limit;
  
      // Fetch posts with include relations
      const posts = await prisma.posts.findMany({
        where: { category: 'SPEECH' },
        include: {
          image_link_post: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });
  
      // Shuffle posts array for random order
      shuffleArray(posts);
  
      // Paginate and limit results
      const paginatedPosts = posts.slice(offset, offset + limit);
  
      const totalPages = Math.ceil(totalCount / limit);
  
      res.status(200).json({
        posts: paginatedPosts,
        totalCount,
        page: Number(page),
        totalPages,
        itemsPerPage: limit,
      });
    } catch (error) {
      console.error('Error fetching speech posts:', error);
      res.status(500).json({ error: 'Failed to fetch speech posts. Please try again later.' });
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