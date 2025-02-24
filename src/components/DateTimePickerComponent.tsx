import React, { useState } from "react";
import {
  View,
  Modal,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RowComponent from "./RowComponent";
import { appColors } from "../constants/appColors";
import Fontisto from "@expo/vector-icons/Fontisto";
import SpaceComponent from "./SpaceComponent";

interface IProps {
  date: Date;
  setDate: (date: Date) => void;
  styles?: StyleProp<ViewStyle>;
}

const DateTimePickerComponent = (props: IProps) => {
  const { date, setDate, styles } = props;

  const [tempDate, setTempDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const confirmDate = () => {
    setDate(tempDate);
    setShow(false);
  };

  const cancelDate = () => {
    setTempDate(date);
    setShow(false);
  };

  return (
    <RowComponent
      styles={[
        {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: appColors.gray3,
          minHeight: 56,
          justifyContent: "flex-start",
          paddingHorizontal: 12,
          width: "100%",
          backgroundColor: appColors.white,
          marginBottom: 15,
        },
        styles,
      ]}
    >
      <Fontisto name="date" size={22} color={appColors.text} />
      <SpaceComponent width={14} />
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text
          style={{
            fontSize: 16,
          }}
        >
          {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      <Modal visible={show} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={onChange}
              style={{ backgroundColor: "white" }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <Button title="Hủy" onPress={cancelDate} />
              <Button title="Đồng ý" onPress={confirmDate} />
            </View>
          </View>
        </View>
      </Modal>
    </RowComponent>
  );
};

export default DateTimePickerComponent;
