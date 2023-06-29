import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
	try {
		const client = await clientPromise;
		const db = client.db(`${process.env.db_name}`);
		const posts = await db
			.collection(`${process.env.collection_name}`)
			.find({})
			.toArray();

		res.json(posts);
	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};
