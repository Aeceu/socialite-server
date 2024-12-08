import prisma from "../../utils/prisma";
import cloudinary from "../../utils/cloudinary";
import { Request, Response } from "express";

// TODO: GET posts of the user (for the profile page)
export const getUserPosts = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const userposts = await prisma.user.findFirst({
			where: {
				id: userId,
			},
			select: {
				post: {
					include: {
						post_img: true,
						user: {
							select: {
								email: true,
								first_name: true,
								last_name: true,
								id: true,
								profile_img: true,
							},
						},
					},
				},
			},
		});
		res.status(200).json(userposts);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// TODO: GET post by Id (for the post page)
export const getPostById = async (req: Request, res: Response) => {
	try {
		const postId = req.params.postId;
		const post = await prisma.post.findFirst({
			where: {
				id: postId,
			},
			include: {
				post_img: true,
				user: {
					select: {
						email: true,
						first_name: true,
						last_name: true,
						id: true,
						profile_img: true,
					},
				},
			},
		});
		res.status(200).json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// TODO: GET all posts (for the feed page)
export const allPosts = async (req: Request, res: Response) => {
	try {
		const posts = await prisma.post.findMany({
			take: 5,
			orderBy: { createdAt: "desc" },
			include: {
				post_img: true,
				user: {
					select: {
						email: true,
						first_name: true,
						last_name: true,
						id: true,
						profile_img: true,
					},
				},
			},
		});
		res.status(200).json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// TODO: CREATE post
export const createPost = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const { data, file } = req.body;

		const newPost = await prisma.post.create({
			data: {
				userId,
				post_img: {
					create: {
						image_id: "",
						secure_url: "",
					},
				},
				title: data,
			},
			include: {
				post_img: true,
				user: {
					select: {
						email: true,
						first_name: true,
						last_name: true,
						id: true,
					},
				},
			},
		});

		if (file) {
			const result = await cloudinary.uploader.upload(file, {
				folder: "SociaLite_Post",
			});
			const newPostWithImage = await prisma.post.update({
				where: {
					id: newPost.id,
				},
				data: {
					post_img: {
						update: {
							image_id: result.public_id,
							secure_url: result.secure_url,
						},
					},
				},
				include: {
					post_img: true,
					user: {
						select: {
							email: true,
							first_name: true,
							last_name: true,
							id: true,
						},
					},
				},
			});

			return res.status(200).json(newPostWithImage);
		}
		res.status(200).json(newPost);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// TODO: UPDATE post
export const updatePost = async (req: Request, res: Response) => {
	try {
		const postId = req.params.postId;
		const { data, file } = req.body;

		const updatedPost = await prisma.post.update({
			where: {
				id: postId,
			},
			data: {
				title: data,
			},
			include: {
				post_img: true,
				user: {
					select: {
						id: true,
						first_name: true,
						last_name: true,
						email: true,
					},
				},
			},
		});

		if (file) {
			if (updatedPost.post_img?.secure_url || updatedPost.post_img?.image_id) {
				await cloudinary.uploader.destroy(updatedPost.post_img.image_id);
			}
			const result = await cloudinary.uploader.upload(file, {
				folder: "SociaLite_Post",
			});

			const updatedPostwithImage = await prisma.post.update({
				where: {
					id: updatedPost.id,
				},
				data: {
					post_img: {
						update: {
							image_id: result.public_id,
							secure_url: result.secure_url,
						},
					},
				},
				include: {
					post_img: true,
					user: {
						select: {
							email: true,
							first_name: true,
							last_name: true,
							id: true,
						},
					},
				},
			});
			return res.status(200).json(updatedPostwithImage);
		}

		res.status(200).json(updatedPost);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// TODO: DELETE post
export const deletePost = async (req: Request, res: Response) => {
	try {
		const postId = req.params.postId;
		const post = await prisma.post.delete({
			where: {
				id: postId,
			},
			include: {
				post_img: true,
			},
		});

		if (post.post_img?.image_id || post.post_img?.secure_url) {
			await cloudinary.uploader.destroy(post.post_img.image_id);
		}

		res.status(200).json("Post deleted successfully!");
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// TODO: GET first 10 post and shared post in feed
export const getFeed = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string);
	const pageSize = parseInt(req.query.pageSize as string);

	const skip = (page - 1) * pageSize; // 3 - 1 = 2 * 3 = 6 skip 6 since where on page 3 now
	const take = pageSize; // take 3 post

	try {
		// fetch post
		const posts = await prisma.post.findMany({
			skip,
			take,
			orderBy: { createdAt: "desc" },
			include: {
				post_img: true,
				user: {
					select: {
						email: true,
						first_name: true,
						last_name: true,
						id: true,
						profile_img: true,
					},
				},
			},
		});

		// Fetch shared posts
		const sharedPosts = await prisma.sharedPost.findMany({
			skip: skip,
			take: take,
			orderBy: { createdAt: "desc" },
			include: {
				post: {
					include: {
						post_img: true,
						user: {
							select: {
								email: true,
								first_name: true,
								last_name: true,
								id: true,
								profile_img: true,
							},
						},
					},
				},
				User: {
					select: {
						email: true,
						first_name: true,
						last_name: true,
						id: true,
						profile_img: true,
					},
				},
			},
		});

		const combinedFeed = [...posts, ...sharedPosts];
		combinedFeed.sort(() => Math.random() - 0.5);

		const totalPostsCount = await prisma.post.count();
		const totalSharedPostsCount = await prisma.sharedPost.count();

		res.status(200).json({
			feed: combinedFeed,
			totalCount: totalPostsCount + totalSharedPostsCount,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Failed to get the feed!",
		});
	}
};
