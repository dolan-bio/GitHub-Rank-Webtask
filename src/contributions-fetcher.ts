import * as cheerio from "cheerio";
import * as request from "request-promise";

export class ContributionFetcher {

    public async fetch(username: string): Promise<number> {
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
