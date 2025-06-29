import React, { useState } from "react";
import { StyleSheet, Image, SafeAreaView, View } from "react-native";
import { replace, goBack } from "@utils/navigation";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Text } from "@components/Text";
import { BackButton } from "@components/BackButton";
import { i18n } from "i18n";
import { AppIcons } from "@constants/images/images";

export const Onboarding: React.FC = () => {
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState<string | null>(null);

  const ageGroups = [
    { key: "ageGroup_2_3", value: "2-3" },
    { key: "ageGroup_4_5", value: "4-5" },
    { key: "ageGroup_6_7", value: "6-7" },
    { key: "ageGroup_7_plus", value: "7+" },
  ];

  const handleSave = () => {
    if (name && ageGroup) {
      replace("/(app)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton
        onPress={() => goBack()}
        size="medium"
        style={styles.backButton}
      />

      <Text variant="heading1" style={styles.title}>
        {i18n.t("newAccount")}
      </Text>

      <View style={styles.avatarWrapper}>
        <Image
          source={AppIcons.emptyAvatar}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>

      <View style={styles.form}>
        <Input
          placeholder={i18n.t("childNamePlaceholder")}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Text variant="body" style={styles.ageGroupLabel}>
          {i18n.t("ageGroupLabel")}
        </Text>
        <View style={styles.ageGroupRow}>
          {ageGroups.map((group) => (
            <Button
              key={group.key}
              variant={ageGroup === group.value ? "primary" : "outline"}
              size="medium"
              style={[
                styles.ageGroupButton,
                ageGroup === group.value && styles.ageGroupButtonSelected,
              ]}
              textStyle={
                ageGroup === group.value
                  ? styles.ageGroupTextSelected
                  : styles.ageGroupText
              }
              onPress={() => setAgeGroup(group.value)}
            >
              {i18n.t(group.key)}
            </Button>
          ))}
        </View>
        <Button
          variant="primary"
          size="large"
          onPress={handleSave}
          style={styles.button}
          disabled={!name || !ageGroup}
        >
          {i18n.t("save")}
        </Button>
      </View>

      <View style={styles.clouds}>
        <Image source={AppIcons.cloudLeft} style={styles.cloud} />
        <Image source={AppIcons.cloudRight} style={styles.cloud} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEFE4",
    alignItems: "center",
    paddingTop: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 20,
  },
  title: {
    marginVertical: 16,
    color: "#3366CC",
  },
  avatarWrapper: {
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 10,
    borderWidth: 4,
    borderColor: "#4DB8FF",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  form: {
    backgroundColor: "#4DB8FF",
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: "90%",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#71C9F8",
    borderRadius: 20,
    width: "100%",
    marginBottom: 16,
    color: "white",
  },
  ageGroupLabel: {
    marginTop: 8,
    marginBottom: 8,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  ageGroupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
    gap: 8,
  },
  ageGroupButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#007AFF",
    backgroundColor: "#E6F0FF",
  },
  ageGroupButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  ageGroupText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  ageGroupTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  button: {
    marginTop: 10,
    width: "100%",
  },
  clouds: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  cloud: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
});

export default Onboarding;
