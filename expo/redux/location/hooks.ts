import { useSelector } from "react-redux";
import { LocationStoreState } from "@/redux/location/store";

export const useLocationSelector = useSelector.withTypes<LocationStoreState>();
