import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { router } from "expo-router";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Tagline fade in delayed
    Animated.timing(taglineFade, {
      toValue: 1,
      duration: 800,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Subtle float loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3200,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0088ff" />

      {/* Same gradient as login header */}
      <LinearGradient
        colors={["#c3b5b0", "#0088ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle light overlay circles for depth */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* Logo area */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
          },
        ]}
      >
        {/* Icon badge — mirrors login's white card bottom */}
        <View style={styles.iconBadge}>
          <Text style={styles.cartEmoji}>🛒</Text>
        </View>

        <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}>
          <Text style={styles.brandTitle}>Campus</Text>
          <Text style={styles.brandAccent}>Cart</Text>
        </Animated.View>

        <Animated.View style={[styles.taglineBox, { opacity: taglineFade }]}>
          <Text style={styles.taglineText}>YOUR CAMPUS MARKETPLACE</Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View style={[styles.pillsRow, { opacity: taglineFade }]}>
          {["Buy", "Sell", "Exchange"].map((label) => (
            <View key={label} style={styles.featurePill}>
              <Text style={styles.featurePillText}>{label}</Text>
            </View>
          ))}
        </Animated.View>
      </Animated.View>

      {/* Bottom loading area — sits on white card like the login form */}
      <View style={styles.bottomCard}>
        <View style={styles.loadingBarTrack}>
          <Animated.View
            style={[
              styles.loadingBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={["#54d5eb", "#0088ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>Initializing secure marketplace...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Depth blobs — white/light tones to complement blue
  blob: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    opacity: 0.12,
  },
  blob1: {
    backgroundColor: "#FFFFFF",
    top: -80,
    right: -80,
  },
  blob2: {
    backgroundColor: "#FFFFFF",
    bottom: 60,
    left: -120,
  },

  // Logo
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconBadge: {
    width: 120,
    height: 120,
    borderRadius: 34,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 14,
  },
  cartEmoji: {
    fontSize: 54,
  },
  brandTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    lineHeight: 50,
    textAlign: "center",
  },
  brandAccent: {
    fontSize: 48,
    fontWeight: "300",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 6,
    lineHeight: 48,
    marginTop: -4,
    textAlign: "center",
  },
  taglineBox: {
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  taglineText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2.5,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  featurePill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  featurePillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Bottom white card — mirrors the login form card
  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 52,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  loadingBarTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "#F0E8E2",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 14,
  },
  loadingBarFill: {
    height: "100%",
    borderRadius: 10,
  },
  loadingText: {
    color: "#8E8E9A",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});

export default SplashScreen;