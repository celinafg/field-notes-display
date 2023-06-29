import React, { ReactEventHandler, useState } from "react";
import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import Layout from "../../components/Layout";

type PageParams = {
	id: string;
};

type ContentPageProps = {
	post: Post;
};

type Post = {
	_id: string;
	text: string;
	type: string;
	tags: Array<string>;
	LAST_UPDATE: string;
};

type ResponseFromServer = {
	_id: string;
	text: string;
	type: string;
	tags: Array<string>;
	LAST_UPDATE: string;
};

export async function getStaticProps({
	params,
}: GetStaticPropsContext<PageParams>): Promise<
	GetStaticPropsResult<ContentPageProps>
> {
	try {
		let response = await fetch(
			"http://localhost:3000/api/getPost?id=" + params?.id
		);

		let responseFromServer: ResponseFromServer = await response.json();

		return {
			// Passed to the page component as props
			props: {
				post: {
					_id: responseFromServer._id,
					text: responseFromServer.text,
					type: responseFromServer.type,
					tags: responseFromServer.tags,
					LAST_UPDATE: responseFromServer.LAST_UPDATE,
				},
			},
		};
	} catch (e) {
		console.log("error ", e);
		return {
			props: {
				post: {
					_id: "",
					type: "",
					text: "",
					tags: [],
					LAST_UPDATE: "TODAY",
				},
			},
		};
	}
}

export async function getStaticPaths() {
	let posts = await fetch("http://localhost:3000/api/getPosts");

	let postFromServer: [Post] = await posts.json();
	return {
		paths: postFromServer.map((post) => {
			return {
				params: {
					id: post._id,
				},
			};
		}),
		fallback: false, // can also be true or 'blocking'
	};
}

export default function EditPost({
	post: { _id, type, text, tags },
}: ContentPageProps) {
	const [postTitle, setPostTitle] = useState(type);
	const [postContent, setPostContent] = useState(text);
	const [postTags, setPostTags] = useState(tags);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (postTitle && postContent) {
			let dt = new Date();
			const dat = `${
				dt.toLocaleDateString() +
				" " +
				dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
			}`;

			try {
				let response = await fetch(
					"http://localhost:3000/api/editPost?id=" + _id,
					{
						method: "POST",
						body: JSON.stringify({
							text: postContent,
							type: postTitle,
							tags: postTags,
							LAST_UPDATE: dat,
						}),
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				response = await response.json();
				setPostTitle("");
				setPostContent("");
				setError("");
				setPostTags([]);
				setMessage("Post edited successfully");
			} catch (errorMessage: any) {
				setError(errorMessage);
			}
		} else {
			return setError("All fields are required");
		}
	};

	// no such post exists
	if (!type && !text && !_id && process.browser) {
		return (window.location.href = "/");
	}

	const handleTags = (e: any) => {
		let str = e.replace(/\s*,\s*/g, ",");
		setPostTags(str.split(","));
	};
	return (
		<Layout>
			<form onSubmit={handleSubmit} className="form">
				{error ? <div className="alert-error">{error}</div> : null}
				{message ? <div className="alert-message">{message}</div> : null}
				<div className="form-group">
					<label>Title</label>
					<input
						type="text"
						placeholder="Title of the post"
						onChange={(e) => setPostTitle(e.target.value)}
						value={postTitle ? postTitle : ""}
					/>
				</div>
				<div className="form-group">
					<label>Content</label>
					<textarea
						name="content"
						placeholder="Content of the post"
						value={postContent ? postContent : ""}
						onChange={(e) => setPostContent(e.target.value)}
						cols={20}
						rows={8}
					/>
				</div>
				<div className="form-group">
					<label>Tags</label>
					<textarea
						name="content"
						placeholder="Content of the post"
						value={postTags ? postTags : [""]}
						onChange={(e) => handleTags(e.target.value)}
						cols={20}
						rows={8}
					/>
				</div>
				<div className="form-group">
					<button type="submit" className="submit_btn">
						Update
					</button>
				</div>
			</form>
			<style jsx>
				{`
					.form {
						width: 400px;
						margin: 10px auto;
					}
					.form-group {
						width: 100%;
						margin-bottom: 10px;
						display: block;
					}
					.form-group label {
						display: block;
						margin-bottom: 10px;
					}
					.form-group input[type="text"] {
						padding: 10px;
						width: 100%;
					}
					.form-group textarea {
						padding: 10px;
						width: 100%;
					}
					.alert-error {
						width: 100%;
						color: red;
						margin-bottom: 10px;
					}
					.alert-message {
						width: 100%;
						color: green;
						margin-bottom: 10px;
					}
				`}
			</style>
		</Layout>
	);
}
