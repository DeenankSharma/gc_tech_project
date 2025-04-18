import {create} from "zustand";
import {createChatSlice} from "../store/slice/chat.slice"


export const useAppStore = create()((...a) => ({
    ...createChatSlice(a[0], a[1]),
}));