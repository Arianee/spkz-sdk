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

export interface RecommendedOrFeaturedRoom {
        roomId: string;
        room: NFTROOM;
        membersNb: number;
        requirements: Requirement[];
    }
