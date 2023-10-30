import {MongoClient, ObjectId} from 'mongodb';
import {NextRequest, NextResponse} from "next/server";


const username = encodeURIComponent(process.env.NEXT_PUBLIC_MONGODB_USERNAME || '');
const password = encodeURIComponent(process.env.NEXT_PUBLIC_MONGODB_PASSWORD || '');
const host = process.env.NEXT_PUBLIC_MONGODB_API || 'localhost:27017';
const url = `mongodb://${username}:${password}@${host}/?authMechanism=DEFAULT&authSource=drawlist`;
const dbName = `${process.env.NEXT_PUBLIC_MONGODB_DB}`;
const dbCollection = 'draw';
console.log(url);

export async function GET(req: NextRequest, res: NextResponse) {

    try {

        const params = new URL(req.url).searchParams;
        console.log(params)
        const user_id = params.get('user_id');
        const skip = params.get('skip');
        const limit = params.get('limit');
        console.log(skip,limit)
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(dbCollection);
        if (!user_id) {
            const result = await collection.find({"shared":true})
                .skip(skip ? parseInt(skip) : 0)
                .limit(limit ? parseInt(limit) : 0)
                .sort("submitTime",-1)
                .toArray();
            await client.close();
            console.log('Connection closed');
            return NextResponse.json(result);
        }
        const result = await collection.find({"user_id":`${user_id}`})
            .skip(skip ? parseInt(skip) : 0)
            .limit(limit ? parseInt(limit) : 0)
            .sort("submitTime",-1)
            .toArray();
        await client.close();
        console.log('Connection closed');
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        console.log(body);
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(dbCollection);
        if (body._id) {
            // 如果请求中包含 _id 字段，则使用 updateOne 进行更新操作
            console.log("现在进行更新")
            const {_id, ...updateData} = body;
            const result = await collection.updateOne(
                {_id: new ObjectId(_id)},
                {$set: updateData}
            );
            await client.close();
            console.log('Connection closed');
            return NextResponse.json(result);
        } else {
            console.log("现在插入数据")
            // 否则，使用 insertOne 进行插入操作
            const result = await collection.insertOne(body);
            await client.close();
            console.log('Connection closed');
            return NextResponse.json(result);
        }


    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });



