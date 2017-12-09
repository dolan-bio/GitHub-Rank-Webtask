import * as mongoose from "mongoose";

interface ISummaryDocument extends mongoose.Document {
    totalDocuments: number;
    c: number;
    d: number;
    contributions: {
        average: number,
        highest: number,
    };
}

const SummarySchema = new mongoose.Schema(
    {
        totalDocuments: Number,
        c: Number,
        d: Number,
        contributions: {
            average: Number,
            highest: Number,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
        },
    });

const Summary = mongoose.model<ISummaryDocument>("GithubRankerSummary", SummarySchema);

export { Summary, ISummaryDocument };
