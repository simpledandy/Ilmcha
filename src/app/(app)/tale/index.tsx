import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { TaleCard } from "@components/TaleCard";
import { useTranslation } from "react-i18next";
import { useAudio } from "@/src/providers/AudioProvider";
import { tales } from "@constants/tales";
import { FlyingPenguin } from '@components/FlyingPenguin';
import { useFocusEffect } from '@react-navigation/native';
import { AppIcons, BackgroundImages } from "@/src/constants";

const StoriesScreen: React.FC = () => {
  const { i18n } = useTranslation();
  const { play, stop } = useAudio();
  useFocusEffect(
    React.useCallback(() => {
      play('welcomeTales', true);
      return () => {
        stop();
      };
    }, [play, stop])
  );

  return (
    <ImageBackground source={AppIcons.storiesBg} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {tales.map((tale) => (
            <TaleCard
              key={tale.id}
              imageSource={tale.image}
              title={i18n.language === "uz" ? tale.title.uz : tale.title.en}
              onPress={() =>
                router.push({
                  pathname: "/tale/[tale]",
                  params: { tale: tale.id },
                })
              }
            />
          ))}
        </View>

        <View style={styles.penguin}><FlyingPenguin /></View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  container: { alignItems: "center", paddingTop: 80, paddingBottom: 100 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  penguin: {
    width: 200,
    height: 200,
    marginTop: 40,
    marginLeft: "auto",
  },
});

export default StoriesScreen;
