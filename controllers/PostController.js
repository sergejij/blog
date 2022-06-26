import PostModel from '../models/Post.js';

export const getAllPosts = async (req, resp) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        resp.json(posts);
    } catch (e) {
        console.error("Error:", e)
        resp.status(500).json({
            message: 'Error by getting posts'
        });
    }
};
export const getOnePost = async (req, resp) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' },
            (err, doc) => {
                if (err) {
                    console.error('Error:', err);
                    resp.status(500).json({
                        message: 'Error by finding post'
                    });
                    return;
                }

                if (!doc) {
                    resp.status(404).json({
                        message: 'Post not found',
                    })
                    return;
                }

                resp.json(doc);
            }
        );
    } catch (e) {
        console.error("Error:", e)
        resp.status(500).json({
            message: 'Error by getting posts'
        });
    }
};

export const createPost = async (req, resp) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save();
        resp.json(post)
    } catch (e) {
        console.error("Error:", e)
        resp.status(500).json({
            message: 'Error by creating post'
        });
    }
}

export const removePost = async (req, resp) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            { _id: postId },
            (err, doc) => {
                if (err) {
                    console.error('Error:', err);
                    resp.status(500).json({
                        message: 'Error by deleting post'
                    });
                    return;
                }

                if (!doc) {
                    resp.status(404).json({
                        message: 'Post not found',
                    })
                    return;
                }

                resp.json({
                    success: true
                });
            }
        );
    } catch (e) {
        console.error("Error:", e)
        resp.status(500).json({
            message: 'Error by getting posts'
        });
    }
};
export const updatePost = async (req, resp) => {
    try {
        const postId = req.params.id;

        await PostModel.findOneAndUpdate(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            },
        );

        resp.json({
            success: true
        })
    } catch (e) {
        console.error("Error:", e)
        resp.status(500).json({
            message: 'Error by updating posts'
        });
    }
};
