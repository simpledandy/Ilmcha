import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { AppButton, AppImage, AppInput, AppText } from '@components';
import { i18n } from '@i18n';
import { supabase } from '@utils/supabaseClient';
import { useAuth } from '@hooks/useAuth';
import * as FileSystem from 'expo-file-system';
import { PenguinImages } from '@/src/constants';

// Helper to get content type from file extension
function getContentType(uri: string) {
  const ext = uri.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  return 'application/octet-stream';
}

export default function Onboarding() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(require('@assets/images/empty-avatar.png'));
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleAvatarSelect = async () => {
    // Simulate avatar selection
    setAvatar(PenguinImages.poses.wavingPink);
    setAvatarError(null);
    // The uploadData function is no longer needed here as the avatar is now directly set.
    // If you still need to simulate an upload, you would call a placeholder function.
  };

  const handleSave = async () => {
    if (!name || !age) return;
    setLoading(true);
    setSaveError(null);
    try {
      // Insert child record (without avatar_url first)
      const parentId = user?.id || null;
      if (!parentId) throw new Error('No parent id found');
      const { data: childData, error: childError } = await supabase
        .from('children')
        .insert([
          {
            parent_id: parentId,
            name,
            date_of_birth: age ? new Date(new Date().getFullYear() - parseInt(age, 10), 0, 1) : null,
            avatar_url: null,
          },
        ])
        .select();
      if (childError || !childData || !childData[0]) throw childError || new Error('Failed to create child');
      const childId = childData[0].id;
      // Upload avatar to Supabase storage (using placeholder for now)
      let avatarUrl = null;
      try {
        // Get local file URI for the avatar (placeholder)
        const assetUri = Image.resolveAssetSource(avatar as any).uri;
        const fileExt = assetUri.split('.').pop();
        const fileName = `${childId}.${fileExt}`;
        const fileType = getContentType(assetUri);
        const fileData = await FileSystem.readAsStringAsync(assetUri, { encoding: FileSystem.EncodingType.Base64 });
        const buffer = Buffer.from(fileData, 'base64');
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, buffer, { contentType: fileType, upsert: true });
        if (uploadError) throw uploadError;
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarUrl = publicUrlData?.publicUrl || null;
        // Update child record with avatar_url
        if (avatarUrl) {
          await supabase.from('children').update({ avatar_url: avatarUrl }).eq('id', childId);
        }
      } catch {
        setAvatarError('Failed to upload avatar.');
      }
      // Insert child_stats record
      const { error: statsError } = await supabase
        .from('child_stats')
        .insert([{ child_id: childId }]);
      if (statsError) throw statsError;
      router.replace('/(app)');
    } catch {
      setSaveError('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AppText style={styles.backText}>{i18n.t('back')}</AppText>
      </TouchableOpacity>

      <AppText variant="heading1" style={styles.title}>
        {i18n.t('newAccount')}
      </AppText>

      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={handleAvatarSelect}>
          <AppImage
            source={avatar}
            style={styles.avatar}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <AppInput
          placeholder={i18n.t('childNamePlaceholder')}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <AppInput
          placeholder={i18n.t('childAgePlaceholder')}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />

        <AppButton
          variant="primary"
          size="large"
          onPress={handleSave}
          style={styles.button}
        >
          {i18n.t('save')}
        </AppButton>
        {loading && <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 10 }} />}
        {avatarError && <AppText style={{ color: 'red', marginTop: 8 }}>{avatarError}</AppText>}
        {saveError && <AppText style={{ color: 'red', marginTop: 8 }}>{saveError}</AppText>}
      </View>

      <View style={styles.clouds}>
        <AppImage source={require('@assets/images/cloud-left.png')} style={styles.cloud} />
        <AppImage source={require('@assets/images/cloud-right.png')} style={styles.cloud} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEFE4',
    alignItems: 'center',
    paddingTop: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    marginVertical: 16,
    color: '#3366CC',
  },
  avatarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 10,
    borderWidth: 4,
    borderColor: '#4DB8FF',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  form: {
    backgroundColor: '#4DB8FF',
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: '90%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#71C9F8',
    borderRadius: 20,
    width: '100%',
    marginBottom: 16,
    color: 'white',
  },
  button: {
    marginTop: 10,
  },
  clouds: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  cloud: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
});