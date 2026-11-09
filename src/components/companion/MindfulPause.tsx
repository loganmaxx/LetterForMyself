import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { Language } from '../../types';
import { PALETTE, FONTS } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';

interface MindfulPauseProps {
  language: Language;
  nightMode: boolean;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale';

export const MindfulPause: React.FC<MindfulPauseProps> = ({ language, nightMode }) => {
  const isNight = nightMode;
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next phase
            if (phase === 'inhale') {
              HapticsService.medium();
              setPhase('hold');
              return 7;
            } else if (phase === 'hold') {
              HapticsService.light();
              setPhase('exhale');
              return 8;
            } else {
              HapticsService.medium();
              setPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  useEffect(() => {
    if (!isActive) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (phase === 'inhale') {
      Animated.timing(scaleAnim, {
        toValue: 1.45,
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (phase === 'hold') {
      // Hold steady
    } else if (phase === 'exhale') {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isActive, phase]);

  const phaseText = {
    inhale: language === 'id' ? 'Tarik Napas...' : 'Inhale...',
    hold: language === 'id' ? 'Tahan Napas...' : 'Hold Breath...',
    exhale: language === 'id' ? 'Hembuskan Perlahan...' : 'Exhale Gently...',
  };

  const handleToggle = () => {
    HapticsService.medium();
    setIsActive(!isActive);
  };

  const handleReset = () => {
    HapticsService.light();
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(4);
  };

  return (
    <View style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, isNight && { color: PALETTE.nightInk }]}>
          {language === 'id' ? 'Napas Tenang (4-7-8)' : 'Mindful Breath (4-7-8)'}
        </Text>
        <Text style={[styles.subtitle, isNight && { color: PALETTE.nightInkMuted }]}>
          {language === 'id'
            ? 'Tenangkan sistem sarafmu dalam 1-2 menit.'
            : 'Soothe your nervous system in 2 minutes.'}
        </Text>
      </View>

      <View style={styles.centerContainer}>
        {/* Animated Breathing Circle */}
        <Animated.View
          style={[
            styles.breathCircle,
            { transform: [{ scale: scaleAnim }] },
            isNight && { backgroundColor: 'rgba(75, 123, 107, 0.25)', borderColor: PALETTE.botanicalHeader },
          ]}
        >
          <Text style={[styles.phaseText, isNight && { color: PALETTE.nightInk }]}>
            {isActive ? phaseText[phase] : language === 'id' ? 'Sentuh Mulai' : 'Tap Start'}
          </Text>
          {isActive && <Text style={styles.counterText}>{secondsLeft}s</Text>}
        </Animated.View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <RotateCcw size={18} color={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playBtn} onPress={handleToggle} activeOpacity={0.85}>
          {isActive ? <Pause size={22} color="#FFFFFF" /> : <Play size={22} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      <View style={{ height: 110 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.serifSemiBold,
    color: PALETTE.ink,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkMuted,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DCE8E2',
    borderWidth: 2,
    borderColor: PALETTE.botanicalHeader,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#263F36',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  phaseText: {
    fontSize: 15,
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
    textAlign: 'center',
  },
  counterText: {
    fontSize: 28,
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
    marginTop: 6,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 30,
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PALETTE.sand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PALETTE.botanicalHeader,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#263F36',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});
