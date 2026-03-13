import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  Animated,
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
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { resetPassword } from "../../services/auth-services/resetPassword";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      shakeAnimation();
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your email",
        position: "bottom",
        visibilityTime: 3000,
      });
    }
    if (!newPassword || !confirmPassword) {
      shakeAnimation();
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all fields",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      shakeAnimation();
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Passwords do not match",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://192.168.105.84:5001/auth/reset-password",
        { email, newPassword, confirmPassword },
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message || "Password updated successfully!",
        position: "bottom",
        visibilityTime: 3000,
      });
      router.replace("/login");
    } catch (error) {
      shakeAnimation();
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Password reset failed. Please try again.",
        position: "bottom",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "#F0E8E2" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "#FF4D4D" };
    if (score === 2) return { level: 2, label: "Fair", color: "#FFA500" };
    if (score === 3) return { level: 3, label: "Good", color: "#54d5eb" };
    return { level: 4, label: "Strong", color: "#00C48C" };
  };

  const strength = getStrength(newPassword);

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
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.brandName}>🛒 CampusCart</Text>
          <Text style={styles.headerTitle}>Reset Password</Text>
          <Text style={styles.headerSubtitle}>
            Create a strong new password for your account
          </Text>
        </LinearGradient>

        {/* Step indicator */}
        <View style={styles.pillContainer}>
          <View style={styles.pillWrap}>
            <View style={[styles.pill, styles.pillDone]}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
            <View style={styles.pillLine} />
            <View style={[styles.pill, styles.pillDone]}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
            <View style={styles.pillLine} />
            <View style={[styles.pill, styles.pillActive]}>
              <Text style={styles.pillText}>3</Text>
            </View>
          </View>
          <View style={styles.pillLabelRow}>
            <Text style={styles.pillLabel}>Account</Text>
            <Text style={styles.pillLabel}>Verify</Text>
            <Text
              style={[styles.pillLabel, { color: "#fff", fontWeight: "700" }]}
            >
              Reset
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <Animated.View
          style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}
        >
          {/* Email */}
          <Text style={styles.label}>Registered Email</Text>
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
            />
          </View>

          {/* New Password */}
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#8E8E9A"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#BDB8B3"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
            />
            <TouchableOpacity
              onPress={() => setShowNew((p) => !p)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showNew ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#8E8E9A"
              />
            </TouchableOpacity>
          </View>

          {/* Strength bar */}
          {newPassword.length > 0 && (
            <View style={styles.strengthRow}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.strengthSeg,
                    {
                      backgroundColor:
                        i <= strength.level ? strength.color : "#F0E8E2",
                    },
                  ]}
                />
              ))}
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#8E8E9A"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor="#BDB8B3"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm((p) => !p)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#8E8E9A"
              />
            </TouchableOpacity>
          </View>

          {/* Match indicator */}
          {confirmPassword.length > 0 && (
            <View style={styles.matchRow}>
              <Ionicons
                name={
                  newPassword === confirmPassword
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={14}
                color={newPassword === confirmPassword ? "#00C48C" : "#FF4D4D"}
              />
              <Text
                style={[
                  styles.matchText,
                  {
                    color:
                      newPassword === confirmPassword ? "#00C48C" : "#FF4D4D",
                  },
                ]}
              >
                {newPassword === confirmPassword
                  ? "Passwords match"
                  : "Passwords don't match"}
              </Text>
            </View>
          )}

          {/* Hint */}
          <View style={styles.hintBox}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color="#0088ff"
            />
            <Text style={styles.hintText}>
              Use 8+ characters with uppercase, numbers, and symbols for a
              strong password.
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={loading}
            style={styles.resetBtn}
          >
            <LinearGradient
              colors={["#54d5eb", "#0088ff"]}
              style={styles.resetBtnGradient}
            >
              <Text style={styles.resetBtnText}>
                {loading ? "Updating..." : "Update Password 🔐"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginHint}>
            <Text style={styles.loginHintText}>Remembered it? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginHintLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  brandName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 30, fontWeight: "900", color: "#FFFFFF" },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },

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
  pillLine: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 6,
  },
  pillLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  pillLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    width: 60,
    textAlign: "center",
  },

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

  // Inputs
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

  // Strength bar
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  strengthSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 8,
    width: 44,
  },

  // Match
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 5,
  },
  matchText: { fontSize: 12, fontWeight: "600" },

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

  // Button
  resetBtn: { borderRadius: 16, overflow: "hidden" },
  resetBtnGradient: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 16,
  },
  resetBtnText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },

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
