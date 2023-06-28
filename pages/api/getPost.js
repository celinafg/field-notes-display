import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
	try {
		const client = await clientPromise;
		const db = client.db("ClusterBotTest");
		const { id } = req.query;

		const post = await db
			.collection("field_notes")
			.findOne({ _id: ObjectId(id) });

		res.json(post);
	} catch {
		console.error(e);
		throw new Error(e).message;
	}
};
