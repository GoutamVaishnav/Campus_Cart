import { LinearGradient } from "expo-linear-gradient";
import { GraduationCap } from "lucide-react-native";
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

  useEffect(() => {
    // Entrance Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle Floating Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Loading Bar Progress
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: false, // Width animation doesn't support native driver
    }).start();

    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Premium Mesh Gradient Background */}
      <LinearGradient
        colors={["#F0E7FF", "#FAE8FF", "#EEF2FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Background Depth Elements */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
          },
        ]}
      >
        <View style={styles.glassIconContainer}>
          <GraduationCap size={64} color="#6366f1" strokeWidth={1.5} />
        </View>

        <Text style={styles.brandTitle}>Campus</Text>
        <Text style={styles.brandSubtitle}>Exchange</Text>

        <View style={styles.taglineBox}>
          <Text style={styles.taglineText}>TRUSTED BY STUDENTS</Text>
        </View>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <View style={styles.glassLoadingBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={["#6366f1", "#d946ef"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>
          Initializing secure marketplace...
        </Text>
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
  blob: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.35,
  },
  blob1: {
    backgroundColor: "#c7d2fe",
    top: -100,
    left: -100,
  },
  blob2: {
    backgroundColor: "#f5d0fe",
    bottom: -100,
    right: -100,
  },
  logoContainer: {
    alignItems: "center",
  },
  glassIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    // Premium Shadow
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  brandTitle: {
    fontSize: 44,
    fontWeight: "900",
    color: "#1e1b4b",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  brandSubtitle: {
    fontSize: 44,
    fontWeight: "300",
    color: "#6366f1",
    letterSpacing: 2,
    lineHeight: 44,
    marginTop: -5,
  },
  taglineBox: {
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  taglineText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#4338ca",
    letterSpacing: 2,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },
  glassLoadingBar: {
    width: width * 0.7,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 15,
    color: "#64748b",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
