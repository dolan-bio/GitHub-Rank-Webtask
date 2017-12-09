
import * as cheerio from "cheerio";
import * as request from "request-promise";

import { ISummaryDocument, Summary } from "./github-rank-summary-model";

export class RankFetcher {

    public async run(): Promise<number> {
        const doc = await Summary.findOne().sort("-created_at").sort("-created_at");
        const contributions = await this.fetchContributions("dolanmiu");

        return this.getRank(doc, contributions);
    }

    private async getRank(doc: ISummaryDocument, contributions: number): Promise<number> {
        const coefficient = (doc.c * doc.totalDocuments) / doc.d;
        const myExponant = Math.pow(Math.E, doc.d * contributions);
        const yMyContributions = coefficient * myExponant;

        const maxExponant = Math.pow(Math.E, doc.d * doc.contributions.highest);
        const yMaxContributions = coefficient * maxExponant;

        return Math.ceil(yMaxContributions - yMyContributions);
    }

    private async fetchContributions(username: string): Promise<number> {
        const url = `https://github.com/users/${username}/contributions`;

        // tslint:disable-next-line:no-any
        const response = await request.get({
            url: url,
            resolveWithFullResponse: true,
        });

        // Sometimes may throw 404 error
        if (response.statusCode === 404) {
            return 0;
        }

        if (response.statusCode !== 200) {
            throw new Error(response.body);
        }

        const $ = cheerio.load(response.body);

        const contributions: number[] = [];

        $("rect").each(function(): void {
            const count = $(this).attr("data-count");
            contributions.push(parseInt(count, 10));
        });

        const total = contributions.reduce((a, b) => {
            return a + b;
        });

        return total;
    }
}
