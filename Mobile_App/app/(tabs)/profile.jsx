import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AsyncStorage.getItem("user");
        if (data) {
          setUser(JSON.parse(data));
        } else {
          // fallback demo data if nothing in storage
          // setUser({
          //   id: "a3f9c2d1-847b-4e2a-9f3d-12bc456ef789",
          //   name: "Arjun Sharma",
          //   email: "arjun.sharma@iit.ac.in",
          //   phone: "+91 98765 43210",
          //   college: "IIT Bombay",
          //   verified: true,
          // });
          Toast.show({
            type: "error",
            text1: "User data not found",
            text2: "Please log in again.",
          });
          router.replace("/(auth)/login");
        }
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load user data.",
        });
        // setUser({
        //   id: "a3f9c2d1-847b-4e2a-9f3d-12bc456ef789",
        //   name: "Arjun Sharma",
        //   email: "arjun.sharma@iit.ac.in",
        //   phone: "+91 98765 43210",
        //   college: "IIT Bombay",
        //   verified: true,
        // });
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      Animated.stagger(100, [
        Animated.spring(headerAnim, {
          toValue: 1,
          tension: 22,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(listAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, user]);

  const animStyle = (anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  });

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
    router.replace("/(auth)/login");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0088ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1160a6" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header gradient */}
        <LinearGradient
          colors={["#c3b5b0", "#1160a6"]}
          style={styles.headerGradient}
        >
          <Animated.View style={animStyle(headerAnim)}>
            <Text style={styles.brandName}>CampusCart</Text>

            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarLetters}>Hello,</Text>
            </View>

            <Text style={styles.userName}>{user?.name || "—"}</Text>

            <View style={styles.verifiedPill}>
              <Ionicons
                name={user?.verified ? "shield-checkmark" : "shield-outline"}
                size={13}
                color={user?.verified ? "#26ff00" : "#FFA500"}
              />
              <Text
                style={[
                  styles.verifiedText,
                  { color: user?.verified ? "#00C48C" : "#FFA500" },
                ]}
              >
                {user?.verified ? "Verified Student" : "Not Verified"}
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* White body */}
        <View style={styles.body}>
          {/* Stats row */}
          {/* <Animated.View style={[styles.statsRow, animStyle(cardAnim)]}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Listed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Rented</Text>
            </View>
          </Animated.View> */}

          {/* Info card */}
          <Animated.View style={[styles.infoCard, animStyle(cardAnim)]}>
            <Text style={styles.sectionLabel}>Account Details</Text>
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={user?.email || "—"}
            />
            <InfoRow
              icon="call-outline"
              label="Phone"
              value={user?.phone || "—"}
            />
            <InfoRow
              icon="school-outline"
              label="College"
              value={user?.college || "—"}
            />
            <InfoRow
              icon="finger-print-outline"
              label="User ID"
              value={user?.id || "—"}
              mono
            />
          </Animated.View>

          {/* Menu */}
          <Animated.View style={animStyle(listAnim)}>
            <Text style={styles.sectionLabel}>Settings</Text>
            {/* <MenuItem
              icon="create-outline"
              label="Edit Profile"
              onPress={() => {}}
            /> */}
            <MenuItem
              icon="bag-handle-outline"
              label="My Listings"
              onPress={() => {
                router.push("/my-listings");
              }}
            />
            {/* <MenuItem
              icon="heart-outline"
              label="Wishlist"
              onPress={() => {}}
            /> */}
            {/* <MenuItem
              icon="time-outline"
              label="Purchase History"
              onPress={() => {}}
            /> */}
            <MenuItem
              icon="notifications-outline"
              label="Notifications"
              onPress={() => {}}
            />
            {/* <MenuItem
              icon="shield-outline"
              label="Privacy & Security"
              onPress={() => {}}
            /> */}
            <MenuItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => {}}
            />

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#ff6b6b", "#ee4444"]}
                style={styles.logoutGradient}
              >
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Log Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, mono }) {
  return (
    <View style={infoStyles.row}>
      <View style={infoStyles.iconBox}>
        <Ionicons name={icon} size={17} color="#0088ff" />
      </View>
      <View style={infoStyles.textWrap}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text
          style={[infoStyles.value, mono && infoStyles.mono]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      style={menuStyles.item}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={menuStyles.iconBox}>
        <Ionicons name={icon} size={19} color="#0088ff" />
      </View>
      <Text style={menuStyles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={17} color="#C5CDD8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  scroll: { paddingBottom: 100 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 24,
    paddingBottom: 36,
    alignItems: "flex-start",
    height: 360,
    justifyContent: "space-evenly",
  },
  brandName: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
    alignSelf: "flex-start",
  },

  avatarWrap: { position: "relative", marginBottom: 14 },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetters: { fontSize: 42, fontWeight: "900", color: "#ffffff" },
  verifiedBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00C48C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  userName: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 4 },
  userCollege: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
    marginBottom: 12,
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  verifiedText: { fontSize: 12, fontWeight: "700" },

  body: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -18,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#F7F8FA",
    borderRadius: 18,
    paddingVertical: 18,
    marginBottom: 22,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A2E",
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 11,
    color: "#8E8E9A",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: { width: 1, backgroundColor: "#E8EBF0", marginVertical: 4 },

  infoCard: {
    backgroundColor: "#F7F8FA",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E9A",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 14,
  },

  logoutBtn: { borderRadius: 16, overflow: "hidden", marginTop: 10 },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 8,
    borderRadius: 16,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F3",
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textWrap: { flex: 1 },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8E8E9A",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: { fontSize: 14, fontWeight: "600", color: "#1A1A2E" },
  mono: {
    fontSize: 12,
    color: "#8E8E9A",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F0ECE8",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  label: { flex: 1, fontSize: 14, fontWeight: "600", color: "#1A1A2E" },
});
