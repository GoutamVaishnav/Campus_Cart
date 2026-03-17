import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useMyListingsStore from "@/store/useMyListingsStore";
import useUserStore from "@/store/useUserStore";

const { width } = Dimensions.get("window");
const H_PAD = 20;
const CARD_GAP = 12;
const SQUARE_SIZE = (width - H_PAD * 2 - CARD_GAP) / 2;
const WIDE_HEIGHT = SQUARE_SIZE * 0.62;

export default function MyListingsScreen() {
  const user = useUserStore((s) => s.user);
  const userId = useUserStore((s) => s.getUserId());
  const fetchMyListings = useMyListingsStore((s) => s.fetchMyListings);

  // ✅ Fix: select the raw arrays directly — reactive, updates when store changes
  const sellCount = useMyListingsStore((s) => s.sellListings.length);
  const rentCount = useMyListingsStore((s) => s.rentListings.length);
  const lostFoundCount = useMyListingsStore((s) => s.lostFoundListings.length);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userId) fetchMyListings(userId);

    Animated.stagger(80, [
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 22,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(card1Anim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(card2Anim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(card3Anim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [userId]); // ✅ re-run if userId changes (e.g. after login)

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0088ff" />

      {/* Header */}
      <LinearGradient colors={["#c3b5b0", "#0088ff"]} style={styles.header}>
        <Animated.View style={animStyle(headerAnim)}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.brandName}>🛒 CampusCart</Text>
            <View style={{ width: 36 }} />
          </View>

          <Text style={styles.headerTitle}>My Listings</Text>
          <Text style={styles.headerSubtitle}>
            Manage all your posted items in one place
          </Text>

          {user && (
            <View style={styles.userPill}>
              <View style={styles.userPillAvatar}>
                <Text style={styles.userPillAvatarText}>
                  {user.name
                    ?.split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
              </View>
              <Text style={styles.userPillName}>{user.name}</Text>
              <View style={styles.userPillDot} />
              <Text style={styles.userPillCollege}>{user.college}</Text>
            </View>
          )}
        </Animated.View>
      </LinearGradient>

      {/* White body */}
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Browse Your Listings</Text>

        {/* Top row — Sell + Rent */}
        <View style={styles.topRow}>
          <Animated.View style={animStyle(card1Anim)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/my-listings/sell")}
              style={styles.cardTouch}
            >
              <LinearGradient
                colors={["#1a8fff", "#0066cc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.squareCard,
                  { width: SQUARE_SIZE, height: SQUARE_SIZE },
                ]}
              >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />
                <View style={styles.arrowBadge}>
                  <Ionicons
                    name="arrow-forward"
                    size={13}
                    color="rgba(255,255,255,0.8)"
                  />
                </View>
                <View style={styles.cardInner}>
                  <View style={styles.iconBox}>
                    <Ionicons name="bag-handle" size={26} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Sell</Text>
                  <Text style={styles.cardSub}>
                    Items you've{"\n"}listed for sale
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={animStyle(card2Anim)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/my-listings/rent")}
              style={styles.cardTouch}
            >
              <LinearGradient
                colors={["#2ddde4", "#00aacc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.squareCard,
                  { width: SQUARE_SIZE, height: SQUARE_SIZE },
                ]}
              >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />
                <View style={styles.arrowBadge}>
                  <Ionicons
                    name="arrow-forward"
                    size={13}
                    color="rgba(255,255,255,0.8)"
                  />
                </View>
                <View style={styles.cardInner}>
                  <View style={styles.iconBox}>
                    <Ionicons name="repeat" size={26} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Rent</Text>
                  <Text style={styles.cardSub}>
                    Items you've{"\n"}listed for rent
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Lost & Found */}
        <Animated.View style={[{ marginTop: CARD_GAP }, animStyle(card3Anim)]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/my-listings/lost-found")}
            style={styles.cardTouch}
          >
            <LinearGradient
              colors={["#1A1A2E", "#0f3460"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.wideCard, { height: WIDE_HEIGHT }]}
            >
              <View style={styles.wideDecCircle} />
              <View style={styles.wideLeft}>
                <View style={[styles.iconBox, styles.iconBoxDark]}>
                  <Ionicons name="search-circle" size={26} color="#54d5eb" />
                </View>
                <View style={{ marginLeft: 14 }}>
                  <Text style={styles.cardTitle}>Lost & Found</Text>
                  <Text
                    style={[
                      styles.cardSub,
                      { color: "rgba(255,255,255,0.55)" },
                    ]}
                  >
                    Items you've reported lost or found
                  </Text>
                </View>
              </View>
              <View style={styles.wideArrow}>
                <Ionicons name="arrow-forward" size={16} color="#54d5eb" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats strip */}
        <Animated.View style={[styles.statsStrip, animStyle(card3Anim)]}>
          <StatPill
            icon="bag-handle-outline"
            label="Sell"
            color="#0088ff"
            count={sellCount}
          />
          <View style={styles.statsDivider} />
          <StatPill
            icon="repeat-outline"
            label="Rent"
            color="#00aacc"
            count={rentCount}
          />
          <View style={styles.statsDivider} />
          <StatPill
            icon="search-circle-outline"
            label="Lost/Found"
            color="#54d5eb"
            count={lostFoundCount}
          />
        </Animated.View>

        {/* Post new listing shortcut */}
        <Animated.View style={animStyle(card3Anim)}>
          <TouchableOpacity
            style={styles.postNewBtn}
            onPress={() => router.push("/(tabs)/post")}
            activeOpacity={0.85}
          >
            <View style={styles.postNewLeft}>
              <View style={styles.postNewIconBox}>
                <Ionicons name="add" size={20} color="#0088ff" />
              </View>
              <View>
                <Text style={styles.postNewTitle}>Post a New Listing</Text>
                <Text style={styles.postNewSub}>
                  Sell, rent or report lost & found
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C5CDD8" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

function StatPill({ icon, label, color, count }) {
  return (
    <View style={statStyles.wrap}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={statStyles.count}>{count}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  header: {
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: H_PAD,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: { fontSize: 18, fontWeight: "900", color: "#fff" },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
    marginBottom: 16,
  },

  userPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    paddingVertical: 7,
    paddingHorizontal: 12,
    gap: 8,
    alignSelf: "flex-start",
  },
  userPillAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  userPillAvatarText: { fontSize: 10, fontWeight: "900", color: "#0088ff" },
  userPillName: { fontSize: 13, fontWeight: "700", color: "#fff" },
  userPillDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  userPillCollege: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },

  body: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -14,
    paddingHorizontal: H_PAD,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E9A",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 16,
  },

  topRow: { flexDirection: "row", justifyContent: "space-between" },
  cardTouch: { borderRadius: 20, overflow: "hidden" },
  squareCard: {
    borderRadius: 20,
    padding: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  cardInner: { zIndex: 2 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBoxDark: { backgroundColor: "rgba(0,136,255,0.2)" },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 16,
    fontWeight: "500",
  },
  arrowBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  decCircle1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.12)",
    top: -28,
    right: -28,
  },
  decCircle2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: 10,
    left: -20,
  },
  wideCard: {
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  wideDecCircle: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(0,136,255,0.1)",
    top: -50,
    right: 40,
  },
  wideLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  wideArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(84,213,235,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  statsStrip: {
    flexDirection: "row",
    backgroundColor: "#F7F8FA",
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 14,
  },
  statsDivider: { width: 1, backgroundColor: "#E8EBF0", marginVertical: 4 },

  postNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7F8FA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#F0ECE8",
    borderStyle: "dashed",
  },
  postNewLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  postNewIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  postNewTitle: { fontSize: 14, fontWeight: "700", color: "#1A1A2E" },
  postNewSub: { fontSize: 12, color: "#8E8E9A", marginTop: 2 },
});

const statStyles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", gap: 4 },
  count: { fontSize: 20, fontWeight: "900", color: "#1A1A2E" },
  label: {
    fontSize: 10,
    color: "#8E8E9A",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
