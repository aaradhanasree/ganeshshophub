import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext(null);

const mapAuthRecord = (model) => {
  if (!model) return null;

  const isSuperuser = model.collectionName === '_superusers';
  const displayName = model.name || [model.firstName, model.lastName].filter(Boolean).join(' ').trim();

  return {
    ...model,
    name: displayName || model.email || 'User',
    role: isSuperuser ? 'admin' : (model.role || 'customer'),
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(mapAuthRecord(pb.authStore.model));
    }
    setInitialLoading(false);

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(mapAuthRecord(model));
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      const mappedUser = mapAuthRecord(authData.record);
      setCurrentUser(mappedUser);
      return mappedUser;
    } catch (userAuthError) {
      const adminAuthData = await pb.collection('_superusers').authWithPassword(email, password);
      const mappedAdmin = mapAuthRecord(adminAuthData.record || pb.authStore.model);
      setCurrentUser(mappedAdmin);
      return mappedAdmin;
    }
  };

  const signup = async (email, password, passwordConfirm, firstName, lastName) => {
    const name = [firstName, lastName].filter(Boolean).join(' ').trim();

    const record = await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
      name,
    });
    
    const authData = await pb.collection('users').authWithPassword(email, password);
    setCurrentUser(mapAuthRecord(authData.record || pb.authStore.model));
    return record;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const isAuthenticated = pb.authStore.isValid;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.collectionName === '_superusers';

  const value = {
    currentUser,
    login,
    logout,
    signup,
    isAuthenticated,
    isAdmin,
    initialLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};