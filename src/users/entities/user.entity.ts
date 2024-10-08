import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        type: String,
        required: true,
        select: false,
    })
    password: string;

    @Prop({
        type: String,
        required: true,
    })
    fullName: string;

    @Prop({
        type: Boolean,
        default: true,
    })
    isActive: boolean;

    @Prop({
        type: [String],
        default: ['user'],
    })
    roles: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);

