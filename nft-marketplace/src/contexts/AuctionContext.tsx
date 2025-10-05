"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AuctionState {
  page: number;
  limit: number;
  sort: string;
  filters: {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  };
  isLoading: boolean;
  totalItems: number;
}

type AuctionAction =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_LIMIT'; payload: number }
  | { type: 'SET_SORT'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<AuctionState['filters']> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TOTAL_ITEMS'; payload: number }
  | { type: 'RESET_FILTERS' };

const initialState: AuctionState = {
  page: 1,
  limit: 25,
  sort: 'buyoutPrice:asc',
  filters: {},
  isLoading: false,
  totalItems: 0,
};

function auctionReducer(state: AuctionState, action: AuctionAction): AuctionState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_LIMIT':
      return { ...state, limit: action.payload, page: 1 }; // Reset to page 1 when changing limit
    case 'SET_SORT':
      return { ...state, sort: action.payload, page: 1 }; // Reset to page 1 when changing sort
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, page: 1 };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TOTAL_ITEMS':
      return { ...state, totalItems: action.payload };
    case 'RESET_FILTERS':
      return { ...state, filters: {}, page: 1 };
    default:
      return state;
  }
}

interface AuctionContextType {
  state: AuctionState;
  dispatch: React.Dispatch<AuctionAction>;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export function AuctionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(auctionReducer, initialState);

  return (
    <AuctionContext.Provider value={{ state, dispatch }}>
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuctionContext() {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuctionContext must be used within an AuctionProvider');
  }
  return context;
}

// Convenience hooks for common actions
export function useAuctionActions() {
  const { dispatch } = useAuctionContext();
  
  return {
    setPage: (page: number) => dispatch({ type: 'SET_PAGE', payload: page }),
    setLimit: (limit: number) => dispatch({ type: 'SET_LIMIT', payload: limit }),
    setSort: (sort: string) => dispatch({ type: 'SET_SORT', payload: sort }),
    setFilters: (filters: Partial<AuctionState['filters']>) => 
      dispatch({ type: 'SET_FILTERS', payload: filters }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setTotalItems: (total: number) => dispatch({ type: 'SET_TOTAL_ITEMS', payload: total }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
  };
}
