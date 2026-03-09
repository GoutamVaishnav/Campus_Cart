import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Lock, KeyRound } from "lucide-react-native";
import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import axios from "axios";

const ResetPasswordScreen = () => {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      shakeAnimation();
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      shakeAnimation();
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Button feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    try {
      setLoading(true);
      // Replace localhost with your actual machine IP if testing on physical device
      const response = await axios.post(
        "http://192.168.108.40:5001/auth/reset-password",
        {
          email,
          newPassword,
          confirmPassword,
        }
      );

      Alert.alert("Success", response.data.message || "Password updated successfully!");
      router.replace("/login");

    } catch (error) {
      shakeAnimation();
      Alert.alert(
        "Error",
        error.response?.data?.message || "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#EEF2FF", "#FAE8FF", "#F0E7FF"]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Background Blobs for the premium look */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ChevronLeft size={28} color="#1e1b4b" />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <KeyRound size={40} color="#8b5cf6" />
              </View>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Strong passwords include numbers, letters, and symbols.
              </Text>
            </View>

            <View style={styles.glassCard}>
              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#6366f1" />
                  <TextInput
                    style={styles.input}
                    placeholder="Registered Email"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color="#6366f1" />
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color="#6366f1" />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#8b5cf6", "#6366f1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.buttonText}>Update Password</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60 },
  blob: { position: "absolute", width: 300, height: 300, borderRadius: 150, opacity: 0.4 },
  blob1: { backgroundColor: "#c7d2fe", top: -50, right: -50 },
  blob2: { backgroundColor: "#f5d0fe", bottom: 50, left: -100 },
  backButton: {
    width: 45, height: 45, borderRadius: 23, backgroundColor: "white",
    justifyContent: "center", alignItems: "center", marginBottom: 30,
    elevation: 4, shadowOpacity: 0.1, shadowRadius: 10,
  },
  header: { alignItems: "center", marginBottom: 30 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "white",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
    elevation: 8, shadowColor: "#8b5cf6", shadowOpacity: 0.2, shadowRadius: 15,
  },
  title: {
    fontSize: 28, fontWeight: "800", color: "#1e1b4b", textAlign: "center",
  },
  subtitle: {
    fontSize: 15, color: "#64748b", textAlign: "center", marginTop: 8, paddingHorizontal: 20,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: 30, padding: 24,
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#4f46e5", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 30,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "white",
    borderRadius: 16, paddingHorizontal: 16, height: 58,
    borderWidth: 1, borderColor: "#f1f5f9", marginBottom: 16,
  },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: "#1e293b", fontWeight: "500", outlineStyle: "none" },
  button: {
    height: 58, borderRadius: 18, justifyContent: "center", alignItems: "center",
    marginTop: 10, shadowColor: "#6366f1", shadowOpacity: 0.3, shadowRadius: 12,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "700" },
});

export default ResetPasswordScreen;