import { ContributionFetcher } from "./contributions-fetcher";
import { ISummaryDocument, Summary } from "./github-rank-summary-model";

export class RankFetcher {

    constructor(private contributionsFetcher: ContributionFetcher) {
    }

    public async run(): Promise<number> {
        const doc = await Summary.findOne().sort("-created_at").sort("-created_at");
        const contributions = await this.contributionsFetcher.fetch("dolanmiu");

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
}
