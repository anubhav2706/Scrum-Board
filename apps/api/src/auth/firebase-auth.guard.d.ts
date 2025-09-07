import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class FirebaseAuthGuard implements CanActivate {
    private readonly firebaseAdmin;
    private readonly reflector;
    constructor(firebaseAdmin: any, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
