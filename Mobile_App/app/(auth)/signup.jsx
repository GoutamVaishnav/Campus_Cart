import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { colleges } from '../../constants/userData';

export default function SignupScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [college, setCollege] = useState('');
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCollegeChange = (text) => {
    setCollege(text);

    if (text.length === 0) {
      setFilteredColleges([]);
      return;
    }

    const filtered = colleges.filter((c) =>
      c.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredColleges(filtered);
  };

  const handleSignup = async () => {
    const fullName = `${firstName} ${lastName}`.trim();
    if (!fullName) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Full name is required',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Invalid email format',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobile)) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Phone number must be exactly 10 digits',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (!passwordRegex.test(password)) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Password must include uppercase, lowercase, number and special character',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Passwords do not match',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_AUTH_API_URL}:5001/auth/signup`, {
        name: fullName,
        email,
        phone: mobile,
        password,
      });

      console.log('Signup success:', response.data);

      Toast.show({
        type: 'success',
        text1: 'Signup Successful',
        position: 'bottom',
        visibilityTime: 3000,
      });
      router.push('/verify-otp', { email });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.response?.data?.message || 'Something went wrong',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0088ff" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={['#c3b5b0', '#0088ff']} style={styles.header}>
          <Text style={styles.brandName}>🛒 CampusCart</Text>
          <Text style={styles.headerTitle}>Join CampusCart! 🎓</Text>
          <Text style={styles.headerSubtitle}>Your campus buy, sell & rent hub</Text>
        </LinearGradient>

        {/* Tab Switch */}
        <View style={styles.tabContainer}>
          <View style={styles.tabSwitch}>
            <TouchableOpacity style={styles.tabBtn} onPress={() => router.replace('/login')}>
              <Text style={styles.tabBtnText}>Login</Text>
            </TouchableOpacity>
            <View style={[styles.tabBtn, styles.tabBtnActive]}>
              <Text style={[styles.tabBtnText, styles.tabBtnTextActive]}>Sign Up</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* First & Last Name */}
          <View style={styles.twoCol}>
            <View style={styles.halfGroup}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={17} color="#8E8E9A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#BDB8B3"
                  value={firstName}
                  onChangeText={setFirstName}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.halfGroup}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={17} color="#8E8E9A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#BDB8B3"
                  value={lastName}
                  onChangeText={setLastName}
                  blurOnSubmit={false}
                />
              </View>
            </View>
          </View>

          <Text style={styles.label}>Institute Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={17} color="#8E8E9A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="rollno@iit.ac.in"
              placeholderTextColor="#BDB8B3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
            />
          </View>

          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="phone-portrait-outline" size={17} color="#8E8E9A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="9876543210"
              placeholderTextColor="#BDB8B3"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              blurOnSubmit={false}
            />
          </View>

          <Text style={styles.label}>College</Text>

          <View style={styles.inputWrap}>
            <Ionicons
              name="school-outline"
              size={17}
              color="#8E8E9A"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your college"
              placeholderTextColor="#BDB8B3"
              value={college}
              onChangeText={handleCollegeChange}
            />
          </View>
          {filteredColleges.length > 0 && (
              <View style={styles.suggestionBox}>
                {filteredColleges.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setCollege(item);
                      setFilteredColleges([]);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={17} color="#8E8E9A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Min. 8 characters"
              placeholderTextColor="#BDB8B3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={17} color="#8E8E9A" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="shield-checkmark-outline" size={17} color="#8E8E9A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="#BDB8B3"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={() => setShowConfirm(p => !p)} style={styles.eyeBtn}>
              <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={17} color="#8E8E9A" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            disabled={isLoading}
            style={styles.signupBtn}
          >
            <LinearGradient colors={['#54d5eb', '#0088ff']} style={styles.signupBtnGradient}>
              <Text style={styles.signupBtnText}>
                {isLoading ? 'Creating Account...' : 'Create Account & Explore 🎉'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginHint}>
            <Text style={styles.loginHintText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginHintLink}>Login Here</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  suggestionBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F0E8E2",
    borderRadius: 10,
    marginTop: 4,
  },

  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  container: { flex: 1, backgroundColor: '#0088ff' },
  scroll: { flexGrow: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  brandName: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 20 },
  headerTitle: { fontSize: 30, fontWeight: '900', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  tabContainer: { backgroundColor: '#0088ff', paddingHorizontal: 24, paddingVertical: 12 },
  tabSwitch: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 5,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#FFFFFF' },
  tabBtnText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  tabBtnTextActive: { color: '#0088ff' },
  form: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 52,
    marginTop: -10,
  },
  twoCol: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  halfGroup: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', color: '#1A1A2E', marginBottom: 8, marginTop: 16 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F0E8E2',
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 13,
  },
  inputIcon: { marginRight: 9 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#1A1A2E', outlineStyle: "none" },
  eyeBtn: { padding: 6 },
  signupBtn: { marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  signupBtnGradient: { paddingVertical: 15, alignItems: 'center', borderRadius: 16 },
  signupBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  loginHint: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  loginHintText: { fontSize: 13, color: '#8E8E9A' },
  loginHintLink: { fontSize: 13, fontWeight: '700', color: '#0088ff' },
});