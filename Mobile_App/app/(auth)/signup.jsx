import React, { useEffect, useRef, useState } from "react";
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
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import {
  CheckCircle,
  ChevronLeft,
  Lock,
  Mail,
  Phone,
  School,
  User,
} from "lucide-react-native";

import { colleges } from "../../constants/userData";

const InputField = ({
  label,
  icon: Icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>

    <View style={styles.inputWrapper}>
      <Icon size={20} color="#6366f1" style={{ marginRight: 10 }} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        underlineColorAndroid="transparent"
      />
    </View>
  </View>
);

const SignupScreen = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [college, setCollege] = useState("");
  const [otherCollege, setOtherCollege] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [collegeList, setCollegeList] = useState([...colleges, "Other"]);

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

  const handleSignup = async () => {
    // ---------------- CLIENT-SIDE VALIDATIONS ----------------
    if (!fullName.trim()) {
      return Alert.alert("Validation Error", "Full name is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Validation Error", "Invalid email format");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return Alert.alert(
        "Validation Error",
        "Phone number must be exactly 10 digits",
      );
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (!passwordRegex.test(password)) {
      return Alert.alert(
        "Validation Error",
        "Password must include uppercase, lowercase, number and special character",
      );
    }
    console.log("Sending signup request...");

    if (password !== confirmPassword) {
      return Alert.alert("Validation Error", "Passwords do not match");
    }

    if (!college) {
      return Alert.alert("Validation Error", "Please select a college");
    }

    let finalCollege = college;

    if (college === "Other" && otherCollege.trim() !== "") {
      finalCollege = otherCollege;

      if (!collegeList.includes(otherCollege)) {
        setCollegeList([...collegeList, otherCollege]);
      }
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

    try {
      const response = await axios.post("http://192.168.108.40:5001/auth/signup", {
        name: fullName,
        email,
        phone,
        password,
        college: finalCollege,
      });

      console.log("Signup success:", response.data);

      // OTP verify page
      router.push({
        pathname: "/verify-otp",
        params: { email },
      });
    } catch (error) {
      console.log("Signup error:", error);

      Alert.alert(
        "Signup Failed",
        error.response?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#EEF2FF", "#F0E7FF", "#FAE8FF"]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              padding: 24,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Create Account</Text>

            <InputField
              label="Full Name"
              icon={User}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Alex Rivera"
            />

            <InputField
              label="Email"
              icon={Mail}
              value={email}
              onChangeText={setEmail}
              placeholder="alex@college.edu"
              keyboardType="email-address"
            />

            <InputField
              label="Phone Number"
              icon={Phone}
              value={phone}
              onChangeText={setPhone}
              placeholder="9876543210"
              keyboardType="phone-pad"
            />

            {/* COLLEGE DROPDOWN */}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>College</Text>

              <Dropdown
                style={styles.dropdown}
                data={collegeList.map((c) => ({ label: c, value: c }))}
                labelField="label"
                valueField="value"
                placeholder="Select College"
                value={college}
                onChange={(item) => setCollege(item.value)}
              />
            </View>

            {/* OTHER COLLEGE INPUT */}

            {college === "Other" && (
              <InputField
                label="Enter Your College"
                icon={School}
                value={otherCollege}
                onChangeText={(text) => setOtherCollege(text)}
                placeholder="Enter college name"
              />
            )}

            <InputField
              label="Password"
              icon={Lock}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <InputField
              label="Confirm Password"
              icon={CheckCircle}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  console.log("Pressed");
                  handleSignup();
                }}
              >
                <LinearGradient
                  colors={["#6366f1", "#8b5cf6", "#d946ef"]}
                  style={styles.mainButton}
                >
                  <Text style={styles.mainButtonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footer}>
              <Text>Already have an account? </Text>

              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  inputContainer: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: "#475569",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "white",
  },

  input: {
    flex: 1,
    outlineStyle: "none",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "white",
  },

  mainButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  mainButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  footerLink: {
    color: "#6366f1",
    fontWeight: "600",
  },
});
