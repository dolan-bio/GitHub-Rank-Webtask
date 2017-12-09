import "babel-polyfill";
import * as mongoose from "mongoose";

import { RankFetcher } from "./rank-fetcher";

module.exports = async (context, cb) => {
    mongoose.connect(context.secrets.MONGODB_URI);
    const rankFetcher = new RankFetcher();

    console.log("Getting rank");
    const rank = await rankFetcher.run();

    cb(null, {
        rank,
    });
};
