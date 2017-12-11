import "babel-polyfill";
import * as mongoose from "mongoose";

import { ContributionFetcher } from "./contributions-fetcher";
import { EventsFetcher } from "./events-fetcher";
import { RankFetcher } from "./rank-fetcher";

module.exports = async (context, cb) => {
    mongoose.connect(context.secrets.MONGODB_URI);
    const contributionsFetcher = new ContributionFetcher();
    const rankFetcher = new RankFetcher(contributionsFetcher);
    const eventsFetcher = new EventsFetcher(context.secrets.GITHUB_TOKEN);

    console.log("Getting rank");
    const rank = await rankFetcher.run();
    const event = await eventsFetcher.fetch();
    const contributions = await contributionsFetcher.fetch("dolanmiu");

    cb(null, {
        rank,
        event,
        contributions,
    });
};
