import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { loginUser } from "../../services/auth-services/loginApi";
import useUserStore from "@/store/useUserStore";

export default function LoginScreen() {
  const router = useRouter();
  const login = useUserStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Enter a valid email address",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    if (!password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your password",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("reached");

      console.log("reached");

      const response = await loginUser(email, password);
      console.log("reached");

      if (!response.data) {
        Toast.show({
          type: "error",
          text1: response.message || "Error Logging In",
          position: "bottom",
          visibilityTime: 3000,
        });
      }
      await login({
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      // const { accessToken, refreshToken, user } = response.data;
      // await AsyncStorage.setItem("accessToken", accessToken);
      // await AsyncStorage.setItem("refreshToken", refreshToken);
      // await AsyncStorage.setItem("user", JSON.stringify(user));

      Toast.show({
        type: "success",
        text1: "Login Successful",
        position: "bottom",
        visibilityTime: 3000,
      });

      router.replace("/(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Error Logging In",
        position: "bottom",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={["#c3b5b0", "#1160a6"]} style={styles.header}>
          <Text style={styles.brandName}>CampusCart</Text>
          <View>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>
              Sign in to your campus marketplace
            </Text>
          </View>
        </LinearGradient>

        {/* Tab Switch */}
        <View style={styles.tabContainer}>
          <View style={styles.tabSwitch}>
            <View style={[styles.tabBtn, styles.tabBtnActive]}>
              <Text style={[styles.tabBtnText, styles.tabBtnTextActive]}>
                Login
              </Text>
            </View>
            <TouchableOpacity
              style={styles.tabBtn}
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.tabBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#8E8E9A"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="you@iit.ac.in"
              placeholderTextColor="#BDB8B3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#8E8E9A"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#BDB8B3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((p) => !p)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#8E8E9A"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotRow}
            onPress={() => router.push("/verify-forgot-otp")}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginBtn}
          >
            <LinearGradient
              colors={["#54d5eb", "#1160a6"]}
              style={styles.loginBtnGradient}
            >
              <Text style={styles.loginBtnText}>
                {isLoading ? "Logging in..." : "Login to CampusCart 🚀"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.signupHint}>
            <Text style={styles.signupHintText}>
              New to campus marketplace?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signupHintLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0088ff" },
  scroll: { flexGrow: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    height: 360,
    justifyContent: "space-evenly",
  },
  brandName: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 40, fontWeight: "900", color: "#FFFFFF" },
  headerSubtitle: {
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },
  tabContainer: {
    backgroundColor: "#1160a6",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  tabSwitch: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 5,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabBtnActive: { backgroundColor: "#FFFFFF" },
  tabBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  tabBtnTextActive: { color: "#0088ff" },
  form: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 26,
    paddingBottom: 48,
    marginTop: -10,
    elevation: 5,
    shadowOpacity: 1,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 8,
    marginTop: 16,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#F0E8E2",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1A1A2E",
    outlineStyle: "none",
  },
  eyeBtn: { padding: 6 },
  forgotRow: { alignItems: "flex-end", marginTop: 10, marginBottom: 24 },
  forgotText: { fontSize: 13, fontWeight: "600", color: "#0088ff" },
  loginBtn: { borderRadius: 16, overflow: "hidden" },
  loginBtnGradient: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 16,
  },
  loginBtnText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  signupHint: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupHintText: { fontSize: 13, color: "#8E8E9A" },
  signupHintLink: { fontSize: 13, fontWeight: "700", color: "#0088ff" },
});
