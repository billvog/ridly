import { useSelector, useDispatch } from "react-redux";
import { StoreState, StoreDispatch } from "@/redux/store";

export const useStoreSelector = useSelector.withTypes<StoreState>();
export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>();
