import { Document } from 'mongoose';
export declare class ActivityLog extends Document {
    type: string;
    user: string;
    ticketId?: string;
    projectId?: string;
    timestamp: string;
    metadata?: Record<string, any>;
}
export declare const ActivityLogSchema: import("mongoose").Schema<ActivityLog, import("mongoose").Model<ActivityLog, any, any, any, Document<unknown, any, ActivityLog, any> & ActivityLog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ActivityLog, Document<unknown, {}, import("mongoose").FlatRecord<ActivityLog>, {}> & import("mongoose").FlatRecord<ActivityLog> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
