import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase.js';
import { USER_ROLES } from '../utils/constants.js';
import { recordAuditLog } from './auditService.js';

// Demo Preset Accounts for Quick 1-Click Evaluation
export const DEMO_USERS = {
  ADMIN: {
    uid: 'demo-admin-01',
    name: 'Dr. Sarah Collins',
    email: 'admin@healthshield.ai',
    role: USER_ROLES.ADMIN,
    hospitalId: 'all',
    hospitalName: 'All 5 Hospital Nodes (Global SecOps)',
    avatar: '👩‍⚕️'
  },
  ANALYST: {
    uid: 'demo-analyst-02',
    name: 'Alex Chen',
    email: 'analyst@healthshield.ai',
    role: USER_ROLES.SECURITY_ANALYST,
    hospitalId: 'hosp-a',
    hospitalName: 'Hospital A (Metropolitan General)',
    avatar: '👨‍💻'
  },
  HOSPITAL_USER: {
    uid: 'demo-hospital-03',
    name: 'Nurse Manager Elena Rostova',
    email: 'elena@metrogeneral.org',
    role: USER_ROLES.HOSPITAL_USER,
    hospitalId: 'hosp-b',
    hospitalName: 'Hospital B (St. Jude Healthcare)',
    avatar: '🩺'
  }
};

const LOCAL_USER_KEY = 'healthshield_current_user';

export function getLocalUser() {
  const raw = localStorage.getItem(LOCAL_USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
  // Require explicit login by returning null on unauthenticated sessions
  return null;
}

export function setLocalUser(user) {
  if (user) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

/**
 * Login user
 */
export async function loginUser(email, password) {
  // Check if matching demo accounts
  if (email === DEMO_USERS.ADMIN.email) {
    setLocalUser(DEMO_USERS.ADMIN);
    await recordAuditLog({
      userId: DEMO_USERS.ADMIN.uid,
      userName: DEMO_USERS.ADMIN.name,
      action: 'USER_LOGIN',
      description: 'Administrator logged into HealthShield AI SecOps console.'
    });
    return DEMO_USERS.ADMIN;
  }
  if (email === DEMO_USERS.ANALYST.email) {
    setLocalUser(DEMO_USERS.ANALYST);
    await recordAuditLog({
      userId: DEMO_USERS.ANALYST.uid,
      userName: DEMO_USERS.ANALYST.name,
      action: 'USER_LOGIN',
      description: 'Security Analyst logged into threat telemetry center.'
    });
    return DEMO_USERS.ANALYST;
  }
  if (email === DEMO_USERS.HOSPITAL_USER.email) {
    setLocalUser(DEMO_USERS.HOSPITAL_USER);
    await recordAuditLog({
      userId: DEMO_USERS.HOSPITAL_USER.uid,
      userName: DEMO_USERS.HOSPITAL_USER.name,
      action: 'USER_LOGIN',
      description: 'Hospital operator logged into local node.'
    });
    return DEMO_USERS.HOSPITAL_USER;
  }

  // Live Firebase Auth if configured
  if (isFirebaseConfigured && auth) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = {
        uid: userCred.user.uid,
        name: userCred.user.displayName || email.split('@')[0],
        email: userCred.user.email,
        role: USER_ROLES.SECURITY_ANALYST,
        hospitalId: 'hosp-a',
        hospitalName: 'Hospital A (Metropolitan General)'
      };
      setLocalUser(user);
      await recordAuditLog({
        userId: user.uid,
        userName: user.name,
        action: 'USER_LOGIN',
        description: `Firebase user ${email} authenticated.`
      });
      return user;
    } catch (err) {
      throw new Error(err.message || 'Authentication failed.');
    }
  }

  // Simulated fallback user for custom credentials
  const customUser = {
    uid: `usr-${Date.now()}`,
    name: email.split('@')[0],
    email,
    role: USER_ROLES.SECURITY_ANALYST,
    hospitalId: 'hosp-a',
    hospitalName: 'Hospital A (Metropolitan General)'
  };
  setLocalUser(customUser);
  await recordAuditLog({
    userId: customUser.uid,
    userName: customUser.name,
    action: 'USER_LOGIN',
    description: `User ${email} authenticated.`
  });
  return customUser;
}

/**
 * Register user
 */
export async function registerUser({ name, email, password, role, hospitalId, hospitalName }) {
  if (isFirebaseConfigured && auth) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }
      const user = {
        uid: userCred.user.uid,
        name: name || email.split('@')[0],
        email: userCred.user.email,
        role: role || USER_ROLES.SECURITY_ANALYST,
        hospitalId: hospitalId || 'hosp-a',
        hospitalName: hospitalName || 'Hospital A (Metropolitan General)'
      };
      setLocalUser(user);
      await recordAuditLog({
        userId: user.uid,
        userName: user.name,
        action: 'USER_REGISTERED',
        description: `New user account registered for ${email} (${user.role}).`
      });
      return user;
    } catch (err) {
      throw new Error(err.message || 'Registration failed.');
    }
  }

  const newUser = {
    uid: `usr-${Date.now()}`,
    name: name || email.split('@')[0],
    email,
    role: role || USER_ROLES.SECURITY_ANALYST,
    hospitalId: hospitalId || 'hosp-a',
    hospitalName: hospitalName || 'Hospital A (Metropolitan General)'
  };
  setLocalUser(newUser);
  await recordAuditLog({
    userId: newUser.uid,
    userName: newUser.name,
    action: 'USER_REGISTERED',
    description: `New account registered for ${email} (${newUser.role}).`
  });
  return newUser;
}

/**
 * Logout
 */
export async function logoutUser() {
  const currentUser = getLocalUser();
  if (currentUser) {
    await recordAuditLog({
      userId: currentUser.uid,
      userName: currentUser.name,
      action: 'USER_LOGOUT',
      description: `User ${currentUser.email} logged out.`
    });
  }
  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
  }
  setLocalUser(null);
}
