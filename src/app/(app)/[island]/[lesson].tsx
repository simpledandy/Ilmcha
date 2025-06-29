import { playAudio, cleanupAudio } from '@/src/utils/audio';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import Text from '@components/Text';
import { TreasureReward } from '@components/TreasureReward';
import { rewardManager } from '@utils/rewardManager';
import i18n from 'i18n';

export default function CountingLesson() {
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);
  const { t } = i18n;

  useEffect(() => {
    playAudio('countingFish');
    
    // Cleanup audio when component unmounts
    return () => {
      cleanupAudio();
    };
  }, []);

  const handleChestPress = async () => {
    if (isChestOpen) return;
    
    setIsChestOpen(true);
    playAudio('five');
    
    // Award treasure after a short delay
    setTimeout(async () => {
      try {
        const result = await rewardManager.awardTreasure(
          'counting',
          0.9, // Performance score (90%)
          false, // Not perfect
          true, // First time
          1.0 // Speed
        );
        
        setRewardData(result);
        setShowReward(true);
      } catch (error) {
        console.error('Error awarding treasure:', error);
      }
    }, 1000);
  };

  const handleRewardClose = () => {
    setShowReward(false);
    setRewardData(null);
  };

  return (
    <ImageBackground
      source={require('@assets/images/counting_bg.png')}
      style={styles.background}
    >
      {/* Stars and Buttons */}
      <View style={styles.topBar}>
        <Text variant="heading3" style={styles.lessonLabel}>{t('lesson5')}</Text>
        <View style={styles.stars}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
        </View>
        <TouchableOpacity style={styles.nextButton}>
          <Text variant="button" style={styles.nextButtonText}>{t('next')}</Text>
        </TouchableOpacity>
      </View>

      {/* Penguin and Instruction */}
      <View style={styles.centerArea}>
        <Image
          source={require('@assets/images/penguin/waving-explorer.png')}
          style={styles.penguin}
          resizeMode="contain"
        />
      </View>

      {/* Bottom chest */}
      <View style={styles.bottomArea}>
        <TouchableOpacity onPress={handleChestPress} disabled={isChestOpen}>
          <Image
            source={isChestOpen ? require('@assets/images/chest-open.png') : require('@assets/images/chest.png')}
            style={styles.chest}
            resizeMode="contain"
          />
          {isChestOpen && (
            <View style={styles.numberContainer}>
              <Image
                source={require('@assets/images/light.png')}
                style={styles.lightEffect}
                resizeMode="contain"
              />
              <Image
                source={require('@assets/images/number-five.png')}
                style={styles.number}
                resizeMode="contain"
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Treasure Reward Modal */}
      {rewardData && (
        <TreasureReward
          treasure={rewardData.treasure}
          points={rewardData.points}
          streak={rewardData.streak}
          isVisible={showReward}
          onClose={handleRewardClose}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40,
    alignItems: 'center',
  },
  lessonLabel: {
    backgroundColor: '#fff0b3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 20,
  },
  nextButton: {
    backgroundColor: '#ffcc80',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#000',
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  penguin: {
    width: 150,
    height: 150,
  },
  bottomArea: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chest: {
    width: 80,
    height: 80,
    left: '30%',
  },
  numberContainer: {
    position: 'absolute',
    top: -35,
    left: '35%',
    transform: [{ translateX: -20 }],
    alignItems: 'center',
  },
  lightEffect: {
    position: 'absolute',
    top: -30,
    width: 200,
    height: 200,
    opacity: 0.8,
  },
  number: {
    width: 50,
    height: 50,
  },
});
