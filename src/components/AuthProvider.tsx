import React, { useState, createContext, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js'
import { useClient, useAuthStateChange } from 'react-supabase'

//init AuthContext prop types
interface AuthUser {
    session: Session | null;
    user: User | null;
}

type Props = {
    children: ReactNode;
}

//create AuthContext
const initialState = { session: null, user: null };
export const AuthContext = createContext<AuthUser>(initialState);

//AuthProvider component
export const AuthProvider = (props: Props) => {
    //user null = loading
    const [state, setState] = useState<AuthUser>(initialState);
	const client = useClient();

    //get and set user session with supabase auth
    useEffect(() => {
        const session = client.auth.session();
        setState({ session, user: session?.user ?? null });

    }, []);

    useAuthStateChange((event, session) => {
        setState({ session, user: session?.user ?? null });
    });

    return (
        <AuthContext.Provider value={state}>
            {props.children}
        </AuthContext.Provider>
    );
};