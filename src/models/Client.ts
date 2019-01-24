export default class Client {
  chat: boolean;
  features: object;
  handle: string;
  language: string;
  name: string;
  persistence: string;
  privacy: boolean;
  rollout: number;
  routingInfo: object;
  tint: string;
  intro?: {
    response_id: string,
    body: string,
    style: string,
    duration: number,
    delay: number
  };

  constructor(clientResponse: any) {
    this.chat = clientResponse.chat;
    this.language = clientResponse.language;
    this.features = clientResponse.features;
    this.name = clientResponse.name;
    this.persistence = clientResponse.persistence;
    this.privacy = clientResponse.privacy;
    this.rollout = clientResponse.rollout;
    this.routingInfo = clientResponse.routing_info;
    this.tint = clientResponse.tint;
    this.intro = clientResponse.intro;
  }
}
