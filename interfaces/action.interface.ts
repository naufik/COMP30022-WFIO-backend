import { User } from './user.interface';

/** 
 * This interface defines an action, that is, the action of a user...
 * The identity field is used to store the authentication token as we speak... this token will
 * then be double checked with the database with some super cryptography stuff.
 * 
 * Note that not all actions need to be accompanied with an identity. Signing up does not
 * require an identity because the identity is not even there in the first place(?).
 * 
 * For actions that do not require a parameter, attach an empty object {}. Interfaces for 
 * specific actions are down below.
 */
export interface Action<T> {
    identity?: string,                      // this is used to store the token for authentication.
    action: string,                         // the action that needs to be performed.
    params: T,                              // parameters for the action. an object.
}

export interface Receipt<V> {
    ok: boolean,                            // Whether the request was successfully carried out or not.
    result?: V | Error,                     // The result of the carried out request.
}
/**
 * Interfaces for specific action.
 */
export interface Token {
    token: string,                          // The token private key that is to be generated.
    user?: User,                            // This token represents the user object that is tied to the token.
}