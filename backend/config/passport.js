const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

async function findOrCreate({ provider, providerId, name, email, avatar }, done) {
  try {
    if (!email) return done(null, false);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, provider, providerId, avatar });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

if (process.env.GOOGLE_CLIENT_ID) {
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
            avatar: profile.photos?.[0]?.value,
          },
          done
        )
    )
  );
}

if (process.env.FACEBOOK_APP_ID) {
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
            avatar: profile.photos?.[0]?.value,
          },
          done
        )
    )
  );
}

module.exports = passport;