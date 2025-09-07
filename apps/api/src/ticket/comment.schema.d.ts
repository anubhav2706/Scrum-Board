import { Document } from 'mongoose';
export declare class Comment extends Document {
    ticketId: string;
    author: string;
    message: string;
    createdAt: string;
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment, any> & Comment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>, {}> & import("mongoose").FlatRecord<Comment> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
