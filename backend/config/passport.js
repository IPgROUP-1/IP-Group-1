const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

const idField = { google: "googleId", facebook: "facebookId" };

async function findOrCreate({ provider, providerId, name, email, avatar, emailVerified }, done) {
  try {
    const field = idField[provider];

    // 1. Returning social user: match on the provider's stable ID
    let user = await User.findOne({ [field]: providerId });
    if (user) return done(null, user);

    if (!email) return done(null, false);
    email = email.toLowerCase();

    // 2. Existing account with this email: link ONLY if the provider verified it
    user = await User.findOne({ email });
    if (user) {
      if (!emailVerified) return done(null, false);
      user[field] = providerId;
      if (!user.avatar && avatar) user.avatar = avatar;
      await user.save();
      return done(null, user);
    }

    // 3. Brand new user
    user = await User.create({
      name: (name || email.split("@")[0]).slice(0, 50),
      email,
      [field]: providerId,
      avatar: avatar || "",
    });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) =>
        findOrCreate(
          {
            provider: "google",
            providerId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            emailVerified:
              profile._json?.email_verified === true || profile.emails?.[0]?.verified === true,
            avatar: profile.photos?.[0]?.value,
          },
          done
        )
    )
  );
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
        profileFields: ["id", "displayName", "emails", "photos"],
      },
      (accessToken, refreshToken, profile, done) =>
        findOrCreate(
          {
            provider: "facebook",
            providerId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            emailVerified: false, // Facebook doesn't say, so never merge into an existing account
            avatar: profile.photos?.[0]?.value,
          },
          done
        )
    )
  );
}

module.exports = passport;