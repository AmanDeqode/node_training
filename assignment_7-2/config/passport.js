import passport from 'passport';
import googlePassport from 'passport-google-oauth20';
import facebookPassport from 'passport-facebook';
import dotenv from 'dotenv';

import Employee from '../models/Employee';

dotenv.config();
const GoogleStrategy = googlePassport.Strategy;
const FacebookStrategy = facebookPassport.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.URL_GOOGLE,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const employee = await Employee.findOne({
          where: { id: parseInt(profile.id, 10) },
        });
        if (!employee) {
          const employeewithEmail = await Employee.findOne({
            where: { email: profile.emails[0].value },
          });
          if (!employeewithEmail) {
            const newEmployee = await Employee.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              password: 'googleDefault',
            });
            return cb(null, newEmployee);
          }
          return cb(null, employeewithEmail);
        }
        return cb(null, employee);
      } catch (error) {
        throw new Error(error);
      }
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.URL_FB,
      profileFields: ['id', 'email', 'name'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const employee = await Employee.findOne({
          where: { id: parseInt(profile.id, 10) },
        });
        if (!employee) {
          const employeewithEmail = await Employee.findOne({
            where: { email: profile.emails[0].value },
          });
          if (!employeewithEmail) {
            const newEmployee = await Employee.create({
              username: `${profile.name.givenName} ${profile.name.familyName}`,
              email: profile.emails[0].value,
              password: 'facebookDefault',
            });
            return cb(null, newEmployee);
          }
          return cb(null, employeewithEmail);
        }
        return cb(null, employee);
      } catch (error) {
        throw new Error(error);
      }
    }
  )
);
passport.serializeUser((employee, cb) => {
  cb(null, employee.id);
});
passport.deserializeUser(async (id, cb) => {
  try {
    const employee = await Employee.findByPk(id);
    cb(null, employee);
  } catch (error) {
    cb(error);
    throw error;
  }
});
