import React, { useContext, useEffect, useState } from "react";
import { Modal, Text, View } from "react-native";
import Button from "./ui/Button";

type ModalProps = {
  title: string;
  body: string;
  onClose?: () => void;
  buttons: ModalButton[];
};

type ModalButton = {
  text: string;
  closeOnPress?: boolean;
  onPress?: () => void;
};

type ModalContextType = {
  open: (props: ModalProps) => void;
};

export const ModalContext = React.createContext<ModalContextType>({
  open() {},
});

interface ModalProviderProps {
  children: JSX.Element;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState<ModalProps>();

  function open(props: ModalProps) {
    setModalVisible(true);
    setModalProps(props);
  }

  useEffect(() => {
    if (!modalVisible && modalProps?.onClose) {
      modalProps.onClose();
    }
  }, [modalVisible]);

  return (
    <ModalContext.Provider value={{ open }}>
      {modalProps && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View className="flex-1 justify-center items-center p-8">
            <View className="bg-white w-full rounded-2xl px-6 py-4 flex">
              <View className="mb-2">
                <Text className="font-extrabold text-2xl text-black">
                  {modalProps.title}
                </Text>
              </View>
              <View className="mb-4">
                <Text className="font-medium text-base text-black">
                  {modalProps.body}
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                {modalProps.buttons.map((button) => (
                  <View key={button.text} className="flex-grow">
                    <Button
                      onPress={() =>
                        button.closeOnPress
                          ? setModalVisible(false)
                          : button.onPress
                          ? button.onPress()
                          : null
                      }
                    >
                      {button.text}
                    </Button>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}

      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
