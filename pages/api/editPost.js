import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
	try {
		const client = await clientPromise;
		const db = client.db("ClusterBotTest");
		const { id } = req.query;
		const { tags, text, type, LAST_UPDATE } = req.body;
		const post = await db.collection("field_notes").updateOne(
			{
				_id: ObjectId(id),
			},
			{
				$set: {
					tags: tags,
					text: text,
					type: type,
					LAST_UPDATE: LAST_UPDATE,
				},
			}
		);

		res.json(post);
	} catch (e) {
		console.error(e);
		throw new Error(e).message;
	}
};
