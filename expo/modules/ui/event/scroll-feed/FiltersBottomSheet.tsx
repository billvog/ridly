import Button from "@/modules/ui/Button";
import { TextInput } from "@/modules/ui/TextInput";
import { EventFeedFilters, UpdateEventFiltersFn } from "@/modules/ui/event/scroll-feed";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

type FiltersForm = {
  distance: string;
};

export function FiltersBottomSheet({
  sheetRef,
  filters,
  onUpdate,
}: {
  sheetRef: React.RefObject<BottomSheet>;
  filters: EventFeedFilters;
  onUpdate: UpdateEventFiltersFn;
}) {
  const snapPoints = useMemo(() => ["40%"], []);
  const formMethods = useForm<FiltersForm>({
    defaultValues: {
      distance: String(filters.distance ?? ""),
    },
  });

  const submitForm = formMethods.handleSubmit((data) => {
    onUpdate({
      distance: data.distance.length > 0 ? parseInt(data.distance) : undefined,
    });

    sheetRef.current?.close();
  });

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.3}
          enableTouchThrough={false}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          style={[{ backgroundColor: "rgba(0, 0, 0, 1)" }, StyleSheet.absoluteFillObject]}
        />
      )}
    >
      <BottomSheetView>
        <View className="divide-y-2 divide-gray-200">
          <View className="px-10 pt-2 pb-5">
            <Text className="font-extrabold text-2xl">Filters</Text>
          </View>
          <View className="px-10 py-6">
            <FormProvider {...formMethods}>
              <TextInput
                component={BottomSheetTextInput}
                label="Distance (km)"
                name="distance"
                placeholder="Distance in km, to show nearby events"
                keyboardType="numeric"
              />
            </FormProvider>

            <Button onPress={submitForm} buttonStyle="mr-auto mt-2">
              Apply Filters
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
