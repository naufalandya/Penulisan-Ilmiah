import { prisma} from "@/config/db.config";
import { CATEGORY } from "@prisma/client";

export const createPost = async function (
    id: string,
    text: string,
    tags: string, 
    image_link: string | undefined,
    category: CATEGORY
  ) {
    try {
      const createdPost = await prisma.posts.create({
        data: {
          user_id: id,
          text: text,
          tags: {
            set: JSON.parse(tags) 
          },
          category: category
        }
      });
  
      let createdImageLink = null;
      if (image_link) {
        createdImageLink = await prisma.image_link_post.create({
          data: {
            post_id: createdPost.id,
            image_link: image_link
          }
        });
      }
  
      return { ...createdPost, createdImageLink };
  
    } catch (err) {
      throw err;
    }
  };

export const getPost = async function(id: string) {
    try {
        const posts = await prisma.posts.findMany({
            where: {
                user_id: id,
            },
            include: {
                image_link_post: true,
                _count: {
                    select: {
                        likes: true,
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return posts.map(post => ({
            ...post,
            totalLikes: post._count.likes,
        }));
    } catch (err) {
        throw err;
    }
}


export const feedByFollowing = async function(userId: string) {
    try {
        const feed = await prisma.posts.findMany({
            where: {
                users: {
                    follows_follows_followerIdTousers: {
                        some: {
                            followingId: userId
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                text: true,
                created_at: true,
                updated_at: true,
                tags: true,
                user_id: true,
                _count: {
                    select: {
                        likes: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    }
                },
                image_link_post: {
                    select: {
                        id: true,
                        image_link: true,
                    }
                }
            }
        });

        return feed.map(post => ({
            ...post,
            totalLikes: post._count.likes,
        }));
    } catch (err) {
        throw err;
    }
}


export const feedByTags = async function(userId: string) {
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { tags: true }
        });

        if (!user || !user.tags.length) {
            return [];
        }

        const feed = await prisma.posts.findMany({
            where: {
                OR: user.tags.map(tag => ({
                    tags: {
                        has: tag
                    }
                }))
            },
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                text: true,
                created_at: true,
                updated_at: true,
                tags: true,
                user_id: true,
                _count: {
                    select: {
                        likes: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        username: true,
                        name: true
                    }
                },
                image_link_post: {
                    select: {
                        id: true,
                        image_link: true
                    }
                }
            }
        });

        return feed.map(post => ({
            ...post,
            totalLikes: post._count.likes,
        }));
    } catch (err) {
        throw err;
    }
}


export const getUserProfile = async function(userId: string) {
    try {
        const userProfile = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                meta_profile_link: true,
                isVerified: true,
                country: true,
                isPublic: true,
                role: true,
                bio: true,
                tags: true,
                created_at: true,
                updated_at: true,
                follows_follows_followerIdTousers: {
                    select: {
                        users_follows_followingIdTousers: {
                            select: {
                                username: true,
                            }
                        }
                    }
                },
                follows_follows_followingIdTousers: {
                    select: {
                        users_follows_followerIdTousers: {
                            select: {
                                username: true,
                            }
                        }
                    }
                }
            }
        });

        console.log(userProfile)

        return {
            ...userProfile,
            followers: userProfile?.follows_follows_followingIdTousers.map(follow => follow.users_follows_followerIdTousers),
            following: userProfile?.follows_follows_followerIdTousers.map(follow => follow.users_follows_followingIdTousers),
        };
    } catch (err) {
        throw err;
    }
}


export const editUserInfo = async function(userId: string, { username, name, bio, country }: { username?: string, name?: string, bio?: string, country?: string }) {
    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                username,
                name,
                bio,
                country
            }
        });
        return updatedUser;
    } catch (err) {
        throw err;
    }
}

export const editUserTags = async function(userId: string, tags: string[]) {
    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                tags
            }
        });
        return updatedUser;
    } catch (err) {
        throw err;
    }
}

export const likePost = async function(userId: string, postId: number) {
    try {
        const like = await prisma.likes.create({
            data: {
                user_id: userId,
                post_id: postId
            }
        });
        return like;
    } catch (err) {
        throw err;
    }
}

export const unlikePost = async function(userId: string, postId: number) {
    try {
        await prisma.likes.deleteMany({
            where: {
                user_id: userId,
                post_id: postId
            }
        });
    } catch (err) {
        throw err;
    }
}


// Activity

export const createReminder = async function(userId: string, title: string, content: string, deadline_time: Date) {
    try {
        const reminder = await prisma.reminders.create({
            data: {
                title,
                content,
                deadline_time,
                user_id: userId
            }
        });
        return reminder;
    } catch (err) {
        throw err;
    }
}

export const createDiary = async function(userId: string, title: string, content: string) {
    try {
        const diary = await prisma.diary.create({
            data: {
                title,
                content,
                user_id: userId
            }
        });
        return diary;
    } catch (err) {
        throw err;
    }
}

// export const createNote = async function(userId: string, title: string, content: string) {
//     try {
//         const note = await prisma.note.create({
//             data: {
//                 title,
//                 content,
//                 user_id: userId
//             }
//         });
//         return note;
//     } catch (err) {
//         throw err;
//     }
// }

export const createRandomQuote = async function(userId: string, title: string, content: string) {
    try {
        const quote = await prisma.random_quotes.create({
            data: {
                title,
                content,
                user_id: userId
            }
        });
        return quote;
    } catch (err) {
        throw err;
    }
}

export const getReminders = async function(userId: string) {
    try {
        const reminders = await prisma.reminders.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return reminders;
    } catch (err) {
        throw err;
    }
}


export const getDiary = async function(userId: string) {
    try {
        const diary = await prisma.diary.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return diary;
    } catch (err) {
        throw err;
    }
}

// export const getNotes = async function(userId: string) {
//     try {
//         const notes = await prisma.note.findMany({
//             where: {
//                 user_id: userId
//             },
//             orderBy: {
//                 created_at: 'desc'
//             }
//         });
//         return notes;
//     } catch (err) {
//         throw err;
//     }
// }

export const getRandomQuotes = async function(userId: string) {
    try {
        const quotes = await prisma.random_quotes.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return quotes;
    } catch (err) {
        throw err;
    }
}






