import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Mail, ShieldCheck, Timer } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
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

const { width } = Dimensions.get("window");

const VerifyOTPScreen = () => {
  const { email: paramEmail } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [email, setEmail] = useState(paramEmail || "");
  const [isLoadingotp, setIsLoadingotp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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

    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      shakeAnimation();
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your registered email");
      return;
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
      const response = await axios.post(
        "http://192.168.108.40:5001/auth/verify-otp",
        {
          email,
          otp: otpString,
        },
      );

      console.log("OTP verified:", response.data);
      if(!response.data){
        shakeAnimation();
        Alert.alert("Verification Failed", "Invalid OTP or OTP expired");
        return;
      }
      (router.push("/change-password"),
        Alert.alert(
          "Success",
          response.message || "Email verified successfully!",
        ));
    } catch (error) {
      console.log("OTP error:", error.response?.data);

      const message = error.response?.data?.message || "Something went wrong";

      if (message === "OTP expired" || message === "Invalid OTP") {
        shakeAnimation();
      }

      Alert.alert("Verification Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("http://192.168.108.40:5001/auth/forgot-password", { email });
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      Alert.alert("OTP Sent", "A new OTP has been sent to your email");
    } catch (error) {
      Alert.alert(
        "Resend Failed",
        error.response?.data?.message || "Could not resend OTP",
      );
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
      "http://192.168.108.40:5001/auth/forgot-password",
      { email }
    );

    Alert.alert(
      "OTP Sent",
      response.data.message || "OTP has been sent to your email"
    );

    setTimer(60);
    inputRefs.current[0]?.focus();

  } catch (error) {
    Alert.alert(
      "Error",
      error.response?.data?.message || "Failed to send OTP"
    );
  } finally {
    setIsLoadingotp(false);
  }
};

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#EEF2FF", "#FAE8FF", "#F0E7FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <View style={styles.backIconCircle}>
                <ChevronLeft size={24} color="#1e1b4b" />
              </View>
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={40} color="#8b5cf6" />
              </View>
              <Text style={styles.headerTitle}>Verify Email</Text>
            </View>

            <View style={styles.emailContainer}>
              <Mail size={20} color="#6366f1" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.emailInput}
                placeholder="Enter your registered email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
                style={styles.sendOtpButton}
                onPress={handleSendOtp}
                disabled={isLoadingotp}
                >
                <LinearGradient
                    colors={["#6366f1", "#8b5cf6"]}
                    style={styles.sendOtpGradient}
                >
                    <Text style={styles.sendOtpText}>
                    {isLoadingotp ? "Sending..." : "Send OTP"}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={styles.glassCard}>
              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <View style={styles.otpGrid}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.otpInput,
                        digit !== "" && styles.otpInputActive,
                      ]}
                      value={digit}
                      onChangeText={(v) => handleOtpChange(v, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                    />
                  ))}
                </View>
              </Animated.View>

              <View style={styles.timerRow}>
                <Timer size={16} color={timer > 0 ? "#64748b" : "#8b5cf6"} />
                {timer > 0 ? (
                  <Text style={styles.timerText}>
                    {" "}
                    Resend in {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, "0")}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendLink}> Resend Code</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPress={handleVerify}
                  activeOpacity={0.9}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={["#8b5cf6", "#6366f1"]}
                    style={styles.mainButton}
                  >
                    <Text style={styles.mainButtonText}>
                      {isLoading ? "Verifying..." : "Verify & Proceed"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>Need help?</Text>
              <TouchableOpacity style={styles.helpItem}>
                <View style={styles.helpIconBox}>
                  <Mail size={20} color="#6366f1" />
                </View>
                <View>
                  <Text style={styles.helpTextPrimary}>Check Spam Folder</Text>
                  <Text style={styles.helpTextSecondary}>
                    Sometimes codes get filtered
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  sendOtpButton: {
marginBottom: 20,
},

sendOtpGradient: {
height: 45,
borderRadius: 12,
justifyContent: "center",
alignItems: "center",
},

sendOtpText: {
color: "white",
fontWeight: "600",
fontSize: 15,
},
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 20,
  },

  emailInput: {
    flex: 1,
    fontSize: 16,
    outlineStyle: "none",
    color: "#1e293b",
  },
  container: { flex: 1, backgroundColor: "#fff" },
  blob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.4,
  },
  blob1: { backgroundColor: "#c7d2fe", top: -50, right: -50 },
  blob2: { backgroundColor: "#f5d0fe", bottom: 50, left: -100 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  content: { paddingHorizontal: 20 },
  backButton: { marginTop: 60, marginBottom: 20 },
  backIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: { alignItems: "center", marginBottom: 30 },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1e1b4b" },
  headerSubtitle: { fontSize: 16, color: "#64748b", marginTop: 8 },
  emailText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366f1",
    marginTop: 2,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    elevation: 10,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  otpGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  otpInput: {
    width: width * 0.11,
    height: 60,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#1e293b",
  },
  otpInputActive: {
    borderColor: "#8b5cf6",
    borderWidth: 2,
    backgroundColor: "#fdf4ff",
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  timerText: { fontSize: 14, color: "#64748b", fontWeight: "500" },
  resendLink: { fontSize: 14, color: "#8b5cf6", fontWeight: "700" },
  mainButton: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  mainButtonText: { color: "white", fontSize: 18, fontWeight: "700" },
  helpSection: { marginTop: 30, padding: 10 },
  helpTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e1b4b",
    marginBottom: 15,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  helpIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  helpTextPrimary: { fontSize: 15, fontWeight: "600", color: "#1e293b" },
  helpTextSecondary: { fontSize: 13, color: "#64748b" },
});

export default VerifyOTPScreen;
