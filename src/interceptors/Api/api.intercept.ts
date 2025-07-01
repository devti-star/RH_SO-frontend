import { type AxiosInstance } from "axios";
import { ApiFactory } from "./api.factory";
import { apiURL } from "../../config";

export class ApiService {
  private static instance: AxiosInstance;

  private constructor() {} 

  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = ApiFactory.create(apiURL);
    }
    return this.instance;
  }

}
