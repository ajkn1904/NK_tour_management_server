/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";


passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async(email: string, password: string, done) =>{

        try {
            
            const isUserExists = await User.findOne({email});
            if(!isUserExists){
                return done("User Does not Exists!");
            };
            

            if (!isUserExists.isVerified) {
                return done("User is not verified")
            }

            if (isUserExists.isActive === IsActive.BLOCKED || isUserExists.isActive === IsActive.INACTIVE) {
                return done(`User is ${isUserExists.isActive}`)
            }
            if (isUserExists.isDeleted) {
                return done("User is deleted")
            }


            const isGoogleAuthenticated = isUserExists.auths.some(providerObjects => providerObjects.provider == "google");
            if(isGoogleAuthenticated && !isUserExists.password){
                return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." 
                });
            }


            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExists?.password as string);
            if(!isPasswordMatched){
                return done(null, false, {message: "Password Does not Match!"})
            }

            
            return done(null, isUserExists);

        } catch (error) {
            console.log(error);
            done(error);
        }
    })
)


passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async(accessToken: string, refeshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;
            if(!email){
                return done(null, false, {message: "No Email Found!"});
            };
            
            let isUserExists = await User.findOne({ email })
            if (isUserExists && !isUserExists.isVerified) {
                return done(null, false, { message: "User is not verified" })
            }

            if (isUserExists && (isUserExists.isActive === IsActive.BLOCKED || isUserExists.isActive === IsActive.INACTIVE)) {
                done(`User is ${isUserExists.isActive}`)
            }

            if (isUserExists && isUserExists.isDeleted) {
                return done(null, false, { message: "User is deleted" })
            }


            if(!isUserExists){
                isUserExists = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                })
            }
            return done(null, isUserExists);

        } catch (error) {
            console.log("Google Strategy Error", error);
            return done(error);
        }
    })
);


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
       console.log(error);
       done(error); 
    }
})