import axios from "axios";
import Transporter from "./transporter";

type AuthResponse = {
  factor: string;
  stop: Date;
  token: string;
  verify: boolean;
};

export type Event = {
  bet_allowed: boolean;
  bettable: boolean;
  chart_time_period: string;
  created: Date;
  description: string;
  display_order: number;
  end_date: Date;
  full_slug: string;
  hidden: false;
  id: string;
  inplay_enabled: boolean;
  modified: Date;
  name: string;
  parent_id: string;
  seo_description: string;
  short_name: string;
  slug: string;
  special_rules: string;
  start_date: string;
  start_datetime: string;
  state: string;
  type: string;
};

type EventResponse = {
  events: Event[]
}

const instance = axios.create({
  baseURL: "https://cors-anywhere.herokuapp.com/https://api.smarkets.com",
});

const TOKEN_STORAGE_KEY = "smarkets_key";

export async function retriveToken(username?: string, password?: string) {
  if (!username || !password) {
    throw new Error("Smarkets username/password is required");
  }
  const cachedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (cachedToken) {
    return cachedToken;
  }

  const response = await instance.post<AuthResponse>("v3/sessions", {
    password: password,
    username: username,
    remember: true,
  });

  const newToken = response.data.token;
  localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
  return newToken;
}

export default class Smarkets extends Transporter {
  async getEvents() {
    const response = await instance.get<EventResponse>("v3/events", {
      params: {
        state: ["new", "upcoming", "live"],
        type: "dota_2_match",
        sort: "id",
        limit: 20,
      },
    });

    return response.data;
  }
}
