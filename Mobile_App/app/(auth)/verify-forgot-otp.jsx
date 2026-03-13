import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export default function VerifyForgotOTPScreen() {
  const { email: paramEmail } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [email, setEmail] = useState(paramEmail || "");
  const [isLoadingotp, setIsLoadingotp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const inputRefs = useRef([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email");
      return;
    }
    try {
      setIsLoadingotp(true);
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_AUTH_API_URL}:5001/auth/forgot-password`,
        { email }
      );
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: response.message || 'OTP has been sent to your email',
        position: 'bottom',
        visibilityTime: 3000,
      });
      setOtpSent(true);
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || "Failed to send OTP",
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoadingotp(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`http://${process.env.EXPO_PUBLIC_AUTH_API_URL}:5001/auth/forgot-password`, { email });
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'A new OTP has been sent to your email',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: error.response?.data?.message || "Could not resend OTP",
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      shakeAnimation();
      return;
    }
    if (!email.trim()) {
      shakeAnimation();
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter your registered email',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_AUTH_API_URL}:5001/auth/verify-otp`,
        { email, otp: otpString }
      );
      if (!response.data) {
        shakeAnimation();
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: 'Invalid OTP or OTP expired',
          position: 'bottom',
          visibilityTime: 3000,
        });
        return;
      }
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message || 'Email verified successfully!',
        position: 'bottom',
        visibilityTime: 3000,
      });
      router.push("/change-password");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      if (message === "OTP expired" || message === "Invalid OTP") shakeAnimation();
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: message,
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0088ff" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={["#c3b5b0", "#0088ff"]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.brandName}>🛒 CampusCart</Text>
          <Text style={styles.headerTitle}>Forgot Password?</Text>
          <Text style={styles.headerSubtitle}>
            We'll send a code to verify your identity
          </Text>
        </LinearGradient>

        {/* Step indicator */}
        <View style={styles.pillContainer}>
          <View style={styles.pillWrap}>
            <View style={[styles.pill, styles.pillActive]}>
              <Text style={styles.pillText}>1</Text>
            </View>
            <View style={styles.pillLine} />
            <View style={[styles.pill, otpSent && styles.pillActive]}>
              <Text style={[styles.pillText, !otpSent && { color: "rgba(255,255,255,0.5)" }]}>2</Text>
            </View>
            <View style={styles.pillLine} />
            <View style={styles.pill}>
              <Text style={[styles.pillText, { color: "rgba(255,255,255,0.5)" }]}>3</Text>
            </View>
          </View>
          <View style={styles.pillLabelRow}>
            <Text style={[styles.pillLabel, { color: "#fff", fontWeight: "700" }]}>Email</Text>
            <Text style={[styles.pillLabel, otpSent && { color: "#fff", fontWeight: "700" }]}>Verify</Text>
            <Text style={styles.pillLabel}>Reset</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.form}>

          {/* Email row with Send OTP button inline */}
          <Text style={styles.label}>Registered Email</Text>
          <View style={styles.emailRow}>
            <View style={[styles.inputWrap, { flex: 1, marginRight: 10 }]}>
              <Ionicons name="mail-outline" size={18} color="#8E8E9A" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@iit.ac.in"
                placeholderTextColor="#BDB8B3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity onPress={handleSendOtp} disabled={isLoadingotp} style={styles.sendBtn}>
              <LinearGradient colors={["#54d5eb", "#0088ff"]} style={styles.sendBtnGradient}>
                <Text style={styles.sendBtnText}>
                  {isLoadingotp ? "..." : otpSent ? "Resent" : "Send OTP"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* OTP section — shown after OTP sent */}
          {otpSent && (
            <>
              <View style={styles.otpLabelRow}>
                <Text style={styles.label}>One-Time Password</Text>
                <View style={styles.timerBadge}>
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color={timer > 0 ? "#0088ff" : "#8E8E9A"}
                  />
                  {timer > 0 ? (
                    <Text style={styles.timerText}>
                      {" "}{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResend}>
                      <Text style={styles.resendText}> Resend</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <Animated.View
                style={[styles.otpGrid, { transform: [{ translateX: shakeAnim }] }]}
              >
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[styles.otpBox, digit !== "" && styles.otpBoxFilled]}
                    value={digit}
                    onChangeText={(v) => handleOtpChange(v, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                ))}
              </Animated.View>
            </>
          )}

          {/* Hint */}
          <View style={styles.hintBox}>
            <Ionicons name="information-circle-outline" size={15} color="#0088ff" />
            <Text style={styles.hintText}>
              {otpSent
                ? "Enter the 6-digit code sent to your email. Check spam if not received."
                : "Enter your registered email and tap 'Send OTP' to receive a verification code."}
            </Text>
          </View>

          {/* Verify button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={handleVerify}
              disabled={isLoading || !otpSent}
              style={styles.verifyBtn}
            >
              <LinearGradient
                colors={isOtpComplete && otpSent ? ["#54d5eb", "#0088ff"] : ["#C8E6FA", "#A0CFEE"]}
                style={styles.verifyBtnGradient}
              >
                <Text style={styles.verifyBtnText}>
                  {isLoading ? "Verifying..." : "Verify & Continue 🔓"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.loginHint}>
            <Text style={styles.loginHintText}>Remembered your password? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginHintLink}>Back to Login</Text>
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

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  brandName: { fontSize: 20, fontWeight: "900", color: "#FFFFFF", marginBottom: 20 },
  headerTitle: { fontSize: 30, fontWeight: "900", color: "#FFFFFF" },
  headerSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 6 },

  // Step pills
  pillContainer: {
    backgroundColor: "#0088ff",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  pillWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  pill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  pillActive: { backgroundColor: "#FFFFFF" },
  pillDone: { backgroundColor: "rgba(255,255,255,0.6)" },
  pillText: { fontSize: 11, fontWeight: "700", color: "#0088ff" },
  pillLine: { flex: 1, height: 2, backgroundColor: "rgba(255,255,255,0.3)", marginHorizontal: 6 },
  pillLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  pillLabel: { fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: "600", width: 60, textAlign: "center" },

  // Card
  form: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 26,
    paddingBottom: 48,
    marginTop: -10,
  },

  // Email row
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  // Inputs
  label: { fontSize: 12, fontWeight: "600", color: "#1A1A2E", marginBottom: 8, marginTop: 16 },
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
  input: { flex: 1, paddingVertical: 13, fontSize: 14, color: "#1A1A2E", outlineStyle: "none" },

  // Send OTP button
  sendBtn: { borderRadius: 14, overflow: "hidden" },
  sendBtnGradient: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },

  // OTP label row
  otpLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: { fontSize: 12, fontWeight: "700", color: "#0088ff" },
  resendText: { fontSize: 12, fontWeight: "700", color: "#0088ff" },

  // OTP grid
  otpGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  otpBox: {
    width: (width - 52 - 5 * 10) / 6,
    height: 56,
    borderWidth: 1.5,
    borderColor: "#F0E8E2",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#1A1A2E",
  },
  otpBoxFilled: {
    borderColor: "#0088ff",
    borderWidth: 2,
    backgroundColor: "#EFF6FF",
    color: "#0088ff",
  },

  // Hint
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
    marginBottom: 24,
    gap: 8,
  },
  hintText: { flex: 1, fontSize: 12, color: "#4B5563", lineHeight: 17 },

  // Verify button
  verifyBtn: { borderRadius: 16, overflow: "hidden" },
  verifyBtnGradient: { paddingVertical: 15, alignItems: "center", borderRadius: 16 },
  verifyBtnText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },

  // Bottom hint
  loginHint: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginHintText: { fontSize: 13, color: "#8E8E9A" },
  loginHintLink: { fontSize: 13, fontWeight: "700", color: "#0088ff" },
});