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
        roomDetails: NFTROOM;
        membersNb: number;
        verified?: boolean;
        special?: boolean;
        requirements: Requirement[];
    }