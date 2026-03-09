import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronRight, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // ---------------- CLIENT-SIDE VALIDATIONS ----------------

    if (!email.trim()) {
      return Alert.alert("Validation Error", "Please enter your email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Validation Error", "Invalid email format");
    }

    if (!password) {
      return Alert.alert("Validation Error", "Please enter your password");
    }

    // Button animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens securely in AsyncStorage
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      console.log("Login success:", response.data.message);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Login error:", error.response?.data);

      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Mesh Gradient Background */}
      <LinearGradient
        colors={["#FAE8FF", "#F0E7FF", "#EEF2FF"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Dynamic Background Blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.welcomeBack}>Welcome Back! 👋</Text>
              <Text style={styles.headerTitle}>Campus Exchange</Text>
              <Text style={styles.headerSubtitle}>
                Sign in to access your marketplace
              </Text>
            </View>

            <View style={styles.glassCard}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#6366f1" style={styles.innerIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="name@college.edu"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color="#6366f1" style={styles.innerIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#94a3b8" />
                    ) : (
                      <Eye size={20} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPress={handleLogin}
                  activeOpacity={0.9}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={["#d946ef", "#8b5cf6", "#6366f1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.mainButton}
                  >
                    <Text style={styles.mainButtonText}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Text>
                    {!isLoading && (
                      <ChevronRight
                        size={20}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>New here? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.footerLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  blob: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    opacity: 0.3,
  },
  blob1: { backgroundColor: "#fbcfe8", top: -100, left: -100 },
  blob2: { backgroundColor: "#e0e7ff", bottom: -50, right: -100 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingBottom: 40 },
  content: { paddingHorizontal: 20 },
  header: { marginBottom: 30, alignItems: "center" },
  welcomeBack: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1e1b4b",
    letterSpacing: -1,
  },
  headerSubtitle: { fontSize: 15, color: "#64748b", marginTop: 5 },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 35,
    elevation: 12,
  },
  inputContainer: { marginBottom: 18 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  innerIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
    outlineStyle: "none",
  },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 25, marginRight: 4 },
  forgotPasswordText: { color: "#6366f1", fontSize: 14, fontWeight: "600" },
  mainButton: {
    height: 58,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  mainButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
  dividerText: {
    marginHorizontal: 15,
    color: "#94a3b8",
    fontWeight: "600",
    fontSize: 12,
  },
  secondaryButton: {
    flexDirection: "row",
    height: 58,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  secondaryButtonText: { color: "#1e293b", fontSize: 16, fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  footerText: { color: "#64748b", fontSize: 15 },
  footerLink: { color: "#6366f1", fontSize: 15, fontWeight: "700" },
});

export default LoginScreen;
