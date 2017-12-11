import * as GitHubApi from "github";

export class EventsFetcher {
    private github: GitHubApi;

    constructor(token: string) {
        this.github = new GitHubApi();

        this.github.authenticate({
            type: "token",
            token: token,
        });
    }


    public async fetch(): Promise<any> {
        const events = await this.github.activity.getEventsForUserPublic({
            username: "dolanmiu",
        });

        console.log(events);

        return events.data[0];
    }
}
