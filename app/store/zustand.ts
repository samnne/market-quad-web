import { Conversation, Listing, User, UserPreferences } from "@/src/generated/prisma/client";
import { ConversationInclude } from "@/src/generated/prisma/models";

import { create, StoreApi, UseBoundStore } from "zustand";

export interface Store {
  type: "sign-in" | "sign-up" | "otp";
  changeType: Function;
}
export const useType = create((set) => {
  const store: Store = {
    type: "sign-in",
    changeType: (newType: string) => set({ type: newType }),
  };
  return { ...store };
});

export type ListingStore = {
  listings: Listing[];
  setListings: Function;
  selectedListing?: Listing | null;
  setSelectedListing: Function;
  reset: Function;
};

export const useListings: UseBoundStore<StoreApi<ListingStore>> = create(
  (set) => {
    return {
      listings: [],
      setListings: (listings: Listing[]) => set({ listings: listings }),
      selectedListing: null,
      setSelectedListing: (listing: Listing) =>
        set({ selectedListing: listing }),
      reset: () => set({ listings: [], selectedListing: null }),
    };
  },
);

export type UserState = {
  user: User | null;
  setUser: Function;
  userListings: Listing[];
  setUserListings: Function;
  reset: Function;
  preferences: UserPreferences | null;
  setPreferences: (p: UserPreferences | null) => void;
};
export const useUser: UseBoundStore<StoreApi<UserState>> = create((set) => {
  return {
    user: null,
    setUser: (user: User) => set({ user: user }),
    userListings: [],
    setUserListings: (listings: Listing[]) => set({ userListings: listings }),
    reset: () => set({ user: null, userListings: [] }),
    preferences: null,
    setPreferences: (pref: UserPreferences | null) => ({ preferences: pref }),
  };
});

export type MessagePopUp = {
  error: boolean;
  success: boolean;
  setSuccess: Function;
  setError: Function;
  msg: string;
  setMessage: Function;
};

export const useMessage: UseBoundStore<StoreApi<MessagePopUp>> = create(
  (set) => {
    return {
      error: false,
      success: false,
      msg: "",
      setSuccess: (success: boolean) => set({ success: success }),
      setError: (error: boolean) => set({ error: error }),
      setMessage: (msg: string) => set({ msg: msg }),
    };
  },
);

export type ConvosState = {
  convos: (Conversation & ConversationInclude)[] | null;
  setConvos: Function;
  selectedConvo: Conversation | null;
  setSelectedConvo: Function;
  reset: Function;
};
export const useConvos: UseBoundStore<StoreApi<ConvosState>> = create((set) => {
  return {
    convos: null,
    selectedConvo: null,
    setSelectedConvo: (convo: Conversation) => set({ selectedConvo: convo }),
    setConvos: (convos: (Conversation & ConversationInclude)[]) =>
      set({ convos: convos }),
    reset: () => set({ convos: null, selectedConvo: null }),
  };
});
export interface ReviewModalState {
  reviewModal: boolean;
  setReviewModal: Function;
  makeReview: boolean;
  setMakeAReview: Function;
  reset: Function;
}

export const useReviewModal: UseBoundStore<StoreApi<ReviewModalState>> = create(
  (set) => {
    return {
      reviewModal: false,
      setReviewModal: (show: boolean) =>
        set({
          reviewModal: show,
        }),
      makeReview: false,
      setMakeAReview: (show: boolean) => set({ makeReview: show }),
      reset: () => set({ reviewModal: false, makeReview: false }),
    };
  },
);
