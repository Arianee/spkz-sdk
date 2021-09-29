import { NFTROOM } from './NFTROOM';

export interface Section {
        title: string;
        id: string;
        strategiesRead: any[];
        strategiesWrite: any[];
    }

export interface Requirement {
        icon: string;
        symbol: string;
        requiredAmount: string;
    }

export interface RecommendedOrFeaturedRooms {
        roomId: number;
        room: NFTROOM;
        membersNb: number;
        requirements: Requirement[];
    }
