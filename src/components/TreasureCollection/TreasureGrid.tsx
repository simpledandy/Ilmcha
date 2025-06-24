import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from '@components/Text';
import { Treasure } from '@constants/rewards';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';

interface TreasureGridProps {
  treasures: Treasure[];
  getRarityColor: (rarity: string) => string;
}

const TreasureGrid: React.FC<TreasureGridProps> = ({ treasures, getRarityColor }) => (
  <View style={styles.treasuresGrid}>
    {treasures.map((treasure, index) => (
      <View key={`${treasure.id}-${index}`} style={styles.treasureItem}>
        <View style={[styles.rarityIndicator, { backgroundColor: getRarityColor(treasure.rarity) }]} />
        <Image source={treasure.imageSource} style={styles.treasureImage} resizeMode="contain" />
        <View style={styles.treasureInfo}>
          <Text variant="body" style={styles.treasureName}>{treasure.name}</Text>
          <Text variant="caption" style={styles.treasureValue}>+{treasure.value} pts</Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  treasuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 8 },
  treasureItem: { width: 120, margin: 8, alignItems: 'center' },
  rarityIndicator: { width: 16, height: 16, borderRadius: 8, marginBottom: 4 },
  treasureImage: { width: 60, height: 60 },
  treasureInfo: { alignItems: 'center', marginTop: 4 },
  treasureName: { fontWeight: 'bold' },
  treasureValue: { color: colors.text.secondary },
});

export { TreasureGrid }; 