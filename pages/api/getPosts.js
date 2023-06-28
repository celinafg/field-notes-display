import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
	try {
		const client = await clientPromise;
		const db = client.db("ClusterBotTest");
		const posts = await db.collection("field_notes").find({}).toArray();

		res.json(posts);
	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};
