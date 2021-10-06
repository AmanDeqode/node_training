import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee';

const LocalStrategy = passportLocal.Strategy;

function initialize(passport) {
  console.log('Initialized');

  const authenticateEmployee = async (email, password, done) => {
    try {
      const employee = await Employee.findOne({
        where: { email: email },
      });
      if (!employee) return done(null, false, { error: 'Invalid Email' });
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) return done(null, false, { error: 'Invalid Password' });
      return done(null, employee);
    } catch (error) {
      done(error);
    }
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      authenticateEmployee
    )
  );
  passport.serializeUser((employee, done) => done(null, employee.id));
  passport.deserializeUser(async (id, done) => {
    const employee = await Employee.findOne({
      where: { id: id },
    });
    if (employee) return done(null, employee);
  });
}
export default initialize;
