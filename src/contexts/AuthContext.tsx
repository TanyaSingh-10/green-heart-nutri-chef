
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string; phone?: string; dietary_preferences?: string; health_goals?: string; }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(current => ({ 
          ...current,
          session, 
          user: session?.user ?? null,
          loading: false
        }));

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        }

        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(current => ({
        ...current,
        session,
        user: session?.user ?? null,
        loading: false
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signUp = async (email: string, password: string) => {
    try {
      setState(current => ({ ...current, error: null, loading: true }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email for the confirmation link.",
      });
    } catch (error) {
      const err = error as Error;
      setState(current => ({ ...current, error: err.message }));
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setState(current => ({ ...current, loading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(current => ({ ...current, error: null, loading: true }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      const err = error as Error;
      setState(current => ({ ...current, error: err.message }));
      toast({
        title: "Error signing in",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setState(current => ({ ...current, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(current => ({ ...current, loading: true }));
      await supabase.auth.signOut();
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error signing out",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setState(current => ({ ...current, loading: false }));
    }
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string; phone?: string; dietary_preferences?: string; health_goals?: string; }) => {
    try {
      if (!state.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', state.user.id);

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error updating profile",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
