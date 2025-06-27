import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseMovement {
    amount: string;
    denominations: Array<{
        direction: "IN" | "OUT";
        denomination: number;
        amount: number;
    }>;
    paymentMethod: string;
    reason: string;
    register: string;
    timestamp: string;
    user: string;
    uuid: string;
}

type BaseMovementRepository = BaseRepository<LocalDatabaseMovement>;

export default BaseMovementRepository;
