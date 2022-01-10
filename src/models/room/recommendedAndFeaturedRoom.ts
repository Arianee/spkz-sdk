export interface Section {
    title: string;
    id: string;
    writeStrategies?: any[][];
    readStrategies?: any[][];
    icon?: string;
    url?: string;
    type?: string
  }

export interface RoomDetails {
    endpoint: string;
    notificationEndpoint: string;
    name: string;
    description: string;
  // eslint-disable-next-line camelcase
    external_url?: string;
    image: string;
    logo: string;
    strategies: any[][];
    sections: Section[];
  }

export interface EnrichedStrategies {
    isAuthorized: boolean;
    strategies: any[][];
  }

export interface AcquireURL {
    title: string;
    logo: string;
    url: string;
  }

export interface Token {
    chainId: string;
    networkId: string;
    address: string;
  }

export interface Params {
    logo: string;
    minBalance: string;
    tokens: Token[];
  }

export interface Requirement {
    name: string;
    acquireURLs: AcquireURL[];
    params: Params;
  }

export interface RecommendedOrFeaturedRoom {
    roomId: string;
    roomDetails: RoomDetails;
    membersNb: number;
    verified: boolean;
    special: boolean;
    enrichedStrategies: EnrichedStrategies;
    requirements: Requirement[];
  }

export interface RecommendedOrFeaturedRoomFromExternalSource {
    roomId: string;
    roomDetails?: RoomDetails;
    membersNb?: number;
    verified?: boolean
    recommended?: boolean;
    featured?: boolean;
    special?: boolean;
    enrichedStrategies?: EnrichedStrategies;
    requirements?: Requirement[];
}

export interface RoomFromStore {
    roomId: string;
    roomDetails: RoomDetails;
    membersNb: number;
    verified: boolean
    recommended: boolean;
    featured: boolean;
    special: boolean;
    enrichedStrategies: EnrichedStrategies;
    requirements: Requirement[];
}
