import axios from "axios";
import Transporter from "./transporter";

const instance = axios.create({
  baseURL: "https://api.opendota.com/api",
});

export type Team = {
  team_id: number;
  rating: number;
  wins: number;
  losses: number;
  last_match_time: number;
  name: string;
  tag: string;
  logo_url: string;
};
const TEAMS_STORAGE_KEY = "opendota_teams";

export default class Opendota extends Transporter {
  constructor(apiKey?: string) {
    if (!apiKey) {
      throw new Error("OpenDota apiKey is required");
    }
    super(apiKey);
    instance.interceptors.request.use((config) => {
      config.params = {
        api_key: this.token,
      };
      return config;
    });
  }

  private async getRemoteTeams() {
    const response = await instance.get<Team[]>("teams");
    return response.data;
  }

  private async getWriteCachedTeams() {
    const teams = await this.getRemoteTeams();
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
    return teams;
  }

  public async getTeams(): Promise<Team[]> {
    const cachedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);

    if (cachedTeams) {
      try {
        const teams = JSON.parse(cachedTeams);

        return teams;
      } catch {
        return this.getWriteCachedTeams();
      }
    } else {
      return this.getWriteCachedTeams();
    }
  }

  public async getPlayers(team_id: string | number) {
    const response = await instance.get(`teams/${team_id}/players`);
    return response.data;
  }
}
