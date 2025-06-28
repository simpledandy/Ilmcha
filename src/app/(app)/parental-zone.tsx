import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { navigate, goBack } from "@utils/navigation";
import { AppIcons, BackgroundImages } from "@constants/images/images";

const ITEM_WIDTH = 100;
const SPACING = 20;
const { width } = Dimensions.get("window");

// Define a type for children
interface Child {
  id: string;
  avatar: ImageSourcePropType;
}

const dummyChildren: Child[] = [
  { id: "1", avatar: AppIcons.boyAvatar },
  { id: "2", avatar: AppIcons.girlAvatar },
  { id: "3", avatar: AppIcons.addIcon },
];

export const ParentalZoneScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (ITEM_WIDTH + 2 * SPACING),
    );
    setSelectedIndex(index);
  };

  const handleReportsPress = () => {
    const selectedChild = dummyChildren[selectedIndex];
    if (selectedChild) {
      navigate("/reports", { childId: selectedChild.id });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={BackgroundImages.auth.white} style={styles.bgTop} />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="fef0e1" />
        </TouchableOpacity>
        <Text variant="heading1" weight="proportionalBold" style={styles.title}>
          {t("parentalZoneTitle")}
        </Text>
        <TouchableOpacity onPress={() => navigate("/settings")}>
          <Ionicons name="settings-outline" size={24} color="fef0e1" />
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={dummyChildren}
          keyExtractor={(item: Child) => item.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH - SPACING}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: (width - ITEM_WIDTH) / 2,
            paddingVertical: 0,
          }}
          onScroll={handleScroll}
          renderItem={({ item, index }: { item: Child; index: number }) => {
            const isActive = index === selectedIndex;
            return (
              <View
                style={[styles.avatarWrapper, isActive && styles.activeAvatar]}
              >
                <Image source={item.avatar} style={styles.avatar} />
              </View>
            );
          }}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button variant="secondary" onPress={handleReportsPress}>
          {t("reports")}
        </Button>
        <Button variant="secondary">{t("blockFunctions")}</Button>
        <Button variant="secondary">{t("screenTime")}</Button>
        <Button variant="secondary">{t("otherDevices")}</Button>
      </View>

      <Image source={AppIcons.cloudLeft} style={styles.cloudLeft} />
      <Image source={AppIcons.cloudRight} style={styles.cloudRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d99ed",
    alignItems: "center",
    paddingTop: 50,
  },
  bgTop: {
    position: "absolute",
    top: 0,
    width: "100%",
    resizeMode: "cover",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#fef0e1",
  },
  swiperContainer: {
    height: 140,
    marginBottom: 40,
    backgroundColor: "#fef0e1",
    borderColor: "#1d99ed",
    borderRadius: 60,
    overflow: "hidden",
  },
  avatarWrapper: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 60,
    margin: SPACING,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 10,
    borderColor: "#fff",
    backgroundColor: "#fff",
    transform: [{ scale: 0.8 }],
  },
  activeAvatar: {
    transform: [{ scale: 1.2 }],
    borderColor: "#1d99ed",
    overflow: "visible",
  },
  avatar: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  buttonsContainer: {
    width: "85%",
    gap: 12,
  },
  cloudLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: width * 0.4,
    resizeMode: "contain",
  },
  cloudRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: width * 0.4,
    resizeMode: "contain",
  },
});

export default ParentalZoneScreen;
