import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { usePrefs } from '@/store/prefs';
import { colors } from '@/theme';

/** Entry gate: wait for persisted prefs, then route to onboarding or the app. */
export default function Index() {
  const hydrated = usePrefs((s) => s.hydrated);
  const onboarded = usePrefs((s) => s.onboarded);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  return <Redirect href={onboarded ? '/(tabs)/home' : '/onboarding'} />;
}
