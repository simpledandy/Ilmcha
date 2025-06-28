import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@hooks/useAuth";

export const SettingsScreen: React.FC = () => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === "uz" ? "en" : "uz";
    await i18n.changeLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <Text variant="heading1" weight="proportionalBold" style={styles.title}>
        {t("settings")}
      </Text>
      <Button
        onPress={() => {
          void toggleLanguage();
        }}
        style={{ marginBottom: 20 }}
        variant="outline"
      >
        {i18n.language === "uz" ? "Switch to English" : "O'zbekchaga o'tish"}
      </Button>
      <Button
        onPress={() => {
          void logout();
        }}
        variant="outline"
      >
        {i18n.t("logout")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F6FB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
});

export default SettingsScreen;
